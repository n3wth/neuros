'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BrainIcon, SparkleIcon, ChartIcon } from '@/components/icons/line-icons'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
}

export default function ProfessionalHero({ isAuthenticated }: ProfessionalHeroProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeWord, setActiveWord] = useState(0)
  
  const words = ['Remember', 'Master', 'Understand', 'Internalize']

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <section ref={ref} className="relative min-h-screen bg-[#FAFAF9] overflow-hidden">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #000 1px, transparent 1px), radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 w-full pt-32 pb-16">
        <div className="space-y-12">
          {/* Refined announcement */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Introducing GPT-5
            </p>
          </motion.div>

          {/* Editorial hero text */}
          <motion.div 
            className="max-w-5xl space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em]">
              <span className="block mb-4 relative inline-block">
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
                <span className="text-black"> everything.</span>
              </span>
              <span className="block text-black/60 mt-4">
                No more forgetting.
              </span>
            </h1>
            
            <p className="text-xl leading-[1.6] text-black/60 font-light max-w-3xl">
              We built a learning system that works like your brain does—making connections, 
              finding patterns, and storing memories exactly when they&apos;re about to fade.
            </p>
          </motion.div>

          {/* Refined CTAs */}
          <motion.div 
            className="pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              href={isAuthenticated ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-medium">Get started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Refined features */}
          <div className="grid lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: BrainIcon,
                title: 'Intelligent Spacing',
                description: 'Our system learns your forgetting curve and delivers knowledge at the exact moment before you forget—creating permanent memories.',
                color: '#FF6B6B',
                stats: { main: '87%', label: 'retention after 30 days' }
              },
              {
                icon: SparkleIcon,
                title: 'AI Generation',
                description: 'Transform any content into perfect study materials with GPT-5. From PDFs to lectures—we make it stick.',
                color: '#4ECDC4',
                stats: { main: '2.3×', label: 'faster mastery' }
              },
              {
                icon: ChartIcon,
                title: 'Deep Analytics',
                description: 'See your learning patterns emerge. Discover your peak performance times and optimal review schedules.',
                color: '#95E77E',
                stats: { main: '15min', label: 'daily commitment' }
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <div className="bg-white border border-black/5 rounded-3xl p-8 h-full hover:shadow-lg transition-shadow duration-300">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon 
                      className="w-7 h-7" 
                      style={{ color: feature.color }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-serif font-light mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-base leading-relaxed text-black/60 font-light mb-8">
                    {feature.description}
                  </p>

                  <div className="pt-6 border-t border-black/5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-serif font-light">{feature.stats.main}</span>
                      <span className="text-sm text-black/60">{feature.stats.label}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Clean testimonial */}
          <motion.div 
            className="mt-16 pt-12 border-t border-black/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="max-w-4xl">
              <blockquote className="text-2xl font-serif font-light leading-relaxed text-black/80 mb-8">
                &ldquo;I&apos;ve tried every learning app out there. This is the first one that actually 
                made me remember things months later. The science behind it is solid.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="text-sm font-mono">DR</span>
                </div>
                <div>
                  <div className="font-medium">Dr. Sarah Chen</div>
                  <div className="text-sm text-black/60">Neuroscientist, Stanford</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}