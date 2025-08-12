'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, SparkleIcon, RocketIcon, ArrowRight } from '@/components/icons/line-icons'

interface ProgressIndicatorProps {
  currentCards: number
  targetCards?: number
  variant?: 'minimal' | 'detailed'
}

export default function ProgressIndicator({ 
  currentCards, 
  targetCards = 3,
  variant = 'minimal' 
}: ProgressIndicatorProps) {
  const progress = Math.min((currentCards / targetCards) * 100, 100)
  const isComplete = currentCards >= targetCards

  const milestones = [
    { cards: 1, label: 'First Step', icon: <SparkleIcon className="w-4 h-4" /> },
    { cards: 3, label: 'Getting Started', icon: <CheckCircleIcon className="w-4 h-4" /> },
    { cards: 10, label: 'Building Momentum', icon: <RocketIcon className="w-4 h-4" /> }
  ]

  const currentMilestone = milestones.findIndex(m => currentCards < m.cards)
  const nextMilestone = currentMilestone === -1 ? null : milestones[currentMilestone]

  if (variant === 'minimal') {
    return (
      <motion.div 
        className="flex items-center gap-3 px-4 py-2 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-28 h-1.5 bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: isComplete 
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : 'linear-gradient(90deg, #000000, #404040)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <span className="text-xs font-mono text-black/50">
            {currentCards}/{targetCards}
          </span>
        </div>
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="relative bg-white rounded-3xl border border-black/5 p-8 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Subtle background accent */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-black to-gray-400 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-black/30" />
              <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
                Progress Tracker
              </p>
            </div>
            <h3 className="text-2xl font-serif font-light text-black mb-2">Your Learning Journey</h3>
            <p className="text-black/60 font-light">
              {isComplete 
                ? "Incredible! You've unlocked the full experience." 
                : nextMilestone 
                  ? `Create ${nextMilestone.cards - currentCards} more ${nextMilestone.cards - currentCards === 1 ? 'card' : 'cards'} to ${nextMilestone.label.toLowerCase()}`
                  : "Build your knowledge base, one card at a time"
              }
            </p>
          </div>
          {nextMilestone && (
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {nextMilestone.icon}
            </motion.div>
          )}
        </div>

        {/* Elegant Progress Bar */}
        <div className="relative h-2 bg-black/5 rounded-full overflow-hidden mb-8">
          <motion.div 
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: isComplete 
                ? 'linear-gradient(90deg, #10b981, #059669)'
                : 'linear-gradient(90deg, #000000, #404040)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        
        {/* Milestone Markers */}
        {milestones.map((milestone, index) => {
          const position = (milestone.cards / 10) * 100
          const isPassed = currentCards >= milestone.cards
          
          return (
            <motion.div
              key={index}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${position}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            >
              <div className={`w-6 h-6 rounded-full border-2 ${
                isPassed 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300' 
                  : 'bg-white border-purple-200'
              } flex items-center justify-center -translate-x-1/2`}>
                {isPassed && (
                  <CheckCircleIcon className="w-3 h-3 text-white" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

        {/* Refined Milestones */}
        <div className="grid grid-cols-3 gap-4">
          {milestones.map((milestone, index) => {
            const isPassed = currentCards >= milestone.cards
            const isCurrent = index === currentMilestone
            
            return (
              <motion.div
                key={index}
                className={`relative p-6 rounded-2xl text-center transition-all duration-500 ${
                  isPassed 
                    ? 'bg-black text-white' 
                    : isCurrent
                      ? 'bg-white border-2 border-black/20'
                      : 'bg-white border border-black/5'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    isPassed ? 'bg-white/10' : 'bg-black/5'
                  }`}
                  animate={isPassed ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className={isPassed ? 'text-white' : 'text-black/60'}>
                    {milestone.icon}
                  </div>
                </motion.div>
                <p className={`text-sm font-light mb-1 ${
                  isPassed ? 'text-white' : 'text-black/80'
                }`}>
                  {milestone.label}
                </p>
                <p className={`text-xs font-mono ${
                  isPassed ? 'text-white/60' : 'text-black/40'
                }`}>
                  {milestone.cards} {milestone.cards === 1 ? 'card' : 'cards'}
                </p>
                {isPassed && (
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircleIcon className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Elegant Rewards Preview */}
        <AnimatePresence>
          {currentCards < targetCards && (
            <motion.div 
              className="mt-8 p-6 bg-black/[0.02] rounded-2xl border border-black/5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-black/80 mb-1">
                    Unlock at {targetCards} cards
                  </p>
                  <p className="text-xs text-black/60 font-light">
                    Analytics dashboard • Spaced repetition insights • AI recommendations
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 text-black/30" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}