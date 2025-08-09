'use client'

import { motion, MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface AppleCardProps extends MotionProps {
  children: ReactNode
  className?: string
  glassy?: boolean
  elevated?: boolean
  interactive?: boolean
  gradient?: boolean
}

export function AppleCard({
  children,
  className,
  glassy = false,
  elevated = false,
  interactive = false,
  gradient = false,
  ...motionProps
}: AppleCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        glassy && [
          'bg-white/70 dark:bg-gray-900/70',
          'backdrop-blur-xl backdrop-saturate-150',
          'border border-white/20 dark:border-gray-800/20',
          'shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
        ],
        elevated && [
          'bg-white dark:bg-gray-900',
          'shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
          'border border-gray-200/50 dark:border-gray-800/50'
        ],
        interactive && [
          'transition-all duration-300',
          'hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]',
          'hover:scale-[1.02]',
          'cursor-pointer'
        ],
        gradient && 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
        className
      )}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      {...motionProps}
    >
      {/* Glow effect */}
      {glassy && (
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-60" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </motion.div>
  )
}

export function AppleGlow({
  className,
  color = 'blue'
}: {
  className?: string
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'orange'
}) {
  const colorMap = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    green: 'from-green-400 to-green-600',
    orange: 'from-orange-400 to-orange-600'
  }

  return (
    <div
      className={cn(
        'absolute -inset-[1px] rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70',
        colorMap[color],
        className
      )}
    />
  )
}

export function AppleShimmer({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent',
        className
      )}
      animate={{
        x: ['0%', '200%']
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatDelay: 3
      }}
    />
  )
}