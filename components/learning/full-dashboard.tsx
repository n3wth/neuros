'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparkleIcon, 
  BrainIcon, 
  ChartIcon, 
  BookIcon, 
  RocketIcon, 
  BeakerIcon,
  PaletteIcon,
  HeartIcon,
  PlusIcon,
  PlayIcon,
  ChevronRightIcon,
  SearchIcon,
  LogOutIcon,
  RefreshIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/server/actions/auth'
import Link from 'next/link'
import CreateCardDialog from './create-card-dialog'
import ReviewInterface from './review-interface'
import ImageGenerator from './image-generator'
import AIFeaturesSettings from './ai-features-settings'
import { 
  getUserCards, 
  getDueCards, 
  getCardStats,
  getUpcomingCards,
  getUserCompletionState 
} from '@/server/actions/cards'
import { 
  startStudySession, 
  endStudySession,
  getStudyStats 
} from '@/server/actions/reviews'
import { generateLearningInsights } from '@/server/actions/ai'
// Meta-learning imports for future use
// import { analyzeMetaLearningPatterns, evolveSystemIntelligence } from '@/server/actions/meta-learning'
// import { generateTutorIntervention } from '@/server/actions/ai-tutor'
import dynamic from 'next/dynamic'
import LoadingSkeleton from '@/components/ui/loading-skeleton'

// Lazy load heavy visualization components
const KnowledgeGraph = dynamic(() => import('@/components/visualizations/knowledge-graph'), {
  ssr: false,
  loading: () => <LoadingSkeleton type="card" message="Loading knowledge graph..." />
})
const GlobalLearningNetwork = dynamic(() => import('@/components/global/learning-network'), {
  ssr: false,
  loading: () => <LoadingSkeleton type="card" message="Connecting to global learning network..." />
})
const ViralMechanisms = dynamic(() => import('@/components/sharing/viral-mechanisms'), {
  ssr: false,
  loading: () => <LoadingSkeleton type="card" message="Loading impact mechanisms..." />
})

interface User {
  id: string
  email?: string
}

interface FullLearningDashboardProps {
  user: User
}

type ViewMode = 'overview' | 'review' | 'browse' | 'stats' | 'images' | 'settings' | 'knowledge' | 'network' | 'viral'

export default function FullLearningDashboard({ user }: FullLearningDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [cards, setCards] = useState<Array<{ id: string; front: string; back: string; difficulty: string; topics?: { name: string; color: string }; user_cards?: Array<{ mastery_level: number }> }>>([])
  const [dueCards, setDueCards] = useState<Array<{ id: string; cards: { front: string; back: string; topics?: { name: string } }; mastery_level: number; total_reviews: number }>>([])
  const [stats, setStats] = useState<{ totalCards: number; dueCards: number; mastered: number; learning: number; difficult: number } | null>(null)
  const [studyStats, setStudyStats] = useState<{ total_reviews: number; average_accuracy: number; total_study_time_minutes: number; current_streak_days: number } | null>(null)
  const [upcomingCards, setUpcomingCards] = useState<Record<string, Array<{ id: string }>>>({})
  const [aiInsights, setAiInsights] = useState<Array<{ type: string; title: string; description: string; action?: string }>>([])
  const [completionState, setCompletionState] = useState<{ type: string; totalCards: number; dueCards: number; nextReviewTime: string | null; completedToday: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [
        userCards,
        dueCardsData,
        cardStats,
        studyStatsData,
        upcomingData,
        userCompletionState
      ] = await Promise.all([
        getUserCards(),
        getDueCards(10),
        getCardStats(),
        getStudyStats(),
        getUpcomingCards(),
        getUserCompletionState()
      ])

      setCards(userCards.map(card => ({
        id: card.id,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || 'medium',
        topics: card.topics ? {
          name: card.topics.name,
          color: card.topics.color || '#999999'
        } : undefined,
        user_cards: card.user_cards?.map(uc => ({
          mastery_level: uc.mastery_level || 0
        }))
      })))
      setDueCards(dueCardsData.map(item => ({
        id: item.id,
        cards: {
          front: item.cards.front,
          back: item.cards.back,
          topics: item.cards.topics ? {
            name: item.cards.topics.name
          } : undefined
        },
        mastery_level: item.mastery_level || 0,
        total_reviews: item.total_reviews || 0
      })))
      setStats(cardStats)
      setStudyStats(studyStatsData ? {
        total_reviews: studyStatsData.total_reviews || 0,
        average_accuracy: studyStatsData.average_accuracy || 0,
        total_study_time_minutes: studyStatsData.total_study_time_minutes || 0,
        current_streak_days: studyStatsData.current_streak_days || 0
      } : null)
      const formattedUpcoming: Record<string, Array<{ id: string }>> = {}
      Object.entries(upcomingData).forEach(([date, items]) => {
        formattedUpcoming[date] = items.map(item => ({ id: item.cards.id }))
      })
      setUpcomingCards(formattedUpcoming)
      setCompletionState(userCompletionState)

      // Generate AI insights if we have stats or show fallback for new users
      if (studyStatsData && cardStats && cardStats.totalCards > 0) {
        try {
          const insights = await generateLearningInsights({
            totalCards: cardStats.totalCards,
            mastered: cardStats.mastered,
            struggling: cardStats.difficult,
            averageAccuracy: studyStatsData.average_accuracy || 0,
            studyTimeMinutes: studyStatsData.total_study_time_minutes || 0
          })
          setAiInsights(insights.insights || [])
        } catch (error) {
          console.error('Failed to get AI insights:', error)
          // Set fallback insights for better UX when API fails
          setAiInsights([
            {
              type: 'info',
              title: 'Welcome to Neuros!',
              description: 'Start creating cards to receive personalized learning insights powered by AI.',
              action: 'Create your first card'
            }
          ])
        }
      } else {
        // Set welcome insights for new users
        setAiInsights([
          {
            type: 'info',
            title: 'Welcome to Neuros!',
            description: 'Start creating cards to receive personalized learning insights powered by AI.',
            action: 'Create your first card'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartReview = async () => {
    try {
      const session = await startStudySession()
      setCurrentSessionId(session.id)
      setViewMode('review')
    } catch (error) {
      console.error('Failed to start study session:', error)
    }
  }

  const handleEndReview = async () => {
    if (currentSessionId) {
      try {
        await endStudySession(currentSessionId)
        setCurrentSessionId(null)
      } catch (error) {
        console.error('Failed to end study session:', error)
      }
    }
    setViewMode('overview')
    loadDashboardData()
  }

  const formatGreeting = () => {
    const hour = new Date().getHours()
    const name = user.email?.split('@')[0] || 'there'
    // Capitalize the first letter of the name
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    if (hour < 12) return `Good morning, ${capitalizedName}`
    if (hour < 18) return `Good afternoon, ${capitalizedName}`
    return `Good evening, ${capitalizedName}`
  }

  const formatSmartMessage = () => {
    if (!completionState) return `You have ${stats?.dueCards || 0} cards ready for review`
    
    switch (completionState.type) {
      case 'new_user':
        return "Ready to start your learning journey? Let's create your first card!"
      case 'completed_today':
        return "Great job! You've completed all your reviews for today"
      case 'has_due_cards':
        const urgency = completionState.dueCards > 10 ? " Let's tackle them!" : ""
        return `You have ${completionState.dueCards} cards ready for review${urgency}`
      case 'no_cards_due':
        if (completionState.nextReviewTime) {
          const nextReview = new Date(completionState.nextReviewTime)
          const now = new Date()
          const hoursUntil = Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60))
          if (hoursUntil < 24) {
            return `Your spaced repetition is working! Next review in ${hoursUntil} hours`
          } else {
            const daysUntil = Math.ceil(hoursUntil / 24)
            return `Your spaced repetition is working! Next review in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`
          }
        }
        return "All caught up! Consider adding new cards to expand your knowledge"
      default:
        return `You have ${stats?.dueCards || 0} cards ready for review`
    }
  }

  const filteredCards = cards.filter(card => 
    searchQuery ? 
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" message="Loading your learning dashboard..." />
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <RefreshIcon className="w-8 h-8 text-red-500 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-serif font-light mb-3 text-black/90">Something went wrong</h2>
          <p className="text-black/60 font-light mb-6">{error}</p>
          <Button
            onClick={loadDashboardData}
            className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg transition-all duration-300"
          >
            <RefreshIcon className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5]">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-black/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center group p-2 rounded-xl hover:bg-black/5 transition-all duration-300">
                <SparkleIcon className="w-8 h-8 text-black/70 stroke-[2] group-hover:text-black group-hover:rotate-12 transition-all duration-300" />
              </Link>
              
              <nav className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'overview' 
                      ? 'bg-black text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setViewMode('review')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'review' 
                      ? 'bg-black text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <BrainIcon className="w-5 h-5 stroke-[2]" />
                  Review
                </button>
                <button
                  onClick={() => setViewMode('browse')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'browse' 
                      ? 'bg-black text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <BookIcon className="w-5 h-5 stroke-[2]" />
                  Browse
                </button>
                <button
                  onClick={() => setViewMode('stats')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'stats' 
                      ? 'bg-black text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <ChartIcon className="w-5 h-5 stroke-[2]" />
                  Stats
                </button>
                <button
                  onClick={() => setViewMode('images')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'images' 
                      ? 'bg-black text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <PaletteIcon className="w-5 h-5 stroke-[2]" />
                  Images
                </button>
                <button
                  onClick={() => setViewMode('settings')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'settings' 
                      ? 'bg-black text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <BeakerIcon className="w-5 h-5 stroke-[2]" />
                  AI
                </button>
                <button
                  onClick={() => setViewMode('knowledge')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'knowledge' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <SparkleIcon className="w-5 h-5 stroke-[2]" />
                  Knowledge
                </button>
                <button
                  onClick={() => setViewMode('network')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'network' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <HeartIcon className="w-5 h-5 stroke-[2]" />
                  Network
                </button>
                <button
                  onClick={() => setViewMode('viral')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
                    viewMode === 'viral' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                      : 'text-black/60 hover:text-black hover:bg-black/3'
                  }`}
                >
                  <RocketIcon className="w-5 h-5 stroke-[2]" />
                  Impact
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {studyStats && studyStats.current_streak_days > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-black/10">
                  <RocketIcon className="w-4 h-4 text-black/70 stroke-[1.5]" />
                  <span className="text-sm font-light text-black/70 whitespace-nowrap">
                    {studyStats.current_streak_days === 1 ? '1 day' : `${studyStats.current_streak_days} days`}
                  </span>
                </div>
              )}
              
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-black text-white hover:bg-black/90 rounded-full px-6 font-light shadow-sm hover:shadow-md transition-all duration-300"
              >
                <PlusIcon className="w-4 h-4 mr-2 stroke-[1.5]" />
                New Card
              </Button>

              <button
                onClick={async () => await signOut()}
                className="p-2.5 hover:bg-black/5 rounded-full transition-all duration-300 group"
                title="Sign out"
              >
                <LogOutIcon className="w-4 h-4 text-black/60 group-hover:text-black/80 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Greeting */}
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl font-serif font-light mb-3 text-black/90">{formatGreeting()}</h1>
                <p className="text-lg text-black/60 font-light">
                  {formatSmartMessage()}
                </p>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <BookIcon className="w-7 h-7 text-black/70 stroke-[2]" />
                      <span className="text-xs text-black/40 font-mono">Total</span>
                    </div>
                    <p className="text-3xl font-serif font-light text-black/90">{stats?.totalCards || 0}</p>
                    <p className="text-xs text-black/50 font-light">cards</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <RocketIcon className="w-7 h-7 text-black/70 stroke-[2]" />
                      <span className="text-xs text-black/40 font-mono">Mastered</span>
                    </div>
                    <p className="text-3xl font-serif font-light text-black/90">{stats?.mastered || 0}</p>
                    <p className="text-xs text-black/50 font-light">cards</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <SparkleIcon className="w-7 h-7 text-black/70 stroke-[2]" />
                      <span className="text-xs text-black/40 font-mono">Due</span>
                    </div>
                    <p className="text-3xl font-serif font-light text-black/90">{stats?.dueCards || 0}</p>
                    <p className="text-xs text-black/50 font-light">today</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <ChartIcon className="w-7 h-7 text-black/70 stroke-[2]" />
                      <span className="text-xs text-black/40 font-mono">Accuracy</span>
                    </div>
                    <p className="text-3xl font-serif font-light text-black/90">{studyStats?.average_accuracy || 0}%</p>
                    <p className="text-xs text-black/50 font-light">average</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <HeartIcon className="w-7 h-7 text-black/70 stroke-[2]" />
                      <span className="text-xs text-black/40 font-mono">Reviews</span>
                    </div>
                    <p className="text-3xl font-serif font-light text-black/90">{studyStats?.total_reviews || 0}</p>
                    <p className="text-xs text-black/50 font-light">total</p>
                  </Card>
                </motion.div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Action Area */}
                <div className="lg:col-span-2">
                  {/* Start Review Card */}
                  {stats && stats.dueCards > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Card className="p-8 bg-white/95 backdrop-blur-sm border border-black/5 rounded-3xl mb-8 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-serif font-light mb-3 text-black/90">Ready to review</h3>
                            <p className="text-black/60 mb-6 font-light max-w-md">
                              {stats.dueCards} cards are due for review. 
                              Estimated time: {Math.ceil(stats.dueCards * 0.5)} minutes
                            </p>
                            <Button
                              onClick={handleStartReview}
                              className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              <PlayIcon className="w-4 h-4 mr-2" />
                              Start Review Session
                            </Button>
                          </div>
                          <BrainIcon className="w-16 h-16 text-black/30 stroke-[1.5]" />
                        </div>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Card className="p-8 bg-white/95 backdrop-blur-sm border border-black/5 rounded-3xl mb-8 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-start justify-between">
                          <div>
                            {completionState?.type === 'new_user' ? (
                              <>
                                <h3 className="text-2xl font-serif font-light mb-3 text-black/90">Start Your Learning Journey</h3>
                                <p className="text-black/60 mb-6 font-light max-w-md">
                                  Welcome to Neuros! Create your first learning card to begin using AI-powered spaced repetition for better knowledge retention.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Create First Card
                                  </Button>
                                  <Button
                                    onClick={() => setViewMode('settings')}
                                    className="border-black/20 text-black hover:bg-black/5 rounded-full px-8 py-3 font-light transition-all duration-300"
                                    variant="outline"
                                  >
                                    <BeakerIcon className="w-4 h-4 mr-2" />
                                    Learn About AI Features
                                  </Button>
                                </div>
                              </>
                            ) : completionState?.type === 'completed_today' ? (
                              <>
                                <motion.div
                                  initial={{ scale: 0.9 }}
                                  animate={{ scale: 1 }}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: 200, 
                                    damping: 10,
                                    repeat: 2,
                                    repeatType: "reverse",
                                    repeatDelay: 0.3
                                  }}
                                >
                                  <div className="flex items-center gap-2 mb-3">
                                    <SparkleIcon className="w-8 h-8 text-green-500 animate-pulse" />
                                    <h3 className="text-2xl font-serif font-light text-black/90">Congratulations!</h3>
                                  </div>
                                </motion.div>
                                <p className="text-black/60 mb-6 font-light max-w-md">
                                  You&apos;ve completed all your reviews for today! Your consistency is building lasting knowledge.
                                  {completionState.nextReviewTime && (
                                    <span className="block mt-2 text-sm text-black/50">
                                      Next reviews: {new Date(completionState.nextReviewTime).toLocaleDateString()}
                                    </span>
                                  )}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add New Cards
                                  </Button>
                                  <Button
                                    onClick={() => setViewMode('stats')}
                                    className="border-black/20 text-black hover:bg-black/5 rounded-full px-8 py-3 font-light transition-all duration-300"
                                    variant="outline"
                                  >
                                    <ChartIcon className="w-4 h-4 mr-2" />
                                    View Progress
                                  </Button>
                                </div>
                              </>
                            ) : completionState?.type === 'no_cards_due' ? (
                              <>
                                <h3 className="text-2xl font-serif font-light mb-3 text-black/90">Spaced Repetition Active!</h3>
                                <p className="text-black/60 mb-6 font-light max-w-md">
                                  Your learning schedule is optimized. No reviews needed right now - your brain is consolidating knowledge.
                                  {completionState.nextReviewTime && (
                                    <span className="block mt-2 text-sm text-black/50">
                                      Next reviews: {new Date(completionState.nextReviewTime).toLocaleDateString()}
                                    </span>
                                  )}
                                </p>
                                <Button
                                  onClick={() => setIsCreateDialogOpen(true)}
                                  className="border-black/20 text-black hover:bg-black/5 rounded-full px-8 py-3 font-light transition-all duration-300"
                                  variant="outline"
                                >
                                  <PlusIcon className="w-4 h-4 mr-2" />
                                  Add New Cards
                                </Button>
                              </>
                            ) : (
                              // Fallback for unknown states
                              <>
                                <h3 className="text-2xl font-serif font-light mb-3 text-black/90">All caught up!</h3>
                                <p className="text-black/60 mb-6 font-light max-w-md">
                                  No cards due for review. Great job staying on top of your learning!
                                </p>
                                <Button
                                  onClick={() => setIsCreateDialogOpen(true)}
                                  className="border-black/20 text-black hover:bg-black/5 rounded-full px-8 py-3 font-light transition-all duration-300"
                                  variant="outline"
                                >
                                  <PlusIcon className="w-4 h-4 mr-2" />
                                  Add New Cards
                                </Button>
                              </>
                            )}
                          </div>
                          {completionState?.type === 'new_user' ? (
                            <SparkleIcon className="w-16 h-16 text-black/30 stroke-[1.5]" />
                          ) : completionState?.type === 'completed_today' ? (
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                            >
                              <HeartIcon className="w-16 h-16 text-green-400 stroke-[1.5]" />
                            </motion.div>
                          ) : completionState?.type === 'no_cards_due' ? (
                            <BrainIcon className="w-16 h-16 text-blue-400 stroke-[1.5]" />
                          ) : (
                            <RocketIcon className="w-16 h-16 text-black/30 stroke-[1.5]" />
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Due Cards Preview */}
                  {dueCards.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <h3 className="text-xl font-serif font-light mb-6 text-black/90">Cards Due Today</h3>
                      <div className="space-y-4">
                        {dueCards.slice(0, 5).map((card, index) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                          >
                            <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-light text-black/90 mb-2 text-lg">
                                    {card.cards.front}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-black/50 font-mono">
                                    <span>Mastery: {Math.round(card.mastery_level)}%</span>
                                    <span>•</span>
                                    <span>Reviews: {card.total_reviews}</span>
                                    {card.cards.topics && (
                                      <>
                                        <span>•</span>
                                        <span>{card.cards.topics.name}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-black/30 group-hover:text-black/60 group-hover:translate-x-1 transition-all duration-300" />
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sidebar */}
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* AI Insights / Onboarding */}
                  <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <BrainIcon className="w-6 h-6 mr-3 text-purple-600/70" />
                      <h3 className="font-serif font-light text-lg text-black/90">
                        {completionState?.type === 'new_user' ? 'Getting Started' : 
                         completionState?.type === 'completed_today' ? 'Today&apos;s Achievement' :
                         'AI Insights'}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {completionState?.type === 'new_user' ? (
                        <motion.div 
                          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2.5 h-2.5 rounded-full mt-2 bg-blue-500" />
                            <div className="flex-1">
                              <p className="text-sm font-light text-black/90 mb-2">
                                Welcome to Neuros!
                              </p>
                              <p className="text-xs text-black/60 mb-3 font-light leading-relaxed">
                                Create your first learning card to unlock AI-powered insights, spaced repetition, and personalized learning analytics.
                              </p>
                              <button 
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="text-xs font-light text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                              >
                                Create your first card →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : completionState?.type === 'completed_today' ? (
                        <motion.div 
                          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2.5 h-2.5 rounded-full mt-2 bg-green-500" />
                            <div className="flex-1">
                              <p className="text-sm font-light text-black/90 mb-2">
                                Consistency Champion!
                              </p>
                              <p className="text-xs text-black/60 mb-3 font-light leading-relaxed">
                                You&apos;ve maintained your learning streak. Consistent daily practice is the key to long-term retention and mastery.
                              </p>
                              <button 
                                onClick={() => setViewMode('stats')}
                                className="text-xs font-light text-green-600 hover:text-green-700 hover:underline transition-colors"
                              >
                                View your progress →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        aiInsights.slice(0, 2).map((insight, index) => (
                          <motion.div 
                            key={index} 
                            className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full mt-2 ${
                                insight.type === 'strength' ? 'bg-green-500' :
                                insight.type === 'improvement' ? 'bg-yellow-500' :
                                insight.type === 'info' ? 'bg-blue-500' :
                                'bg-blue-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-light text-black/90 mb-2">
                                  {insight.title}
                                </p>
                                <p className="text-xs text-black/60 mb-3 font-light leading-relaxed">
                                  {insight.description}
                                </p>
                                {insight.action && (
                                  <button 
                                    onClick={() => insight.action === 'Create your first card' && setIsCreateDialogOpen(true)}
                                    className="text-xs font-light text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                  >
                                    {insight.action} →
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </Card>

                  {/* Upcoming Reviews */}
                  <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif font-light text-lg text-black/90">Upcoming Reviews</h3>
                      <SparkleIcon className="w-5 h-5 text-orange-600/70" />
                    </div>
                    <div className="space-y-3">
                      {Object.entries(upcomingCards).slice(0, 3).map(([date, cards]: [string, Array<{ id: string }>]) => (
                        <div key={date} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-2xl">
                          <span className="text-black/60 font-light">{date}</span>
                          <span className="font-light text-black/80 text-xs font-mono">{cards.length} cards</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <h3 className="font-serif font-light text-lg text-black/90 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent border-black/10 hover:border-black/20 hover:bg-black/5 rounded-2xl p-4 font-light transition-all duration-300"
                        onClick={() => setViewMode('browse')}
                      >
                        <SearchIcon className="w-4 h-4 mr-3 text-black/60" />
                        Browse All Cards
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent border-black/10 hover:border-black/20 hover:bg-black/5 rounded-2xl p-4 font-light transition-all duration-300"
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        <PlusIcon className="w-4 h-4 mr-3 text-black/60" />
                        Create New Card
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent border-black/10 hover:border-black/20 hover:bg-black/5 rounded-2xl p-4 font-light transition-all duration-300"
                        onClick={() => setViewMode('stats')}
                      >
                        <ChartIcon className="w-4 h-4 mr-3 text-black/60" />
                        View Statistics
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {viewMode === 'review' && currentSessionId && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-light">Review Session</h2>
                <Button
                  variant="outline"
                  onClick={handleEndReview}
                >
                  End Session
                </Button>
              </div>
              <ReviewInterface sessionId={currentSessionId} />
            </motion.div>
          )}

          {viewMode === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif font-light mb-6 text-black/90">Your Cards</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 border border-black/10 rounded-full bg-white focus:outline-none focus:border-black/20 focus:shadow-sm transition-all duration-300 font-light"
                    />
                  </div>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-4 font-light shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Card
                  </Button>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                      <div className="mb-4">
                        {card.topics && (
                          <Badge 
                            variant="outline"
                            className="rounded-full px-3 py-1 text-xs font-light border-black/20"
                            style={{ 
                              borderColor: card.topics.color + '40',
                              color: card.topics.color,
                              backgroundColor: card.topics.color + '10'
                            }}
                          >
                            {card.topics.name}
                          </Badge>
                        )}
                      </div>
                      <p className="font-light text-black/90 mb-3 text-lg leading-relaxed">{card.front}</p>
                      <p className="text-sm text-black/60 mb-4 font-light leading-relaxed">{card.back}</p>
                      <div className="flex items-center justify-between text-xs text-black/50 font-mono">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">{card.difficulty}</span>
                        {card.user_cards?.[0] && (
                          <span>Mastery: {Math.round(card.user_cards[0].mastery_level)}%</span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredCards.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <BookIcon className="w-16 h-16 mx-auto mb-6 text-black/20" />
                  <p className="text-black/60 font-light text-lg mb-6">
                    {searchQuery ? 'No cards found matching your search' : 'No cards yet'}
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg transition-all duration-300"
                    variant="outline"
                  >
                    Create Your First Card
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {viewMode === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2 
                className="text-3xl font-serif font-light mb-8 text-black/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Your Statistics
              </motion.h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="p-8 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <ChartIcon className="w-10 h-10 text-blue-600/70 mb-4" />
                    <p className="text-4xl font-serif font-light mb-2 text-black/90">{studyStats?.total_reviews || 0}</p>
                    <p className="text-sm text-black/60 font-light">Total Reviews</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="p-8 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <SparkleIcon className="w-10 h-10 text-green-600/70 mb-4" />
                    <p className="text-4xl font-serif font-light mb-2 text-black/90">
                      {Math.round((studyStats?.total_study_time_minutes || 0) / 60)}h
                    </p>
                    <p className="text-sm text-black/60 font-light">Study Time</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="p-8 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <RocketIcon className="w-10 h-10 text-orange-600/70 mb-4" />
                    <p className="text-4xl font-serif font-light mb-2 text-black/90">{studyStats?.current_streak_days || 0}</p>
                    <p className="text-sm text-black/60 font-light">Day Streak</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="p-8 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <HeartIcon className="w-10 h-10 text-purple-600/70 mb-4" />
                    <p className="text-4xl font-serif font-light mb-2 text-black/90">{studyStats?.average_accuracy || 0}%</p>
                    <p className="text-sm text-black/60 font-light">Accuracy</p>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="p-8 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                  <h3 className="text-xl font-serif font-light mb-6 text-black/90">Card Distribution</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-black/70 font-light">Mastered ({stats?.mastered || 0})</span>
                        <span className="text-black/60 font-mono text-xs">{stats && stats.totalCards > 0 ? Math.round((stats.mastered / stats.totalCards) * 100) : 0}%</span>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats && stats.totalCards > 0 ? (stats.mastered / stats.totalCards) * 100 : 0}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-black/70 font-light">Learning ({stats?.learning || 0})</span>
                        <span className="text-black/60 font-mono text-xs">{stats && stats.totalCards > 0 ? Math.round((stats.learning / stats.totalCards) * 100) : 0}%</span>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats && stats.totalCards > 0 ? (stats.learning / stats.totalCards) * 100 : 0}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-black/70 font-light">Difficult ({stats?.difficult || 0})</span>
                        <span className="text-black/60 font-mono text-xs">{stats && stats.totalCards > 0 ? Math.round((stats.difficult / stats.totalCards) * 100) : 0}%</span>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats && stats.totalCards > 0 ? (stats.difficult / stats.totalCards) * 100 : 0}%` }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {viewMode === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif font-light mb-3 text-black/90">AI Image Generator</h2>
                <p className="text-lg text-black/60 font-light">Create beautiful visuals for your learning cards using AI</p>
              </motion.div>
              
              <ImageGenerator />
            </motion.div>
          )}

          {viewMode === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif font-light mb-3 text-black/90">AI-Powered Features</h2>
                <p className="text-lg text-black/60 font-light">Configure intelligent learning features powered by advanced AI</p>
              </motion.div>
              
              <div className="max-w-3xl">
                <AIFeaturesSettings 
                  onFeatureClick={(feature) => {
                    console.log('Feature clicked:', feature)
                    // Future: Could open detailed settings for each feature
                  }}
                />
              </div>
            </motion.div>
          )}
          
          {/* Knowledge Graph View */}
          {viewMode === 'knowledge' && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-light text-black/90 mb-2">
                  Your Knowledge Universe
                </h2>
                <p className="text-black/60 font-light">
                  Visualize how your learning connects and grows over time
                </p>
              </div>
              
              <Card className="p-8 bg-white/90 backdrop-blur-sm rounded-3xl border-black/5">
                <KnowledgeGraph
                  nodes={[
                    { id: '1', label: 'Machine Learning', type: 'topic', mastery: 0.7, size: 30 },
                    { id: '2', label: 'Neural Networks', type: 'concept', mastery: 0.5, size: 25 },
                    { id: '3', label: 'Backpropagation', type: 'skill', mastery: 0.3, size: 20 },
                    { id: '4', label: 'Deep Learning', type: 'topic', mastery: 0.6, size: 28 },
                    { id: '5', label: 'Computer Vision', type: 'concept', mastery: 0.4, size: 22 },
                    { id: '6', label: user.email || 'You', type: 'user', size: 35 },
                  ]}
                  edges={[
                    { source: '1', target: '2', strength: 0.9, type: 'prerequisite' },
                    { source: '2', target: '3', strength: 0.8, type: 'builds-on' },
                    { source: '1', target: '4', strength: 0.7, type: 'related' },
                    { source: '4', target: '5', strength: 0.6, type: 'related' },
                    { source: '6', target: '1', strength: 0.7, type: 'similar' },
                    { source: '6', target: '4', strength: 0.5, type: 'similar' },
                  ]}
                  width={1000}
                  height={600}
                  onNodeClick={(node) => {
                    console.log('Node clicked:', node)
                    // Future: Open detailed view of this knowledge area
                  }}
                />
              </Card>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
                  <h3 className="font-semibold mb-2">Knowledge Depth</h3>
                  <p className="text-2xl font-bold text-purple-600">Level 7</p>
                  <p className="text-sm text-gray-600 mt-1">Advanced Learner</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                  <h3 className="font-semibold mb-2">Connections Made</h3>
                  <p className="text-2xl font-bold text-blue-600">142</p>
                  <p className="text-sm text-gray-600 mt-1">Cross-domain links</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <h3 className="font-semibold mb-2">Growth Rate</h3>
                  <p className="text-2xl font-bold text-green-600">+23%</p>
                  <p className="text-sm text-gray-600 mt-1">This month</p>
                </Card>
              </div>
            </motion.div>
          )}
          
          {/* Global Learning Network View */}
          {viewMode === 'network' && (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-light text-black/90 mb-2">
                  Global Learning Community
                </h2>
                <p className="text-black/60 font-light">
                  Connect with learners worldwide in real-time
                </p>
              </div>
              
              <GlobalLearningNetwork />
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <Card className="p-6 bg-white rounded-2xl">
                  <h3 className="font-semibold mb-4">Learning Together</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Join collaborative learning sessions with peers who share your interests
                    and complement your learning style.
                  </p>
                  <Button className="w-full">
                    Find Learning Partner
                  </Button>
                </Card>
                
                <Card className="p-6 bg-white rounded-2xl">
                  <h3 className="font-semibold mb-4">Knowledge Exchange</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Share your expertise and learn from others through peer-to-peer
                    knowledge markets.
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse Knowledge Market
                  </Button>
                </Card>
              </div>
            </motion.div>
          )}
          
          {/* Viral Impact View */}
          {viewMode === 'viral' && (
            <motion.div
              key="viral"
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-light text-black/90 mb-2">
                  Your Learning Impact
                </h2>
                <p className="text-black/60 font-light">
                  Share achievements, join challenges, and inspire others
                </p>
              </div>
              
              <ViralMechanisms userId={user.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Card Dialog */}
      <CreateCardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCardCreated={loadDashboardData}
      />
    </div>
  )
}