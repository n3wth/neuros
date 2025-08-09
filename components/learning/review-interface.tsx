'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  X,
  Clock,
  Zap,
  Lightbulb,
  Volume2,
  Keyboard,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { submitReview } from '@/server/actions/reviews'
import { getDueCards } from '@/server/actions/cards'
import { generateExplanation, generatePracticeQuestions } from '@/server/actions/ai'

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

  // Load due cards
  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    setIsLoading(true)
    try {
      const dueCards = await getDueCards(20)
      setCards(dueCards as any)
    } catch (error) {
      console.error('Failed to load cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
  }, [currentCard, showAnswer, aiExplanation])

  const handleShowAnswer = () => {
    setShowAnswer(true)
    setStartTime(Date.now())
  }

  const handleRate = async (rating: number) => {
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
  }

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation)
  }

  const getAIHelp = async () => {
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
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 0: return 'bg-red-600 hover:bg-red-700'
      case 1: return 'bg-orange-600 hover:bg-orange-700'
      case 2: return 'bg-yellow-600 hover:bg-yellow-700'
      case 3: return 'bg-blue-600 hover:bg-blue-700'
      case 4: return 'bg-green-600 hover:bg-green-700'
      case 5: return 'bg-emerald-600 hover:bg-emerald-700'
      default: return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading your cards...</p>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
          <p className="text-gray-600 mb-4">No cards due for review right now.</p>
          <Button onClick={loadCards}>Check Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {currentIndex + 1} of {cards.length}</span>
          <span>Mastery: {Math.round(currentCard?.mastery_level || 0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Reviewed</span>
            <span className="text-xl font-semibold">{stats.reviewed}</span>
          </div>
        </Card>
        <Card className="p-4 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Correct</span>
            <span className="text-xl font-semibold text-green-600">{stats.correct}</span>
          </div>
        </Card>
        <Card className="p-4 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Learning</span>
            <span className="text-xl font-semibold text-orange-600">{stats.incorrect}</span>
          </div>
        </Card>
      </div>

      {/* Card Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-white border-gray-200 min-h-[400px]">
            {/* Topic Badge */}
            {currentCard?.cards.topics && (
              <div className="mb-6">
                <span 
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${currentCard.cards.topics.color}20`,
                    color: currentCard.cards.topics.color
                  }}
                >
                  {currentCard.cards.topics.name}
                </span>
              </div>
            )}

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-2">Question</h2>
              <p className="text-lg text-gray-700">{currentCard?.cards.front}</p>
            </div>

            {/* Answer */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-medium mb-2 text-green-600">Answer</h3>
                    <p className="text-lg text-gray-700 mb-4">{currentCard?.cards.back}</p>

                    {/* Explanation */}
                    {(currentCard?.cards.explanation || aiExplanation) && showExplanation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center mb-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-900">Explanation</span>
                        </div>
                        <p className="text-sm text-blue-800">
                          {aiExplanation || currentCard?.cards.explanation}
                        </p>
                      </motion.div>
                    )}

                    {/* Rating Buttons */}
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-3">How difficult was this?</p>
                      <div className="grid grid-cols-6 gap-2">
                        <Button
                          onClick={() => handleRate(0)}
                          className={`${getRatingColor(0)} text-white`}
                        >
                          <div className="text-center">
                            <X className="w-4 h-4 mx-auto mb-1" />
                            <span className="text-xs">Forgot</span>
                            <span className="text-xs opacity-60 block">(0)</span>
                          </div>
                        </Button>
                        {[1, 2, 3, 4, 5].map(rating => (
                          <Button
                            key={rating}
                            onClick={() => handleRate(rating)}
                            className={`${getRatingColor(rating)} text-white`}
                          >
                            <div className="text-center">
                              <span className="text-lg">{rating}</span>
                              <span className="text-xs block">
                                {rating === 1 && 'Hard'}
                                {rating === 2 && 'Tough'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Easy'}
                                {rating === 5 && 'Perfect'}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show Answer Button */}
            {!showAnswer && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleShowAnswer}
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Show Answer
                  <Eye className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            {showAnswer && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleExplanation}
                    className="text-gray-600"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>
                  {!aiExplanation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getAIHelp}
                      className="text-gray-600"
                    >
                      <Brain className="w-4 h-4 mr-1" />
                      AI Help
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  Read Aloud
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Keyboard className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Keyboard Shortcuts</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div><kbd className="px-2 py-1 bg-white rounded border">Space</kbd> Show Answer</div>
          <div><kbd className="px-2 py-1 bg-white rounded border">0-5</kbd> Rate Difficulty</div>
          <div><kbd className="px-2 py-1 bg-white rounded border">E</kbd> Toggle Explanation</div>
          <div><kbd className="px-2 py-1 bg-white rounded border">H</kbd> AI Help</div>
        </div>
      </div>
    </div>
  )
}