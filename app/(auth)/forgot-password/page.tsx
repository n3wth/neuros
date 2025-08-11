'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ForgotPasswordForm } from '@/components/features/auth/forgot-password-form'
import { BrainIcon, ShieldIcon, LockIcon } from '@/components/icons/line-icons'
import { Logo } from '@/components/ui/logo'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Left Side - Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] relative overflow-hidden">
        {/* Background Pattern */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dots-forgot-left" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.02)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-forgot-left)" />
          
          {/* Organic shapes */}
          <motion.path
            d="M 0 400 Q 300 200 600 400 T 1000 400"
            stroke="rgba(255, 107, 107, 0.05)"
            strokeWidth="80"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.circle
            cx="150"
            cy="300"
            r="120"
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
              Don&apos;t worry,
              <span className="block text-black/60 mt-2">we&apos;ve got you covered</span>
            </h1>

            <p className="text-xl text-black/60 font-light mb-12 max-w-lg">
              Enter your email and we&apos;ll send you a secure link to reset your password.
            </p>

            {/* Security Features */}
            <div className="space-y-6">
              {[
                {
                  icon: ShieldIcon,
                  title: 'Secure Process',
                  description: 'Your reset link is encrypted and expires in 1 hour'
                },
                {
                  icon: LockIcon,
                  title: 'Privacy Protected',
                  description: 'We never store your passwords in plain text'
                },
                {
                  icon: BrainIcon,
                  title: 'Quick Recovery',
                  description: 'Get back to learning in just a few clicks'
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

            {/* Security Note */}
            <div className="mt-16 pt-12 border-t border-black/10">
              <p className="text-sm text-black/50 leading-relaxed">
                <strong className="text-black/70">Security tip:</strong> If you don&apos;t receive the email within a few minutes, 
                check your spam folder or contact support.
              </p>
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
              <h2 className="text-3xl font-serif font-light mb-3">Reset password</h2>
              <p className="text-base text-black/60 font-light">
                Enter your email address and we&apos;ll send you a reset link
              </p>
            </div>

            {/* Form */}
            <ForgotPasswordForm />

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <p className="text-center text-sm text-black/60">
                Remember your password?{' '}
                <Link href="/signin" className="font-medium text-black hover:text-black/80 transition-colors">
                  Sign in
                </Link>
              </p>
              
              <p className="text-center">
                <Link href="/signup" className="text-sm text-black/40 hover:text-black/60 transition-colors">
                  Don&apos;t have an account? Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}