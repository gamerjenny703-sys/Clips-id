/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // --- TAMBAHKAN BAGIAN INI ---
  async headers() {
    return [
      {
        // Terapkan header ini ke semua rute di aplikasi
        source: "/:path*",
        headers: [
          // 1. Mencegah Clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // 2. Mencegah MIME-sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 3. Mengontrol informasi yang dikirim di header Referer
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 4. Content Security Policy (CSP) - Paling kompleks tapi paling kuat
          {
            key: "Content-Security-Policy",
            value: createCspHeader(),
          },
        ],
      },
    ];
  },
  // -----------------------------
};

// --- TAMBAHKAN FUNGSI HELPER INI DI LUAR `nextConfig` ---
const createCspHeader = () => {
  const policies = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-eval'", // Diperlukan untuk beberapa library dan Next.js dev mode
      "'unsafe-inline'", // Diperlukan untuk inline scripts & styles Next.js
      "https://app.sandbox.midtrans.com", // Izinkan skrip dari Midtrans Sandbox
      // TODO: Ganti ke URL produksi Midtrans saat launching
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https://skhhodaegohhedcomccs.supabase.co"], // Izinkan gambar dari Supabase Storage
    "connect-src": [
      "'self'",
      "*.supabase.co", // Izinkan koneksi (fetch) ke Supabase
    ],
    "frame-src": [
      "'self'",
      "https://app.sandbox.midtrans.com", // Izinkan Midtrans Snap di-load dalam iframe
    ],
    "font-src": ["'self'"], // Jika kamu pakai Google Fonts, tambahkan 'https://fonts.gstatic.com'
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"], // Alternatif modern untuk X-Frame-Options
  };

  return Object.entries(policies)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
};

export default nextConfig;
