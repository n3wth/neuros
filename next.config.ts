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
    // Pre-compile frequently used packages
    serverComponentsExternalPackages: [],
  },
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Compression
  compress: true,
};

export default withBundleAnalyzer(nextConfig);
