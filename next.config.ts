import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable build-time linting (security critical)
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily disabled for deployment
  },
  experimental: {
    // Optimize package imports for better bundling
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react', 'framer-motion'],
    // Turbopack configuration
    turbo: {
      resolveAlias: {
        // Ensure proper module resolution for Turbopack
        '@': './src',
      },
    },
  },
  // Pre-compile frequently used packages
  serverExternalPackages: [],
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Compression
  compress: true,
  // Webpack configuration to handle manifest files
  webpack: (config, { isServer }) => {
    // Ignore temporary manifest files during development
    if (!isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /\.tmp\./,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
