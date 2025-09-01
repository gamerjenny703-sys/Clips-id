// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const { pathname } = request.nextUrl;

  const cspPolicies = {
    "default-src": ["'self'"],
    "script-src": [] as string[],
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
  const pageWithInsecureScripts = ["/creator/contest/new", "/user/earnings/"];
  const ispageWithInsecureScripts = pageWithInsecureScripts.some((page) =>
    pathname.startsWith(page),
  );

  if (ispageWithInsecureScripts) {
    cspPolicies["script-src"] = [
      "'self'",
      "https://app.midtrans.com",
      "'unsafe-inline'",
    ];
  } else {
    cspPolicies["script-src"] = [`'nonce-${nonce}'`, "'strict-dynamic'"];
  }

  if (process.env.NODE_ENV === "development") {
    cspPolicies["script-src"].push("'unsafe-eval'");
  }

  const cspHeader = Object.entries(cspPolicies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  // Buat response terlebih dahulu
  const response = NextResponse.next();

  // Sekarang, set semua header langsung di response
  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}
