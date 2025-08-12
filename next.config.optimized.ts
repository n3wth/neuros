import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

/**
 * Optimized Next.js configuration for 2025 best practices
 * Focused on performance, bundle optimization, and AI-assisted development
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  // Optimize package imports to reduce bundle size
  optimizePackageImports: [
    'lucide-react',
    '@tabler/icons-react',
    'd3',
    'framer-motion',
    'date-fns',
    '@radix-ui/react-dialog',
    '@radix-ui/react-tabs',
    '@radix-ui/react-slot'
  ],
  
  // Experimental features for performance
  experimental: {
    // Enable Turbopack for faster development builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    },
    
    // Optimize CSS delivery
    optimizeCss: true,
    
    // Enable partial prerendering for better performance
    ppr: true,
    
    // Enable server actions size limit optimization
    serverActionsBodySizeLimit: '2mb',
    
    // Use SWC minifier for better performance
    swcMinify: true,
    
    // Enable React compiler optimizations
    reactCompiler: true,
    
    // Optimize server components payload
    serverComponentsExternalPackages: [
      'sharp',
      'bcrypt'
    ]
  },
  
  // Configure module resolution for cleaner imports
  webpack: (config, { isServer }) => {
    // Add path aliases for feature modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/features': './features',
      '@/shared': './features/shared'
    }
    
    // Optimize client bundles
    if (!isServer) {
      // Replace large libraries with lighter alternatives
      config.resolve.alias = {
        ...config.resolve.alias,
        'lodash': 'lodash-es',
        'moment': 'date-fns'
      }
      
      // Enable tree shaking for icon libraries
      config.module.rules.push({
        test: /lucide-react/,
        sideEffects: false
      })
    }
    
    // Add bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
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
    
    return config
  },
  
  // Image optimization settings
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Headers for security and performance
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
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
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
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
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
  
  // Redirects for common patterns
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/app',
        destination: '/dashboard',
        permanent: false
      }
    ]
  },
  
  // Rewrites for cleaner URLs
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    }
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // PoweredByHeader disabled for security
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Generate build ID based on git commit
  generateBuildId: async () => {
    // Use git commit hash as build ID
    return process.env.VERCEL_GIT_COMMIT_SHA || 'development'
  },
  
  // Configure build output
  distDir: '.next',
  
  // TypeScript configuration
  typescript: {
    // Allow production builds with TypeScript errors (use with caution)
    ignoreBuildErrors: false
  },
  
  // ESLint configuration
  eslint: {
    // Allow production builds with ESLint errors (use with caution)
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'features', 'lib', 'server']
  },
  
  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '0.1.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString()
  }
}

// Sentry configuration for error monitoring (optional)
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true
}

// Export with Sentry if configured, otherwise export plain config
export default process.env.SENTRY_DSN 
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig