// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ============= KONFIGURASI =============
// Daftar route yang bisa diakses publik tanpa login
const PUBLIC_ROUTES = [
  "/",
  "/work", // Termasuk /work/[id]
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/sign-in",
  "/sign-up",
  "/auth/callback",
  "/api/auth", // Semua route di bawah /api/auth
];

// Route yang hanya bisa diakses oleh user dengan role 'creator'
const CREATOR_ROUTES = ["/creator"];

// Route yang hanya bisa diakses oleh user dengan role 'clipper'
const CLIPPER_ROUTES = ["/user"];

// ============= HELPER FUNCTIONS =============

/**
 * Membuat Supabase client di dalam middleware.
 * Diambil dari dokumentasi resmi Supabase.
 */
function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  return { supabase, response };
}

/**
 * Mengecek apakah sebuah path termasuk route publik.
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Menghasilkan header keamanan standar untuk setiap request.
 */
function getSecurityHeaders() {
  const headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
  return headers;
}

/**
 * Menghasilkan header Content-Security-Policy (CSP) yang aman.
 * Ini adalah versi final yang menggabungkan semua pembelajaran kita.
 */
function getCSPHeader(): string {
  // Daftar hash ini akan kita hapus jika nonce sudah terbukti stabil
  const shaHashes = [
    "'sha256-OBTN3R1yCV4Bq7dFqZ5a2pAXjnCcCYETjM02I/LYKeo='",
    "'sha256-GURBUR8f8Y0f0iCvfiUBdMNU386jQI5fM6yu34e4ml+NLxI='",
    "'sha256-E5hq48e3j0n0PZLb/HV98rpLw0vJKrfd9DAa/7VRTFI='",
    "'sha256-njsrAvwPFsR0ppoG04puafQfMh2fknN1B07EXCLAZfEo='",
    "'sha256-1vxz6ivcnfQMcz4kpZ3ax2RvaiUbWkLVml2NiZ0333Jk8='",
    "'sha256-2Tu4HudpI+xAMi+dsiI8aWsEl+bAqA/yX8E5EyvS6ws='",
    "'sha256-y5Bj5y3U7jNaBzN4rLHm6iYx2+kENGlssM/774nedJg='",
    "'sha256-21U4updiMiS8awsEl+bAqA/yX8E5EyvS6wsY5uY3U7j='",
    "'sha256-pZjljoaA0ltqmr5pv4o5dyFbkWdiqmKnqvqSbfVavmQ='",
    "'sha256-r2hQ60hLdGNfCFN7n1mbGCcUS+eNTO5mUCB5v='",
    "'sha256-V5Sj5y3U7jNaBzN4rLHm6iYx2+kENGlssM/774nedJg='",
    "'sha256-Wr5S3KfoqB0vN187uWmEMgW2Uj2ohDzdGdskaCA='",
  ];

  const cspPolicies = [
    "default-src 'self'",
    `script-src 'self' https://app.sandbox.midtrans.com ${shaHashes.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://skhhodaegohhedcomccs.supabase.co",
    "connect-src 'self' *.supabase.co wss://*.supabase.co https://app.sandbox.midtrans.com",
    "frame-src 'self' https://app.sandbox.midtrans.com",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  return cspPolicies.join("; ");
}

// ============= MAIN MIDDLEWARE =============
export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // 1. Buat Supabase client & response object
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // 2. Terapkan semua header keamanan
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set("Content-Security-Policy", getCSPHeader());

  // 3. Ambil sesi pengguna saat ini
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 4. Lewati jika route publik
  if (isPublicRoute(pathname)) {
    return response;
  }

  // 5. Jika tidak ada sesi (pengguna belum login)
  if (!session) {
    console.log(`❌ No session for protected route: ${pathname}`);
    const loginUrl = new URL("/sign-in", origin);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Ambil role pengguna dari database (jika diperlukan)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_creator")
    .eq("id", session.user.id)
    .single();

  const isCreator = profile?.is_creator || false;

  // 7. Cek otorisasi berdasarkan role
  if (pathname.startsWith("/creator") && !isCreator) {
    console.log(`❌ Access denied - Creator role required for: ${pathname}`);
    return NextResponse.redirect(new URL("/", origin)); // Redirect ke home jika bukan creator
  }

  if (pathname.startsWith("/user") && isCreator) {
    // Creator bisa akses halaman user, jadi tidak perlu blokir
  }

  console.log(`✅ Authorized: User ${session.user.id} accessing ${pathname}`);
  return response;
}

// ============= MATCHER CONFIGURATION =============
export const config = {
  matcher: [
    /*
     * Match semua request kecuali:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico (file favicon)
     * - file di dalam folder /public
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
