import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Jika development, gunakan CSP yang lebih permisif
  if (process.env.NODE_ENV === "development") {
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://skhhodaegohhedcomccs.supabase.co",
      "connect-src 'self' *.supabase.co https://app.sandbox.midtrans.com ws://localhost:* http://localhost:*",
      "frame-src 'self' https://app.sandbox.midtrans.com",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    response.headers.set("Content-Security-Policy", cspHeader);
  } else {
    // Production CSP yang lebih ketat
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    const cspHeader = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://skhhodaegohhedcomccs.supabase.co",
      "connect-src 'self' *.supabase.co https://app.sandbox.midtrans.com",
      "frame-src 'self' https://app.sandbox.midtrans.com",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("x-nonce", nonce);
  }

  // Header keamanan lainnya
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
