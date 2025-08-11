'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
}

export default function ProfessionalHero({ isAuthenticated }: ProfessionalHeroProps) {
  const [activeWord, setActiveWord] = useState(0)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 600], [1, 0.3])
  
  // Words for the text morphing effect, simplified
  const words = ['Remember', 'Master', 'Understand', 'Internalize', 'Absorb']

  // Simple interval for word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <motion.section 
      style={{ opacity }}
      className="relative min-h-screen bg-white text-black"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 w-full pt-32 pb-24">
        <div className="space-y-16">
          {/* Simple eyebrow text */}
          <div className="flex items-center gap-4">
            <Separator className="w-12" />
            <p className="text-xs font-mono text-black/60 tracking-widest uppercase">
              Introducing Neuros
            </p>
          </div>

          {/* Clean, minimal headline */}
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-light leading-[0.9] tracking-tight">
              <span className="relative inline-block">
                {words[activeWord]}
                <Separator className="absolute -bottom-3 left-0 w-full h-[1px] bg-black/50" />
              </span>
            </h1>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-light leading-[0.9] tracking-tight text-black/90">
              everything.
            </h1>
          </div>

          {/* Content with more whitespace */}
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-8">
              <p className="text-xl leading-relaxed text-black/80 font-light">
                We built a learning system that works like your brain does—making connections, 
                finding patterns, and storing memories exactly when they&apos;re about to fade.
              </p>
              <p className="text-xl leading-relaxed text-black/60 font-light">
                No more forgetting. No more re-learning. Just pure, permanent knowledge.
              </p>
              
              {/* Simplified CTA section */}
              <div className="pt-8 space-y-4">
                <Button 
                  asChild
                  size="lg"
                  className="rounded-full h-14 px-8 text-base font-medium bg-black text-white hover:bg-black/90"
                >
                  <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                    Begin your journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-black/60 hover:text-black"
                >
                  Watch demo — 2 min
                </Button>
              </div>
            </div>

            {/* Clean, minimal stat cards */}
            <div className="md:col-span-6 md:col-start-7 space-y-4">
              {[
                { number: '87%', label: 'Better recall after 30 days' },
                { number: '2.3×', label: 'Faster learning velocity' },
                { number: '15min', label: 'Daily commitment needed' },
              ].map((stat, index) => (
                <Card 
                  key={index}
                  className="p-6 border-black/10 hover:border-black/20 transition-colors duration-200"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl font-serif font-light mb-1">{stat.number}</div>
                      <div className="text-sm text-black/60">{stat.label}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black/30" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Simple trust indicators */}
          <div className="pt-16 border-t border-black/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <div className="text-2xl font-serif font-light text-black mb-1">50,000+</div>
                  <div className="text-xs text-black/60 uppercase tracking-wider">Active Learners</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <div className="text-2xl font-serif font-light text-black mb-1">Stanford, MIT</div>
                  <div className="text-xs text-black/60 uppercase tracking-wider">Trusted By Top Institutions</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <div>
                  <div className="text-2xl font-serif font-light text-black mb-1">92%</div>
                  <div className="text-xs text-black/60 uppercase tracking-wider">Retention Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}