import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspPolicies = {
    "default-src": ["'self'"],
    "script-src": [
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      "https://app.midtrans.com",
      "'unsafe-inline'",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https://skhhodaegohhedcomccs.supabase.co"],
    "connect-src": ["'self'", "*.supabase.co"],
    "frame-src": ["'self'", "https://app.midtrans.com"],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  if (process.env.NODE_ENV === "development") {
    cspPolicies["script-src"].push("'unsafe-eval'");
  }
  // --- AKHIR BLOK ---

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);
  requestHeaders.set("X-Frame-Options", "SAMEORIGIN");
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

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
