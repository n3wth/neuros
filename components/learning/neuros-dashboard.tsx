'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
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
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  const studyStreak = 47
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
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-cyan-600/5 to-pink-600/5 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Neuros</span>
                </div>
                <Badge className="bg-white/10 backdrop-blur text-white border-white/20">
                  Beta
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                {/* Streak Counter */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-600/20 backdrop-blur rounded-full border border-orange-600/30">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-400">{studyStreak} day streak</span>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-400">Level 12 Learner</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={async () => await signOut()}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{getGreeting()}</h1>
            <p className="text-gray-400">You have {learningQueue.filter(c => c.priority === 'high').length} high-priority cards ready for review</p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-green-400">+12%</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalCards}</p>
                <p className="text-xs text-gray-400">Cards Mastered</p>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-green-400">+{stats.weeklyProgress}%</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.weeklyProgress}%</p>
                <p className="text-xs text-gray-400">Weekly Growth</p>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span className="text-xs text-gray-400">Excellent</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.averageAccuracy}%</p>
                <p className="text-xs text-gray-400">Accuracy</p>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <p className="text-2xl font-bold text-white">{Math.floor(stats.studyTime / 60)}h {stats.studyTime % 60}m</p>
                <p className="text-xs text-gray-400">Study Time</p>
              </div>
            </Card>
          </motion.div>

          {/* Today's Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Today&apos;s Goal</h3>
                    <p className="text-sm text-gray-400">Complete 20 cards to maintain your streak</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{Math.floor(todayProgress * 0.2)}/20</p>
                    <p className="text-xs text-gray-400">cards completed</p>
                  </div>
                </div>
                <Progress value={todayProgress} className="h-2 bg-white/10" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                      On Track
                    </Badge>
                    <span className="text-sm text-gray-400">Est. completion: 2:30 PM</span>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                  >
                    Continue Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  } backdrop-blur border ${
                    selectedCategory === cat.id ? 'border-white/30' : 'border-white/10'
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
                  <h2 className="text-xl font-semibold text-white">Learning Queue</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
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
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 border-dashed hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="p-6 text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Add Custom Learning Card</p>
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
        </div>
      </div>
    </div>
  )
}