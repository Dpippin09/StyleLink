import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  env: {
    EBAY_APP_ID: process.env.EBAY_APP_ID,
  }
};

export default nextConfig;
