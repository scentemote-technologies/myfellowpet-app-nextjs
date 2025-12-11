/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 🔥 REQUIRED for static hosting (cPanel, GoDaddy)
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false,
  },

  images: {
    unoptimized: true, // 🔥 Important: avoids Next Image optimization server
  },
};

module.exports = nextConfig;
