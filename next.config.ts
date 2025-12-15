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
        source: "/privacy-policy",
        destination: "/privacy-policy.html",
      },
      {
        source: "/cancellation-refund-policy",
        destination: "/cancellation-refund-policy.html",
      },
      {
        source: "/contact-us",
        destination: "/contact-us.html",
      },
      {
        source: "/delete-account",
        destination: "/delete-account.html",
      },
      {
        source: "/about-us",
        destination: "/about-us.html",
      },
      {
        source: "/terms_of_service",
        destination: "/terms_of_service.html",
      },
      {
        source: "/boarding/:path*",
        destination: "/", // serve homepage, return 200
      },
    ];
  },
};

module.exports = nextConfig;
