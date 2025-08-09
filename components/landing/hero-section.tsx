'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Brain } from "lucide-react"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface HeroSectionProps {
  isAuthenticated: boolean
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* iOS 26 Liquid Glass Background */}
      <div className="absolute inset-0">
        {/* Dynamic gradient that follows mouse */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.5), transparent 50%)`
          }}
        />
        
        {/* Animated glass morphism layers */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Glass mesh pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <Brain className="w-4 h-4 mr-2" />
            Neuros · AI Learning OS
          </Badge>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Learn Anything
          </span>
          <br />
          <span className="text-3xl md:text-5xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            With AI-Powered Mastery
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience the future of learning with adaptive AI, spaced repetition, and personalized knowledge paths. 
          Master complex concepts through immersive, iOS 26-inspired interactions.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {isAuthenticated ? (
            <Link href="/learn">
              <Button 
                size="lg" 
                className="group relative px-8 py-6 text-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter Learning Space
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="group relative px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning
                    <Sparkles className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/signin">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 text-6xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🧠
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-5xl"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-5xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚀
        </motion.div>
      </div>
    </section>
  )
}