'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { 
  SparkleIcon, 
  ChartIcon, 
  BookIcon, 
  HeartIcon,
  PlusIcon,
  PlayIcon,
  LogOutIcon,
  RefreshIcon,
  ClockIcon,
  RocketIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/server/actions/auth'
import Link from 'next/link'
import CreateCardDialog from './create-card-dialog'
import { 
  getCardStats,
  getUserCompletionState 
} from '@/server/actions/cards'
import { 
  getStudyStats 
} from '@/server/actions/reviews'
// Meta-learning imports for future use
// import { analyzeMetaLearningPatterns, evolveSystemIntelligence } from '@/server/actions/meta-learning'
// import { generateTutorIntervention } from '@/server/actions/ai-tutor'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import DiscoveryDashboard from './discovery-dashboard'

interface User {
  id: string
  email?: string
}

interface FullLearningDashboardProps {
  user: User
  initialViewMode?: ViewMode
}

type ViewMode = 'overview' | 'discover' | 'browse' | 'stats' | 'settings' | 'knowledge' | 'network' | 'viral'

export default function FullLearningDashboard({ user, initialViewMode = 'overview' }: FullLearningDashboardProps) {
  const pathname = usePathname()
  
  // Get view mode from route path or use initial view mode
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Extract view mode from pathname
    if (pathname.includes('/dashboard/browse')) return 'browse'
    if (pathname.includes('/dashboard/discover')) return 'discover' 
    if (pathname.includes('/dashboard/stats')) return 'stats'
    if (pathname.includes('/dashboard/settings')) return 'settings'
    return initialViewMode
  })
  
  // Handle client-side navigation
  const handleNavigation = (mode: ViewMode) => {
    setViewMode(mode)
    // Update URL without causing a reload
    const newPath = mode === 'overview' ? '/dashboard' : `/dashboard/${mode}`
    window.history.pushState({}, '', newPath)
  }
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [stats, setStats] = useState<{ totalCards: number; dueCards: number; mastered: number; learning: number; difficult: number } | null>(null)
  const [studyStats, setStudyStats] = useState<{ total_reviews: number; average_accuracy: number; total_study_time_minutes: number; current_streak_days: number } | null>(null)
  const [completionState, setCompletionState] = useState<{ type: string; totalCards: number; dueCards: number; nextReviewTime: string | null; completedToday: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // State for tracking data loading (keeping for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const loadingRef = useRef(false)

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      let newViewMode: ViewMode = 'overview'
      if (path.includes('/dashboard/browse')) newViewMode = 'browse'
      else if (path.includes('/dashboard/discover')) newViewMode = 'discover' 
      else if (path.includes('/dashboard/stats')) newViewMode = 'stats'
      else if (path.includes('/dashboard/settings')) newViewMode = 'settings'
      
      if (newViewMode !== viewMode) {
        setViewMode(newViewMode)
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [viewMode])

  const loadDashboardData = useCallback(async () => {
    // Prevent multiple simultaneous loads using ref
    if (loadingRef.current) return
    loadingRef.current = true
    
    setIsLoadingData(true)
    // Don't set isLoading to true if we already have data (for refreshes)
    if (!stats) {
      setIsLoading(true)
    }
    setError(null)
    try {
      const [
        cardStats,
        studyStatsData,
        userCompletionState
      ] = await Promise.allSettled([
        getCardStats(),
        getStudyStats(),
        getUserCompletionState()
      ])

      // Handle results from Promise.allSettled
      const cardStatsResult = cardStats.status === 'fulfilled' ? cardStats.value : null
      const studyStatsResult = studyStatsData.status === 'fulfilled' ? studyStatsData.value : null
      const completionResult = userCompletionState.status === 'fulfilled' ? userCompletionState.value : null

      setStats(cardStatsResult)
      setStudyStats(studyStatsResult ? {
        total_reviews: studyStatsResult.total_reviews || 0,
        average_accuracy: studyStatsResult.average_accuracy || 0,
        total_study_time_minutes: studyStatsResult.total_study_time_minutes || 0,
        current_streak_days: studyStatsResult.current_streak_days || 0
      } : null)
      setCompletionState(completionResult)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
      setIsLoadingData(false)
      loadingRef.current = false
    }
  }, []) // Remove dependency on stats to prevent infinite loops

  useEffect(() => {
    // Load data immediately on mount
    loadDashboardData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency to prevent infinite loop

  // Add scroll listener for header animation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      if (scrolled !== hasScrolled) {
        setHasScrolled(scrolled)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolled])

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
    // Show optimistic message immediately, update when data loads
    if (!completionState && !stats) {
      return "Welcome back! Let's continue your learning journey"
    }
    
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
          <h2 className="text-xl font-serif font-normal mb-3 text-black/90">Something went wrong</h2>
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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        hasScrolled 
          ? 'bg-white border-b border-black/10 backdrop-blur-lg' 
          : 'bg-[#FAFAF9] border-b border-transparent'
      }`}>
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
                  onClick={() => handleNavigation('overview')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'overview' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Overview
                  {viewMode === 'overview' && hasScrolled && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => handleNavigation('discover')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'discover' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Discover
                  {viewMode === 'discover' && hasScrolled && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => handleNavigation('browse')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'browse' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Library
                  {viewMode === 'browse' && hasScrolled && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => handleNavigation('stats')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'stats' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Analytics
                  {viewMode === 'stats' && hasScrolled && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => handleNavigation('settings')}
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'settings' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Settings
                  {viewMode === 'settings' && hasScrolled && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-opacity duration-300" />
                  )}
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              {studyStats && studyStats.current_streak_days > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5">
                  <HeartIcon className="h-4 w-4 text-black/60" />
                  <span className="text-sm text-black/60">
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
        {viewMode === 'overview' && (
          <div>
            {/* Greeting - Simple, no animation */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-black/30" />
                <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <h1 className="text-[clamp(3rem,5vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-4 text-black/90">
                {formatGreeting()}
              </h1>
              <p className="text-xl sm:text-2xl text-black/60 font-light leading-[1.6] max-w-3xl">
                {formatSmartMessage()}
              </p>
            </div>

              {/* Stats Cards - Simple, no animations */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <Card className="p-6 bg-white rounded-3xl border border-black/5">
                  <div className="mb-4">
                    <BookIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                  </div>
                  <p className="text-3xl font-serif font-light text-black mb-1">
                    {stats?.totalCards ?? '0'}
                  </p>
                  <p className="text-sm text-black/50">total cards</p>
                </Card>

                <Card className="p-6 bg-white rounded-3xl border border-black/5">
                  <div className="mb-4">
                    <SparkleIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                  </div>
                  <p className="text-3xl font-serif font-light text-black mb-1">
                    {stats?.mastered ?? '0'}
                  </p>
                  <p className="text-sm text-black/50">mastered</p>
                </Card>

                <Card className="p-6 bg-white rounded-3xl border border-black/5">
                  <div className="mb-4">
                    <ClockIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                  </div>
                  <p className="text-3xl font-serif font-light text-black mb-1">
                    {stats?.dueCards ?? '0'}
                  </p>
                  <p className="text-sm text-black/50">due today</p>
                </Card>

                <Card className="p-6 bg-white rounded-3xl border border-black/5">
                  <div className="mb-4">
                    <ChartIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                  </div>
                  <p className="text-3xl font-serif font-light text-black mb-1">
                    {studyStats?.average_accuracy ?? '0'}%
                  </p>
                  <p className="text-sm text-black/50">accuracy</p>
                </Card>

                <Card className="p-6 bg-white rounded-3xl border border-black/5">
                  <div className="mb-4">
                    <HeartIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                  </div>
                  <p className="text-3xl font-serif font-light text-black mb-1">
                    {studyStats?.current_streak_days ?? '0'}
                  </p>
                  <p className="text-sm text-black/50">day streak</p>
                </Card>
              </div>

              {/* Quick Actions Section - No animations */}
              <div className="mb-12">
                <h2 className="text-xl font-serif font-normal text-black/80 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Start Review */}
                  <Card className="group cursor-pointer hover:shadow-lg bg-white border border-black/5 rounded-3xl overflow-hidden"
                    onClick={() => window.location.href = '/review'}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <PlayIcon className="w-8 h-8 text-black/60" />
                        <Badge className="bg-black/5 text-black/60 text-xs">
                          {stats?.dueCards || 0} cards
                        </Badge>
                      </div>
                      <h3 className="text-xl font-serif font-normal text-black/90 mb-2">Start Review Session</h3>
                      <p className="text-sm text-black/60 leading-relaxed">Review your due cards with spaced repetition</p>
                    </div>
                  </Card>

                  {/* Create New Cards */}
                  <Card className="group cursor-pointer hover:shadow-lg bg-blue-50 border border-black/5 rounded-3xl overflow-hidden"
                    onClick={() => setIsCreateDialogOpen(true)}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <PlusIcon className="w-8 h-8 text-black/60 group-hover:text-black transition-colors" />
                        <Badge className="bg-blue-100/50 text-blue-700 text-xs">AI-Powered</Badge>
                      </div>
                      <h3 className="text-xl font-serif font-normal text-black/90 mb-2">Create Cards</h3>
                      <p className="text-sm text-black/60 leading-relaxed">Generate cards from text or manually create</p>
                    </div>
                  </Card>

                  {/* Browse Library */}
                  <Card className="group cursor-pointer hover:shadow-lg bg-green-50 border border-black/5 rounded-3xl overflow-hidden"
                    onClick={() => handleNavigation('browse')}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <BookIcon className="w-8 h-8 text-black/60 group-hover:text-black transition-colors" />
                        <Badge className="bg-green-100/50 text-green-700 text-xs">
                          {stats?.totalCards || 0} total
                        </Badge>
                      </div>
                      <h3 className="text-xl font-serif font-normal text-black/90 mb-2">Browse Library</h3>
                      <p className="text-sm text-black/60 leading-relaxed">View and manage all your cards</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Learning Insights Section */}
              <div className="mb-12">
                <h2 className="text-xl font-serif font-normal text-black/80 mb-6">Your Learning Journey</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Progress Overview */}
                  <Card className="p-6 bg-white rounded-3xl border border-black/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-black/90">Weekly Progress</h3>
                      <ChartIcon className="w-5 h-5 text-black/40" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-black/60">Cards Reviewed</span>
                          <span className="text-black font-medium">{studyStats?.total_reviews || 0}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full"
                            style={{ width: `${Math.min((studyStats?.total_reviews || 0) / 50 * 100, 100)}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-black/60">Mastery Level</span>
                          <span className="text-black font-medium">
                            {stats?.totalCards ? Math.round((stats.mastered / stats.totalCards) * 100) : 0}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full"
                            style={{ width: `${stats?.totalCards ? (stats.mastered / stats.totalCards) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-black/60">Study Time</span>
                          <span className="text-black font-medium">
                            {Math.round((studyStats?.total_study_time_minutes || 0) / 60)} hours
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min((studyStats?.total_study_time_minutes || 0) / 60 / 10 * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Achievement Highlights */}
                  <Card className="p-6 bg-white rounded-3xl border border-black/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-black/90">Recent Achievements</h3>
                      <SparkleIcon className="w-5 h-5 text-black/40" />
                    </div>
                    <div className="space-y-3">
                      {studyStats?.current_streak_days && studyStats.current_streak_days >= 3 && (
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <HeartIcon className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black/90">Streak Master</p>
                            <p className="text-xs text-black/60 leading-relaxed">{studyStats.current_streak_days} day learning streak!</p>
                          </div>
                        </div>
                      )}
                      {stats?.mastered && stats.mastered >= 5 && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <SparkleIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black/90">Knowledge Expert</p>
                            <p className="text-xs text-black/60 leading-relaxed">{stats.mastered} cards mastered</p>
                          </div>
                        </div>
                      )}
                      {studyStats?.average_accuracy && studyStats.average_accuracy >= 80 && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ChartIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black/90">Accuracy Champion</p>
                            <p className="text-xs text-black/60 leading-relaxed">{studyStats.average_accuracy}% accuracy rate</p>
                          </div>
                        </div>
                      )}
                      {(!studyStats?.current_streak_days || studyStats.current_streak_days < 3) && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <RocketIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black/90">Keep Going!</p>
                            <p className="text-xs text-black/60 leading-relaxed">Build your streak to unlock achievements</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Upcoming Reviews Preview */}
              {stats && stats.totalCards > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-serif font-normal text-black/80 mb-6">Upcoming Reviews</h2>
                  <Card className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <div className="grid grid-cols-7 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                        const date = new Date()
                        date.setDate(date.getDate() + dayOffset)
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                        const isToday = dayOffset === 0
                        
                        return (
                          <div key={dayOffset} className={`text-center p-3 rounded-xl ${
                            isToday ? 'bg-black text-white' : 'bg-white'
                          }`}>
                            <p className={`text-xs font-medium mb-1 ${
                              isToday ? 'text-white/70' : 'text-black/50'
                            }`}>{dayName}</p>
                            <p className={`text-lg font-serif ${
                              isToday ? 'text-white' : 'text-black'
                            }`}>
                              {isToday ? (stats?.dueCards || 0) : '—'}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>
              )}
              
            </div>
          )}

          {viewMode === 'discover' && (
            <div>
              <DiscoveryDashboard 
                onCreateCard={(prompt) => {
                  if (prompt && typeof window !== 'undefined') {
                    window.localStorage.setItem('suggested-prompt', prompt)
                  }
                  setIsCreateDialogOpen(true)
                }}
                onStartLearning={(topicId) => {
                  // Store topic ID for later use
                  if (typeof window !== 'undefined') {
                    window.localStorage.setItem('selected-topic', topicId)
                  }
                  setIsCreateDialogOpen(true)
                }}
                userLevel={stats && stats.totalCards > 10 ? 'intermediate' : stats && stats.totalCards > 0 ? 'beginner' : 'new'}
              />
            </div>
          )}
          
      </main>

      {/* Create Card Dialog */}
      <CreateCardDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onCardCreated={() => {
          // Refresh dashboard data
          loadDashboardData()
        }}
      />
    </div>
  )
}
