'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BrainIcon, SparkleIcon } from '@/components/icons/line-icons'

interface EnhancedLoaderProps {
  isVisible?: boolean
  context?: 'dashboard' | 'review' | 'cards' | 'ai' | 'generic'
  onComplete?: () => void
  duration?: number
}

const contextualMessages = {
  dashboard: [
    "Brewing your perfect learning session...",
    "Your brain is getting ready to learn...",
    "Preparing your knowledge journey...",
    "Organizing your cards with care...",
    "Setting up your learning environment..."
  ],
  review: [
    "Preparing your review session...",
    "Optimizing spaced repetition magic...",
    "Loading your cards for review...",
    "Getting your brain warmed up...",
    "Ready, set, learn!"
  ],
  cards: [
    "Gathering your knowledge cards...",
    "Preparing cards with AI precision...",
    "Your learning materials are loading...",
    "Organizing your study session...",
    "Cards are shuffling into place..."
  ],
  ai: [
    "AI is thinking deeply...",
    "Generating intelligent insights...",
    "Your AI tutor is preparing...",
    "Processing with neural precision...",
    "Intelligence loading..."
  ],
  generic: [
    "Something wonderful is loading...",
    "Preparing your experience...",
    "Just a moment of magic...",
    "Getting things ready for you...",
    "Loading with love..."
  ]
}

export function EnhancedLoader({ 
  isVisible = true, 
  context = 'generic',
  onComplete,
  duration = 2000
}: EnhancedLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [showLoader, setShowLoader] = useState(isVisible)
  
  // Respect user's reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  useEffect(() => {
    // Set initial message
    const messages = contextualMessages[context]
    setCurrentMessage(messages[0])
    
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length)
    }, 1500)

    // Hide loader after duration
    const timer = setTimeout(() => {
      setShowLoader(false)
      onComplete?.()
    }, duration)

    return () => {
      clearInterval(messageInterval)
      clearTimeout(timer)
    }
  }, [context, duration, onComplete])

  useEffect(() => {
    const messages = contextualMessages[context]
    setCurrentMessage(messages[messageIndex])
  }, [context, messageIndex])

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Pattern */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <pattern id="dots-loader" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.02)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-loader)" />
            
            {/* Animated background shapes */}
            {!prefersReducedMotion && (
              <>
                <motion.circle
                  cx="200"
                  cy="300"
                  r="100"
                  fill="rgba(79, 70, 229, 0.02)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <motion.path
                  d="M 100 500 Q 400 450 700 600"
                  stroke="rgba(255, 107, 107, 0.04)"
                  strokeWidth="60"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </>
            )}
          </svg>

          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-8">
            {/* Brain Animation with Neurons */}
            <div className="relative mb-8">
              {/* Main Brain Icon */}
              <motion.div
                className="relative"
                animate={!prefersReducedMotion ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BrainIcon className="w-16 h-16 text-black/60 stroke-[1.5]" />
              </motion.div>

              {/* Neuron Connection Lines */}
              {!prefersReducedMotion && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
                      style={{
                        height: '20px',
                        left: '50%',
                        top: '50%',
                        transformOrigin: 'top',
                        transform: `rotate(${i * 60}deg) translateX(-50%)`,
                      }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ 
                        scaleY: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}

                  {/* Sparkling Neurons */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`neuron-${i}`}
                      className="absolute"
                      style={{
                        left: `${20 + i * 15}px`,
                        top: `${10 + i * 8}px`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <SparkleIcon className="w-3 h-3 text-purple-400/70" />
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Loading Message */}
            <motion.div
              className="text-center"
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h3 className="text-xl font-serif font-light mb-3 text-black/90">
                {currentMessage}
              </h3>
              <motion.div 
                className="flex justify-center space-x-1 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-black/30"
                    animate={!prefersReducedMotion ? {
                      scale: [1, 1.2, 1],
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
              
              {/* Progress Indicator */}
              <div className="w-32 h-1 bg-black/5 rounded-full overflow-hidden mx-auto">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    duration: duration / 1000,
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EnhancedLoader