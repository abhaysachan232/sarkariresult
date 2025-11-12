/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // strict mode off
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sarkariresult.rest",  // aapka real domain
        port: "",                      // production me generally port nahi hota
        pathname: "/api/job-image/**",
      },
    ],
  },
};

module.exports = nextConfig;
