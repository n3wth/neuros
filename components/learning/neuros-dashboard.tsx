'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Activity,
  ArrowRight,
  Clock,
  Flame,
  Heart,
  LogOut,
  Plus,
  RefreshCw,
  Brain
} from 'lucide-react'
import Link from 'next/link'
import { SparkleIcon } from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/server/actions/auth'
import LearningCard from './learning-card'
import AIAssistant from './ai-assistant'

interface User {
  id: string
  email?: string
}

interface NeurosLearningDashboardProps {
  user: User | null
}

export default function NeurosLearningDashboard({ user }: NeurosLearningDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const studyStreak: number = 47
  const todayProgress = 65

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
  }, [])

  const categories = [
    { id: 'all', label: 'All Topics', count: 24 },
    { id: 'tech', label: 'Technology', count: 8, color: 'from-blue-600 to-cyan-600' },
    { id: 'career', label: 'Career', count: 6, color: 'from-purple-600 to-pink-600' },
    { id: 'creative', label: 'Creative', count: 5, color: 'from-orange-600 to-red-600' },
    { id: 'wellness', label: 'Wellness', count: 5, color: 'from-green-600 to-teal-600' }
  ]

  const learningQueue = [
    {
      id: '1',
      title: 'Transformer Architecture Deep Dive',
      category: 'tech',
      type: 'concept',
      difficulty: 'advanced',
      timeEstimate: 15,
      dueIn: 'now',
      priority: 'high',
      masteryLevel: 3.8,
      lastReviewed: '2 days ago',
      reviewCount: 12,
      icon: Brain,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: '2',
      title: 'HEART Framework for UX Metrics',
      category: 'career',
      type: 'framework',
      difficulty: 'intermediate',
      timeEstimate: 10,
      dueIn: '2 hours',
      priority: 'medium',
      masteryLevel: 4.2,
      lastReviewed: 'yesterday',
      reviewCount: 8,
      icon: Heart,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: '3',
      title: 'Generative Art with p5.js',
      category: 'creative',
      type: 'project',
      difficulty: 'beginner',
      timeEstimate: 20,
      dueIn: 'tomorrow',
      priority: 'low',
      masteryLevel: 2.5,
      lastReviewed: '5 days ago',
      reviewCount: 4,
      icon: Sparkles,
      gradient: 'from-orange-600 to-red-600'
    },
    {
      id: '4',
      title: 'Mindfulness Meditation Techniques',
      category: 'wellness',
      type: 'practice',
      difficulty: 'beginner',
      timeEstimate: 5,
      dueIn: 'daily',
      priority: 'high',
      masteryLevel: 4.5,
      lastReviewed: 'this morning',
      reviewCount: 47,
      icon: Activity,
      gradient: 'from-green-600 to-teal-600'
    }
  ]

  const stats = {
    totalCards: 1283,
    weeklyProgress: 24,
    averageAccuracy: 89,
    studyTime: 127 // minutes this week
  }

  const getGreeting = () => {
    const greetings = {
      morning: "Good morning! Ready to expand your mind?",
      afternoon: "Afternoon focus time! Let's dive deep",
      evening: "Evening review session - perfect for retention"
    }
    return greetings[timeOfDay]
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Link href="/" className="flex items-center group p-2 rounded-xl hover:bg-black/5 transition-all duration-300">
                    <SparkleIcon className="w-8 h-8 text-black/70 stroke-[2] group-hover:text-black group-hover:rotate-12 transition-all duration-300" />
                  </Link>
                </div>
                <Badge className="bg-black/5 backdrop-blur text-black/70 border-black/10 font-light">
                  Beta
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                {/* Streak Counter */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white/90 rounded-full border border-black/10 hover:border-black/20 transition-all duration-300">
                  <Flame className="w-4 h-4 text-black/70 hover:text-black/80 stroke-[1.5] transition-colors duration-300" />
                  <span className="text-sm font-light text-black/70 hover:text-black/80 whitespace-nowrap transition-colors duration-300">
                    {studyStreak === 1 ? '1 day' : `${studyStreak} days`}
                  </span>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => await signOut()}
                    className="p-2.5 hover:bg-black/5 focus:bg-black/5 rounded-full transition-all duration-300 group focus:ring-2 focus:ring-black/20 focus:ring-offset-1"
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4 text-black/60 group-hover:text-black/90 group-focus:text-black/90 stroke-[1.5] transition-colors duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-serif font-light mb-3 text-black/90">{getGreeting()}</h1>
            <p className="text-lg text-black/60 font-light">You have {learningQueue.filter(c => c.priority === 'high').length} high-priority cards ready for review</p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-7 h-7 text-black/70 stroke-[2]" />
                <span className="text-xs text-black/40 font-mono">Total</span>
              </div>
              <p className="text-3xl font-serif font-light text-black/90">{stats.totalCards}</p>
              <p className="text-xs text-black/50 font-light">cards</p>
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-7 h-7 text-black/70 stroke-[2]" />
                <span className="text-xs text-black/40 font-mono">Growth</span>
              </div>
              <p className="text-3xl font-serif font-light text-black/90">{stats.weeklyProgress}%</p>
              <p className="text-xs text-black/50 font-light">weekly</p>
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-7 h-7 text-black/70 stroke-[2]" />
                <span className="text-xs text-black/40 font-mono">Accuracy</span>
              </div>
              <p className="text-3xl font-serif font-light text-black/90">{stats.averageAccuracy}%</p>
              <p className="text-xs text-black/50 font-light">average</p>
            </Card>

            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-7 h-7 text-black/70 stroke-[2]" />
                <span className="text-xs text-black/40 font-mono">Time</span>
              </div>
              <p className="text-3xl font-serif font-light text-black/90">{Math.floor(stats.studyTime / 60)}h {stats.studyTime % 60}m</p>
              <p className="text-xs text-black/50 font-light">this week</p>
            </Card>
          </motion.div>

          {/* Today's Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-8 bg-white/95 backdrop-blur-sm border border-black/5 rounded-3xl mb-8 hover:shadow-xl transition-all duration-500">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-light mb-3 text-black/90">Today&apos;s Goal</h3>
                  <p className="text-black/60 mb-6 font-light max-w-md">
                    Complete 20 cards to maintain your streak. 
                    Estimated time: {Math.ceil(20 * 0.5)} minutes
                  </p>
                  <Button
                    className="bg-black text-white hover:bg-black/80 focus:bg-black/80 rounded-full px-8 py-3 font-light shadow-md hover:shadow-lg focus:shadow-lg focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-serif font-light text-black/90 mb-1">{Math.floor(todayProgress * 0.2)}/20</p>
                  <p className="text-sm text-black/50 font-light">cards completed</p>
                  <div className="mt-4">
                    <Badge className="bg-green-50 text-green-600 border-green-200 font-light">
                      On Track
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-sm font-light rounded-full transition-all duration-300 focus:ring-2 focus:ring-black/20 focus:ring-offset-1 ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white'
                      : 'text-black/70 hover:text-black hover:bg-black/5 focus:text-black focus:bg-black/5'
                  }`}
                >
                  {cat.label}
                  {cat.count && (
                    <span className="ml-2 text-xs opacity-60">({cat.count})</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Learning Queue */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-serif font-light text-black/90">Learning Queue</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black/70 hover:text-black border-black/20 hover:border-black/30 rounded-full font-light"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <AnimatePresence>
                  {learningQueue
                    .filter(card => selectedCategory === 'all' || card.category === selectedCategory)
                    .map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <LearningCard
                          card={card}
                          isActive={activeCardId === card.id}
                          onActivate={() => setActiveCardId(card.id)}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Card */}
                <Card className="bg-white/90 backdrop-blur-sm border border-black/5 border-dashed hover:bg-white/95 hover:border-black/10 transition-all duration-300 cursor-pointer rounded-3xl">
                  <div className="p-8 text-center">
                    <Plus className="w-8 h-8 text-black/30 mx-auto mb-3" />
                    <p className="text-black/60 font-light">Add Custom Learning Card</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <AIAssistant 
                  userName={user?.email?.split('@')[0] || 'Learner'}
                  currentCard={learningQueue.find(c => c.id === activeCardId) ? {
                    id: learningQueue.find(c => c.id === activeCardId)!.id,
                    title: learningQueue.find(c => c.id === activeCardId)!.title,
                    content: learningQueue.find(c => c.id === activeCardId)!.category
                  } : null}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}