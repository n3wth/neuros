'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignUpForm } from '@/components/features/auth/sign-up-form'
import { BrainIcon, RocketIcon, HeartIcon } from '@/components/icons/line-icons'
import { Logo } from '@/components/ui/logo'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Left Side - Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] relative overflow-hidden">
        {/* Background Pattern */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <defs>
            <pattern id="dots-signup-left" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.02)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-signup-left)" />
          
          {/* Organic shapes */}
          <motion.path
            d="M 200 200 Q 500 100 700 300 T 1000 400"
            stroke="rgba(255, 107, 107, 0.05)"
            strokeWidth="120"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.circle
            cx="800"
            cy="700"
            r="200"
            fill="rgba(79, 70, 229, 0.02)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="mb-16">
              <Logo size="lg" href="/" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl xl:text-6xl font-serif font-light leading-tight mb-6">
              Learn anything.
              <span className="block text-black/60 mt-2">Remember everything.</span>
            </h1>

            <p className="text-xl text-black/60 font-light mb-12 max-w-lg">
              Join thousands who are mastering new skills 2.3x faster with AI-powered learning.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {[
                { value: '2.5M+', label: 'Active learners' },
                { value: '87%', label: 'Retention rate' },
                { value: '4.9/5', label: 'User rating' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-3xl font-serif font-light">{stat.value}</div>
                  <div className="text-sm text-black/50">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* How it works */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-black/80">How it works</h3>
              {[
                {
                  icon: BrainIcon,
                  title: 'AI creates your cards',
                  description: 'Upload notes or topics, our AI generates perfect flashcards'
                },
                {
                  icon: RocketIcon,
                  title: 'Learn at optimal times',
                  description: 'Spaced repetition shows you cards right before you forget'
                },
                {
                  icon: HeartIcon,
                  title: 'Master any subject',
                  description: 'From languages to medicine, achieve true mastery'
                }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <step.icon className="w-6 h-6 text-black/60 mt-1 stroke-[1.5]" />
                  <div>
                    <h4 className="font-medium text-black/80">{step.title}</h4>
                    <p className="text-sm text-black/50">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-8 py-12">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Mobile Logo (shown only on mobile) */}
          <div className="text-center mb-12 lg:hidden">
            <Logo size="md" href="/" />
          </div>

          {/* Form Card */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-light mb-3">Create your account</h2>
              <p className="text-base text-black/60 font-light">
                Start your personalized learning journey today
              </p>
            </div>

            {/* Benefits - Compact Version */}
            <div className="mb-6 space-y-2">
              {[
                'AI-powered personalized learning',
                'Track progress with analytics',
                '14-day free trial, no credit card'
              ].map((benefit, index) => (
                <motion.div 
                  key={benefit}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-sm text-black/70">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <SignUpForm />

            {/* Social Options - Temporarily disabled but kept for future implementation */}
            {/* 
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FAFAF9] lg:bg-white px-4 text-black/40 font-mono tracking-wider">or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              
              <button className="w-full px-6 py-3 border border-black/20 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </button>
            </div>
            */}

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <p className="text-center text-sm text-black/60">
                Already have an account?{' '}
                <Link href="/signin" className="font-medium text-black hover:text-black/80 transition-colors">
                  Sign in
                </Link>
              </p>
              
              <p className="text-center text-xs text-black/40 px-4">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-black/60">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-black/60">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}