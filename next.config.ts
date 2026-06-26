import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/pocketmoda',
          destination: '/pocketmoda/index.html',
        },
        {
          source: '/pocketmoda/:path((?!.*\\..+$).*)',
          destination: '/pocketmoda/index.html',
        },
      ],
    }
  },
};

export default nextConfig;
