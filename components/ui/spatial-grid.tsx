'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SpatialGridProps {
  children: ReactNode
  className?: string
}

export function SpatialGrid({ children, className }: SpatialGridProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Background grid with depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg) scale(2)',
            transformOrigin: 'center center'
          }}
        />
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FloatingElement({ 
  children, 
  className,
  delay = 0,
  duration = 6
}: FloatingElementProps) {
  return (
    <motion.div
      className={cn('relative', className)}
      animate={{
        y: [0, -20, 0],
        rotateZ: [-1, 1, -1]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxContainer({ 
  children, 
  className,
  offset = 50 
}: {
  children: ReactNode
  className?: string
  offset?: number
}) {
  return (
    <motion.div
      className={cn('relative', className)}
      initial={{ y: offset }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function DepthCard({
  children,
  className,
  depth = 1
}: {
  children: ReactNode
  className?: string
  depth?: 1 | 2 | 3
}) {
  const depthStyles = {
    1: 'shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.05)]',
    2: 'shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.08)]',
    3: 'shadow-[0_4px_8px_rgba(0,0,0,0.05),0_16px_32px_rgba(0,0,0,0.1)]'
  }

  return (
    <motion.div
      className={cn(
        'relative bg-white dark:bg-gray-900 rounded-2xl',
        depthStyles[depth],
        className
      )}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      style={{
        transform: 'translateZ(0)', // Enable hardware acceleration
        willChange: 'transform'
      }}
    >
      {children}
    </motion.div>
  )
}