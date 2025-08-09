'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { IconArrowRight, IconSparkles } from '@tabler/icons-react'

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
      className="relative min-h-[90vh] flex items-center bg-background"
    >
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Small badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary rounded mb-8">
              <div className="w-2 h-2 bg-green-500 rounded animate-pulse" />
              <span className="text-xs font-medium text-secondary-foreground">AI-powered learning platform</span>
            </div>

            {/* Main headline with typing effect */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight grid grid-rows-2 gap-0">
              {/* First line */}
              <span className="flex items-baseline">
                <span className="text-foreground">Master&nbsp;</span>
                <span className="font-medium inline-block relative" style={{ minWidth: '22ch' }}>
                  <span>
                    {text}
                    <span className="animate-blink">|</span>
                  </span>
                </span>
              </span>
              {/* Second line */}
              <span className="text-foreground">
                with intelligent repetition
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              An adaptive learning system that understands how you think. 
              Powered by advanced AI to optimize retention through personalized spaced repetition.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded transition-colors hover:opacity-90 group"
              >
                Start learning
                <IconArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="inline-flex items-center justify-center px-6 py-3 text-foreground font-medium rounded border border-border hover:bg-secondary transition-colors">
                Watch demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">92%</span>
                <span className="text-sm text-muted-foreground">retention rate</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">50K+</span>
                <span className="text-sm text-muted-foreground">active learners</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">3M+</span>
                <span className="text-sm text-muted-foreground">cards mastered</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Simple geometric visualization */}
        <motion.div 
          className="absolute right-8 top-1/2 -translate-y-1/2 w-96 h-96 hidden xl:block"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-full h-full">
            {/* Clean, simple shapes instead of complex neural network */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 rounded" />
            <div className="absolute top-20 right-0 w-16 h-16 bg-accent/20 rounded" />
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-secondary rounded" />
            <div className="absolute bottom-0 right-10 w-12 h-12 bg-destructive/20 rounded" />
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