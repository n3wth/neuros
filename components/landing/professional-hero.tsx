'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Brain, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
}

export default function ProfessionalHero({ isAuthenticated }: ProfessionalHeroProps) {
  const [activeWord, setActiveWord] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])
  const y = useTransform(scrollY, [0, 400], [0, -50])
  
  // Words for the text morphing effect
  const words = [
    { text: 'Learn', color: 'from-violet-600 to-indigo-600' },
    { text: 'Master', color: 'from-blue-600 to-cyan-600' },
    { text: 'Excel', color: 'from-emerald-600 to-teal-600' },
    { text: 'Remember', color: 'from-orange-600 to-red-600' },
    { text: 'Grow', color: 'from-purple-600 to-pink-600' }
  ]

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50">
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-300/10 to-rose-300/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 pb-32"
      >
        <div className="space-y-20">
          {/* Announcement bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <Badge variant="secondary" className="px-4 py-1.5 bg-gradient-to-r from-violet-100 to-indigo-100 border-violet-200">
              <Sparkles className="w-3 h-3 mr-2" />
              New: GPT-5 powered learning engine
            </Badge>
          </motion.div>

          {/* Hero headline with animated gradient text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight">
              <span className="block text-slate-900">Your smartest,</span>
              <span className="block mt-2">
                <span className="text-slate-900">fastest, most </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`inline-block bg-gradient-to-r ${words[activeWord].color} bg-clip-text text-transparent`}
                  >
                    {words[activeWord].text.toLowerCase()}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="block mt-2 text-slate-900">model yet, with built-in</span>
              <span className="block mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                thinking that counts.
              </span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed"
            >
              Our smartest, fastest, most useful model yet, with built-in thinking
              that gets expert-level intelligence in everyone&apos;s hands.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-full px-8 py-6 text-base font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-xl transition-all duration-300"
            >
              <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                <span className="relative z-10">Get started</span>
                <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
            >
              Learn more
            </Button>
          </motion.div>

          {/* Feature cards grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              {
                icon: Brain,
                title: 'Advanced reasoning',
                description: 'Powered by GPT-5 with chain-of-thought capabilities for complex problem solving',
                gradient: 'from-violet-500 to-purple-500'
              },
              {
                icon: Zap,
                title: 'Lightning fast',
                description: 'Get instant responses with our optimized inference engine and smart caching',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Shield,
                title: 'Enterprise ready',
                description: 'SOC 2 compliant with end-to-end encryption and role-based access control',
                gradient: 'from-emerald-500 to-teal-500'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

          {/* Stats section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 py-12 border-y border-slate-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10M+', label: 'Active users' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '<100ms', label: 'Response time' },
                { value: '4.9/5', label: 'User rating' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-3xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}