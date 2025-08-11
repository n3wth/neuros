'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form'
import { LockIcon, ShieldIcon, CheckCircleIcon } from '@/components/icons/line-icons'
import { Logo } from '@/components/ui/logo'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Left Side - Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] relative overflow-hidden">
        {/* Background Pattern */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dots-reset-left" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.02)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-reset-left)" />
          
          {/* Organic shapes */}
          <motion.path
            d="M 0 350 Q 350 150 700 350 T 1000 350"
            stroke="rgba(255, 107, 107, 0.05)"
            strokeWidth="60"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.circle
            cx="200"
            cy="250"
            r="100"
            fill="rgba(79, 70, 229, 0.03)"
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
              Create your new
              <span className="block text-black/60 mt-2">secure password</span>
            </h1>

            <p className="text-xl text-black/60 font-light mb-12 max-w-lg">
              Choose a strong password to protect your account and get back to learning.
            </p>

            {/* Security Features */}
            <div className="space-y-6">
              {[
                {
                  icon: LockIcon,
                  title: 'Password Security',
                  description: 'Your password is encrypted and never stored in plain text'
                },
                {
                  icon: ShieldIcon,
                  title: 'Account Protection',
                  description: 'Strong passwords help keep your learning data safe'
                },
                {
                  icon: CheckCircleIcon,
                  title: 'Instant Access',
                  description: 'Once set, you can immediately access your account'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <feature.icon className="w-6 h-6 text-black/60 mt-1 stroke-[1.5]" />
                  <div>
                    <h3 className="font-medium text-black/80">{feature.title}</h3>
                    <p className="text-sm text-black/50">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Password Tips */}
            <div className="mt-16 pt-12 border-t border-black/10">
              <h4 className="font-medium text-black/70 mb-3">Password best practices:</h4>
              <ul className="text-sm text-black/50 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Mix of letters, numbers, and symbols</li>
                <li>• Unique to your Neuros account</li>
              </ul>
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
              <h2 className="text-3xl font-serif font-light mb-3">Set new password</h2>
              <p className="text-base text-black/60 font-light">
                Create a strong, secure password for your account
              </p>
            </div>

            {/* Form */}
            <ResetPasswordForm />

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <p className="text-center text-sm text-black/60">
                Remember your password?{' '}
                <Link href="/signin" className="font-medium text-black hover:text-black/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}