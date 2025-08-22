// app/api/payments/midtrans/create-token/route.ts

import { type NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";

export async function POST(request: NextRequest) {
  try {
    const { amount, contestTitle, user } = await request.json();

    // Inisialisasi Midtrans Snap client
    let snap = new Midtrans.Snap({
      isProduction: false, // Set ke true saat di produksi
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    // Buat ID transaksi yang unik, misalnya 'CONTEST-' diikuti timestamp
    let orderId = "CONTEST-" + Date.now();

    // Siapkan parameter transaksi
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: `CONTEST-${Math.random()}`, // ID unik untuk item
          price: amount,
          quantity: 1,
          name: `Funding for: ${contestTitle}`,
          category: "Contest Funding",
        },
      ],
      customer_details: {
        first_name: user.first_name,
        email: user.email,
      },
      callbacks: {
        // (Opsional) URL callback jika Anda ingin Midtrans mengirim notifikasi
        // finish: "https://your-website.com/payment-success"
      },
    };

    console.log("Creating Midtrans transaction with params:", parameter);

    // Dapatkan token dari Midtrans
    const token = await snap.createTransactionToken(parameter);

    console.log("Midtrans token created:", token);

    // Kirim token kembali ke frontend
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Midtrans API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
