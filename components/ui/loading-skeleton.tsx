'use client'

import { motion } from 'framer-motion'
import { BookIcon } from '@/components/icons/line-icons'

interface LoadingSkeletonProps {
  type?: 'card' | 'dashboard' | 'stats' | 'list' | 'review'
  message?: string
  className?: string
  showIcon?: boolean
}

export function LoadingSkeleton({ 
  type = 'card', 
  message, 
  className = '' 
}: LoadingSkeletonProps) {

  if (type === 'dashboard') {
    return (
      <div className={`min-h-screen bg-[#FAFAF9] ${className}`}>
        {/* Ultra minimal loading - almost blank */}
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-1 h-1 bg-black/20 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={`p-6 bg-white rounded-xl border border-black/5 ${className}`}>
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
            className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-black/5"
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
            className="p-4 bg-white rounded-xl border-black/5"
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
          <div className="p-6 bg-white border border-black/5 rounded-xl shadow-lg">
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
                <BookIcon className="w-8 h-8 text-black/60" />
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