/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sarkariresult.rest",
        pathname: "/api/job-image/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/job-image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
