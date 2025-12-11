/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false,
  },

  images: {
    unoptimized: true, // 🔥 Important: avoids Next Image optimization server
  },
};

module.exports = nextConfig;
