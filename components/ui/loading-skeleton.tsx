'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingSkeletonProps {
  type?: 'card' | 'dashboard' | 'stats' | 'list' | 'review'
  message?: string
  showIcon?: boolean
  className?: string
}

export function LoadingSkeleton({ 
  type = 'card', 
  message, 
  className = '' 
}: LoadingSkeletonProps) {
  const [loadingStage, setLoadingStage] = useState(0)
  const [dots, setDots] = useState('.')
  
  // Fast-updating loading stages
  useEffect(() => {
    if (type === 'dashboard') {
      const stages = [
        'Initializing workspace',
        'Loading your cards',
        'Calculating statistics',
        'Preparing insights',
        'Almost ready'
      ]
      
      const interval = setInterval(() => {
        setLoadingStage(prev => (prev + 1) % stages.length)
      }, 400) // Update every 400ms for quick feedback
      
      return () => clearInterval(interval)
    }
  }, [type])
  
  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 200)
    
    return () => clearInterval(interval)
  }, [])

  const loadingMessages = [
    'Initializing workspace',
    'Loading your cards',
    'Calculating statistics',
    'Preparing insights',
    'Almost ready'
  ]

  if (type === 'dashboard') {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center ${className}`}>
        <div className="text-center relative">
          {/* Modern animated loading ring */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-black/10"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Progress ring */}
            <svg className="absolute inset-0 w-24 h-24 -rotate-90">
              <motion.circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 0.8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  strokeDasharray: "1 1",
                  pathLength: 1
                }}
              />
            </svg>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
              >
                <span className="text-2xl">🧠</span>
              </motion.div>
            </div>
          </div>
          
          {/* Fast-updating status text */}
          <div className="space-y-2">
            <motion.h3 
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-light text-black/80"
            >
              {loadingMessages[loadingStage]}{dots}
            </motion.h3>
            
            {/* Progress indicator */}
            <div className="w-48 h-1 bg-black/5 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-black/20 rounded-full"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ width: '50%' }}
              />
            </div>
            
            {/* Quick tips */}
            <motion.p 
              className="text-xs text-black/40 font-light mt-4"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tip: Press spacebar to quickly review cards
            </motion.p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={`p-6 bg-white rounded-3xl border border-black/5 ${className}`}>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-4 bg-black/5 rounded"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleX: [1, 1.01, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
              style={{ width: `${100 - i * 15}%` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1
            }}
          >
            <div className="space-y-3">
              <div className="h-8 w-8 bg-black/5 rounded" />
              <div className="h-6 w-16 bg-black/5 rounded" />
              <div className="h-3 w-10 bg-black/5 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white rounded-3xl border-black/5"
            animate={{
              x: [0, 2, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-black/5 rounded w-3/4" />
                <div className="h-3 bg-black/5 rounded w-1/2" />
              </div>
              <div className="w-5 h-5 bg-black/5 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'review') {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center ${className}`}>
        <div className="max-w-2xl w-full mx-auto px-8">
          <div className="p-10 bg-white border border-black/5 rounded-3xl shadow-lg">
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <span className="text-2xl">📚</span>
              </motion.div>
            </div>
            
            <div className="space-y-4">
              <div className="h-8 bg-black/5 rounded w-1/3 mx-auto" />
              <div className="h-4 bg-black/5 rounded" />
              <div className="h-4 bg-black/5 rounded w-4/5" />
            </div>
            
            {message && (
              <p className="text-center text-sm text-black/60 font-light mt-6">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default LoadingSkeleton