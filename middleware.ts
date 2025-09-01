// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cspPolicies = {
    "default-src": ["'self'"],
    // STRATEGI BARU: Izinkan semua skrip dari domain kita ('self')
    // dan izinkan skrip inline secara eksplisit ('unsafe-inline').
    // Ini akan menyelesaikan error 'Refused to execute inline script'.
    "script-src": [
      "'self'",
      "https://app.sandbox.midtrans.com",
      "'unsafe-inline'", // Ini adalah kuncinya untuk sekarang
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

  // Tetap berikan kelonggaran untuk mode development
  if (process.env.NODE_ENV === "development") {
    cspPolicies["script-src"].push("'unsafe-eval'");
  }

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  console.log(
    "--- [RESET STRATEGY] Generated CSP Header for:",
    request.nextUrl.pathname,
    "---",
  );
  console.log(cspHeader);
  console.log("-------------------------------------------------");

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}
