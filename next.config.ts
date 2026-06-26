import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/pocketmoda',
        destination: 'https://pocketmoda.vercel.app/pocketmoda',
      },
      {
        source: '/pocketmoda/:path*',
        destination: 'https://pocketmoda.vercel.app/pocketmoda/:path*',
      },
    ]
  },
};

export default nextConfig;
