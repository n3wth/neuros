'use client'

import { motion } from 'framer-motion'

interface MemoryTracesProps {
  show?: boolean
  position?: {
    top?: string
    right?: string
    left?: string
    bottom?: string
  }
}

export default function MemoryTraces({ 
  show = true,
  position = { top: '12rem', right: '8rem' }
}: MemoryTracesProps) {
  if (!show) return null

  return (
    <motion.div 
      className="absolute hidden xl:block pointer-events-none"
      style={position}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: 1.5 }}
    >
      <div className="relative w-24 h-16">
        {/* Memory consolidation traces */}
        {[1, 2, 3].map((trace, index) => (
          <motion.div
            key={`trace-${trace}`}
            className="absolute"
            style={{
              left: index * 8,
              top: index * 4,
            }}
          >
            {/* Subtle memory dots */}
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)'
              }}
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 0.05, 0.3],
              }}
              transition={{
                duration: 4 + index * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 1.2
              }}
            />
          </motion.div>
        ))}

        {/* Thought emergence effect */}
        <motion.div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black/02"
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 0.08, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 3
          }}
        />

        {/* Subtle connecting path */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 96 64">
          <motion.path
            d="M 8 32 Q 32 20 56 32 T 88 28"
            stroke="rgba(0,0,0,0.02)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </svg>

        {/* Memory formation indicator */}
        <motion.div
          className="absolute bottom-1 left-6 text-[0.5rem] font-mono text-black/08 tracking-wider"
          animate={{
            opacity: [0, 0.12, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          ∞
        </motion.div>
      </div>
    </motion.div>
  )
}