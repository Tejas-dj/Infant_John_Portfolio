import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's defaults minus 3840: no photo is ever displayed that wide, and
    // 2x-density desktop screens would otherwise pick the 3840w candidate.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
