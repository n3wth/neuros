'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  SparkleIcon, 
  ChartIcon, 
  BookIcon, 
  HeartIcon,
  PlusIcon,
  PlayIcon,
  RefreshIcon,
  LogOutIcon,
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { signOut } from '@/server/actions/auth'
import Link from 'next/link'
import CreateCardDialog from './create-card-dialog'
import { loadMobileDashboardData } from '@/server/actions/dashboard'
import { 
  getCardStats,
  getUserCompletionState 
} from '@/server/actions/cards'
import { 
  getStudyStats 
} from '@/server/actions/reviews'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import { useMobile } from '@/hooks/use-mobile'

interface User {
  id: string
  email?: string
}

interface MobileOptimizedDashboardProps {
  user: User
  initialViewMode?: string
}

interface DashboardStats {
  totalCards: number
  dueCards: number
  mastered: number
  learning: number
  difficult: number
}

interface StudyStats {
  total_reviews: number
  average_accuracy: number
  total_study_time_minutes: number
  current_streak_days: number
}

interface CompletionState {
  type: string
  totalCards: number
  dueCards: number
  nextReviewTime: string | null
  completedToday: boolean
}

export default function MobileOptimizedDashboard({ user }: MobileOptimizedDashboardProps) {
  const router = useRouter()
  const { } = useMobile()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null)
  const [completionState, setCompletionState] = useState<CompletionState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const loadingRef = useRef(false)

  // Load essential data first (mobile-optimized)
  const loadEssentialData = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    
    setIsRefreshing(true)
    setError(null)
    
    try {
      const data = await loadMobileDashboardData()
      setStats(data.stats)
      setStudyStats(data.studyStats ? {
        total_reviews: data.studyStats.total_reviews || 0,
        average_accuracy: data.studyStats.average_accuracy || 0,
        total_study_time_minutes: data.studyStats.total_study_time_minutes || 0,
        current_streak_days: data.studyStats.current_streak_days || 0
      } : null)
      setCompletionState(data.completionState)
      setLastUpdated(new Date(data._metadata.timestamp))
    } catch (error) {
      console.error('Failed to load essential data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsRefreshing(false)
      loadingRef.current = false
    }
  }, [])

  // Refresh data with loading state  
  const refreshData = useCallback(async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    
    try {
      // Use individual actions for refresh to avoid circular dependency
      const [cardStats, studyStatsData, userCompletionState] = await Promise.allSettled([
        getCardStats(),
        getStudyStats(), 
        getUserCompletionState()
      ])

      // Process results from Promise.allSettled
      const userCardsResult = cardStats.status === 'fulfilled' ? cardStats.value : null
      const studyStatsResult = studyStatsData.status === 'fulfilled' ? studyStatsData.value : null
      const completionResult = userCompletionState.status === 'fulfilled' ? userCompletionState.value : null

      setStats(userCardsResult)
      setStudyStats(studyStatsResult ? {
        total_reviews: studyStatsResult.total_reviews || 0,
        average_accuracy: studyStatsResult.average_accuracy || 0,
        total_study_time_minutes: studyStatsResult.total_study_time_minutes || 0,
        current_streak_days: studyStatsResult.current_streak_days || 0
      } : null)
      setCompletionState(completionResult)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to refresh data:', error)
      setError('Failed to refresh dashboard')
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing])

  // Initial load - show instantly then load data
  useEffect(() => {
    // Show dashboard instantly with static content
    setIsLoading(false)
    
    // Load actual data in background after initial render
    const timer = setTimeout(() => {
      loadEssentialData()
    }, 50)
    
    return () => clearTimeout(timer)
  }, [loadEssentialData])

  const handleStartReview = () => {
    router.push('/review')
  }

  const formatGreeting = () => {
    const hour = new Date().getHours()
    const name = user.email?.split('@')[0] || 'there'
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    if (hour < 12) return `Good morning, ${capitalizedName}`
    if (hour < 18) return `Good afternoon, ${capitalizedName}`
    return `Good evening, ${capitalizedName}`
  }

  const formatSmartMessage = () => {
    if (!completionState) return `You have ${stats?.dueCards || 0} cards ready for review`
    
    switch (completionState.type) {
      case 'new_user':
        return "Ready to start your learning journey?"
      case 'completed_today':
        return "Great job! All reviews completed for today"
      case 'has_due_cards':
        const urgency = completionState.dueCards > 10 ? " Time to focus!" : ""
        return `${completionState.dueCards} cards ready${urgency}`
      case 'no_cards_due':
        return "Spaced repetition is working! No reviews needed"
      default:
        return `${stats?.dueCards || 0} cards ready for review`
    }
  }

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" message="Loading your learning dashboard..." />
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <RefreshIcon className="w-16 h-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-xl font-serif font-light mb-3">Connection Issue</h2>
          <p className="text-black/60 mb-6">{error}</p>
          <Button
            onClick={loadEssentialData}
            className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-3"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Mobile-Optimized Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50 safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-light">
              Neuros
            </Link>
            
            <div className="flex items-center gap-2">
              {/* Streak Indicator */}
              {studyStats && studyStats.current_streak_days > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-black/5 rounded-full">
                  <HeartIcon className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium">{studyStats.current_streak_days}</span>
                </div>
              )}
              
              {/* Create Button */}
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="sm"
                className="h-8 w-8 bg-black text-white rounded-full p-0"
              >
                <PlusIcon className="w-4 h-4" />
              </Button>

              {/* Sign Out (Mobile) */}
              <Button
                onClick={async () => await signOut()}
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full p-0"
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="px-4 py-6 safe-bottom">
        {/* Greeting Section - Compact for Mobile */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-serif font-light leading-tight mb-2">
            {formatGreeting()}
          </h1>
          <p className="text-base sm:text-lg text-black/60 font-light">
            {formatSmartMessage()}
          </p>
        </motion.div>

        {/* Stats Grid - Mobile Optimized */}
        {completionState?.type !== 'new_user' && stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="p-4 bg-white rounded-2xl border-black/5">
                <BookIcon className="w-5 h-5 text-black/40 mb-2" />
                <p className="text-2xl font-serif font-light text-black">{stats.totalCards}</p>
                <p className="text-xs text-black/50">total cards</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-4 bg-white rounded-2xl border-black/5">
                <SparkleIcon className="w-5 h-5 text-black/40 mb-2" />
                <p className="text-2xl font-serif font-light text-black">{stats.mastered}</p>
                <p className="text-xs text-black/50">mastered</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="p-4 bg-white rounded-2xl border-black/5">
                <ChartIcon className="w-5 h-5 text-black/40 mb-2" />
                <p className="text-2xl font-serif font-light text-black">{studyStats?.average_accuracy || 0}%</p>
                <p className="text-xs text-black/50">accuracy</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="p-4 bg-white rounded-2xl border-black/5">
                <HeartIcon className="w-5 h-5 text-black/40 mb-2" />
                <p className="text-2xl font-serif font-light text-black">{studyStats?.current_streak_days || 0}</p>
                <p className="text-xs text-black/50">day streak</p>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Main Action Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats && stats.dueCards > 0 ? (
            <Card className="p-6 bg-white rounded-3xl border-black/5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-light mb-2">Ready to Review</h3>
                  <p className="text-sm text-black/60">
                    {stats.dueCards} cards • ~{Math.ceil(stats.dueCards * 0.5)} min
                  </p>
                </div>
                <PlayIcon className="w-8 h-8 text-black/20" />
              </div>
              <Button
                onClick={handleStartReview}
                className="w-full bg-black text-white hover:bg-black/90 rounded-full py-3"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Start Review Session
              </Button>
            </Card>
          ) : (
            <Card className="p-6 bg-white rounded-3xl border-black/5 mb-6 shadow-sm">
              <div className="text-center">
                {completionState?.type === 'new_user' ? (
                  <>
                    <SparkleIcon className="w-12 h-12 mx-auto mb-4 text-black/20" />
                    <h3 className="text-xl font-serif font-light mb-2">Welcome to Neuros!</h3>
                    <p className="text-sm text-black/60 mb-4">Create your first learning card to get started</p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-black text-white rounded-full px-6 py-3"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create First Card
                    </Button>
                  </>
                ) : completionState?.type === 'completed_today' ? (
                  <>
                    <HeartIcon className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-serif font-light mb-2">Well Done!</h3>
                    <p className="text-sm text-black/60 mb-4">You&apos;ve completed all reviews for today</p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      variant="outline"
                      className="rounded-full px-6 py-3"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add New Cards
                    </Button>
                  </>
                ) : (
                  <>
                    <BookIcon className="w-12 h-12 mx-auto mb-4 text-black/20" />
                    <h3 className="text-xl font-serif font-light mb-2">All Caught Up!</h3>
                    <p className="text-sm text-black/60 mb-4">No cards due for review right now</p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      variant="outline"
                      className="rounded-full px-6 py-3"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add New Cards
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Pull to Refresh Indicator */}
        <motion.div 
          className="flex justify-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={refreshData}
            variant="ghost"
            size="sm"
            disabled={isRefreshing}
            className="text-xs text-black/40"
          >
            <RefreshIcon className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </Button>
        </motion.div>

        {/* Last Updated */}
        <div className="text-center text-xs text-black/30 mb-4">
          Updated {lastUpdated.toLocaleTimeString()}
        </div>
      </main>

      {/* Create Card Dialog */}
      <CreateCardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCardCreated={refreshData}
      />
    </div>
  )
}