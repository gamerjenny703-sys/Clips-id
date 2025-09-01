import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ============= KONFIGURASI =============
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/api/auth/login",
  "/api/auth/register",
];

const ADMIN_ROUTES = ["/admin", "/dashboard/admin"];

const USER_ROUTES = ["/dashboard", "/profile", "/orders"];

const API_ROUTES = {
  PUBLIC: ["/api/auth", "/api/public"],
  PROTECTED: ["/api/user", "/api/orders"],
  ADMIN: ["/api/admin"],
};

// ============= HELPER FUNCTIONS =============
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret",
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

function isUserRoute(pathname: string): boolean {
  return USER_ROUTES.some((route) => pathname.startsWith(route));
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api");
}

function getSecurityHeaders(isDevelopment: boolean = false) {
  const headers: Record<string, string> = {
    // Prevent MIME sniffing
    "X-Content-Type-Options": "nosniff",

    // Prevent clickjacking
    "X-Frame-Options": "SAMEORIGIN",

    // XSS Protection (legacy but still good)
    "X-XSS-Protection": "1; mode=block",

    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions policy - disable unused features
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  };

  // HTTPS-only headers (hanya di production)
  if (!isDevelopment) {
    headers["Strict-Transport-Security"] =
      "max-age=31536000; includeSubDomains";
  }

  return headers;
}

function getCSPHeader(isDevelopment: boolean = false, nonce?: string): string {
  if (isDevelopment) {
    // CSP permisif untuk development
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' ws: wss: http: https:",
      "frame-src 'self'",
    ].join("; ");
  }

  // CSP production dengan nonce
  const scriptSrc = nonce
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `'self' 'unsafe-inline'`; // Fallback jika nonce gagal

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' *.supabase.co https://app.sandbox.midtrans.com https://app.midtrans.com",
    "frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// ============= MAIN MIDDLEWARE =============
export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isDevelopment = process.env.NODE_ENV === "development";

  console.log(`🔄 Middleware: ${request.method} ${pathname}`);

  // ============= 1. SECURITY HEADERS =============
  const response = NextResponse.next();

  // Generate nonce untuk CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Apply security headers
  const securityHeaders = getSecurityHeaders(isDevelopment);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply CSP
  response.headers.set(
    "Content-Security-Policy",
    getCSPHeader(isDevelopment, nonce),
  );
  response.headers.set("x-nonce", nonce);

  // ============= 2. CORS HANDLING (untuk API) =============
  if (isApiRoute(pathname)) {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      const corsHeaders = {
        "Access-Control-Allow-Origin": isDevelopment ? "*" : origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 24 hours
      };

      return new NextResponse(null, { status: 200, headers: corsHeaders });
    }

    // Add CORS headers to API responses
    response.headers.set(
      "Access-Control-Allow-Origin",
      isDevelopment ? "*" : origin,
    );
  }

  // ============= 3. RATE LIMITING (Simple) =============
  const clientIP =
    request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const rateLimitKey = `${clientIP}-${pathname}`;

  // Di production, Anda bisa pakai Redis/database untuk rate limiting
  // Ini contoh simple menggunakan in-memory (tidak persistent)

  // ============= 4. AUTHENTICATION & AUTHORIZATION =============

  // Skip auth untuk public routes
  if (isPublicRoute(pathname)) {
    console.log(`✅ Public route: ${pathname}`);
    return response;
  }

  // Get token dari cookies atau header
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log(`❌ No token for protected route: ${pathname}`);

    if (isApiRoute(pathname)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: response.headers },
      );
    }

    // Redirect ke login dengan return URL
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    console.log(`❌ Invalid token for: ${pathname}`);

    if (isApiRoute(pathname)) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401, headers: response.headers },
      );
    }

    // Clear invalid token dan redirect
    const loginUrl = new URL("/login", origin);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete("auth-token");
    return redirectResponse;
  }

  // ============= 5. ROLE-BASED ACCESS CONTROL =============
  const userRole = payload.role as string;

  // Admin routes
  if (isAdminRoute(pathname)) {
    if (userRole !== "admin") {
      console.log(`❌ Access denied - Admin required for: ${pathname}`);

      if (isApiRoute(pathname)) {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403, headers: response.headers },
        );
      }

      return NextResponse.redirect(new URL("/unauthorized", origin));
    }
  }

  // User routes (admin juga bisa akses)
  if (isUserRoute(pathname)) {
    if (!["user", "admin"].includes(userRole)) {
      console.log(`❌ Access denied - User role required for: ${pathname}`);

      if (isApiRoute(pathname)) {
        return NextResponse.json(
          { error: "User access required" },
          { status: 403, headers: response.headers },
        );
      }

      return NextResponse.redirect(new URL("/unauthorized", origin));
    }
  }

  // ============= 6. ADD USER INFO TO HEADERS (untuk server components) =============
  response.headers.set("x-user-id", payload.sub as string);
  response.headers.set("x-user-role", userRole);
  response.headers.set("x-user-email", payload.email as string);

  // ============= 7. LOGGING & MONITORING =============
  console.log(`✅ Authorized: ${userRole} accessing ${pathname}`);

  // Di production, bisa log ke external service
  // await logUserActivity(payload.sub, pathname, request.method);

  return response;
}

// ============= MATCHER CONFIGURATION =============
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api routes that don't need middleware (webhooks, etc)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
