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
  },
  // Configure Turbopack to exclude mobile folder
  turbopack: {
    resolveAlias: {
      'expo-router': '/dev/null',
      '@expo/vector-icons': '/dev/null',
      'react-native': '/dev/null',
    }
  },
  // Fallback webpack config for legacy mode
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/mobile/**', '**/node_modules/**'],
    };
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'expo-router': false,
      '@expo/vector-icons': false,
      'react-native': false,
    };
    
    return config;
  },
};

export default nextConfig;
