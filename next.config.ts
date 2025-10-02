import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Disable ESLint entirely
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
