'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface CuteButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  href?: string
  as?: 'button' | 'a'
}

export default function CuteButton({ 
  children, 
  onClick, 
  className,
  variant = 'primary',
  disabled = false,
  href,
  as = 'button'
}: CuteButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleMouseEnter = () => {
    setIsHovered(true)
    // Add sparkle on hover
    const newSparkle = {
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 100
    }
    setSparkles(prev => [...prev, newSparkle])
    
    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 1000)
  }

  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 overflow-hidden group",
    {
      'bg-black text-white hover:bg-black/90 px-8 py-4': variant === 'primary',
      'border border-black/20 hover:bg-black/5 px-8 py-4': variant === 'secondary',
      'hover:text-black text-black/60 px-4 py-2': variant === 'ghost',
      'opacity-50 cursor-not-allowed': disabled
    },
    className
  )

  const Component = as === 'a' ? motion.a : motion.button

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Subtle gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: variant === 'primary' 
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0%, transparent 70%)'
        }}
      />
      
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path 
              d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4L5 0Z" 
              fill={variant === 'primary' ? 'white' : 'black'}
              opacity="0.4"
            />
          </svg>
        </motion.div>
      ))}
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
      
      {/* Hover indicator dot */}
      {variant === 'primary' && (
        <motion.div
          className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{
            opacity: isHovered ? [0.4, 1, 0.4] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      )}
    </Component>
  )
}