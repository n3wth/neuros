'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TextMorphProps {
  words: string[]
  className?: string
  interval?: number
  colors?: string[]
}

interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  opacity: number
  color: string
}

export default function TextMorph({ 
  words, 
  className = '',
  interval = 3000,
  colors = ['#000000', '#4169E1', '#32CD32', '#FF6B6B', '#9B59B6']
}: TextMorphProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  
  // Generate particles during transition
  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x: Math.random() * 200 - 100,
        y: Math.random() * 50 - 25,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 0,
        maxLife: 45 + Math.random() * 30,
        opacity: 0.4 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    setParticles(newParticles)
  }, [colors])
  
  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return
    
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life + 1,
        opacity: particle.opacity * 0.96
      })).filter(particle => particle.life < particle.maxLife))
    }
    
    const intervalId = setInterval(animateParticles, 16)
    return () => clearInterval(intervalId)
  }, [particles])
  
  // Main word cycling with spring physics timing
  useEffect(() => {
    const timer = setInterval(() => {
      generateParticles()
      
      // Staggered timing for natural feel
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % words.length)
      }, 300)
    }, interval)
    
    return () => clearInterval(timer)
  }, [words, interval, generateParticles])
  
  // Spring physics configuration for organic motion
  const springConfig = {
    type: "spring" as const,
    stiffness: 80,
    damping: 12,
    mass: 0.6
  }
  
  const morphVariants = {
    enter: {
      opacity: 0,
      scale: 0.85,
      rotateX: 15,
      y: 30,
      filter: 'blur(8px)'
    },
    center: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      scale: 1.15,
      rotateX: -15,
      y: -30,
      filter: 'blur(8px)'
    }
  }
  
  // Get current color with smooth transitions
  const currentColor = colors[currentIndex % colors.length]
  
  return (
    <div className={`relative ${className}`}>
      {/* Particles with organic motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: `50%`,
              top: `50%`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0, 
              opacity: particle.opacity 
            }}
            animate={{ 
              x: particle.x, 
              y: particle.y, 
              scale: [0, 1.2, 0.8, 0],
              opacity: [particle.opacity, particle.opacity * 0.8, 0]
            }}
            transition={{ 
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for organic feel
            }}
          />
        ))}
      </div>
      
      {/* Main text container with perspective */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={morphVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springConfig}
            style={{ 
              color: currentColor,
              transformStyle: 'preserve-3d'
            }}
            className="font-serif font-light tracking-[-0.02em]"
          >
            {words[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Subtle background color shift */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg opacity-3"
        animate={{
          background: [
            `radial-gradient(ellipse at center, ${currentColor}10 0%, transparent 70%)`,
            `radial-gradient(ellipse at center, ${colors[(currentIndex + 1) % colors.length]}10 0%, transparent 70%)`
          ]
        }}
        transition={{
          duration: interval / 1000,
          ease: "easeInOut",
          repeat: Infinity
        }}
      />
    </div>
  )
}