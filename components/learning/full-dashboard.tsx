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
  GlobeIcon,
  HeartIcon,
  ShieldIcon,
  LeafIcon,
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
  getUpcomingCards 
} from '@/server/actions/cards'
import { 
  startStudySession, 
  endStudySession,
  getStudyStats 
} from '@/server/actions/reviews'
import { generateLearningInsights } from '@/server/actions/ai'

interface User {
  id: string
  email?: string
}

interface FullLearningDashboardProps {
  user: User
}

type ViewMode = 'overview' | 'review' | 'browse' | 'stats' | 'images' | 'settings'

export default function FullLearningDashboard({ user }: FullLearningDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [cards, setCards] = useState<any[]>([])
  const [dueCards, setDueCards] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [studyStats, setStudyStats] = useState<any>(null)
  const [upcomingCards, setUpcomingCards] = useState<any>({})
  const [aiInsights, setAiInsights] = useState<any[]>([])
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
        upcomingData
      ] = await Promise.all([
        getUserCards(),
        getDueCards(10),
        getCardStats(),
        getStudyStats(),
        getUpcomingCards()
      ])

      setCards(userCards as any)
      setDueCards(dueCardsData as any)
      setStats(cardStats)
      setStudyStats(studyStatsData)
      setUpcomingCards(upcomingData as any)

      // Generate AI insights if we have stats or show fallback for new users
      if (studyStatsData && cardStats && cardStats.totalCards > 0) {
        try {
          const insights = await generateLearningInsights({
            totalCards: cardStats.totalCards,
            mastered: cardStats.mastered,
            struggling: cardStats.difficult,
            averageAccuracy: studyStatsData.average_accuracy,
            studyTimeMinutes: studyStatsData.total_study_time_minutes
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
    if (hour < 12) return `Good morning, ${name}`
    if (hour < 18) return `Good afternoon, ${name}`
    return `Good evening, ${name}`
  }

  const filteredCards = cards.filter(card => 
    searchQuery ? 
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5] flex items-center justify-center">
        <div className="text-center">
          <BrainIcon className="w-12 h-12 mx-auto mb-4 text-black/40 animate-pulse stroke-[1.5]" />
          <p className="text-black/60 font-light">Loading your learning dashboard...</p>
        </div>
      </div>
    )
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
              <Link href="/" className="flex items-center space-x-3 group">
                <SparkleIcon className="w-8 h-8 text-black/70 stroke-[1.5] group-hover:text-black transition-colors" />
                <span className="text-xl font-serif font-light text-black/90 group-hover:text-black transition-colors">Neuros</span>
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
                  <BrainIcon className="w-4 h-4 stroke-[1.5]" />
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
                  <BookIcon className="w-4 h-4 stroke-[1.5]" />
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
                  <ChartIcon className="w-4 h-4 stroke-[1.5]" />
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
                  <PaletteIcon className="w-4 h-4 stroke-[1.5]" />
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
                  <BeakerIcon className="w-4 h-4 stroke-[1.5]" />
                  AI Settings
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {studyStats?.current_streak_days > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-black/10">
                  <RocketIcon className="w-4 h-4 text-black/70 stroke-[1.5]" />
                  <span className="text-sm font-light text-black/70">
                    {studyStats.current_streak_days} day streak
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

              <form action={signOut}>
                <button
                  type="submit"
                  className="p-2.5 hover:bg-black/5 rounded-full transition-all duration-300 group"
                  title="Sign out"
                >
                  <LogOutIcon className="w-4 h-4 text-black/60 group-hover:text-black/80 stroke-[1.5]" />
                </button>
              </form>
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
                  You have {stats?.dueCards || 0} cards ready for review
                </p>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <BookIcon className="w-6 h-6 text-black/70 stroke-[1.5]" />
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
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <RocketIcon className="w-6 h-6 text-black/70 stroke-[1.5]" />
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
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <SparkleIcon className="w-6 h-6 text-black/70 stroke-[1.5]" />
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
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <ChartIcon className="w-6 h-6 text-black/70 stroke-[1.5]" />
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
                  <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <HeartIcon className="w-6 h-6 text-black/70 stroke-[1.5]" />
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
                  {stats?.dueCards > 0 ? (
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
                            {stats?.totalCards === 0 ? (
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
                            ) : (
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
                          {stats?.totalCards === 0 ? (
                            <SparkleIcon className="w-16 h-16 text-black/30 stroke-[1.5]" />
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
                        {dueCards.slice(0, 5).map((card: any, index) => (
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
                  {(aiInsights.length > 0 || stats?.totalCards === 0) && (
                    <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <BrainIcon className="w-6 h-6 mr-3 text-purple-600/70" />
                        <h3 className="font-serif font-light text-lg text-black/90">
                          {stats?.totalCards === 0 ? 'Getting Started' : 'AI Insights'}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {stats?.totalCards === 0 ? (
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
                  )}

                  {/* Upcoming Reviews */}
                  <Card className="p-6 bg-white rounded-3xl border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif font-light text-lg text-black/90">Upcoming Reviews</h3>
                      <SparkleIcon className="w-5 h-5 text-orange-600/70" />
                    </div>
                    <div className="space-y-3">
                      {Object.entries(upcomingCards).slice(0, 3).map(([date, cards]: [string, any]) => (
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
                        <span className="text-black/60 font-mono text-xs">{Math.round((stats?.mastered / stats?.totalCards) * 100) || 0}%</span>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats?.mastered / stats?.totalCards) * 100 || 0}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-black/70 font-light">Learning ({stats?.learning || 0})</span>
                        <span className="text-black/60 font-mono text-xs">{Math.round((stats?.learning / stats?.totalCards) * 100) || 0}%</span>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats?.learning / stats?.totalCards) * 100 || 0}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-black/70 font-light">Difficult ({stats?.difficult || 0})</span>
                        <span className="text-black/60 font-mono text-xs">{Math.round((stats?.difficult / stats?.totalCards) * 100) || 0}%</span>
                      </div>
                      <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats?.difficult / stats?.totalCards) * 100 || 0}%` }}
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