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
  "/api/payment/notification", // Midtrans notification callback
  "/api/payment/callback", // Payment callback routes
];

// ============= 2. SECURITY HEADERS CONFIGURATION =============

const setSecurityHeaders = (response: NextResponse) => {
  // Content Security Policy - Disesuaikan untuk Next.js + Supabase + Midtrans + Vercel
  const csp = [
    "default-src 'self'",
    // Script sources: Next.js chunks + Supabase SDK + Midtrans payment
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://app.midtrans.com https://app.sandbox.midtrans.com",
    // Style sources: Next.js styles + inline styles + Midtrans styles
    "style-src 'self' 'unsafe-inline' https://app.midtrans.com https://app.sandbox.midtrans.com",
    // Font sources: jika pakai custom fonts
    "font-src 'self' data: https://app.midtrans.com https://app.sandbox.midtrans.com",
    // Image sources: Next.js optimized images + Supabase storage + Midtrans assets
    "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://app.midtrans.com https://app.sandbox.midtrans.com https://*.midtrans.com",
    // Connect sources: API calls ke Supabase + Midtrans API + Source maps
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://api.midtrans.com https://api.sandbox.midtrans.com https://app.midtrans.com https://app.sandbox.midtrans.com",
    // Media sources: untuk audio/video dari Supabase storage
    "media-src 'self' https://*.supabase.co https://*.supabase.in",
    "frame-src 'self' https://app.midtrans.com https://app.sandbox.midtrans.com",
    "frame-ancestors 'none'", // Mencegah clickjacking
    "base-uri 'self'",
    "form-action 'self' https://app.midtrans.com https://app.sandbox.midtrans.com",
    "object-src 'none'",
    // Upgrade insecure requests di production
    ...(process.env.NODE_ENV === "production"
      ? ["upgrade-insecure-requests"]
      : []),
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // X-Frame-Options - Mencegah clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // X-Content-Type-Options - Mencegah MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer Policy - Mengontrol informasi referrer
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy - Mengizinkan payment untuk Midtrans
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), interest-cohort=(), browsing-topics=()",
  );

  // X-DNS-Prefetch-Control - Mengontrol DNS prefetching
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // Strict-Transport-Security - Vercel sudah handle ini, tapi kita perkuat
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // Cross-Origin-Embedder-Policy dan Cross-Origin-Opener-Policy
  // response.headers.set("Cross-Origin-Embedder-Policy", "credentialless");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return response;
};

// ============= 3. HELPER UNTUK IP ADDRESS =============

/**
 * Fungsi untuk mendapatkan IP address yang benar di berbagai environment
 * Khusus untuk Vercel dan deployment lainnya
 */
const getClientIP = (request: NextRequest): string => {
  // Coba berbagai header untuk mendapatkan real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  
  if (forwarded) {
    // x-forwarded-for bisa berisi multiple IPs, ambil yang pertama
    return forwarded.split(",")[0].trim();
  }
  
  if (vercelForwarded) {
    return vercelForwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  // Fallback jika tidak ada header IP yang ditemukan
  return "unknown";
};

// ============= 4. HELPER UTAMA (dari Supabase) =============

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
          // Tambahkan security options untuk cookies
          const secureOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
          };

          request.cookies.set({ name, value, ...secureOptions });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...secureOptions });
        },
        remove(name: string, options: CookieOptions) {
          const secureOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
          };

          request.cookies.set({ name, value: "", ...secureOptions });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...secureOptions });
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
};

// ============= 5. FUNGSI MIDDLEWARE UTAMA =============

export async function middleware(request: NextRequest) {
  // Jalankan updateSession di setiap request untuk menjaga sesi tetap aktif.
  let response = await updateSession(request);

  // Terapkan security headers ke semua response
  response = setSecurityHeaders(response);

  const { pathname, origin } = request.nextUrl;

  // Gunakan helper function untuk mendapatkan IP
  const ip = getClientIP(request);

  const userAgent = request.headers.get("user-agent") || "";

  // Blokir request yang mencurigakan (lebih spesifik untuk production)
  if (process.env.NODE_ENV === "production") {
    const suspiciousBots = ["python-requests", "curl/", "wget/", "scrapy"];
    const isSuspicious = suspiciousBots.some((bot) =>
      userAgent.toLowerCase().includes(bot.toLowerCase()),
    );

    if (isSuspicious) {
      console.log(`🚫 Blocked suspicious request from ${ip}: ${userAgent}`);
      const blockedResponse = new NextResponse("Forbidden", { status: 403 });
      return setSecurityHeaders(blockedResponse);
    }
  }

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
      `❌ Unauthenticated access to ${pathname} from ${ip} redirected to /sign-in`,
    );
    const loginUrl = new URL("/sign-in", origin);
    loginUrl.searchParams.set("returnUrl", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    return setSecurityHeaders(redirectResponse);
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
        `❌ Access Denied: User ${user.id} from ${ip} is not a creator for ${pathname}.`,
      );
      const redirectResponse = NextResponse.redirect(new URL("/", origin));
      return setSecurityHeaders(redirectResponse);
    }
  }

  // 4. Proteksi tambahan untuk payment dan upload routes
  if (pathname.startsWith("/api/payment") || pathname.startsWith("/payment")) {
    if (
      !user &&
      !pathname.includes("/callback") &&
      !pathname.includes("/notification")
    ) {
      console.log(`❌ Unauthorized payment access from ${ip} to ${pathname}`);
      const forbiddenResponse = new NextResponse("Unauthorized", {
        status: 401,
      });
      return setSecurityHeaders(forbiddenResponse);
    }
  }

  if (pathname.startsWith("/api/upload") || pathname.startsWith("/upload")) {
    if (!user) {
      console.log(`❌ Unauthorized upload attempt from ${ip} to ${pathname}`);
      const forbiddenResponse = new NextResponse("Unauthorized", {
        status: 401,
      });
      return setSecurityHeaders(forbiddenResponse);
    }

    // Tambahan: Cek content-type untuk upload
    const contentType = request.headers.get("content-type");
    if (
      contentType &&
      !contentType.startsWith("multipart/form-data") &&
      !contentType.startsWith("application/json")
    ) {
      console.log(
        `❌ Invalid content-type for upload from ${ip}: ${contentType}`,
      );
      const badRequestResponse = new NextResponse("Bad Request", {
        status: 400,
      });
      return setSecurityHeaders(badRequestResponse);
    }
  }

  console.log(
    `✅ Authorized access for user ${user.id} from ${ip} to ${pathname}`,
  );
  return response;
}

// ============= 6. KONFIGURASI MATCHER =============

export const config = {
  matcher: [
    /*
     * Match semua request kecuali yang ada di daftar ini.
     * Ini untuk efisiensi agar middleware tidak berjalan untuk file statis.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};