'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
}

export default function ProfessionalHero({ isAuthenticated }: ProfessionalHeroProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeWord, setActiveWord] = useState(0)
  
  // Thoughtful, slow word transitions that emphasize meaning
  const words = ['Remember', 'Master', 'Understand', 'Internalize', 'Absorb']

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => (prev + 1) % words.length)
    }, 4000) // Slower, more thoughtful timing
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <motion.section 
      ref={ref}
      className="relative min-h-screen bg-[#FAFAF9] text-black overflow-hidden"
    >
      {/* Subtle, sophisticated background elements */}
      <div className="absolute inset-0">
        {/* Very subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #000 0.5px, transparent 0.5px), radial-gradient(circle at 75% 75%, #000 0.5px, transparent 0.5px)`,
          backgroundSize: '80px 80px'
        }} />
        
        {/* Floating subtle elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-black/[0.03] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-black/[0.02] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 w-full pt-32 pb-24">
        <div className="space-y-16">
          {/* Refined eyebrow text */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Separator className="w-12" />
            <p className="text-xs font-mono text-black/60 tracking-widest uppercase">
              Introducing Neuros
            </p>
          </motion.div>

          {/* Apple-quality hero headline */}
          <div className="text-center max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-8">
                <span className="relative inline-block">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[activeWord]}
                      initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -30, scale: 1.05, filter: "blur(8px)" }}
                      transition={{ 
                        duration: 1.2,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="block text-black"
                    >
                      {words[activeWord]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="block text-black/60 mt-4">everything.</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-[1.375rem] leading-[1.4] text-black/60 font-light max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              We built a learning system that works like your brain does—making connections, 
              finding patterns, and storing memories exactly when they&apos;re about to fade.
            </motion.p>
          </div>

          {/* Apple-style CTA section */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="group rounded-full h-14 px-10 text-[1.0625rem] font-medium bg-black text-white hover:bg-black/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg"
                className="rounded-full h-14 px-8 text-[1.0625rem] font-medium text-black/60 hover:text-black hover:bg-black/5 transition-all duration-300"
              >
                Watch the film
              </Button>
            </div>
            
            <p className="text-sm text-black/50 font-light">
              Available for Mac, iPad, iPhone, and web.
            </p>
          </motion.div>

          {/* Apple-style feature grid with more space */}
          <div className="grid lg:grid-cols-3 gap-12 mt-32">

            {[
              {
                title: 'Memory that mirrors yours',
                subtitle: 'Intelligent Spacing',
                description: 'Our system learns your forgetting curve and delivers knowledge at the exact moment before you forget—creating permanent memories, not temporary knowledge.',
                stat: { value: '87%', label: 'retention after 30 days' },
                delay: 0.9
              },
              {
                title: 'Difficulty that evolves',
                subtitle: 'Adaptive Challenge', 
                description: 'Like a personal tutor that knows exactly when to push you harder and when to ease up. Every session calibrated to your current ability.',
                stat: { value: '2.3×', label: 'faster mastery' },
                delay: 1.0
              },
              {
                title: 'Understanding, visualized',
                subtitle: 'Deep Analytics',
                description: 'See your learning patterns emerge. Discover your peak performance times, strongest subjects, and optimal review schedules.',
                stat: { value: '15min', label: 'daily commitment' },
                delay: 1.1
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: feature.delay, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <div className="relative p-8 rounded-3xl bg-white border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-500 h-full">
                  <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-4">
                    {feature.subtitle}
                  </p>
                  
                  <h3 className="text-2xl font-serif font-light mb-6 leading-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[1.0625rem] leading-relaxed text-black/60 font-light mb-8">
                    {feature.description}
                  </p>

                  <div className="pt-6 border-t border-black/5">
                    <div className="text-center">
                      <div className="text-3xl font-serif font-light mb-1">{feature.stat.value}</div>
                      <div className="text-sm text-black/60">{feature.stat.label}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Apple-style trust indicators */}
          <motion.div 
            className="mt-32 pt-16 border-t border-black/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <p className="text-lg text-black/60 font-light mb-12">
              Trusted by learners at the world&apos;s most innovative companies.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center">
              {['Google', 'Apple', 'Microsoft', 'Stanford', 'MIT'].map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
                  className="text-2xl font-serif font-light text-black/40 hover:text-black/60 transition-colors duration-300"
                >
                  {company}
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              {[
                { value: '50,000+', label: 'Active learners worldwide' },
                { value: '87%', label: 'Still remember after 30 days' },
                { value: '15min', label: 'Daily time investment' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-serif font-light text-black mb-2">{stat.value}</div>
                  <div className="text-sm text-black/60 font-light">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}