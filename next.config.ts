/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false,
  },

  images: {
    unoptimized: true, // 🔥 avoids Next Image optimization server
  },

  // ✅ FIX: Allow deep links like /boarding/:id
  async rewrites() {
    return [
      {
        source: "/boarding/:path*",
        destination: "/", // serve homepage, return 200
      },
    ];
  },
};

module.exports = nextConfig;
