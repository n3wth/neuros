'use client'

import { motion } from 'framer-motion'

interface AnimatedFluffyDogProps {
  show?: boolean
  position?: {
    top?: string
    right?: string
    left?: string
    bottom?: string
  }
}

export default function AnimatedFluffyDog({ 
  show = true,
  position = { top: '5rem', right: '5rem' }
}: AnimatedFluffyDogProps) {
  if (!show) return null

  return (
    <motion.div 
      className="absolute hidden xl:block z-20"
      style={position}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Magical Lighting Aura - inspired by Pink Triangle installations */}
        <motion.div
          className="absolute -inset-8 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255,20,147,0.1) 0%, rgba(138,43,226,0.05) 30%, rgba(255,165,0,0.03) 60%, transparent 80%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            background: [
              'radial-gradient(circle, rgba(255,20,147,0.1) 0%, rgba(138,43,226,0.05) 30%, rgba(255,165,0,0.03) 60%, transparent 80%)',
              'radial-gradient(circle, rgba(138,43,226,0.1) 0%, rgba(255,165,0,0.05) 30%, rgba(255,20,147,0.03) 60%, transparent 80%)',
              'radial-gradient(circle, rgba(255,165,0,0.1) 0%, rgba(255,20,147,0.05) 30%, rgba(138,43,226,0.03) 60%, transparent 80%)',
              'radial-gradient(circle, rgba(255,20,147,0.1) 0%, rgba(138,43,226,0.05) 30%, rgba(255,165,0,0.03) 60%, transparent 80%)'
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Smaller inner aura */}
        <motion.div
          className="absolute -inset-4 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,182,193,0.2) 0%, rgba(173,216,230,0.1) 50%, transparent 70%)',
            filter: 'blur(10px)',
          }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dog body */}
        <div className="relative z-10">
          {/* Main body */}
          <div className="w-24 h-20 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full relative overflow-hidden border-2 border-amber-200/50 shadow-lg">
            {/* Fluffy texture spots with subtle pride shimmer */}
            <motion.div 
              className="absolute top-2 left-3 w-3 h-3 rounded-full opacity-80"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,182,193,0.4) 50%, rgba(255,255,255,0.6) 100%)'
              }}
              animate={{
                background: [
                  'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,182,193,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                  'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(173,216,230,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                  'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(221,160,221,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                  'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,182,193,0.4) 50%, rgba(255,255,255,0.6) 100%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-6 right-4 w-2 h-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(144,238,144,0.3) 100%)'
              }}
              animate={{
                background: [
                  'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(144,238,144,0.3) 100%)',
                  'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,215,0,0.3) 100%)',
                  'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,165,0,0.3) 100%)',
                  'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(144,238,144,0.3) 100%)'
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute bottom-3 left-6 w-4 h-3 rounded-full"
              style={{
                background: 'linear-gradient(45deg, rgba(255,165,0,0.3) 0%, rgba(255,20,147,0.2) 100%)'
              }}
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(255,165,0,0.3) 0%, rgba(255,20,147,0.2) 100%)',
                  'linear-gradient(45deg, rgba(255,20,147,0.3) 0%, rgba(138,43,226,0.2) 100%)',
                  'linear-gradient(45deg, rgba(138,43,226,0.3) 0%, rgba(255,165,0,0.2) 100%)',
                  'linear-gradient(45deg, rgba(255,165,0,0.3) 0%, rgba(255,20,147,0.2) 100%)'
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>
          
          {/* Head */}
          <div className="absolute -top-8 left-6 w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full border-2 border-amber-200/50 shadow-lg">
            {/* Eyes */}
            <div className="absolute top-5 left-3 w-2 h-2 bg-black rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </div>
            <div className="absolute top-5 right-3 w-2 h-2 bg-black rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </div>
            
            {/* Nose */}
            <div className="absolute top-8 left-6 w-2 h-1.5 bg-pink-400 rounded-full" />
            
            {/* Mouth */}
            <div className="absolute top-9 left-5 w-4 h-1 border-b-2 border-gray-600 rounded-full" />
            
            {/* Ears */}
            <motion.div 
              className="absolute -top-2 left-1 w-6 h-8 bg-gradient-to-b from-orange-200 to-amber-200 rounded-full border border-amber-300/50 origin-bottom"
              animate={{ rotate: [0, -10, 0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="absolute -top-2 right-1 w-6 h-8 bg-gradient-to-b from-orange-200 to-amber-200 rounded-full border border-amber-300/50 origin-bottom"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
            />
          </div>
          
          {/* Tail */}
          <motion.div 
            className="absolute -right-2 top-6 w-12 h-3 bg-gradient-to-r from-amber-200 to-orange-300 rounded-full border border-amber-300/50 origin-left"
            animate={{ 
              rotate: [0, 20, -5, 15, 0],
              scaleY: [1, 1.2, 1, 1.1, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Legs */}
          <div className="absolute -bottom-4 left-3 w-3 h-6 bg-gradient-to-b from-amber-200 to-orange-300 rounded-full border border-amber-300/50" />
          <div className="absolute -bottom-4 left-8 w-3 h-6 bg-gradient-to-b from-amber-200 to-orange-300 rounded-full border border-amber-300/50" />
          <div className="absolute -bottom-4 right-6 w-3 h-6 bg-gradient-to-b from-amber-200 to-orange-300 rounded-full border border-amber-300/50" />
          <div className="absolute -bottom-4 right-2 w-3 h-6 bg-gradient-to-b from-amber-200 to-orange-300 rounded-full border border-amber-300/50" />
        </div>
        
        {/* Floating hearts when dog is happy */}
        <motion.div
          className="absolute -top-12 left-12"
          animate={{
            y: [0, -20, -40],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 2,
            ease: "easeOut"
          }}
        >
          <div className="text-pink-400 text-lg">❤️</div>
        </motion.div>
        
        <motion.div
          className="absolute -top-8 right-2"
          animate={{
            y: [0, -15, -30],
            opacity: [0, 1, 0],
            scale: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 3.5,
            ease: "easeOut"
          }}
        >
          <div className="text-pink-400 text-sm">💕</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}