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
  const masteryLevel = currentCard?.mastery_level || 0
  const difficultyColor = masteryLevel > 70 ? '#22C55E' : masteryLevel > 40 ? '#4682B4' : '#F59E0B'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="#F5F1EB"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke={difficultyColor}
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${progress * 1.13} 113`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#36454F]">
                    {currentIndex + 1}/{cards.length}
                  </span>
                </div>
              </div>
              
              {/* Live Stats */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-[#22C55E]" />
                  <span className="font-medium text-[#36454F]">{stats.correct}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FlashIcon className="w-4 h-4 text-[#F59E0B]" />
                  <span className="font-medium text-[#36454F]">{stats.streak}</span>
                </div>
                {currentCard?.cards.topics && (
                  <div className="px-2 py-0.5 bg-[#F5F1EB] rounded text-xs text-[#8B8680]">
                    {currentCard.cards.topics.name}
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="text-[#8B8680] hover:text-[#36454F] h-8 w-8 p-0"
              onClick={() => window.location.href = '/dashboard'}
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            ref={cardRef}
          >
            <Card className={cn(
              "bg-white border-2 shadow-lg min-h-[500px] relative overflow-hidden transition-all duration-300",
              isFlipping && "scale-[0.98]",
              showAnswer ? "border-[#4682B4]/20" : "border-[#F5F1EB]"
            )}>
              {/* Mastery Indicator */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5F1EB]">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: difficultyColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${masteryLevel}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>

              <div className="p-10">
                {/* Question Section */}
                <div className="min-h-[200px] flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl font-light text-[#36454F] leading-relaxed text-center">
                      {currentCard?.cards.front}
                    </h2>
                  </motion.div>
                </div>

                {/* Divider with Show Answer */}
                {!showAnswer && (
                  <motion.div 
                    className="my-8 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="border-t border-[#F5F1EB]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={handleShowAnswer}
                        className="bg-white border-2 border-[#4682B4] text-[#4682B4] hover:bg-[#4682B4] hover:text-white px-6 py-2 transition-all duration-200 group"
                      >
                        <span className="mr-2">Reveal Answer</span>
                        <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Answer Section */}
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t-2 border-[#F5F1EB] pt-8 mt-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h3 className="text-2xl font-light text-[#36454F] leading-relaxed text-center mb-8">
                            {currentCard?.cards.back}
                          </h3>
                        </motion.div>

                        {/* Explanation Section */}
                        <AnimatePresence>
                          {showExplanation && (currentCard?.cards.explanation || aiExplanation) && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mb-6 p-4 bg-gradient-to-r from-[#4682B4]/5 to-[#4682B4]/10 border-l-3 border-[#4682B4] rounded-r-lg"
                            >
                              <div className="flex items-center mb-2">
                                {aiExplanation ? (
                                  <SparkleIcon className="w-4 h-4 text-[#4682B4] mr-2" />
                                ) : (
                                  <LightbulbIcon className="w-4 h-4 text-[#4682B4] mr-2" />
                                )}
                                <span className="text-xs text-[#4682B4] font-medium uppercase tracking-wider">
                                  {aiExplanation ? 'AI Insight' : 'Explanation'}
                                </span>
                              </div>
                              <p className="text-sm text-[#36454F] leading-relaxed">
                                {aiExplanation || currentCard?.cards.explanation}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Smart Rating Buttons */}
                        <div className="mt-8">
                          <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-4 text-center">How difficult was this?</p>
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { rating: 0, label: 'Again', color: 'bg-red-500 hover:bg-red-600', key: '1' },
                              { rating: 1, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', key: '2' },
                              { rating: 2, label: 'Good', color: 'bg-yellow-500 hover:bg-yellow-600', key: '3' },
                              { rating: 3, label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600', key: '4' },
                              { rating: 5, label: 'Perfect', color: 'bg-green-500 hover:bg-green-600', key: '5' }
                            ].map((item, index) => (
                              <motion.div
                                key={item.rating}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                              >
                                <Button
                                  onClick={() => handleRate(item.rating)}
                                  className={cn(
                                    "w-full h-14 text-white font-medium transition-all duration-200 relative overflow-hidden",
                                    item.color,
                                    selectedRating === item.rating && "ring-2 ring-offset-2 ring-[#4682B4] scale-95"
                                  )}
                                >
                                  <span className="relative z-10">
                                    <div className="text-xs opacity-80">{item.key}</div>
                                    <div className="text-sm">{item.label}</div>
                                  </span>
                                  {selectedRating === item.rating && (
                                    <motion.div
                                      className="absolute inset-0 bg-white/20"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                          {!showExplanation && (
                            <Button
                              variant="ghost"
                              onClick={toggleExplanation}
                              className="text-[#8B8680] hover:text-[#4682B4] hover:bg-[#F5F1EB] text-sm"
                            >
                              <LightbulbIcon className="w-4 h-4 mr-1" />
                              Show Explanation
                            </Button>
                          )}
                          {!aiExplanation && !isGeneratingAI && (
                            <Button
                              variant="ghost"
                              onClick={getAIHelp}
                              className="text-[#8B8680] hover:text-[#4682B4] hover:bg-[#F5F1EB] text-sm"
                            >
                              <SparkleIcon className="w-4 h-4 mr-1" />
                              Get AI Insight
                            </Button>
                          )}
                          {isGeneratingAI && (
                            <div className="flex items-center text-sm text-[#4682B4]">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <SparkleIcon className="w-4 h-4 mr-1" />
                              </motion.div>
                              Generating...
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

        {/* Minimalist Keyboard Hints */}
        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4 text-xs text-[#8B8680]">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#F5F1EB] rounded text-[10px] font-mono">Space</kbd>
              <span className="opacity-60">Reveal</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#F5F1EB] rounded text-[10px] font-mono">1-5</kbd>
              <span className="opacity-60">Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#F5F1EB] rounded text-[10px] font-mono">E</kbd>
              <span className="opacity-60">Explain</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}