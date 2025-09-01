// middleware.ts

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// ============= KONFIGURASI =============
const PUBLIC_ROUTES = [
  "/",
  "/work",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/sign-in",
  "/sign-up",
  "/auth/callback",
  "/api/auth",
  "/api/payments/midtrans",
];

// ============= HELPER UTAMA (dari Supabase) =============
const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );
  await supabase.auth.getUser();
  return response;
};

// ============= FUNGSI MIDDLEWARE UTAMA =============
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname, origin } = request.nextUrl;

  // Buat nonce unik untuk setiap request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = [
    "default-src 'self'",
    // Menggunakan 'nonce' dan 'strict-dynamic' untuk keamanan script-src
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://skhhodaegohhedcomccs.supabase.co",
    "connect-src 'self' *.supabase.co wss://*.supabase.co https://app.sandbox.midtrans.com",
    "frame-src 'self' https://app.sandbox.midtrans.com",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  // Terapkan semua header keamanan
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Teruskan nonce ke client-side (jika diperlukan oleh komponen lain)
  response.headers.set("x-nonce", nonce);

  // --- LOGIKA PROTEKSI ROUTE ---
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => request.cookies.get(name)?.value } },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/sign-in", origin);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/creator")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_creator")
      .eq("id", user.id)
      .single();
    if (!profile?.is_creator) {
      return NextResponse.redirect(new URL("/user/dashboard", origin));
    }
  }

  return response;
}

// ============= KONFIGURASI MATCHER =============
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
