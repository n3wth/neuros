'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Clock, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CallToActionProps {
  isAuthenticated: boolean
}

export default function CallToAction({ isAuthenticated }: CallToActionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const benefits = [
    {
      icon: Sparkles,
      text: "Start learning in under 60 seconds"
    },
    {
      icon: Clock,
      text: "Free 14-day trial, no credit card required"
    },
    {
      icon: Users,
      text: "Join 50,000+ learners worldwide"
    },
    {
      icon: Zap,
      text: "Cancel anytime, keep your progress forever"
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #000 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <motion.div
        className="absolute top-20 left-1/4 w-2 h-2 bg-gray-400 rounded-full"
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-32 right-1/3 w-1 h-1 bg-gray-500 rounded-full"
        animate={{
          x: [0, 20, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Ready to get started?</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-light leading-tight mb-8">
            Your learning revolution
            <br />
            <span className="text-gray-600">starts today</span>
          </h2>

          <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands of learners who have transformed their ability to master 
            new skills with our AI-powered learning system.
          </p>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-700 font-medium text-left">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="group h-16 px-12 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            {!isAuthenticated && (
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="h-16 px-12 border-2 border-gray-300 hover:bg-gray-50 rounded-xl text-lg font-medium transition-all duration-300"
              >
                <Link href="/signin">
                  Already have an account?
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <span>Cancel anytime</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to experience learning that actually sticks?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Join the thousands of professionals, students, and lifelong learners who have 
              transformed their learning with Neuros. Your future self will thank you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}