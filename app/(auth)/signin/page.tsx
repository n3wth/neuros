'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignInForm } from '@/components/features/auth/sign-in-form'
import { SparkleIcon } from '@/components/icons/line-icons'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] relative overflow-hidden">
      {/* Full Page Background Pattern - Cute organic shapes */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] via-[#FAFAF9] to-[#F5FFF5]" />
        
        {/* Floating organic shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.03)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          
          {/* Cute organic blobs */}
          <motion.path
            d="M -100 300 Q 200 100 400 300 T 800 300"
            stroke="rgba(255, 107, 107, 0.1)"
            strokeWidth="80"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.circle
            cx="150"
            cy="150"
            r="100"
            fill="rgba(149, 231, 126, 0.05)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.circle
            cx="1300"
            cy="600"
            r="150"
            fill="rgba(79, 70, 229, 0.03)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
          <motion.path
            d="M 1200 100 Q 1100 200 1200 300 T 1200 500"
            stroke="rgba(255, 215, 0, 0.08)"
            strokeWidth="60"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.3, ease: "easeInOut" }}
          />
        </svg>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 text-6xl opacity-10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20 text-5xl opacity-10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          📚
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-40 text-4xl opacity-10"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          🌟
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <SparkleIcon className="w-8 h-8 text-black/70 group-hover:text-black transition-colors" />
              <span className="text-2xl font-serif font-light">Neuros</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-black/5 p-10 shadow-sm">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-light mb-3">Welcome back</h1>
              <p className="text-base text-black/60 font-light">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Form */}
            <SignInForm />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-black/40 font-mono tracking-wider">or</span>
              </div>
            </div>

            {/* Social Options */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <button className="w-full px-6 py-3 border border-black/20 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-black/5 text-center">
              <p className="text-sm text-black/60">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-black hover:text-black/80 transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <Link href="/forgot-password" className="text-sm text-black/40 hover:text-black/60 transition-colors">
              Forgot your password?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}