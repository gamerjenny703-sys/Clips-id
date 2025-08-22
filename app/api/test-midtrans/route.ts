// app/api/test-midtrans/route.ts

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    return NextResponse.json(
      { status: "error", message: "MIDTRANS_SERVER_KEY is not set." },
      { status: 500 },
    );
  }

  // --- PERBAIKAN URL ENDPOINT ---
  // Kita coba panggil endpoint yang pasti ada tapi memerlukan otentikasi,
  // seperti membuat transaksi dengan body kosong. Ini akan mengetes kunci kita.
  const midtransApiUrl = "https://api.sandbox.midtrans.com/v2/charge";

  const encodedKey = Buffer.from(serverKey + ":").toString("base64");

  try {
    console.log("Attempting to connect to Midtrans with corrected endpoint...");
    // --- UBAH METHOD MENJADI POST DENGAN BODY KOSONG ---
    const response = await fetch(midtransApiUrl, {
      method: "POST", // Endpoint 'charge' memerlukan POST
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify({}), // Kirim body kosong
    });

    const responseText = await response.text();

    // Midtrans akan mengembalikan error dalam format JSON jika otentikasi gagal atau body salah
    if (!response.ok && response.status !== 400) {
      // Error 401 berarti kunci salah. Error lain bisa berarti masalah server.
      // Error 400 berarti request kita (body kosong) tidak valid, TAPI KUNCINYA BENAR.
      return NextResponse.json(
        {
          status: "error",
          message: "Authentication might have failed or server error.",
          statusCode: response.status,
          details: responseText,
        },
        { status: response.status },
      );
    }

    // --- KONDISI SUKSES BARU ---
    // Jika kita mendapatkan error 400 "Bad Request", itu justru pertanda BAIK.
    // Artinya Midtrans menerima dan memahami request kita, tapi body-nya tidak lengkap.
    // Ini membuktikan KUNCI KITA SUDAH BENAR!
    if (response.status === 400) {
      return NextResponse.json({
        status: "success",
        message:
          "Authentication successful! Midtrans received the request but rejected the empty body, which is expected.",
        details: JSON.parse(responseText),
      });
    }

    return NextResponse.json({
      status: "unknown_success",
      message: "Received an unexpected successful response.",
      data: JSON.parse(responseText),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
