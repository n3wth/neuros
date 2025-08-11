'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BrainIcon,
  RefreshIcon,
  CheckCircleIcon,
  CloseIcon,
  LightbulbIcon,
  VolumeIcon,
  KeyboardIcon,
  EyeIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import { submitReview } from '@/server/actions/reviews'
import { getDueCards } from '@/server/actions/cards'
import { generateExplanation } from '@/server/actions/ai'

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

export default function ReviewInterface({ sessionId }: { sessionId: string }) {
  const [cards, setCards] = useState<ReviewCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [aiExplanation, setAiExplanation] = useState<string>('')
  const [stats, setStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0
  })

  const currentCard = cards[currentIndex]

  // Define loadCards first so it can be used in callbacks
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

  // Define callbacks before they're used
  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setStartTime(Date.now())
  }, [])

  const handleRate = useCallback(async (rating: number) => {
    if (!currentCard) return

    const responseTime = Date.now() - startTime

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
        correct: rating >= 3 ? prev.correct + 1 : prev.correct,
        incorrect: rating < 3 ? prev.incorrect + 1 : prev.incorrect
      }))

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setShowAnswer(false)
        setShowExplanation(false)
        setAiExplanation('')
      } else {
        // No more cards
        await loadCards()
        setCurrentIndex(0)
        setShowAnswer(false)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }, [currentCard, startTime, sessionId, cards.length, currentIndex, loadCards])

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

  // Load due cards
  useEffect(() => {
    loadCards()
  }, [loadCards])

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
          if (showAnswer) handleRate(1)
          break
        case '2':
          if (showAnswer) handleRate(2)
          break
        case '3':
          if (showAnswer) handleRate(3)
          break
        case '4':
          if (showAnswer) handleRate(4)
          break
        case '5':
          if (showAnswer) handleRate(5)
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
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentCard, showAnswer, aiExplanation, startTime, handleShowAnswer, handleRate, toggleExplanation, getAIHelp])

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 0: return 'bg-red-500 hover:bg-red-600'
      case 1: return 'bg-orange-500 hover:bg-orange-600'
      case 2: return 'bg-yellow-500 hover:bg-yellow-600'
      case 3: return 'bg-blue-500 hover:bg-blue-600'
      case 4: return 'bg-green-500 hover:bg-green-600'
      case 5: return 'bg-emerald-500 hover:bg-emerald-600'
      default: return 'bg-black/60 hover:bg-black/70'
    }
  }

  if (isLoading) {
    return <LoadingSkeleton type="review" message="Preparing your learning session..." showIcon={true} />
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] flex items-center justify-center">
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
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-6 text-green-600" />
          </motion.div>
          <h3 className="text-3xl font-serif font-light mb-3">All caught up!</h3>
          <p className="text-lg text-black/60 font-light mb-8">No cards due for review right now.</p>
          <Button 
            onClick={loadCards}
            className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 transition-colors"
          >
            <RefreshIcon className="w-5 h-5 mr-2" />
            Check Again
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] relative overflow-hidden">
      {/* Background Pattern */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="dots-review" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.02)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-review)" />
        
        {/* Organic shapes */}
        <motion.path
          d="M 100 100 Q 400 50 600 200 T 900 300"
          stroke="rgba(255, 107, 107, 0.03)"
          strokeWidth="120"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="150"
          cy="700"
          r="180"
          fill="rgba(79, 70, 229, 0.015)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between text-sm text-black/60 font-light mb-3">
            <span>Progress: {currentIndex + 1} of {cards.length}</span>
            <span>Mastery: {Math.round(currentCard?.mastery_level || 0)}%</span>
          </div>
          <div className="h-1 bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6 bg-white border border-black/5 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60 font-light">Reviewed</span>
              <span className="text-2xl font-serif font-light">{stats.reviewed}</span>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-black/5 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60 font-light">Correct</span>
              <span className="text-2xl font-serif font-light text-green-600">{stats.correct}</span>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-black/5 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60 font-light">Learning</span>
              <span className="text-2xl font-serif font-light text-orange-600">{stats.incorrect}</span>
            </div>
          </Card>
        </motion.div>

        {/* Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="p-10 bg-white border border-black/5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[500px]">
              {/* Topic Badge */}
              {currentCard?.cards.topics && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span 
                    className="inline-block px-4 py-2 text-sm font-light rounded-full border"
                    style={{ 
                      backgroundColor: `${currentCard.cards.topics.color}08`,
                      color: currentCard.cards.topics.color,
                      borderColor: `${currentCard.cards.topics.color}20`
                    }}
                  >
                    {currentCard.cards.topics.name}
                  </span>
                </motion.div>
              )}

              {/* Question */}
              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-serif font-light mb-4 text-black/90">Question</h2>
                <p className="text-xl text-black/80 font-light leading-relaxed">{currentCard?.cards.front}</p>
              </motion.div>

              {/* Answer */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="border-t border-black/5 pt-8">
                      <h3 className="text-2xl font-serif font-light mb-4 text-green-600">Answer</h3>
                      <p className="text-xl text-black/80 font-light leading-relaxed mb-6">{currentCard?.cards.back}</p>

                      {/* Explanation */}
                      {(currentCard?.cards.explanation || aiExplanation) && showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100"
                        >
                          <div className="flex items-center mb-3">
                            <LightbulbIcon className="w-6 h-6 text-blue-600 mr-3" />
                            <span className="font-serif font-light text-lg text-blue-900">Explanation</span>
                          </div>
                          <p className="text-base text-blue-800 font-light leading-relaxed">
                            {aiExplanation || currentCard?.cards.explanation}
                          </p>
                        </motion.div>
                      )}

                      {/* Rating Buttons */}
                      <div className="mt-8">
                        <p className="text-base text-black/70 font-light mb-4">How difficult was this?</p>
                        <div className="grid grid-cols-6 gap-3">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleRate(0)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl p-4 h-auto transition-colors"
                            >
                              <div className="text-center">
                                <CloseIcon className="w-5 h-5 mx-auto mb-2" />
                                <span className="text-xs font-light">Forgot</span>
                                <span className="text-xs opacity-75 block font-mono">(0)</span>
                              </div>
                            </Button>
                          </motion.div>
                          {[1, 2, 3, 4, 5].map(rating => (
                            <motion.div key={rating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={() => handleRate(rating)}
                                className={`${getRatingColor(rating)} text-white rounded-2xl p-4 h-auto transition-colors`}
                              >
                                <div className="text-center">
                                  <span className="text-xl font-light">{rating}</span>
                                  <span className="text-xs font-light block mt-1">
                                    {rating === 1 && 'Hard'}
                                    {rating === 2 && 'Tough'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Easy'}
                                    {rating === 5 && 'Perfect'}
                                  </span>
                                </div>
                              </Button>
                            </motion.div>
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
                  className="flex justify-center mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleShowAnswer}
                      className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-4 text-lg transition-colors"
                    >
                      Show Answer
                      <EyeIcon className="w-6 h-6 ml-3" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Action Buttons */}
              {showAnswer && (
                <motion.div 
                  className="flex items-center justify-between mt-8 pt-8 border-t border-black/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={toggleExplanation}
                        className="text-black/60 border-black/20 hover:bg-black/5 rounded-full px-4 py-2 transition-colors"
                      >
                        <LightbulbIcon className="w-4 h-4 mr-2" />
                        {showExplanation ? 'Hide' : 'Show'} Explanation
                      </Button>
                    </motion.div>
                    {!aiExplanation && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          onClick={getAIHelp}
                          className="text-black/60 border-black/20 hover:bg-black/5 rounded-full px-4 py-2 transition-colors"
                        >
                          <BrainIcon className="w-4 h-4 mr-2" />
                          AI Help
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="text-black/60 border-black/20 hover:bg-black/5 rounded-full px-4 py-2 transition-colors"
                    >
                      <VolumeIcon className="w-4 h-4 mr-2" />
                      Read Aloud
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Keyboard Shortcuts */}
        <motion.div 
          className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <KeyboardIcon className="w-5 h-5 text-black/60 mr-3" />
            <span className="text-base font-serif font-light text-black/80">Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-black/60">
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-2 bg-white rounded-lg border border-black/10 font-mono text-xs">Space</kbd>
              <span className="font-light">Show Answer</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-2 bg-white rounded-lg border border-black/10 font-mono text-xs">0-5</kbd>
              <span className="font-light">Rate Difficulty</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-2 bg-white rounded-lg border border-black/10 font-mono text-xs">E</kbd>
              <span className="font-light">Toggle Explanation</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-3 py-2 bg-white rounded-lg border border-black/10 font-mono text-xs">H</kbd>
              <span className="font-light">AI Help</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}