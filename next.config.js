/** @type {import('next').NextConfig} */

const nextConfig = {
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
  },
};

module.exports = nextConfig;
