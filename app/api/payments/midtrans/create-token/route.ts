// app/api/payments/midtrans/create-token/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
// @ts-ignore - Midtrans client doesn't have proper TypeScript definitions
import Midtrans from "midtrans-client";

export async function POST(request: NextRequest) {
  try {
    const { amount, contestTitle, user: userInfo } = await request.json();

    // Validasi input
    if (!amount || !contestTitle || !userInfo) {
      return NextResponse.json(
        {
          error: "Missing required fields: amount, contestTitle, or user info.",
        },
        { status: 400 },
      );
    }

    // Inisialisasi Midtrans Snap
    const snap = new Midtrans.Snap({
      isProduction: false, // Ganti ke true saat launching
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    // Buat ID transaksi yang unik
    const transactionId = `CONTEST-${Date.now()}`;

    // Amount sudah dalam IDR, tidak perlu konversi
    const amountInIDR = Math.round(parseFloat(amount));
    
    console.log(`Prize amount in IDR: ${amountInIDR}`);
    
    // Siapkan parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: amountInIDR,
        currency: "IDR",
      },
      item_details: [
        {
          id: `contest-${transactionId}`,
          price: amountInIDR,
          quantity: 1,
          name: `Funding for: ${contestTitle}`,
        },
      ],
      customer_details: {
        first_name: userInfo.first_name,
        email: userInfo.email,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
      },
    };
    
    console.log("Midtrans parameter:", JSON.stringify(parameter, null, 2));

    // Buat transaksi dan dapatkan token-nya
    const token = await snap.createTransactionToken(parameter);

    console.log("Midtrans Snap token created:", token);
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Midtrans API Error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to create Midtrans transaction.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
