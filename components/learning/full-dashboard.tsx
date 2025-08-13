'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparkleIcon, 
  LightbulbIcon, 
  ChartIcon, 
  BookIcon, 
  RocketIcon, 
  BeakerIcon,
  HeartIcon,
  PlusIcon,
  PlayIcon,
  ChevronRightIcon,
  SearchIcon,
  LogOutIcon,
  RefreshIcon,
  ClockIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/server/actions/auth'
import Link from 'next/link'
import CreateCardDialog from './create-card-dialog'
import ImmersiveReviewInterface from './immersive-review-interface'
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
// import { generateLearningInsights } from '@/server/actions/ai' // Temporarily disabled due to rate limiting
// Meta-learning imports for future use
// import { analyzeMetaLearningPatterns, evolveSystemIntelligence } from '@/server/actions/meta-learning'
// import { generateTutorIntervention } from '@/server/actions/ai-tutor'
import dynamic from 'next/dynamic'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import SuggestedPrompts from './suggested-prompts'
import ProgressIndicator from './progress-indicator'

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

type ViewMode = 'overview' | 'review' | 'browse' | 'stats' | 'settings' | 'knowledge' | 'network' | 'viral'

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
      ] = await Promise.allSettled([
        getUserCards(),
        getDueCards(10),
        getCardStats(),
        getStudyStats(),
        getUpcomingCards(),
        getUserCompletionState()
      ])

      // Handle results from Promise.allSettled
      const userCardsResult = userCards.status === 'fulfilled' ? userCards.value : []
      const dueCardsResult = dueCardsData.status === 'fulfilled' ? dueCardsData.value : []
      const cardStatsResult = cardStats.status === 'fulfilled' ? cardStats.value : null
      const studyStatsResult = studyStatsData.status === 'fulfilled' ? studyStatsData.value : null
      const upcomingResult = upcomingData.status === 'fulfilled' ? upcomingData.value : {}
      const completionResult = userCompletionState.status === 'fulfilled' ? userCompletionState.value : null

      setCards(userCardsResult.map(card => ({
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
      setDueCards(dueCardsResult.map(item => ({
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
      setStats(cardStatsResult)
      setStudyStats(studyStatsResult ? {
        total_reviews: studyStatsResult.total_reviews || 0,
        average_accuracy: studyStatsResult.average_accuracy || 0,
        total_study_time_minutes: studyStatsResult.total_study_time_minutes || 0,
        current_streak_days: studyStatsResult.current_streak_days || 0
      } : null)
      const formattedUpcoming: Record<string, Array<{ id: string }>> = {}
      if (upcomingResult) {
        Object.entries(upcomingResult).forEach(([date, items]) => {
          if (Array.isArray(items)) {
            formattedUpcoming[date] = items.map(item => ({ id: item.cards?.id || item.id }))
          }
        })
      }
      setUpcomingCards(formattedUpcoming)
      setCompletionState(completionResult)

      // Skip AI insights for now to avoid rate limiting issues
      // In production, this should use caching or be loaded on-demand
      setAiInsights([
        {
          type: 'info',
          title: 'AI Insights',
          description: cardStats && cardStats.totalCards > 0 
            ? `You're making progress! ${cardStats.mastered} cards mastered out of ${cardStats.totalCards}.`
            : 'Start creating cards to track your learning progress.',
          action: cardStats && cardStats.totalCards > 0 ? undefined : 'Create your first card'
        }
      ])
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
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Layout */}
            <div className="flex items-center flex-1 md:hidden">
              <Link href="/" className="group">
                <span className="text-2xl font-serif font-light tracking-tight">Neuros</span>
              </Link>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center flex-1">
              <Link href="/" className="group mr-12">
                <span className="text-[32px] font-serif font-light tracking-tight leading-none hover:scale-[1.02] transition-transform">Neuros</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'overview' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Overview
                  {viewMode === 'overview' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
                <button
                  onClick={() => setViewMode('review')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'review' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Review
                  {viewMode === 'review' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
                <button
                  onClick={() => setViewMode('browse')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'browse' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Library
                  {viewMode === 'browse' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
                <button
                  onClick={() => setViewMode('stats')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'stats' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Analytics
                  {viewMode === 'stats' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
                <button
                  onClick={() => setViewMode('settings')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'settings' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Settings
                  {viewMode === 'settings' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Progress Indicator for users with few cards */}
              {stats && stats.totalCards > 0 && stats.totalCards < 10 && (
                <ProgressIndicator 
                  currentCards={stats.totalCards}
                  targetCards={10}
                  variant="minimal"
                />
              )}
              
              {studyStats && studyStats.current_streak_days > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5">
                  <HeartIcon className="h-4 w-4 text-black/60" />
                  <span className="hidden sm:inline text-sm text-black/60">
                    {studyStats.current_streak_days} day{studyStats.current_streak_days !== 1 ? 's' : ''}
                  </span>
                  <span className="sm:hidden text-sm text-black/60">
                    {studyStats.current_streak_days}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center justify-center h-9 w-9 bg-black text-white rounded-full hover:bg-black/80 transition-colors duration-200"
                title="Create Cards"
              >
                <PlusIcon className="w-4 h-4" />
              </button>

              <button
                onClick={async () => await signOut()}
                className="hidden md:block p-2 hover:bg-black/5 transition-colors duration-200"
                title="Sign out"
              >
                <LogOutIcon className="w-4 h-4 text-black/60 hover:text-black stroke-[1.5]" />
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
              {/* Greeting with Editorial Style */}
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-12 bg-black/30" />
                  <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <h1 className="text-[clamp(3rem,5vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-4 text-black">
                  {formatGreeting()}
                </h1>
                <p className="text-xl sm:text-2xl text-black/60 font-light leading-relaxed max-w-3xl">
                  {formatSmartMessage()}
                </p>
              </motion.div>

              {/* Stats Cards - Hide for new users */}
              {completionState?.type !== 'new_user' && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="p-6 bg-white rounded-3xl border border-black/5 hover:shadow-lg transition-all duration-300">
                    <div className="mb-4">
                      <BookIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                    </div>
                    <p className="text-3xl font-serif font-light text-black mb-1">{stats?.totalCards || 0}</p>
                    <p className="text-sm text-black/50">total cards</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="p-6 bg-white rounded-3xl border border-black/5 hover:shadow-lg transition-all duration-300">
                    <div className="mb-4">
                      <SparkleIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                    </div>
                    <p className="text-3xl font-serif font-light text-black mb-1">{stats?.mastered || 0}</p>
                    <p className="text-sm text-black/50">mastered</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="p-6 bg-white rounded-3xl border border-black/5 hover:shadow-lg transition-all duration-300">
                    <div className="mb-4">
                      <ClockIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                    </div>
                    <p className="text-3xl font-serif font-light text-black mb-1">{stats?.dueCards || 0}</p>
                    <p className="text-sm text-black/50">due today</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="p-6 bg-white rounded-3xl border border-black/5 hover:shadow-lg transition-all duration-300">
                    <div className="mb-4">
                      <ChartIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                    </div>
                    <p className="text-3xl font-serif font-light text-black mb-1">{studyStats?.average_accuracy || 0}%</p>
                    <p className="text-sm text-black/50">accuracy</p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="p-6 bg-white rounded-3xl border border-black/5 hover:shadow-lg transition-all duration-300">
                    <div className="mb-4">
                      <HeartIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                    </div>
                    <p className="text-3xl font-serif font-light text-black mb-1">{studyStats?.current_streak_days || 0}</p>
                    <p className="text-sm text-black/50">day streak</p>
                  </Card>
                </motion.div>
              </div>
              )}

              {/* New User Onboarding Experience */}
              {completionState?.type === 'new_user' && stats?.totalCards === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-12"
                >
                  <div className="mb-8">
                    <ProgressIndicator 
                      currentCards={stats?.totalCards || 0}
                      targetCards={3}
                      variant="detailed"
                    />
                  </div>
                  <SuggestedPrompts 
                    onSelectPrompt={(prompt) => {
                      setIsCreateDialogOpen(true)
                      // Store the prompt to pass to dialog
                      if (typeof window !== 'undefined') {
                        window.localStorage.setItem('suggested-prompt', prompt)
                      }
                    }}
                    variant="grid"
                  />
                </motion.div>
              )}

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Main Action Area */}
                <div className="lg:col-span-2">
                  {/* Start Review Card */}
                  {stats && stats.dueCards > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Card className="relative bg-white rounded-3xl border border-black/5 p-8 mb-8 hover:shadow-xl transition-all duration-500 overflow-hidden group">
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.03) 0%, transparent 50%)'
                          }}
                        />
                        <div className="relative flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-serif font-light mb-3 text-black">Ready to review</h3>
                            <p className="text-black/60 mb-6 max-w-md">
                              {stats.dueCards} cards are due for review. 
                              Estimated time: {Math.ceil(stats.dueCards * 0.5)} minutes
                            </p>
                            <Button
                              onClick={handleStartReview}
                              className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-3 text-sm transition-all duration-200"
                            >
                              <PlayIcon className="w-4 h-4 mr-2" />
                              Start Review Session
                            </Button>
                          </div>
                          <LightbulbIcon className="w-12 h-12 text-black/20 stroke-[1.5]" />
                        </div>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Card className="relative bg-white rounded-3xl border border-black/5 p-8 mb-8 hover:shadow-xl transition-all duration-500 overflow-hidden group">
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: completionState?.type === 'completed_today' 
                              ? 'radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(52, 211, 153, 0.03) 0%, transparent 50%)'
                              : 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.03) 0%, transparent 50%)'
                          }}
                        />
                        <div className="relative flex items-start justify-between">
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
                                    className="bg-black text-white hover:bg-black/80 focus:bg-black/80 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg focus:shadow-lg focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Create First Card
                                  </Button>
                                  <Button
                                    onClick={() => setViewMode('settings')}
                                    className="border-black/20 text-black hover:bg-black hover:text-white hover:border-black focus:bg-black focus:text-white focus:border-black rounded-full px-8 py-3 font-light focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
                                    variant="outline"
                                  >
                                    <BeakerIcon className="w-4 h-4 mr-2" />
                                    Learn About AI Features
                                  </Button>
                                </div>
                              </>
                            ) : completionState?.type === 'completed_today' ? (
                              <>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <SparkleIcon className="w-5 h-5 text-green-600" />
                                  </div>
                                  <h3 className="text-2xl font-serif font-light text-black/90">Well done</h3>
                                </div>
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
                                    className="bg-black text-white hover:bg-black/80 focus:bg-black/80 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg focus:shadow-lg focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add New Cards
                                  </Button>
                                  <Button
                                    onClick={() => setViewMode('stats')}
                                    className="border-black/20 text-black hover:bg-black hover:text-white hover:border-black focus:bg-black focus:text-white focus:border-black rounded-full px-8 py-3 font-light focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
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
                                  className="border-black/20 text-black hover:bg-black hover:text-white hover:border-black focus:bg-black focus:text-white focus:border-black rounded-full px-8 py-3 font-light focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
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
                                  className="border-black/20 text-black hover:bg-black hover:text-white hover:border-black focus:bg-black focus:text-white focus:border-black rounded-full px-8 py-3 font-light focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
                                  variant="outline"
                                >
                                  <PlusIcon className="w-4 h-4 mr-2" />
                                  Add New Cards
                                </Button>
                              </>
                            )}
                          </div>
                          {completionState?.type === 'new_user' ? (
                            <SparkleIcon className="w-12 h-12 text-black/20 stroke-[1.5]" />
                          ) : completionState?.type === 'completed_today' ? (
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                              <HeartIcon className="w-6 h-6 text-green-600 stroke-[1.5]" />
                            </div>
                          ) : completionState?.type === 'no_cards_due' ? (
                            <LightbulbIcon className="w-12 h-12 text-black/20 stroke-[1.5]" />
                          ) : (
                            <RocketIcon className="w-12 h-12 text-black/20 stroke-[1.5]" />
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Enhanced Due Cards Preview - Hide for new users with no cards */}
                  {dueCards.length > 0 && completionState?.type !== 'new_user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-serif font-light text-black">Due Today</h3>
                          <p className="text-sm text-black/50 font-light mt-1">Your spaced repetition schedule</p>
                        </div>
                        <span className="text-xs font-mono text-black/40 tracking-[0.2em] uppercase">
                          {dueCards.length} {dueCards.length === 1 ? 'card' : 'cards'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {dueCards.slice(0, 5).map((card, index) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                          >
                            <Card className="relative bg-white rounded-2xl border border-black/5 p-6 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-500 cursor-pointer group overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-60" />
                              <div className="flex items-center justify-between">
                                <div className="flex-1 pl-3">
                                  <p className="font-light text-black text-lg mb-3 leading-relaxed">
                                    {card.cards.front}
                                  </p>
                                  <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                          style={{ width: `${card.mastery_level}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-black/40 font-mono">{Math.round(card.mastery_level)}%</span>
                                    </div>
                                    {card.cards.topics && (
                                      <span className="text-xs px-2 py-1 bg-gray-50 rounded-full text-black/60">
                                        {card.cards.topics.name}
                                      </span>
                                    )}
                                    <span className="text-xs text-black/40">
                                      {card.total_reviews} reviews
                                    </span>
                                  </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                  <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      {dueCards.length > 5 && (
                        <motion.p 
                          className="text-center mt-6 text-sm text-black/40 font-light"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3 }}
                        >
                          +{dueCards.length - 5} more cards waiting
                        </motion.p>
                      )}
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
                  {/* AI Insights / Onboarding - Editorial Style with Color */}
                  <Card className="relative bg-white rounded-3xl border border-black/5 p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 overflow-hidden">
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full"
                      style={{
                        background: completionState?.type === 'completed_today'
                          ? 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="relative flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif font-light text-black">
                        {completionState?.type === 'new_user' ? 'Getting Started' : 
                         completionState?.type === 'completed_today' ? 'Today\'s Achievement' :
                         'AI Insights'}
                      </h3>
                      <motion.div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: completionState?.type === 'completed_today'
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                        }}
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <LightbulbIcon className={`w-5 h-5 stroke-[1.5] ${
                          completionState?.type === 'completed_today' ? 'text-green-600' : 'text-purple-600'
                        }`} />
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      {completionState?.type === 'new_user' ? (
                        <motion.div 
                          className="p-4 bg-black/5 rounded-2xl border border-black/10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2.5 h-2.5 rounded-full mt-2 bg-black" />
                            <div className="flex-1">
                              <p className="text-sm font-light text-black/90 mb-2">
                                Welcome to Neuros!
                              </p>
                              <p className="text-xs text-black/60 mb-3 font-light leading-relaxed">
                                Create your first learning card to unlock AI-powered insights, spaced repetition, and personalized learning analytics.
                              </p>
                              <button 
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="text-xs font-light text-black/70 hover:text-black hover:underline transition-colors"
                              >
                                Create your first card →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : completionState?.type === 'completed_today' ? (
                        <motion.div 
                          className="p-4 bg-black/5 rounded-2xl border border-black/10"
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
                                className="text-xs font-light text-black/70 hover:text-black hover:underline transition-colors"
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
                            className="p-4 bg-gray-50 rounded-2xl"
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
                                    className="text-xs font-light text-black/70 hover:text-black hover:underline transition-colors"
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

                  {/* Upcoming Reviews - Hide for new users */}
                  {completionState?.type !== 'new_user' && (
                  <Card className="relative bg-white rounded-3xl border border-black/5 p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{ transformOrigin: 'left' }}
                    />
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-serif font-light text-black">Upcoming</h3>
                      <motion.div 
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center"
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <SparkleIcon className="w-5 h-5 text-orange-600 stroke-[1.5]" />
                      </motion.div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(upcomingCards).slice(0, 3).map(([date, cards]: [string, Array<{ id: string }>], index) => (
                        <motion.div 
                          key={date} 
                          className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/50 transition-all duration-300 cursor-pointer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          whileHover={{ x: 4 }}
                        >
                          <div>
                            <span className="text-base text-black font-light">{date}</span>
                            <span className="block text-xs text-black/40 mt-1">Scheduled review</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.span 
                              className="text-sm font-mono text-black/60"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                delay: 0.7 + index * 0.1
                              }}
                            >
                              {cards.length}
                            </motion.span>
                            <motion.div 
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white flex items-center justify-center transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <ChevronRightIcon className="w-4 h-4 stroke-[1.5]" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {viewMode === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentSessionId ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-light">Review Session</h2>
                    <Button
                      variant="outline"
                      onClick={handleEndReview}
                    >
                      End Session
                    </Button>
                  </div>
                  <ImmersiveReviewInterface sessionId={currentSessionId} />
                </>
              ) : (
                <div className="max-w-2xl mx-auto text-center py-20">
                  <BookIcon className="w-16 h-16 mx-auto mb-6 text-black/20" />
                  <h2 className="text-2xl font-serif mb-4">Ready to Review?</h2>
                  <p className="text-black/60 mb-8">You have {dueCards.length} cards ready for review.</p>
                  {dueCards.length > 0 ? (
                    <Button
                      onClick={handleStartReview}
                      className="bg-black text-white hover:bg-black/90"
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Start Review Session
                    </Button>
                  ) : (
                    <p className="text-black/40">No cards due for review. Check back later!</p>
                  )}
                </div>
              )}
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
                      className="w-full pl-12 pr-6 py-4 border border-black/10 rounded-full bg-white focus:outline-none focus:border-black/30 focus:ring-2 focus:ring-black/20 focus:ring-offset-1 focus:shadow-sm transition-all duration-300 font-light"
                      aria-label="Search your learning cards"
                    />
                  </div>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-black text-white hover:bg-black/80 focus:bg-black/80 rounded-full px-8 py-4 font-light shadow-sm hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
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
                    className="bg-black text-white hover:bg-black/80 focus:bg-black/80 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg focus:shadow-lg focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
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
                          className="h-full bg-green-500 rounded-full"
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
                          className="h-full bg-orange-400 rounded-full"
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
                          className="h-full bg-red-400 rounded-full"
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