'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { 
  BrainIcon,
  RefreshIcon,
  CheckCircleIcon,
  LightbulbIcon,
  EyeIcon
} from '@/components/icons/line-icons'
import { ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import { submitReview } from '@/server/actions/reviews'
import { getDueCards } from '@/server/actions/cards'
import { generateExplanation } from '@/server/actions/ai'
import { useMobile, vibrate } from '@/hooks/use-mobile'
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

const SWIPE_THRESHOLD = 100
const SWIPE_VELOCITY = 500

export default function MobileReviewInterface({ sessionId }: { sessionId: string }) {
  const [cards, setCards] = useState<ReviewCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [aiExplanation, setAiExplanation] = useState<string>('')
  const [showRatingPanel, setShowRatingPanel] = useState(false)
  const [stats, setStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0
  })

  const { isMobile, isTouch } = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number>(0)
  const isPulling = useRef(false)

  // Swipe animation values
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const currentCard = cards[currentIndex]

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

  // Pull to refresh
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].pageY
      isPulling.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current) return
    
    const currentY = e.touches[0].pageY
    const diff = currentY - startY.current

    if (diff > 0 && containerRef.current) {
      e.preventDefault()
      containerRef.current.style.transform = `translateY(${Math.min(diff, 100)}px)`
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isPulling.current || !containerRef.current) return
    
    const transform = containerRef.current.style.transform
    const translateY = parseInt(transform.replace(/[^\d-]/g, ''))
    
    if (translateY > 60) {
      vibrate(50)
      loadCards()
    }
    
    containerRef.current.style.transform = ''
    isPulling.current = false
  }, [loadCards])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setStartTime(Date.now())
    vibrate(30)
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

      // Haptic feedback
      if (rating >= 3) {
        vibrate(50)
      } else {
        vibrate([50, 30, 50])
      }

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setShowAnswer(false)
        setShowExplanation(false)
        setShowRatingPanel(false)
        setAiExplanation('')
      } else {
        await loadCards()
        setCurrentIndex(0)
        setShowAnswer(false)
        setShowRatingPanel(false)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }, [currentCard, startTime, sessionId, cards.length, currentIndex, loadCards])

  // Handle card swipe
  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const shouldSwipeLeft = info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY
      const shouldSwipeRight = info.offset.x > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY

      if (shouldSwipeLeft) {
        // Mark as difficult (rating 1)
        vibrate([50, 30, 50])
        handleRate(1)
      } else if (shouldSwipeRight) {
        // Mark as easy (rating 4)
        vibrate(50)
        handleRate(4)
      }
    },
    [handleRate]
  )

  const getAIHelp = useCallback(async () => {
    if (!currentCard || aiExplanation) return

    vibrate(30)
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

  // Load cards on mount
  useEffect(() => {
    loadCards()
  }, [loadCards])

  // Setup pull to refresh
  useEffect(() => {
    if (!isTouch) return

    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isTouch, handleTouchStart, handleTouchMove, handleTouchEnd])

  if (isLoading) {
    return <LoadingSkeleton type="review" message="Preparing your learning session..." showIcon={true} />
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] flex items-center justify-center p-4 safe-top safe-bottom">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CheckCircleIcon className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h3 className="text-2xl sm:text-3xl font-serif font-light mb-3">All caught up!</h3>
          <p className="text-base sm:text-lg text-black/60 font-light mb-8">No cards due for review right now.</p>
          <Button 
            onClick={loadCards}
            className="bg-black text-white hover:bg-black/90 rounded-full px-6 sm:px-8 py-3 transition-colors"
          >
            <RefreshIcon className="w-5 h-5 mr-2" />
            Check Again
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#F5F5FF] to-[#FFF5F5] relative overflow-hidden mobile-scroll"
    >
      {/* Pull to refresh indicator */}
      <div className="pull-to-refresh">
        <RefreshIcon className="w-8 h-8 text-black/40" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 safe-top safe-bottom">
        {/* Compact Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-black/60 font-light mb-2">
            <span>Progress: {currentIndex + 1}/{cards.length}</span>
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
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="text-xs text-black/60 mb-1">Reviewed</div>
            <div className="text-lg font-medium">{stats.reviewed}</div>
          </div>
          <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="text-xs text-black/60 mb-1">Correct</div>
            <div className="text-lg font-medium text-green-600">{stats.correct}</div>
          </div>
          <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl">
            <div className="text-xs text-black/60 mb-1">Learning</div>
            <div className="text-lg font-medium text-orange-600">{stats.incorrect}</div>
          </div>
        </div>

        {/* Card Display with Swipe */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            drag={showAnswer && isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            style={{ x, rotate, opacity }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative",
              showAnswer && isMobile && "swipeable"
            )}
          >
            <Card className="p-6 sm:p-8 bg-white border border-black/5 rounded-3xl shadow-lg min-h-[400px] sm:min-h-[500px]">
              {/* Topic Badge */}
              {currentCard?.cards.topics && (
                <div className="mb-4">
                  <span 
                    className="inline-block px-3 py-1 text-xs sm:text-sm font-light rounded-full border"
                    style={{ 
                      backgroundColor: `${currentCard.cards.topics.color}08`,
                      color: currentCard.cards.topics.color,
                      borderColor: `${currentCard.cards.topics.color}20`
                    }}
                  >
                    {currentCard.cards.topics.name}
                  </span>
                </div>
              )}

              {/* Question */}
              <div className="mb-6">
                <h2 className="text-lg sm:text-2xl font-serif font-light mb-3 text-black/90">Question</h2>
                <p className="text-base sm:text-xl text-black/80 font-light leading-relaxed mobile-readable">
                  {currentCard?.cards.front}
                </p>
              </div>

              {/* Answer Section */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t border-black/5 pt-6">
                      <h3 className="text-lg sm:text-2xl font-serif font-light mb-3 text-green-600">Answer</h3>
                      <p className="text-base sm:text-xl text-black/80 font-light leading-relaxed mobile-readable mb-4">
                        {currentCard?.cards.back}
                      </p>

                      {/* Explanation */}
                      {(currentCard?.cards.explanation || aiExplanation) && showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                        >
                          <div className="flex items-center mb-2">
                            <LightbulbIcon className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="font-serif font-light text-sm text-blue-900">Explanation</span>
                          </div>
                          <p className="text-sm text-blue-800 font-light leading-relaxed">
                            {aiExplanation || currentCard?.cards.explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show Answer Button */}
              {!showAnswer && (
                <motion.div 
                  className="absolute bottom-6 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button
                    onClick={handleShowAnswer}
                    className="w-full bg-black text-white hover:bg-black/90 rounded-full py-4 text-base transition-colors haptic"
                  >
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Show Answer
                  </Button>
                </motion.div>
              )}
            </Card>

            {/* Swipe hints */}
            {showAnswer && isMobile && (
              <div className="flex justify-between mt-4 px-4">
                <motion.div 
                  className="text-xs text-red-600/60"
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ← Hard
                </motion.div>
                <motion.div 
                  className="text-xs text-green-600/60"
                  animate={{ x: [5, -5, 5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Easy →
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Action Buttons */}
        {showAnswer && (
          <motion.div 
            className="mt-4 flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex-1 text-black/60 border-black/20 rounded-full py-3"
            >
              <LightbulbIcon className="w-4 h-4 mr-1" />
              Explain
            </Button>
            {!aiExplanation && (
              <Button
                variant="outline"
                onClick={getAIHelp}
                className="flex-1 text-black/60 border-black/20 rounded-full py-3"
              >
                <BrainIcon className="w-4 h-4 mr-1" />
                AI Help
              </Button>
            )}
          </motion.div>
        )}

        {/* Mobile Rating Panel */}
        {showAnswer && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              onClick={() => setShowRatingPanel(!showRatingPanel)}
              className="w-full bg-black/5 text-black hover:bg-black/10 rounded-full py-3 transition-colors"
            >
              Rate Difficulty
              {showRatingPanel ? (
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              ) : (
                <ChevronUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
            
            <AnimatePresence>
              {showRatingPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 grid grid-cols-3 gap-2"
                >
                  {[
                    { rating: 0, label: 'Forgot', color: 'bg-red-600' },
                    { rating: 1, label: 'Hard', color: 'bg-orange-600' },
                    { rating: 2, label: 'Tough', color: 'bg-yellow-600' },
                    { rating: 3, label: 'Good', color: 'bg-blue-600' },
                    { rating: 4, label: 'Easy', color: 'bg-green-600' },
                    { rating: 5, label: 'Perfect', color: 'bg-emerald-600' },
                  ].map(({ rating, label, color }) => (
                    <Button
                      key={rating}
                      onClick={() => handleRate(rating)}
                      className={cn(
                        color,
                        "text-white rounded-2xl py-3 text-sm font-light transition-all rating-button haptic"
                      )}
                    >
                      {label}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}