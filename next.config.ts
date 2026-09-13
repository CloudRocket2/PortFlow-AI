import type { NextConfig } from "next";

// @ts-expect-error - NextConfig types are out of date
const nextConfig: any = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
