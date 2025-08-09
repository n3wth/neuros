'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignUpForm } from '@/components/features/auth/sign-up-form'
import { SparkleIcon } from '@/components/icons/line-icons'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-8 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)`
        }}
      />

      <motion.div 
        className="relative z-10 w-full max-w-md"
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
        <div className="bg-white rounded-3xl border border-black/5 p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-light mb-3">Create your account</h1>
            <p className="text-base text-black/60 font-light">
              Start your personalized learning journey today
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-8 space-y-3">
            {[
              'AI-powered personalized learning paths',
              'Spaced repetition for lasting memory',
              'Track progress with detailed analytics'
            ].map((benefit, index) => (
              <motion.div 
                key={benefit}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span className="text-sm text-black/70">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <SignUpForm />

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
              Sign up with Google
            </button>
            
            <button className="w-full px-6 py-3 border border-black/20 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Sign up with GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-black/60">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-black hover:text-black/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 text-center px-6">
          <p className="text-xs text-black/40 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-black/60">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-black/60">Privacy Policy</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}