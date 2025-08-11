'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import MemoryTraces from './neural-network'
import TextMorph from '../ui/text-morph'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
}

export default function ProfessionalHero({ isAuthenticated }: ProfessionalHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const heroRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 600], [1, 0.3])
  const textY = useTransform(scrollY, [0, 400], [0, -30])
  

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.section 
      ref={heroRef}
      style={{ opacity }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] pattern-mesh"
    >
      {/* Background Pattern - matching auth pages */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="dots-hero" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.02)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-hero)" />
        
        {/* Organic shapes */}
        <motion.path
          d="M 100 100 Q 400 50 600 200 T 900 300"
          stroke="rgba(255, 107, 107, 0.05)"
          strokeWidth="120"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="150"
          cy="600"
          r="180"
          fill="rgba(79, 70, 229, 0.02)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.path
          d="M 300 700 Q 600 600 900 800"
          stroke="rgba(34, 197, 94, 0.03)"
          strokeWidth="100"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.3 }}
        />
      </svg>
      
      {/* Additional decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-40 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 87, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>


      {/* Hero Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 w-full pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Editorial-style eyebrow text */}
          <motion.div 
            className="flex items-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Introducing Neuros
            </p>
          </motion.div>

          {/* Large editorial headline */}
          <motion.h1 
            className="mb-16"
            style={{ y: textY }}
          >
            <motion.span 
              className="block text-[clamp(4rem,10vw,9rem)] font-serif font-light leading-[0.85] tracking-[-0.02em]"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="relative inline-block">
                <TextMorph
                  words={[
                    'Remember',
                    'Master',
                    'Understand',
                    'Internalize',
                    'Absorb'
                  ]}
                  className="text-[clamp(4rem,10vw,9rem)] leading-[0.85]"
                  interval={2800}
                  colors={['#000000', '#4f46e5', '#22c55e', '#ff6b6b', '#a855f7']}
                />
                <motion.span 
                  className="absolute -bottom-3 left-0 w-full h-[2px] bg-gradient-to-r from-black to-black/30 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.span>
            <motion.span 
              className="block text-[clamp(4rem,10vw,9rem)] font-serif font-light leading-[0.85] tracking-[-0.02em] text-black/90 mt-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              everything.
            </motion.span>
          </motion.h1>

          {/* Editorial body text in columns */}
          <div className="grid md:grid-cols-12 gap-12">
            <motion.div 
              className="md:col-span-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-xl leading-[1.6] text-black/80 font-light">
                We built a learning system that works like your brain does—making connections, 
                finding patterns, and storing memories exactly when they&apos;re about to fade.
              </p>
              <p className="text-xl leading-[1.6] text-black/60 font-light mt-6">
                No more forgetting. No more re-learning. Just pure, permanent knowledge.
              </p>
              
              {/* Refined CTA section */}
              <div className="mt-16 space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link 
                    href={isAuthenticated ? "/dashboard" : "/signup"}
                    className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full border border-black/20 bg-white hover:bg-black hover:border-black transition-all duration-200 ease-out"
                  >
                    <span className="text-lg font-medium tracking-wide relative z-10 text-black group-hover:text-white transition-colors duration-200">
                      Begin your journey
                    </span>
                    <motion.div 
                      className="relative w-12 h-12 rounded-full border border-black/20 group-hover:border-white/20 transition-all duration-200 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <IconArrowRight className="w-5 h-5 text-black group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                    </motion.div>
                  </Link>
                </motion.div>
                
                <motion.button 
                  className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60 transition-all duration-200 ease-out group"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black/20 transition-all duration-200"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="w-0 h-0 border-l-[6px] border-l-black/40 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent group-hover:border-l-black/60 transition-colors duration-200" />
                  </motion.div>
                  <span className="transition-colors duration-200">Watch demo — 2 min</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Visual storytelling cards */}
            <motion.div 
              className="md:col-span-6 md:col-start-7 space-y-5"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                { number: '87%', label: 'Better recall after 30 days', accent: '#FFD700' },
                { number: '2.3×', label: 'Faster learning velocity', accent: '#4169E1' },
                { number: '15min', label: 'Daily commitment needed', accent: '#32CD32' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card relative p-8 rounded-3xl bg-white border border-black/5 overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ease-out"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-1 h-full origin-top"
                    style={{ backgroundColor: stat.accent }}
                    initial={{ scaleY: 0 }}
                    animate={hoveredIndex === index ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative flex items-baseline justify-between">
                    <div>
                      <div className="text-4xl font-serif font-light mb-2">{stat.number}</div>
                      <div className="text-sm text-black/50 font-light tracking-wide">{stat.label}</div>
                    </div>
                    <motion.div
                      className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center"
                      animate={hoveredIndex === index ? { scale: 1.1 } : { scale: 1 }}
                    >
                      <IconArrowRight className="w-4 h-4 text-black/30" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom section with refined trust indicators */}
          <motion.div 
            className="mt-32 pt-16 border-t border-black/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif font-light text-black mb-1">50,000+</div>
                  <div className="text-xs text-black/40 uppercase tracking-wider">Active Learners</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif font-light text-black mb-1">Stanford, MIT</div>
                  <div className="text-xs text-black/40 uppercase tracking-wider">Trusted By Top Institutions</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif font-light text-black mb-1">92%</div>
                  <div className="text-xs text-black/40 uppercase tracking-wider">Retention Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Subtle Memory Formation Traces */}
        <MemoryTraces 
          show={true}
          position={{ top: '12rem', right: '8rem' }}
        />

        {/* Cute floating elements */}
        <motion.div className="absolute top-32 right-48 hidden xl:block">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100/60 to-purple-100/60 border border-purple-200/30"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.div className="absolute bottom-48 left-32 hidden xl:block">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100/70 to-orange-100/70 backdrop-blur-sm border border-yellow-200/30"
            animate={{
              y: [0, 35, 0],
              x: [0, -25, 0],
              rotate: [0, -360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.div className="absolute top-64 left-[60%] hidden xl:block">
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/60 backdrop-blur-sm border border-blue-200/30"
            animate={{
              y: [0, -20, 0],
              x: [0, 20, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.div className="absolute top-96 left-[40%] hidden xl:block">
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100/60 to-emerald-100/60 backdrop-blur-sm border border-green-200/30"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}