'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SparkleIcon } from '@/components/icons/line-icons'

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [dots, setDots] = useState(0)

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev + 1) % 4)
    }, 300)

    // Hide loader after delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => {
      clearInterval(dotsInterval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAF9]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            {/* Animated sparkle */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SparkleIcon className="w-12 h-12 text-black/20 stroke-[1.5]" />
            </motion.div>
            
            {/* Loading text with animated dots */}
            <motion.p
              className="mt-6 text-sm font-light text-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Loading{'.'.repeat(dots)}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}