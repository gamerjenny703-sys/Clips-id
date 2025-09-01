// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Kumpulkan semua hash sha256 yang kita dapat dari error sebelumnya
  const scriptHashes = [
    "'sha256-OBTN3R1yCV4Bq7dFqZ5a2pAXjnCcCYETjM02I/LYKeo='",
    "'sha256-GURBUR8f8Y0f0iCvfiUBdMNU386jQI5fM6yu34e4ml+NLxI='",
    "'sha256-E5hq48e3j0n0PZLb/HV98rpLw0vJKrfd9DAa/7VRTFI='",
    "'sha256-njsrAvwPFsR0ppoG04puafQfMh2fknN1B07EXCLAZfEo='",
    "'sha256-1vxz6ivcnfQMcz4kpZ3ax2RvaiUbWkLVml2NiZ0333Jk8='",
    "'sha256-2Tu4HudpI+xAMi+dsiI8aWsEl+bAqA/yX8E5EyvS6ws='",
    "'sha256-y5Bj5y3U7jNaBzN4rLHm6iYx2+kENGlssM/774nedJg='",
    // Tambahkan hash lain jika muncul error baru
  ];

  const cspPolicies = {
    "default-src": ["'self'"],
    // STRATEGI BARU: Hapus 'strict-dynamic'. Kita hanya andalkan 'self' dan hash.
    "script-src": [
      "'self'", // Izinkan skrip dari domain kita sendiri (PENTING!)
      "https://app.sandbox.midtrans.com", // Izinkan skrip Midtrans
      ...scriptHashes, // Tambahkan semua hash yang kita kumpulkan
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https://skhhodaegohhedcomccs.supabase.co"],
    "connect-src": [
      "'self'",
      "*.supabase.co",
      "https://app.sandbox.midtrans.com",
    ],
    "frame-src": ["'self'", "https://app.sandbox.midtrans.com"],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  // Tambahkan 'unsafe-eval' hanya saat development
  if (process.env.NODE_ENV === "development") {
    cspPolicies["script-src"].push("'unsafe-eval'");
  }

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  // =============================================================
  // LOG UNTUK DEBUGGING - Ini akan muncul di log Vercel
  console.log("Generated CSP Header for path:", request.nextUrl.pathname);
  console.log(cspHeader);
  // =============================================================

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader);
  // Header lain bisa ditambahkan kembali jika diperlukan

  return response;
}
