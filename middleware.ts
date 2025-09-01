// middleware.ts

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// ============= 1. KONFIGURASI =============

// Daftar route yang bisa diakses publik tanpa perlu login.
const PUBLIC_ROUTES = [
  "/",
  "/work", // Mencakup /work/[id]
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/sign-in",
  "/sign-up",
  "/auth/callback", // Route callback dari Supabase
  "/api/auth", // Semua API route untuk otentikasi
];

// ============= 2. HELPER UTAMA (dari Supabase) =============

/**
 * Fungsi ini adalah cara standar dari Supabase untuk menangani sesi
 * di dalam server-side code seperti Middleware.
 * Tugasnya adalah membaca, menulis, dan menghapus cookies dengan aman.
 */
const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Perintah ini adalah KUNCI-nya.
  // Ia akan me-refresh session token pengguna jika sudah mau expired.
  await supabase.auth.getUser();

  return response;
};

// ============= 3. FUNGSI MIDDLEWARE UTAMA =============

export async function middleware(request: NextRequest) {
  // Jalankan updateSession di setiap request untuk menjaga sesi tetap aktif.
  const response = await updateSession(request);

  const { pathname, origin } = request.nextUrl;

  // Ambil data user dari Supabase client yang sudah diinisialisasi
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => request.cookies.get(name)?.value } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- LOGIKA PROTEKSI ROUTE ---

  // 1. Jika route adalah publik, biarkan saja.
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return response; // Langsung lolos
  }

  // 2. Jika pengguna belum login dan mencoba akses halaman privat
  if (!user) {
    console.log(
      `❌ Unauthenticated access to ${pathname} redirected to /sign-in`,
    );
    const loginUrl = new URL("/sign-in", origin);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Jika pengguna sudah login, cek role untuk route spesifik (contoh)
  if (pathname.startsWith("/creator")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_creator")
      .eq("id", user.id)
      .single();

    if (!profile?.is_creator) {
      console.log(
        `❌ Access Denied: User ${user.id} is not a creator for ${pathname}.`,
      );
      return NextResponse.redirect(new URL("/", origin)); // Redirect ke homepage
    }
  }

  console.log(`✅ Authorized access for user ${user.id} to ${pathname}`);
  return response;
}

// ============= 4. KONFIGURASI MATCHER =============

export const config = {
  matcher: [
    /*
     * Match semua request kecuali yang ada di daftar ini.
     * Ini untuk efisiensi agar middleware tidak berjalan untuk file statis.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
