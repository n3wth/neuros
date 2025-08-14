'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparkleIcon, 
  ChartIcon, 
  BookIcon, 
  PlusIcon,
  PlayIcon,
  ChevronRightIcon,
  SearchIcon,
  LogOutIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  XIcon,
  StarIcon,
  TrophyIcon,
  BrainIcon,
  ZapIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/server/actions/auth'
import CreateCardDialog from './create-card-dialog'
import ImmersiveReviewInterface from './immersive-review-interface'
import { 
  getUserCards, 
  getDueCards, 
  getCardStats,
  getUpcomingCards,
  getUserCompletionState 
} from '@/server/actions/cards'
import { 
  startStudySession, 
  getStudyStats 
} from '@/server/actions/reviews'
import { cn } from '@/lib/utils'

interface User {
  id: string
  email?: string
}

interface OpenAIDashboardProps {
  user: User
}

type ViewMode = 'overview' | 'review' | 'browse' | 'stats'

export default function OpenAIDashboard({}: OpenAIDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [cards, setCards] = useState<Array<{id: string; front: string; back: string; difficulty: string | null; topics?: {name: string} | null; user_cards?: Array<{mastery_level: number}>}>>([])
  const [dueCards, setDueCards] = useState<Array<{id: string; cards: {front: string; back: string; topics?: {name: string} | null}; mastery_level: number; total_reviews: number}>>([])
  const [stats, setStats] = useState<{totalCards: number; dueCards: number; mastered: number; learning: number; difficult: number} | null>(null)
  const [studyStats, setStudyStats] = useState<{total_reviews: number; average_accuracy: number; total_study_time_minutes: number; current_streak_days: number} | null>(null)
  const [, setUpcomingCards] = useState<Record<string, Array<{id: string}>>>({})
  const [, setCompletionState] = useState<{type: string; totalCards: number; dueCards: number; nextReviewTime: string | null; completedToday: boolean} | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDashboardData()
    // Check system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [
        userCards,
        dueCardsData,
        cardStats,
        studyStatsData,
        upcomingCardsData,
        completionStateData
      ] = await Promise.all([
        getUserCards(),
        getDueCards(),
        getCardStats(),
        getStudyStats(),
        getUpcomingCards(),
        getUserCompletionState()
      ])

      setCards(userCards.map(card => ({
        id: card.id,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty,
        topics: card.topics ? { name: card.topics.name } : undefined,
        user_cards: card.user_cards?.map(uc => ({
          mastery_level: uc.mastery_level ?? 0
        }))
      })))
      setDueCards(dueCardsData.map(dueCard => ({
        id: dueCard.id,
        cards: {
          front: dueCard.cards.front,
          back: dueCard.cards.back,
          topics: dueCard.cards.topics ? { name: dueCard.cards.topics.name } : undefined
        },
        mastery_level: dueCard.mastery_level ?? 0,
        total_reviews: dueCard.total_reviews ?? 0
      })))
      setStats(cardStats)
      setStudyStats(studyStatsData ? {
        total_reviews: studyStatsData.total_reviews ?? 0,
        average_accuracy: studyStatsData.average_accuracy ?? 0,
        total_study_time_minutes: studyStatsData.total_study_time_minutes ?? 0,
        current_streak_days: studyStatsData.current_streak_days ?? 0
      } : null)
      setUpcomingCards(
        Object.entries(upcomingCardsData).reduce((acc, [date, cards]) => {
          acc[date] = cards.map(card => ({ id: card.cards.id }))
          return acc
        }, {} as Record<string, Array<{id: string}>>)
      )
      setCompletionState(completionStateData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleStartReview = async () => {
    if (dueCards.length === 0) return
    const sessionResult = await startStudySession()
    if (sessionResult?.id) {
      setCurrentSessionId(sessionResult.id)
      setViewMode('review')
    }
  }

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: SparkleIcon, count: null },
    { id: 'review', label: 'Review', icon: PlayIcon, count: dueCards.length || 0 },
    { id: 'browse', label: 'All Cards', icon: BookIcon, count: cards.length || 0 },
    { id: 'stats', label: 'Statistics', icon: ChartIcon, count: null },
  ]

  const StatCard = ({ icon: Icon, label, value, trend, color = 'default' }: {icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value: string | number; trend?: number; color?: string}) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "bg-white dark:bg-gray-800/50 backdrop-blur-sm",
        "border border-gray-100 dark:border-gray-700/50",
        "hover:shadow-lg dark:hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/20",
        "cursor-pointer group"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-colors duration-300",
            "bg-gradient-to-br",
            color === 'green' && "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 group-hover:from-green-100 group-hover:to-emerald-100",
            color === 'blue' && "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 group-hover:from-blue-100 group-hover:to-indigo-100",
            color === 'purple' && "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 group-hover:from-purple-100 group-hover:to-pink-100",
            color === 'orange' && "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 group-hover:from-orange-100 group-hover:to-red-100",
            color === 'default' && "from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 group-hover:from-gray-100 group-hover:to-slate-100"
          )}>
            <Icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              color === 'green' && "text-green-600 dark:text-green-400",
              color === 'blue' && "text-blue-600 dark:text-blue-400",
              color === 'purple' && "text-purple-600 dark:text-purple-400",
              color === 'orange' && "text-orange-600 dark:text-orange-400",
              color === 'default' && "text-gray-600 dark:text-gray-400"
            )} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-current opacity-5 group-hover:opacity-10 transition-opacity" />
    </motion.div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full"
        />
      </div>
    )
  }

  if (viewMode === 'review' && currentSessionId) {
    return (
      <ImmersiveReviewInterface
        sessionId={currentSessionId}
      />
    )
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
    )}>
      {/* ChatGPT-style Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "fixed left-0 top-0 h-full w-[280px] z-40",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          "border-r border-gray-200 dark:border-gray-800"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                "text-white font-medium transition-all duration-300",
                "shadow-md hover:shadow-xl hover:scale-[1.02]"
              )}
            >
              <PlusIcon className="w-4 h-4" />
              New Session
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg",
                  "bg-gray-100 dark:bg-gray-800",
                  "border border-transparent focus:border-blue-500",
                  "text-sm text-gray-900 dark:text-gray-100",
                  "placeholder-gray-500 dark:placeholder-gray-400",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id as ViewMode)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg",
                  "transition-all duration-200 group",
                  viewMode === item.id
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    viewMode === item.id && "scale-110"
                  )} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.count !== null && item.count > 0 && (
                  <Badge className={cn(
                    "px-2 py-0.5 text-xs",
                    viewMode === item.id
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  )}>
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <button
              onClick={toggleDarkMode}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "text-gray-600 dark:text-gray-400 transition-colors"
              )}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
                <span className="text-sm">Theme</span>
              </div>
            </button>
            <button
              onClick={() => signOut()}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "hover:bg-red-50 dark:hover:bg-red-900/20",
                "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400",
                "transition-colors"
              )}
            >
              <LogOutIcon className="w-4 h-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "ml-[280px]" : "ml-0"
      )}>
        {/* Top Bar */}
        <header className={cn(
          "sticky top-0 z-30 px-6 py-4",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
          "border-b border-gray-200 dark:border-gray-800"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {viewMode === 'overview' && 'Dashboard'}
                  {viewMode === 'browse' && 'Your Cards'}
                  {viewMode === 'stats' && 'Statistics'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {studyStats && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <TrophyIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{studyStats.current_streak_days} day streak</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {viewMode === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={BookIcon}
                  label="Total Cards"
                  value={stats?.totalCards || 0}
                  color="blue"
                />
                <StatCard
                  icon={ClockIcon}
                  label="Due Today"
                  value={stats?.dueCards || 0}
                  color="orange"
                />
                <StatCard
                  icon={StarIcon}
                  label="Mastered"
                  value={stats?.mastered || 0}
                  trend={15}
                  color="green"
                />
                <StatCard
                  icon={ChartIcon}
                  label="Accuracy"
                  value={`${Math.round(studyStats?.average_accuracy || 0)}%`}
                  trend={(studyStats?.average_accuracy ?? 0) > 70 ? 5 : -3}
                  color="purple"
                />
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Review Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-8",
                    "bg-gradient-to-br from-blue-500 to-indigo-600",
                    "text-white shadow-xl"
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <ZapIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Ready to Learn</h3>
                    </div>
                    <p className="text-white/90 mb-6">
                      {dueCards.length > 0 
                        ? `You have ${dueCards.length} cards ready for review. Estimated time: ${Math.ceil(dueCards.length * 0.5)} minutes.`
                        : 'Great job! All cards reviewed for today.'}
                    </p>
                    <Button
                      onClick={handleStartReview}
                      disabled={dueCards.length === 0}
                      className={cn(
                        "bg-white text-blue-600 hover:bg-white/90",
                        "shadow-lg hover:shadow-xl transition-all"
                      )}
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      {dueCards.length > 0 ? 'Start Review' : 'All Done!'}
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
                </motion.div>

                {/* Progress Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "rounded-2xl p-8",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "shadow-lg"
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                      <BrainIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Progress</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Learning Progress</span>
                        <span className="font-medium">{Math.round((stats?.mastered || 0) / Math.max(stats?.totalCards || 1, 1) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats?.mastered || 0) / Math.max(stats?.totalCards || 1, 1) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {studyStats?.total_study_time_minutes || 0}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Minutes studied</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {studyStats?.total_reviews || 0}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total reviews</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                <div className="space-y-3">
                  {cards.slice(0, 5).map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        "transition-colors cursor-pointer group"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          (card.user_cards?.[0]?.mastery_level ?? 0) > 0.7 ? "bg-green-500" :
                          (card.user_cards?.[0]?.mastery_level ?? 0) > 0.3 ? "bg-yellow-500" : "bg-red-500"
                        )} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {card.front.length > 50 ? card.front.substring(0, 50) + '...' : card.front}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {card.difficulty} • {card.topics?.name || 'No topic'}
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {viewMode === 'browse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "p-5 rounded-xl",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "hover:shadow-lg dark:hover:shadow-2xl",
                    "transition-all cursor-pointer"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {card.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < Math.ceil((card.user_cards?.[0]?.mastery_level || 0) * 3)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {card.front}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {card.back}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Learning Velocity</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart visualization would go here
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mastery Distribution</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart visualization would go here
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Create Card Dialog */}
      <CreateCardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCardCreated={() => {
          setIsCreateDialogOpen(false)
          loadDashboardData()
        }}
      />
    </div>
  )
}