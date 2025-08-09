'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { IconArrowRight, IconSparkles } from '@tabler/icons-react'

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
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.section 
      ref={heroRef}
      style={{ opacity }}
      className="relative min-h-screen overflow-hidden bg-[#FAFAF9]"
    >
      {/* Organic background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 87, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Custom cursor follower */}
      <motion.div
        className="pointer-events-none absolute w-6 h-6 rounded-full border-2 border-black/20 z-50 hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />

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
                Remember
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
            <motion.span 
              className="block text-[clamp(1.5rem,3.5vw,2.5rem)] font-sans font-extralight mt-6 text-black/50 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Forever.
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
                finding patterns, and storing memories exactly when they're about to fade.
              </p>
              <p className="text-xl leading-[1.6] text-black/60 font-light mt-6">
                No more forgetting. No more re-learning. Just pure, permanent knowledge.
              </p>
              
              {/* Refined CTA section */}
              <div className="mt-16 space-y-6">
                <Link 
                  href={isAuthenticated ? "/dashboard" : "/signup"}
                  className="group relative inline-flex items-center gap-4 overflow-hidden"
                >
                  <span className="text-lg font-medium tracking-wide relative z-10">
                    Begin your journey
                  </span>
                  <div className="relative w-12 h-12 rounded-full border border-black/20 group-hover:border-black/40 transition-colors flex items-center justify-center">
                    <IconArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                
                <button className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60 transition-colors group">
                  <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black/20 transition-colors">
                    <div className="w-0 h-0 border-l-[6px] border-l-black/40 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent group-hover:border-l-black/60 transition-colors" />
                  </div>
                  <span>Watch demo — 2 min</span>
                </button>
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
                  className="relative p-8 rounded-3xl bg-white border border-black/5 overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ y: -2 }}
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

        {/* Refined floating elements */}
        <motion.div className="absolute top-32 right-32 hidden xl:block">
          <motion.div
            className="w-24 h-24 rounded-full border border-black/5"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.div className="absolute bottom-48 left-32 hidden xl:block">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100/50 to-orange-100/50 backdrop-blur-sm"
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.div className="absolute top-64 left-[60%] hidden xl:block">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 backdrop-blur-sm"
            animate={{
              y: [0, -15, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 17,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}