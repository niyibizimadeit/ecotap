import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.ecotap.rw" },
    ],
  },
};

export default nextConfig;
