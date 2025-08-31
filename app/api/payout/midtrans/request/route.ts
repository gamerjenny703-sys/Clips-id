// app/api/payouts/midtrans/request/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Gunakan client untuk server
import Midtrans from "midtrans-client";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    // 1. Otentikasi Pengguna & Ambil Data dari Request
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, bankDetails } = await request.json();
    if (
      !amount ||
      !bankDetails ||
      !bankDetails.bankCode ||
      !bankDetails.accountNumber
    ) {
      return NextResponse.json(
        { error: "Missing required payout details" },
        { status: 400 },
      );
    }

    // 2. Validasi Saldo Pengguna di Database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Could not retrieve user profile.");
    }
    if (profile.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance." },
        { status: 400 },
      );
    }

    // 3. Inisialisasi Midtrans Iris & Buat Permintaan Payout
    const iris = new Midtrans.Iris({
      isProduction: true, // Ganti ke true saat launching
      serverKey: process.env.MIDTRANS_IRIS_KEY!,
    });

    const payoutPayload = {
      payouts: [
        {
          beneficiary_name: bankDetails.accountName,
          beneficiary_account: bankDetails.accountNumber,
          beneficiary_bank: bankDetails.bankCode.toLowerCase(),
          amount: amount.toString(),
          notes: `Payout for Clips.ID user ${user.email}`,
        },
      ],
    };

    const irisResponse = await iris.createPayouts(payoutPayload);

    if (irisResponse.payouts && irisResponse.payouts[0].status === "queued") {
      const midtransReference = irisResponse.payouts[0].reference_no;

      // 4. Kurangi Saldo & Catat Transaksi di Database
      // Kita gunakan RPC untuk memastikan operasi ini aman (transaksional)
      const { error: decrementError } = await supabase.rpc(
        "decrement_balance_and_log_payout",
        {
          user_id_input: user.id,
          amount_input: amount,
          bank_details_input: bankDetails,
          midtrans_ref_input: midtransReference,
        },
      );

      if (decrementError) {
        // Jika ini gagal, kita perlu mekanisme untuk membatalkan payout di Midtrans
        console.error(
          "CRITICAL: Failed to decrement balance after payout creation:",
          decrementError,
        );
        // Untuk sekarang, kita kembalikan error
        throw new Error("Payout created but failed to update user balance.");
      }

      return NextResponse.json({
        status: "success",
        message: "Payout request submitted successfully!",
        data: irisResponse,
      });
    } else {
      // Jika API Midtrans mengembalikan error
      throw new Error(
        `Midtrans Iris rejected the payout: ${JSON.stringify(irisResponse)}`,
      );
    }
  } catch (errro) {
    console.error("An unexpected error occurred in payout request:", error);

    // Kirim response error yang generik ke client
    // Hindari mengirim detail error ke client karena alasan keamanan
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
