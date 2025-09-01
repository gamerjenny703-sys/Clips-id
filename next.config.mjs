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
      {
        source: "/privacy/tiktokje8FevyLlAmAq2MbZX3H28psFPwbyI8k.txt",
        destination: "/tiktokje8FevyLlAmAq2MbZX3H28psFPwbyI8k.txt",
      },
    ];
  },
};

export default nextConfig;
