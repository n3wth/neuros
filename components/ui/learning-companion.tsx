'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { SparkleIcon, LightbulbIcon, HeartIcon } from '@/components/icons/line-icons'

const tips = [
  { icon: LightbulbIcon, text: "Did you know? Your brain remembers better when you study in short bursts!" },
  { icon: SparkleIcon, text: "Tip: Review your cards just before sleeping for better retention" },
  { icon: HeartIcon, text: "Take a break! A rested mind learns faster" },
  { icon: LightbulbIcon, text: "Fun fact: Teaching others helps you learn 90% better!" },
  { icon: SparkleIcon, text: "Try the Feynman technique: Explain concepts in simple terms" },
]

export default function LearningCompanion() {
  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)
  const [position, setPosition] = useState({ x: 20, y: 20 })

  useEffect(() => {
    // Show tip occasionally
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        setCurrentTip(prev => (prev + 1) % tips.length)
        setPosition({
          x: 20 + Math.random() * 40,
          y: 20 + Math.random() * 40
        })
        setShowTip(true)
        
        // Hide after 5 seconds
        setTimeout(() => setShowTip(false), 5000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const tip = tips[currentTip]
  const Icon = tip.icon

  return (
    <AnimatePresence>
      {showTip && (
        <motion.div
          className="fixed z-40 pointer-events-none"
          style={{ 
            bottom: `${position.y}px`, 
            right: `${position.x}px` 
          }}
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 10 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="bg-white rounded-3xl shadow-lg border border-black/5 p-4 max-w-xs">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Icon className="w-6 h-6 text-black/60 stroke-[1.5] flex-shrink-0" />
              </motion.div>
              <p className="text-sm text-black/70 font-light leading-relaxed">
                {tip.text}
              </p>
            </div>
            
            {/* Cute tail */}
            <svg 
              className="absolute -bottom-2 right-8 w-4 h-4 text-white"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M 0 0 L 8 8 L 16 0 Z" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}