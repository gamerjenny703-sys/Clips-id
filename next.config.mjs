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
  async rewrites() {
    return [
      {
        source: "/terms/tiktokbdyI1Xrvc0vW2NLoCKSFMfS1YS98pLEW.txt",
        destination: "/tiktokbdyI1Xrvc0vW2NLoCKSFMfS1YS98pLEW.txt",
      },
    ];
  },
  // HAPUS seluruh bagian 'async headers()' dari sini
};

export default nextConfig;
