'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { 
  LightbulbIcon,
  VolumeIcon,
  TrendingIcon,
  TrophyIcon,
  ChevronRightIcon
} from '@/components/icons/line-icons'
import { Card } from '@/components/ui/card'
import confetti from 'canvas-confetti'

const DEMO_CARDS = [
  {
    id: '1',
    cards: {
      id: '1',
      front: 'What is the difference between stress and anxiety?',
      back: 'Stress is a response to external pressures and typically subsides when the stressor is removed, while anxiety is worry about future threats and can persist without clear external triggers.',
      explanation: 'Think of stress as your body\'s reaction to a specific situation (like a deadline), while anxiety is more about anticipating problems that may or may not happen. Stress tends to have a clear cause and endpoint, but anxiety can be more persistent and general.',
      difficulty: 'medium',
      topics: {
        name: 'Wellness',
        color: '#10B981'
      }
    },
    ease_factor: 2.5,
    interval_days: 1,
    repetitions: 0,
    mastery_level: 45
  },
  {
    id: '2',
    cards: {
      id: '2',
      front: 'What are the key principles of spaced repetition?',
      back: 'The key principles are: 1) Review information at increasing intervals, 2) Test yourself actively rather than passively reviewing, 3) Adjust intervals based on difficulty, 4) Focus on material just before you forget it.',
      explanation: 'Spaced repetition leverages the psychological spacing effect. By reviewing information just as you\'re about to forget it, you strengthen the memory trace more effectively than massed practice (cramming).',
      difficulty: 'hard',
      topics: {
        name: 'Learning Science',
        color: '#8B5CF6'
      }
    },
    ease_factor: 2.3,
    interval_days: 3,
    repetitions: 2,
    mastery_level: 68
  },
  {
    id: '3',
    cards: {
      id: '3',
      front: 'What is the Feynman Technique?',
      back: 'A learning method where you: 1) Choose a concept, 2) Explain it in simple terms as if teaching a child, 3) Identify gaps in your explanation, 4) Review and simplify further.',
      explanation: 'Named after physicist Richard Feynman, this technique forces you to break down complex ideas into simple components. If you can\'t explain something simply, you don\'t understand it well enough.',
      difficulty: 'medium',
      topics: {
        name: 'Study Methods',
        color: '#3B82F6'
      }
    },
    ease_factor: 2.6,
    interval_days: 2,
    repetitions: 1,
    mastery_level: 52
  }
]

export default function SophisticatedImmersiveReview() {
  const [cards] = useState(DEMO_CARDS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [stats, setStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
    avgTime: 0,
    totalTime: 0
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-200, 200], [5, -5])
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5])

  const currentCard = cards[currentIndex]

  // Subtle celebration
  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#3B82F6', '#10B981'],
      gravity: 0.8,
      ticks: 200,
      scalar: 0.8
    })
  }, [])

  // Handle mouse movement for subtle 3D effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setStartTime(Date.now())
  }, [])

  const handleRate = useCallback((rating: number) => {
    const responseTime = Date.now() - startTime
    const isCorrect = rating >= 3

    // Update stats
    setStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      totalTime: prev.totalTime + responseTime,
      avgTime: Math.round((prev.totalTime + responseTime) / (prev.reviewed + 1))
    }))

    // Update streak
    if (isCorrect) {
      setStreak(prev => prev + 1)
      if (streak >= 4 && streak % 5 === 4) {
        triggerCelebration()
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    } else {
      setStreak(0)
    }

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
      setShowExplanation(false)
    } else {
      // Loop back to start for demo
      setCurrentIndex(0)
      setShowAnswer(false)
      setShowExplanation(false)
      triggerCelebration()
    }
  }, [startTime, cards.length, currentIndex, streak, triggerCelebration])

  const toggleExplanation = useCallback(() => {
    setShowExplanation(!showExplanation)
  }, [showExplanation])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentCard) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (!showAnswer) {
            handleShowAnswer()
          }
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          if (showAnswer) handleRate(parseInt(e.key))
          break
        case '0':
          if (showAnswer) handleRate(0)
          break
        case 'e':
          if (showAnswer) toggleExplanation()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentCard, showAnswer, handleShowAnswer, handleRate, toggleExplanation])

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-[#0F0F0F] to-[#1A1A1A] opacity-90" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #8B5CF610 0%, transparent 40%)',
              'radial-gradient(circle at 80% 20%, #3B82F610 0%, transparent 40%)',
              'radial-gradient(circle at 20% 80%, #8B5CF610 0%, transparent 40%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        {/* Minimal top navigation */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-8">
            <h1 className="text-white/90 font-serif text-2xl font-light">Neuros</h1>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm font-light">Session</span>
              <span className="text-white/60 text-sm font-mono">{currentIndex + 1} / {cards.length}</span>
            </div>
          </div>
          
          {/* Minimal stats */}
          <div className="flex items-center gap-6">
            {streak > 0 && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <TrendingIcon className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-white/60 font-mono text-sm">{streak}</span>
              </motion.div>
            )}
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-emerald-500/80">{stats.correct}</span>
              <span className="text-white/20">·</span>
              <span className="text-amber-500/80">{stats.incorrect}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/40">{Math.round(currentCard?.mastery_level || 0)}%</span>
            </div>
          </div>
        </motion.div>

        {/* Progress line */}
        <motion.div 
          className="h-px bg-white/10 mb-16 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
            >
              <div className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-white/80 text-sm font-light">Excellent streak</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            ref={cardRef}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Card className="relative p-12 bg-[#1A1A1A]/50 backdrop-blur-sm border border-white/5 rounded-2xl shadow-2xl min-h-[500px]">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />
              
              {/* Topic indicator */}
              {currentCard?.cards.topics && (
                <motion.div 
                  className="relative z-10 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span 
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-light"
                    style={{ color: currentCard.cards.topics.color }}
                  >
                    {currentCard.cards.topics.name}
                  </span>
                </motion.div>
              )}

              {/* Question */}
              <motion.div 
                className="relative z-10 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-sm uppercase tracking-wider text-white/40 font-light mb-6">Question</h2>
                <p className="text-3xl font-serif text-white/90 leading-relaxed">{currentCard?.cards.front}</p>
              </motion.div>

              {/* Answer */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10"
                  >
                    <div className="border-t border-white/5 pt-10">
                      <h3 className="text-sm uppercase tracking-wider text-emerald-500/60 font-light mb-6">Answer</h3>
                      <p className="text-xl font-light text-white/80 leading-relaxed mb-8">{currentCard?.cards.back}</p>

                      {/* Explanation */}
                      {currentCard?.cards.explanation && showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 p-6 bg-white/[0.02] rounded-xl border border-white/5"
                        >
                          <div className="flex items-center mb-3">
                            <LightbulbIcon className="w-4 h-4 text-[#8B5CF6]/60 mr-2" />
                            <span className="text-xs uppercase tracking-wider text-[#8B5CF6]/60 font-light">Insight</span>
                          </div>
                          <p className="text-sm text-white/60 font-light leading-relaxed">
                            {currentCard.cards.explanation}
                          </p>
                        </motion.div>
                      )}

                      {/* Sophisticated Rating Buttons */}
                      <div className="mt-10">
                        <p className="text-xs uppercase tracking-wider text-white/40 font-light mb-6">How difficult was this?</p>
                        <div className="flex gap-2">
                          {[
                            { rating: 0, label: 'Forgot', color: 'bg-red-500/80 hover:bg-red-500' },
                            { rating: 1, label: 'Hard', color: 'bg-orange-500/80 hover:bg-orange-500' },
                            { rating: 2, label: 'Medium', color: 'bg-amber-500/80 hover:bg-amber-500' },
                            { rating: 3, label: 'Good', color: 'bg-blue-500/80 hover:bg-blue-500' },
                            { rating: 4, label: 'Easy', color: 'bg-emerald-500/80 hover:bg-emerald-500' },
                            { rating: 5, label: 'Perfect', color: 'bg-[#8B5CF6]/80 hover:bg-[#8B5CF6]' },
                          ].map(({ rating, label, color }) => (
                            <motion.button
                              key={rating}
                              onClick={() => handleRate(rating)}
                              className={`flex-1 py-4 ${color} text-white rounded-lg transition-all text-sm font-light`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show Answer Button */}
              {!showAnswer && (
                <motion.div 
                  className="relative z-10 flex justify-center mt-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleShowAnswer}
                    className="group px-8 py-4 bg-white text-black rounded-full font-light transition-all flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Show Answer
                    <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </motion.div>
              )}

              {/* Action Buttons */}
              {showAnswer && (
                <motion.div 
                  className="relative z-10 flex items-center justify-between mt-8 pt-8 border-t border-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <button
                    onClick={toggleExplanation}
                    className="text-white/40 hover:text-white/60 transition-colors text-sm font-light flex items-center gap-2"
                  >
                    <LightbulbIcon className="w-4 h-4" />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </button>
                  <button
                    className="text-white/40 hover:text-white/60 transition-colors text-sm font-light flex items-center gap-2"
                  >
                    <VolumeIcon className="w-4 h-4" />
                    Read Aloud
                  </button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Keyboard shortcuts - minimal */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-6 text-xs text-white/30 font-light">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 font-mono">Space</kbd>
              <span>Show Answer</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 font-mono">0-5</kbd>
              <span>Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 font-mono">E</kbd>
              <span>Explanation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}