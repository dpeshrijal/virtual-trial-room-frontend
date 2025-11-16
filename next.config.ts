import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "virtualtrialroombackendst-virtualtryonresultsbucke-r3w9znvctxpc.s3.us-east-1.amazonaws.com",
      },
    ],
    // Disable image optimization for development (optional)
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
