// app/api/payouts/midtrans/request/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Midtrans from "midtrans-client";

// Fungsi RPC baru untuk memastikan operasi database aman (transaksional)
async function decrementBalanceAndLog(
  supabase: any,
  userId: string,
  amount: number,
  bankDetails: any,
  midtransRef: string,
) {
  const { error } = await supabase.rpc("decrement_balance_and_log_payout", {
    user_id_input: userId,
    amount_input: amount,
    bank_details_input: bankDetails,
    midtrans_ref_input: midtransRef,
  });
  return { error };
}

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
      !bankDetails.accountNumber ||
      !bankDetails.accountName
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
      isProduction: false, // Ganti ke true saat launching
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

      // 4. Kurangi Saldo & Catat Transaksi di Database menggunakan RPC
      const { error: decrementError } = await decrementBalanceAndLog(
        supabase,
        user.id,
        amount,
        bankDetails,
        midtransReference,
      );

      if (decrementError) {
        console.error(
          "CRITICAL: Failed to decrement balance after payout creation:",
          decrementError,
        );
        // Di produksi, kita perlu menambahkan logika untuk membatalkan payout di Midtrans jika langkah ini gagal
        throw new Error(
          "Payout created but failed to update user balance. Please contact support.",
        );
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
  } catch (error: any) {
    console.error("Payout API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
