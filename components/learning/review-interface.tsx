'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LightbulbIcon,
  RefreshIcon,
  CheckCircleIcon,
  CloseIcon,
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

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-light text-[#36454F] mb-2">Review Session</h1>
              <p className="text-sm text-[#8B8680]">Card {currentIndex + 1} of {cards.length}</p>
            </div>
            <Button
              variant="ghost"
              className="text-[#8B8680] hover:text-[#36454F]"
              onClick={() => window.location.href = '/dashboard'}
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Simple Progress Bar */}
          <div className="h-0.5 bg-[#F5F1EB] overflow-hidden">
            <motion.div 
              className="h-full bg-[#4682B4]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 mb-8 pb-8 border-b border-[#F5F1EB]">
          <div>
            <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-1">Reviewed</p>
            <p className="text-2xl font-light text-[#36454F]">{stats.reviewed}</p>
          </div>
          <div>
            <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-1">Correct</p>
            <p className="text-2xl font-light text-[#22C55E]">{stats.correct}</p>
          </div>
          <div>
            <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-1">Learning</p>
            <p className="text-2xl font-light text-[#F59E0B]">{stats.incorrect}</p>
          </div>
          <div className="ml-auto">
            <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-1">Mastery</p>
            <p className="text-2xl font-light text-[#36454F]">{Math.round(currentCard?.mastery_level || 0)}%</p>
          </div>
        </div>

        {/* Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white border border-[#F5F1EB] shadow-sm min-h-[400px]">
              <div className="p-8">
                {/* Topic Badge */}
                {currentCard?.cards.topics && (
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider text-[#8B8680] bg-[#F5F1EB] rounded">
                      {currentCard.cards.topics.name}
                    </span>
                  </div>
                )}

                {/* Question */}
                <div className="mb-8">
                  <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-3">Question</p>
                  <p className="text-xl text-[#36454F] leading-relaxed">{currentCard?.cards.front}</p>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-[#F5F1EB] pt-8">
                        <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-3">Answer</p>
                        <p className="text-lg text-[#36454F] leading-relaxed mb-6">{currentCard?.cards.back}</p>

                        {/* Explanation */}
                        {(currentCard?.cards.explanation || aiExplanation) && showExplanation && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-[#F5F1EB] border-l-2 border-[#4682B4]"
                          >
                            <div className="flex items-center mb-2">
                              <LightbulbIcon className="w-4 h-4 text-[#4682B4] mr-2" />
                              <span className="text-xs text-[#4682B4] uppercase tracking-wider">Explanation</span>
                            </div>
                            <p className="text-sm text-[#36454F] leading-relaxed">
                              {aiExplanation || currentCard?.cards.explanation}
                            </p>
                          </motion.div>
                        )}

                        {/* Rating Buttons */}
                        <div className="mt-8">
                          <p className="text-xs text-[#8B8680] uppercase tracking-wider mb-4">Rate Difficulty</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRate(0)}
                              className="flex-1 bg-[#B7410E] hover:bg-[#B7410E]/90 text-white h-12"
                            >
                              <span className="text-sm">Forgot</span>
                            </Button>
                            <Button
                              onClick={() => handleRate(1)}
                              className="flex-1 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white h-12"
                            >
                              <span className="text-sm">Hard</span>
                            </Button>
                            <Button
                              onClick={() => handleRate(2)}
                              className="flex-1 bg-[#8B8680] hover:bg-[#8B8680]/90 text-white h-12"
                            >
                              <span className="text-sm">Good</span>
                            </Button>
                            <Button
                              onClick={() => handleRate(3)}
                              className="flex-1 bg-[#4682B4] hover:bg-[#4682B4]/90 text-white h-12"
                            >
                              <span className="text-sm">Easy</span>
                            </Button>
                            <Button
                              onClick={() => handleRate(5)}
                              className="flex-1 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white h-12"
                            >
                              <span className="text-sm">Perfect</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show Answer Button */}
                {!showAnswer && (
                  <div className="flex justify-center mt-auto pt-8">
                    <Button
                      onClick={handleShowAnswer}
                      className="bg-[#4682B4] hover:bg-[#4682B4]/90 text-white px-8 py-3"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Reveal Answer
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                {showAnswer && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#F5F1EB]">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={toggleExplanation}
                        className="text-[#8B8680] border-[#F5F1EB] hover:bg-[#F5F1EB] h-9"
                      >
                        <LightbulbIcon className="w-3 h-3 mr-1" />
                        {showExplanation ? 'Hide' : 'Show'} Explanation
                      </Button>
                      {!aiExplanation && (
                        <Button
                          variant="outline"
                          onClick={getAIHelp}
                          className="text-[#8B8680] border-[#F5F1EB] hover:bg-[#F5F1EB] h-9"
                        >
                          <LightbulbIcon className="w-3 h-3 mr-1" />
                          AI Help
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 pt-8 border-t border-[#F5F1EB]">
          <div className="flex items-center gap-2 mb-3">
            <KeyboardIcon className="w-4 h-4 text-[#8B8680]" />
            <span className="text-xs text-[#8B8680] uppercase tracking-wider">Keyboard Shortcuts</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-[#8B8680]">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-[#F5F1EB] rounded font-mono">Space</kbd>
              <span>Show Answer</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-[#F5F1EB] rounded font-mono">1-5</kbd>
              <span>Rate Difficulty</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-[#F5F1EB] rounded font-mono">E</kbd>
              <span>Explanation</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-[#F5F1EB] rounded font-mono">H</kbd>
              <span>AI Help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}