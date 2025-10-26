import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable turbopack for now
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
