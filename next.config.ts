import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  eslint: {
    ignoreDuringBuilds: false, // Enable build-time linting (security critical)
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  
  // Experimental optimizations for mobile performance
  experimental: {
    // Optimize package imports for better bundling
    optimizePackageImports: [
      '@radix-ui/react-*', 
      'lucide-react', 
      'framer-motion',
      '@tabler/icons-react',
      'date-fns',
      'd3'
    ],
  },
  
  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  
  // Pre-compile frequently used packages
  serverExternalPackages: ['sharp'],
  
  // Image optimization with mobile-first approach
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Enable compression
  compress: true,
  
  // Webpack configuration optimized for mobile
  webpack: (config, { isServer, dev }) => {
    // Ignore temporary manifest files during development
    if (!isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /\.tmp\./,
      };
    }
    
    // Optimize for mobile performance
    if (!isServer) {
      // Enable tree shaking for icon libraries
      config.module.rules.push({
        test: /lucide-react|@tabler\/icons-react/,
        sideEffects: false
      });
      
      // Replace large libraries with lighter alternatives
      config.resolve.alias = {
        ...config.resolve.alias,
        'lodash': 'lodash-es',
      };
    }
    
    // Bundle analyzer in development only
    if (process.env.ANALYZE === 'true' && !dev) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer 
            ? '../analyze/server.html' 
            : './analyze/client.html',
          openAnalyzer: false
        })
      )
    }
    
    return config;
  },
  
  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // PoweredByHeader disabled for security
  poweredByHeader: false,
};

export default withBundleAnalyzer(nextConfig);
