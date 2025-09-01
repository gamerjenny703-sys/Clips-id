// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Daftar hash TANPA tanda kutip tunggal di dalamnya.
  // Ini lebih bersih dan aman dari kesalahan copy-paste.
  const shaHashes = [
    // Hash dari build sebelumnya
    "sha256-OBTN3R1yCV4Bq7dFqZ5a2pAXjnCcCYETjM02I/LYKeo=",
    "sha256-GURBUR8f8Y0f0iCvfiUBdMNU386jQI5fM6yu34e4ml+NLxI=",
    "sha256-E5hq48e3j0n0PZLb/HV98rpLw0vJKrfd9DAa/7VRTFI=",
    "sha256-njsrAvwPFsR0ppoG04puafQfMh2fknN1B07EXCLAZfEo=",
    "sha256-1vxz6ivcnfQMcz4kpZ3ax2RvaiUbWkLVml2NiZ0333Jk8=",
    "sha256-2Tu4HudpI+xAMi+dsiI8aWsEl+bAqA/yX8E5EyvS6ws=",
    "sha256-y5Bj5y3U7jNaBzN4rLHm6iYx2+kENGlssM/774nedJg=",
    // Hash BARU dari screenshot terakhir
    "sha256-21U4updiMiS8awsEl+bAqA/yX8E5EyvS6wsY5uY3U7j=",
    "sha256-pZjljoaA0ltqmr5pv4o5dyFbkWdiqmKnqvqSbfVavmQ=",
  ];

  // Secara programatis, kita tambahkan 'sha256-...' di sekeliling setiap hash.
  // Ini memastikan formatnya SELALU BENAR.
  const scriptHashDirectives = shaHashes.map((hash) => `'sha256-${hash}'`);

  const cspPolicies = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "https://app.sandbox.midtrans.com",
      ...scriptHashDirectives, // Gunakan array yang sudah diformat dengan benar
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

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  // =============================================================
  // LOGGING UNTUK VERIFIKASI (Akan muncul di log Vercel)
  console.log("--- Generated CSP Header for:", request.nextUrl.pathname, "---");
  console.log(cspHeader);
  console.log("-------------------------------------------------");
  // =============================================================

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}
