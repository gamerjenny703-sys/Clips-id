import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Buat nonce acak untuk setiap request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // 2. Definisikan Content Security Policy (CSP) yang lebih ketat
  const cspPolicies = {
    "default-src": ["'self'"],
    "script-src": [
      `'nonce-${nonce}'`, // Gunakan nonce
      "'strict-dynamic'", // Izinkan skrip yang sah untuk memuat skrip lain
      "https://app.midtrans.com", // Tetap izinkan Midtrans
      // CATATAN: 'unsafe-eval' mungkin masih dibutuhkan oleh beberapa library.
      // Coba jalankan tanpanya. Jika ada yang rusak, tambahkan kembali.
    ],
    "style-src": ["'self'", "'unsafe-inline'"], // 'unsafe-inline' untuk style lebih sulit dihilangkan dan risikonya lebih rendah
    "img-src": ["'self'", "data:", "https://skhhodaegohhedcomccs.supabase.co"],
    "connect-src": ["'self'", "*.supabase.co"],
    "frame-src": ["'self'", "https://app.midtrans.com"],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  // 3. Buat request header baru untuk diteruskan ke Next.js
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce); // Ini akan dibaca oleh Next.js untuk menambahkan nonce ke skripnya
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // 4. Tambahkan juga header keamanan lainnya di sini untuk sentralisasi
  requestHeaders.set("X-Frame-Options", "SAMEORIGIN");
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 5. Buat respons dengan meneruskan header request yang sudah dimodifikasi
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  requestHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}
