'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LightbulbIcon,
  RefreshIcon,
  CheckCircleIcon,
  CloseIcon,
  ChevronDownIcon,
  SparkleIcon,
  FlashIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import { submitReview } from '@/server/actions/reviews'
import { getDueCards } from '@/server/actions/cards'
import { generateExplanation } from '@/server/actions/ai'
import { cn } from '@/lib/utils'

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
  const [isFlipping, setIsFlipping] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [stats, setStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
    streak: 0
  })
  const cardRef = useRef<HTMLDivElement>(null)

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
    setIsFlipping(true)
    setTimeout(() => {
      setShowAnswer(true)
      setStartTime(Date.now())
      setIsFlipping(false)
    }, 300)
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
        incorrect: rating < 3 ? prev.incorrect + 1 : prev.incorrect,
        streak: rating >= 3 ? prev.streak + 1 : 0
      }))

      // Animate rating selection
      setSelectedRating(rating)
      setTimeout(() => setSelectedRating(null), 300)

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
    if (!currentCard || aiExplanation || isGeneratingAI) return

    setIsGeneratingAI(true)
    try {
      const result = await generateExplanation(
        `${currentCard.cards.front} - ${currentCard.cards.back}`,
        'simple'
      )
      setAiExplanation(result.explanation || '')
      setShowExplanation(true)
    } catch (error) {
      console.error('Failed to get AI explanation:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }, [currentCard, aiExplanation, isGeneratingAI])

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
          if (showAnswer) handleRate(0) // Forgot
          break
        case '2':
          if (showAnswer) handleRate(2) // Remembered
          break
        case '3':
          if (showAnswer) handleRate(4) // Easy
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


  if (isLoading) {
    return <LoadingSkeleton type="review" message="Preparing your learning session..." showIcon={true} />
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-[#22C55E]" />
          <h3 className="text-2xl font-light text-[#36454F] mb-2">All caught up!</h3>
          <p className="text-sm text-[#8B8680] mb-6">No cards due for review right now.</p>
          <Button 
            onClick={loadCards}
            className="bg-[#4682B4] text-white hover:bg-[#4682B4]/90"
          >
            <RefreshIcon className="w-4 h-4 mr-2" />
            Check Again
          </Button>
        </div>
      </div>
    )
  }

  const progress = ((currentIndex + 1) / cards.length) * 100

  return (
    <div className="h-screen bg-[#FAFAF9] flex flex-col overflow-hidden">
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col">
        {/* Compact Header */}
        <div className="mb-3 sm:mb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-6">
              {/* Minimal Progress */}
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-black/20" />
                <span className="font-mono text-xs text-black/60 tracking-[0.2em] uppercase">
                  {currentIndex + 1} / {cards.length}
                </span>
                <div className="h-px w-6 bg-black/20" />
              </div>
              
              {/* Live Stats */}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-black/60" />
                  <span className="font-medium text-black">{stats.correct}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FlashIcon className="w-4 h-4 text-black/60" />
                  <span className="font-medium text-black">{stats.streak}</span>
                </div>
              </div>
              
              {/* Topic Badge */}
              {currentCard?.cards.topics && (
                <div className="hidden md:block px-3 py-1 bg-black/5 rounded text-xs font-medium text-black/70 tracking-wide">
                  {currentCard.cards.topics.name}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              className="text-black/40 hover:text-black/80 h-8 w-8 p-0 hover:bg-black/5"
              onClick={() => window.location.href = '/dashboard'}
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="h-px bg-black/10 overflow-hidden">
            <motion.div 
              className="h-full bg-black/60"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main Card - Optimized Height */}
        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              ref={cardRef}
              className="flex-1 flex flex-col"
            >
              <Card className={cn(
                "bg-white border border-black/10 rounded-xl shadow-sm flex-1 flex flex-col relative overflow-hidden transition-all duration-300",
                isFlipping && "scale-[0.995]",
                showAnswer && "shadow-md"
              )}>
                <div className="flex-1 flex flex-col p-6">
                  {/* Question Section */}
                  <div className="flex-1 flex flex-col justify-center min-h-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center"
                    >
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-light text-black leading-tight tracking-[-0.01em] max-w-3xl mx-auto">
                        {currentCard?.cards.front}
                      </h2>
                    </motion.div>
                  </div>

                  {/* Divider with Show Answer */}
                  {!showAnswer && (
                    <motion.div 
                      className="my-6 relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="border-t border-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          onClick={handleShowAnswer}
                          className="bg-white border border-black/20 text-black hover:bg-black hover:text-white px-8 py-3 rounded-full transition-all duration-200 group font-medium"
                        >
                          <span className="mr-2">Reveal Answer</span>
                          <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Answer Section - Optimized */}
                  <AnimatePresence>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0"
                      >
                        <div className="border-t border-black/10 pt-4 mt-4 flex-1 flex flex-col">
                          {/* Answer Text */}
                          <div className="flex-shrink-0 text-center mb-4">
                            <motion.h3
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="text-base sm:text-lg lg:text-xl font-serif font-light text-black leading-relaxed max-w-3xl mx-auto"
                            >
                              {currentCard?.cards.back}
                            </motion.h3>
                          </div>

                          {/* Explanation Section - Compact */}
                          <AnimatePresence>
                            {showExplanation && (currentCard?.cards.explanation || aiExplanation) && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-shrink-0 mb-3 p-3 bg-black/3 border-l-2 border-black/20 rounded-r"
                              >
                                <div className="flex items-center mb-2">
                                  {aiExplanation ? (
                                    <SparkleIcon className="w-3 h-3 text-black/60 mr-2" />
                                  ) : (
                                    <LightbulbIcon className="w-3 h-3 text-black/60 mr-2" />
                                  )}
                                  <span className="text-[10px] text-black/60 font-mono uppercase tracking-wider">
                                    {aiExplanation ? 'AI Insight' : 'Explanation'}
                                  </span>
                                </div>
                                <p className="text-sm text-black/80 leading-relaxed">
                                  {aiExplanation || currentCard?.cards.explanation}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Spacer */}
                          <div className="flex-1 min-h-1"></div>

                          {/* Rating System - Always at bottom */}
                          <div className="flex-shrink-0">
                            <div className="flex items-center gap-3 mb-3 justify-center">
                              <div className="h-px w-6 bg-black/20" />
                              <span className="font-mono text-[10px] text-black/60 tracking-[0.2em] uppercase">
                                How did you do?
                              </span>
                              <div className="h-px w-6 bg-black/20" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
                              {[
                                { rating: 0, label: 'Forgot', description: 'Need to review', key: '1' },
                                { rating: 2, label: 'Remembered', description: 'Got it right', key: '2' },
                                { rating: 4, label: 'Easy', description: 'Knew instantly', key: '3' }
                              ].map((item, index) => (
                                <motion.div
                                  key={item.rating}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 + (0.1 * index) }}
                                >
                                  <Button
                                    onClick={() => handleRate(item.rating)}
                                    className={cn(
                                      "w-full h-10 sm:h-12 font-medium transition-all duration-200 relative overflow-hidden border flex flex-col gap-0.5 rounded-xl",
                                      selectedRating === item.rating 
                                        ? "bg-black text-white border-black" 
                                        : "bg-white text-black border-black/20 hover:bg-black/5 hover:border-black/40"
                                    )}
                                  >
                                    <span className="relative z-10 flex flex-col items-center">
                                      <div className="font-serif text-xs sm:text-sm">{item.label}</div>
                                      <div className="text-[9px] opacity-60 hidden sm:block">{item.description}</div>
                                      <div className="text-[8px] font-mono opacity-40 hidden sm:block">Press {item.key}</div>
                                    </span>
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions - Compact */}
                          <div className="flex items-center justify-center gap-2 mt-2 flex-shrink-0">
                            {!showExplanation && (
                              <Button
                                variant="ghost"
                                onClick={toggleExplanation}
                                className="text-black/60 hover:text-black hover:bg-black/5 text-xs px-2 py-1 h-6 rounded-full"
                              >
                                <LightbulbIcon className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Explanation</span>
                              </Button>
                            )}
                            {!aiExplanation && !isGeneratingAI && (
                              <Button
                                variant="ghost"
                                onClick={getAIHelp}
                                className="text-black/60 hover:text-black hover:bg-black/5 text-xs px-2 py-1 h-6 rounded-full"
                              >
                                <SparkleIcon className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">AI Insight</span>
                              </Button>
                            )}
                            {isGeneratingAI && (
                              <div className="flex items-center text-xs text-black/60">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <SparkleIcon className="w-3 h-3 mr-1" />
                                </motion.div>
                                <span className="hidden sm:inline">Generating...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Keyboard Hints */}
        <motion.div 
          className="mt-2 flex justify-center flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="hidden sm:flex items-center gap-4 text-xs text-black/40">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-black/5 border border-black/10 rounded text-[9px] font-mono">Space</kbd>
              <span>Reveal</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-black/5 border border-black/10 rounded text-[9px] font-mono">1-3</kbd>
              <span>Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-black/5 border border-black/10 rounded text-[9px] font-mono">E</kbd>
              <span>Explain</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}