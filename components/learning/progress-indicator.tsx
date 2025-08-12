'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon, SparkleIcon, RocketIcon } from '@/components/icons/line-icons'

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
        className="flex items-center gap-3 px-4 py-2 bg-black/5 rounded-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <div className="relative w-24 h-2 bg-black/10 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-mono text-black/60">
            {currentCards}/{targetCards}
          </span>
        </div>
        {isComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-light text-black/90">Your Learning Journey</h3>
          <p className="text-sm text-black/60 mt-1">
            {isComplete 
              ? "Amazing! You've unlocked all features!" 
              : nextMilestone 
                ? `${nextMilestone.cards - currentCards} more cards to ${nextMilestone.label}`
                : "Keep creating cards to build your knowledge base"
            }
          </p>
        </div>
        {nextMilestone && (
          <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-purple-600">
            {nextMilestone.icon}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-white/60 rounded-full overflow-hidden mb-6">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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

      {/* Milestones List */}
      <div className="grid grid-cols-3 gap-3">
        {milestones.map((milestone, index) => {
          const isPassed = currentCards >= milestone.cards
          const isCurrent = index === currentMilestone
          
          return (
            <motion.div
              key={index}
              className={`p-3 rounded-xl text-center transition-all duration-300 ${
                isPassed 
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200' 
                  : isCurrent
                    ? 'bg-white/80 border border-purple-200'
                    : 'bg-white/40 border border-transparent'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                isPassed ? 'text-purple-600' : 'text-black/40'
              }`}>
                {milestone.icon}
              </div>
              <p className={`text-xs font-light ${
                isPassed ? 'text-purple-700' : 'text-black/60'
              }`}>
                {milestone.label}
              </p>
              <p className={`text-xs font-mono mt-1 ${
                isPassed ? 'text-purple-600' : 'text-black/40'
              }`}>
                {milestone.cards} {milestone.cards === 1 ? 'card' : 'cards'}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Rewards Preview */}
      {currentCards < targetCards && (
        <motion.div 
          className="mt-4 p-3 bg-white/60 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-black/60 font-light">
            <span className="font-medium">Unlock at {targetCards} cards:</span> Analytics dashboard, 
            spaced repetition insights, and AI-powered learning recommendations
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}