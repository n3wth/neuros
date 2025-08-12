'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { 
  LightbulbIcon,
  RefreshIcon,
  CheckCircleIcon,
  CloseIcon,
  VolumeIcon,
  KeyboardIcon,
  EyeIcon,
  SparkleIcon,
  TrendingIcon,
  TrophyIcon,
  ChartIcon,
  BrainIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import { submitReview } from '@/server/actions/reviews'
import { getDueCards } from '@/server/actions/cards'
import { generateExplanation } from '@/server/actions/ai'
import confetti from 'canvas-confetti'

interface ReviewCard {
  id: string
  cards: {
    id: string
    front: string
    back: string
    explanation?: string
    difficulty: string
    topics?: {
      name: string
      color: string
    }
  }
  ease_factor: number
  interval_days: number
  repetitions: number
  mastery_level: number
}

export default function ImmersiveReviewInterface({ sessionId }: { sessionId: string }) {
  const [cards, setCards] = useState<ReviewCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [aiExplanation, setAiExplanation] = useState<string>('')
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
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
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10])
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10])

  const currentCard = cards[currentIndex]

  // Particle effect for celebrations
  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    })
  }, [])

  // Handle mouse movement for 3D card effect
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

  // Load cards
  const loadCards = useCallback(async () => {
    setIsLoading(true)
    try {
      const dueCards = await getDueCards(20)
      setCards(dueCards as ReviewCard[])
    } catch (error) {
      console.error('Failed to load cards:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setStartTime(Date.now())
  }, [])

  const handleRate = useCallback(async (rating: number) => {
    if (!currentCard) return

    const responseTime = Date.now() - startTime
    const isCorrect = rating >= 3

    try {
      await submitReview(
        currentCard.cards.id,
        rating,
        responseTime,
        sessionId
      )

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
        setAiExplanation('')
      } else {
        // Session complete
        triggerCelebration()
        await loadCards()
        setCurrentIndex(0)
        setShowAnswer(false)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }, [currentCard, startTime, sessionId, cards.length, currentIndex, loadCards, streak, triggerCelebration])

  const toggleExplanation = useCallback(() => {
    setShowExplanation(!showExplanation)
  }, [showExplanation])

  const getAIHelp = useCallback(async () => {
    if (!currentCard || aiExplanation) return

    try {
      const result = await generateExplanation(
        `${currentCard.cards.front} - ${currentCard.cards.back}`,
        'simple'
      )
      setAiExplanation(result.explanation || '')
    } catch (error) {
      console.error('Failed to get AI explanation:', error)
    }
  }, [currentCard, aiExplanation])

  // Load initial cards
  useEffect(() => {
    loadCards()
  }, [loadCards])

  // Enhanced keyboard shortcuts
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
        case 'h':
          if (showAnswer && !aiExplanation) getAIHelp()
          break
        case 'f':
          setFocusMode(!focusMode)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentCard, showAnswer, aiExplanation, handleShowAnswer, handleRate, toggleExplanation, getAIHelp, focusMode])

  if (isLoading) {
    return <LoadingSkeleton type="review" message="Preparing your immersive learning experience..." showIcon={true} />
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircleIcon className="w-20 h-20 mx-auto mb-8 text-green-400" />
          </motion.div>
          <h3 className="text-4xl font-serif font-light mb-4 text-white">Perfect Session!</h3>
          <p className="text-xl text-white/60 font-light mb-10">You&apos;ve mastered all cards for now.</p>
          <Button 
            onClick={loadCards}
            className="bg-white text-black hover:bg-white/90 rounded-full px-10 py-4 text-lg transition-all"
          >
            <RefreshIcon className="w-6 h-6 mr-3" />
            Check for More
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${focusMode ? 'bg-black' : 'bg-[#0A0A0A]'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <motion.div
          className="absolute -inset-[10px] opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #7C3AED 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #3B82F6 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #7C3AED 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i]}20 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-8">
        {/* Top Bar with Stats and Streak */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Progress Ring */}
          <div className="flex items-center gap-6">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentIndex / cards.length) * 176} 176`}
                  initial={{ strokeDasharray: "0 176" }}
                  animate={{ strokeDasharray: `${((currentIndex + 1) / cards.length) * 176} 176` }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-mono text-sm">{Math.round(((currentIndex + 1) / cards.length) * 100)}%</span>
              </div>
            </div>
            
            {/* Streak Counter */}
            {streak > 0 && (
              <motion.div
                className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <TrendingIcon className="w-6 h-6 text-orange-400" />
                <span className="text-white font-mono text-lg">{streak} streak</span>
              </motion.div>
            )}
          </div>

          {/* Live Stats */}
          <div className="flex items-center gap-4">
            <motion.div
              className="px-6 py-3 bg-green-500/20 backdrop-blur-xl rounded-full border border-green-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono">{stats.correct}</span>
              </div>
            </motion.div>
            <motion.div
              className="px-6 py-3 bg-orange-500/20 backdrop-blur-xl rounded-full border border-orange-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <BrainIcon className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-mono">{stats.incorrect}</span>
              </div>
            </motion.div>
            <motion.div
              className="px-6 py-3 bg-purple-500/20 backdrop-blur-xl rounded-full border border-purple-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <ChartIcon className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-mono">{Math.round(currentCard?.mastery_level || 0)}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Celebration Message */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <div className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <div className="flex items-center gap-3">
                  <TrophyIcon className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">Amazing streak! Keep going!</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            ref={cardRef}
            className="relative"
            initial={{ opacity: 0, scale: 0.9, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 180 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            style={{
              rotateX: focusMode ? 0 : rotateX,
              rotateY: focusMode ? 0 : rotateY,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={focusMode ? undefined : handleMouseMove}
            onMouseLeave={focusMode ? undefined : handleMouseLeave}
          >
            <Card className="relative p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl min-h-[600px] overflow-hidden">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
              
              {/* Topic Badge with Animation */}
              {currentCard?.cards.topics && (
                <motion.div 
                  className="relative z-10 mb-10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span 
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full backdrop-blur-xl border"
                    style={{ 
                      backgroundColor: `${currentCard.cards.topics.color}20`,
                      color: currentCard.cards.topics.color,
                      borderColor: `${currentCard.cards.topics.color}40`
                    }}
                  >
                    <SparkleIcon className="w-4 h-4" />
                    {currentCard.cards.topics.name}
                  </span>
                </motion.div>
              )}

              {/* Question Section */}
              <motion.div 
                className="relative z-10 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-serif font-light mb-6 text-white/90">Question</h2>
                <p className="text-2xl text-white/80 font-light leading-relaxed">{currentCard?.cards.front}</p>
              </motion.div>

              {/* Answer Section with Flip Animation */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, rotateX: -90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="relative z-10"
                  >
                    <div className="border-t border-white/10 pt-10">
                      <h3 className="text-3xl font-serif font-light mb-6 text-green-400">Answer</h3>
                      <p className="text-2xl text-white/80 font-light leading-relaxed mb-8">{currentCard?.cards.back}</p>

                      {/* AI Explanation with Glassmorphism */}
                      {(currentCard?.cards.explanation || aiExplanation) && showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 p-8 bg-blue-500/10 backdrop-blur-xl rounded-3xl border border-blue-500/20"
                        >
                          <div className="flex items-center mb-4">
                            <LightbulbIcon className="w-6 h-6 text-blue-400 mr-3" />
                            <span className="font-serif font-light text-xl text-blue-400">Deep Dive</span>
                          </div>
                          <p className="text-lg text-blue-300/90 font-light leading-relaxed">
                            {aiExplanation || currentCard?.cards.explanation}
                          </p>
                        </motion.div>
                      )}

                      {/* Enhanced Rating Buttons */}
                      <div className="mt-10">
                        <p className="text-lg text-white/70 font-light mb-6">How did you do?</p>
                        <div className="grid grid-cols-6 gap-4">
                          {[
                            { rating: 0, label: 'Forgot', color: 'from-red-500 to-red-600', icon: CloseIcon },
                            { rating: 1, label: 'Hard', color: 'from-orange-500 to-orange-600' },
                            { rating: 2, label: 'Tough', color: 'from-yellow-500 to-yellow-600' },
                            { rating: 3, label: 'Good', color: 'from-blue-500 to-blue-600' },
                            { rating: 4, label: 'Easy', color: 'from-green-500 to-green-600' },
                            { rating: 5, label: 'Perfect', color: 'from-emerald-500 to-emerald-600', icon: CheckCircleIcon },
                          ].map(({ rating, label, color, icon: Icon }) => (
                            <motion.button
                              key={rating}
                              onClick={() => handleRate(rating)}
                              className={`relative p-6 bg-gradient-to-br ${color} rounded-2xl text-white transition-all overflow-hidden group`}
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                              <div className="relative text-center">
                                {Icon && <Icon className="w-6 h-6 mx-auto mb-2" />}
                                {!Icon && <span className="text-2xl font-bold block mb-2">{rating}</span>}
                                <span className="text-xs font-medium">{label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show Answer Button with Pulse Animation */}
              {!showAnswer && (
                <motion.div 
                  className="relative z-10 flex justify-center mt-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleShowAnswer}
                    className="relative px-12 py-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xl font-medium transition-all overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                      style={{ opacity: 0.2 }}
                    />
                    <span className="relative flex items-center gap-3">
                      Reveal Answer
                      <EyeIcon className="w-6 h-6" />
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* Action Buttons */}
              {showAnswer && (
                <motion.div 
                  className="relative z-10 flex items-center justify-between mt-10 pt-10 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="flex gap-4">
                    <motion.button
                      onClick={toggleExplanation}
                      className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 rounded-full transition-all hover:bg-white/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LightbulbIcon className="w-5 h-5 inline mr-2" />
                      {showExplanation ? 'Hide' : 'Show'} Explanation
                    </motion.button>
                    {!aiExplanation && (
                      <motion.button
                        onClick={getAIHelp}
                        className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 rounded-full transition-all hover:bg-white/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <BrainIcon className="w-5 h-5 inline mr-2" />
                        AI Help
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 rounded-full transition-all hover:bg-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <VolumeIcon className="w-5 h-5 inline mr-2" />
                    Read Aloud
                  </motion.button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Keyboard Shortcuts */}
        <motion.div 
          className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <KeyboardIcon className="w-5 h-5 text-white/60 mr-3" />
            <span className="text-lg font-serif font-light text-white/80">Quick Commands</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20 font-mono text-xs text-white/80">Space</kbd>
              <span className="text-white/60 font-light">Show Answer</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20 font-mono text-xs text-white/80">0-5</kbd>
              <span className="text-white/60 font-light">Rate Card</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-2 bg-white/10 backdrop-blur rounded-lg border border-white/20 font-mono text-xs text-white/80">F</kbd>
              <span className="text-white/60 font-light">Focus Mode</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}