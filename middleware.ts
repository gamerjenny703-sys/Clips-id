// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Buat nonce unik untuk setiap request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspPolicies = {
    "default-src": ["'self'"],
    // 2. Gunakan nonce dan strict-dynamic. Ini adalah standar emas untuk CSP modern.
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https://skhhodaegohhedcomccs.supabase.co"],
    "connect-src": [
      "'self'",
      "*.supabase.co",
      // Izinkan koneksi ke Midtrans jika diperlukan di client-side
      "https://app.sandbox.midtrans.com",
    ],
    "frame-src": ["'self'", "https://app.sandbox.midtrans.com"],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  // Tambahkan 'unsafe-eval' hanya saat development untuk HMR
  if (process.env.NODE_ENV === "development") {
    cspPolicies["script-src"].push("'unsafe-eval'");
  }

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  const response = NextResponse.next();

  // 3. Set semua header keamanan
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Header lain yang juga bagus untuk ditambahkan
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}
// Paksa update build v2
