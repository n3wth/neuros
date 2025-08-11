'use client'

import { motion } from 'framer-motion'
import { BrainIcon, SparkleIcon } from '@/components/icons/line-icons'

interface LoadingSkeletonProps {
  type?: 'card' | 'dashboard' | 'stats' | 'list' | 'review'
  message?: string
  className?: string
}

export function LoadingSkeleton({ 
  type = 'card', 
  message, 
  className = '' 
}: LoadingSkeletonProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const shimmerAnimation = !prefersReducedMotion ? {
    background: [
      'linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.05) 75%)',
      'linear-gradient(90deg, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.02) 75%)',
      'linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.05) 75%)',
    ]
  } : {}

  const shimmerTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }

  if (type === 'card') {
    return (
      <div className={`p-6 bg-white rounded-3xl border border-black/5 ${className}`}>
        {message && (
          <div className="flex items-center mb-4 text-center justify-center">
            <motion.div
              animate={!prefersReducedMotion ? { rotate: [0, 360] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <SparkleIcon className="w-5 h-5 mr-2 text-black/40" />
            </motion.div>
            <p className="text-sm text-black/60 font-light">{message}</p>
          </div>
        )}
        <div className="space-y-4">
          <motion.div 
            className="h-4 rounded-full"
            animate={shimmerAnimation}
            transition={shimmerTransition}
          />
          <motion.div 
            className="h-4 rounded-full w-4/5"
            animate={shimmerAnimation}
            transition={{...shimmerTransition, delay: 0.2}}
          />
          <motion.div 
            className="h-3 rounded-full w-2/3"
            animate={shimmerAnimation}
            transition={{...shimmerTransition, delay: 0.4}}
          />
        </div>
      </div>
    )
  }

  if (type === 'dashboard') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5] flex items-center justify-center ${className}`}>
        <div className="text-center">
          <motion.div
            animate={!prefersReducedMotion ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BrainIcon className="w-12 h-12 mx-auto mb-4 text-black/40 stroke-[1.5]" />
          </motion.div>
          <h3 className="text-xl font-serif font-light mb-2 text-black/70">
            {message || "Loading your learning dashboard..."}
          </h3>
          <motion.div 
            className="flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-black/30"
                animate={!prefersReducedMotion ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 1, 0.3]
                } : {}}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5">
            <div className="flex items-center justify-between mb-3">
              <motion.div 
                className="w-7 h-7 rounded-lg"
                animate={shimmerAnimation}
                transition={{...shimmerTransition, delay: i * 0.1}}
              />
              <motion.div 
                className="h-3 w-12 rounded-full"
                animate={shimmerAnimation}
                transition={{...shimmerTransition, delay: i * 0.1 + 0.2}}
              />
            </div>
            <motion.div 
              className="h-8 w-16 rounded-lg mb-2"
              animate={shimmerAnimation}
              transition={{...shimmerTransition, delay: i * 0.1 + 0.4}}
            />
            <motion.div 
              className="h-3 w-10 rounded-full"
              animate={shimmerAnimation}
              transition={{...shimmerTransition, delay: i * 0.1 + 0.6}}
            />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border-black/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <motion.div 
                  className="h-5 rounded-full mb-3 w-3/4"
                  animate={shimmerAnimation}
                  transition={{...shimmerTransition, delay: i * 0.1}}
                />
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="h-3 w-20 rounded-full"
                    animate={shimmerAnimation}
                    transition={{...shimmerTransition, delay: i * 0.1 + 0.2}}
                  />
                  <motion.div 
                    className="h-3 w-16 rounded-full"
                    animate={shimmerAnimation}
                    transition={{...shimmerTransition, delay: i * 0.1 + 0.4}}
                  />
                </div>
              </div>
              <motion.div 
                className="w-5 h-5 rounded-full"
                animate={shimmerAnimation}
                transition={{...shimmerTransition, delay: i * 0.1 + 0.6}}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'review') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] flex items-center justify-center ${className}`}>
        <div className="max-w-2xl w-full mx-auto px-8">
          <div className="p-10 bg-white border border-black/5 rounded-3xl shadow-lg">
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={!prefersReducedMotion ? {
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <BrainIcon className="w-8 h-8 text-purple-500/70" />
              </motion.div>
            </div>
            
            <motion.div 
              className="h-6 rounded-full mb-8 w-1/3"
              animate={shimmerAnimation}
              transition={shimmerTransition}
            />
            
            <motion.div 
              className="h-5 rounded-full mb-4"
              animate={shimmerAnimation}
              transition={{...shimmerTransition, delay: 0.2}}
            />
            <motion.div 
              className="h-5 rounded-full mb-8 w-4/5"
              animate={shimmerAnimation}
              transition={{...shimmerTransition, delay: 0.4}}
            />
            
            <div className="border-t border-black/5 pt-8">
              <motion.div 
                className="h-6 rounded-full mb-4 w-1/4"
                animate={shimmerAnimation}
                transition={{...shimmerTransition, delay: 0.6}}
              />
              <motion.div 
                className="h-4 rounded-full mb-2"
                animate={shimmerAnimation}
                transition={{...shimmerTransition, delay: 0.8}}
              />
              <motion.div 
                className="h-4 rounded-full mb-6 w-3/4"
                animate={shimmerAnimation}
                transition={{...shimmerTransition, delay: 1}}
              />
              
              <div className="grid grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-16 rounded-2xl"
                    animate={shimmerAnimation}
                    transition={{...shimmerTransition, delay: 1.2 + i * 0.1}}
                  />
                ))}
              </div>
            </div>
            
            {message && (
              <motion.p 
                className="text-center text-sm text-black/60 font-light mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {message}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default LoadingSkeleton