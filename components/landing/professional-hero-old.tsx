'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { IconArrowRight, IconSparkles } from '@tabler/icons-react'
import { DESIGN_COLORS } from '@/lib/avatar-utils'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
}

export default function ProfessionalHero({ isAuthenticated }: ProfessionalHeroProps) {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  const concepts = [
    'quantum computing',
    'transformer architectures', 
    'product strategy',
    'creative coding',
    'system design',
    'machine learning'
  ]

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % concepts.length
      const fullText = concepts[i]

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 30 : 150)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed])

  return (
    <motion.section 
      style={{ opacity, scale }}
      className="relative min-h-[90vh] flex items-center"
    >
      {/* Subtle solid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `${DESIGN_COLORS.warmBeige}10` }} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Small badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded mb-8" style={{ backgroundColor: DESIGN_COLORS.warmBeige }}>
              <div className="w-2 h-2 rounded animate-pulse" style={{ backgroundColor: DESIGN_COLORS.forestGreen }} />
              <span className="text-xs font-medium" style={{ color: DESIGN_COLORS.charcoal }}>AI-powered learning platform</span>
            </div>

            {/* Main headline with typing effect - using grid to prevent layout shift */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight grid grid-rows-2 gap-0">
              {/* First line - grid ensures consistent height */}
              <span className="flex items-baseline">
                <span className="text-gray-900">Master&nbsp;</span>
                <span className="font-medium inline-block relative" style={{ minWidth: '22ch' }}>
                  <span>
                    {text}
                    <span className="animate-blink">|</span>
                  </span>
                </span>
              </span>
              {/* Second line */}
              <span className="text-gray-900">
                with intelligent repetition
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
              An adaptive learning system that understands how you think. 
              Powered by advanced AI to optimize retention through personalized spaced repetition.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center px-6 py-3 font-medium rounded transition-all duration-200 group" style={{ backgroundColor: DESIGN_COLORS.charcoal, color: DESIGN_COLORS.softWhite }}
              >
                Start learning
                <IconArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="inline-flex items-center justify-center px-6 py-3 font-medium rounded border transition-colors" style={{ color: DESIGN_COLORS.charcoal, borderColor: DESIGN_COLORS.warmGray }}>
                Watch demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">92%</span>
                <span className="text-sm text-gray-600">retention rate</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">50K+</span>
                <span className="text-sm text-gray-600">active learners</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">3M+</span>
                <span className="text-sm text-gray-600">cards mastered</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Visualization on the right - adjusted positioning to prevent overlap */}
        <motion.div 
          className="absolute right-8 top-1/2 -translate-y-1/2 w-96 h-96 hidden xl:block"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-full h-full">
            {/* Neural network visualization */}
            <svg className="w-full h-full" viewBox="0 0 400 400">
              {/* Animated connections */}
              {[...Array(6)].map((_, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={100 + i * 50}
                  y1={100}
                  x2={150 + i * 40}
                  y2={300}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatType: "reverse" }}
                />
              ))}
              
              {/* Nodes */}
              {[...Array(8)].map((_, i) => (
                <motion.circle
                  key={`node-${i}`}
                  cx={100 + Math.random() * 200}
                  cy={100 + Math.random() * 200}
                  r="4"
                  fill="black"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </motion.section>
  )
}