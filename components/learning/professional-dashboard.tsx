'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Sparkles,
  Clock,
  TrendingUp,
  BookOpen,
  ChevronRight,
  BarChart3,
  Calendar,
  Zap,
  Target,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Play,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { signOut } from '@/server/actions/auth'
import Link from 'next/link'

interface User {
  id: string
  email?: string
}

interface ProfessionalDashboardProps {
  user: User | null
}

export default function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState('due')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatGreeting = () => {
    const hour = currentTime.getHours()
    const name = user?.email?.split('@')[0] || 'there'
    if (hour < 12) return `Good morning, ${name}`
    if (hour < 18) return `Good afternoon, ${name}`
    return `Good evening, ${name}`
  }

  const learningItems = [
    {
      id: '1',
      title: 'Understanding Transformer Self-Attention Mechanisms',
      category: 'Machine Learning',
      difficulty: 'Advanced',
      duration: '15 min',
      dueStatus: 'Overdue by 2 hours',
      mastery: 72,
      lastSeen: '2 days ago',
      nextReview: 'Now',
      color: 'border-l-4 border-l-red-500'
    },
    {
      id: '2',
      title: 'Product-Market Fit: Finding Your North Star Metric',
      category: 'Product Strategy',
      difficulty: 'Intermediate',
      duration: '10 min',
      dueStatus: 'Due in 4 hours',
      mastery: 85,
      lastSeen: 'Yesterday',
      nextReview: 'Today at 3 PM',
      color: 'border-l-4 border-l-yellow-500'
    },
    {
      id: '3',
      title: 'React Server Components: Architecture Patterns',
      category: 'Frontend Development',
      difficulty: 'Intermediate',
      duration: '12 min',
      dueStatus: 'Due tomorrow',
      mastery: 91,
      lastSeen: '5 days ago',
      nextReview: 'Tomorrow',
      color: 'border-l-4 border-l-green-500'
    },
    {
      id: '4',
      title: 'Cognitive Load Theory in UX Design',
      category: 'Design',
      difficulty: 'Beginner',
      duration: '8 min',
      dueStatus: 'Due in 3 days',
      mastery: 65,
      lastSeen: 'Last week',
      nextReview: 'In 3 days',
      color: 'border-l-4 border-l-blue-500'
    }
  ]

  const stats = {
    streak: 47,
    todayCards: 12,
    todayTime: 42,
    weeklyProgress: 24,
    totalMastered: 1283
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-semibold">Neuros</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-sm font-medium text-black">
                  Learn
                </Link>
                <Link href="/explore" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Explore
                </Link>
                <Link href="/progress" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Progress
                </Link>
                <Link href="/library" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Library
                </Link>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <form action={signOut}>
                <button type="submit" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Greeting and Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-6">{formatGreeting()}</h1>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-xs text-gray-500">Streak</span>
              </div>
              <p className="text-2xl font-light">{stats.streak}</p>
              <p className="text-xs text-gray-500">days</p>
            </Card>
            
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <p className="text-2xl font-light">{stats.todayCards}</p>
              <p className="text-xs text-gray-500">cards</p>
            </Card>
            
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-xs text-gray-500">Time</span>
              </div>
              <p className="text-2xl font-light">{stats.todayTime}</p>
              <p className="text-xs text-gray-500">minutes</p>
            </Card>
            
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-gray-500">Progress</span>
              </div>
              <p className="text-2xl font-light">+{stats.weeklyProgress}%</p>
              <p className="text-xs text-gray-500">this week</p>
            </Card>
            
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-indigo-500" />
                <span className="text-xs text-gray-500">Mastered</span>
              </div>
              <p className="text-2xl font-light">{stats.totalMastered}</p>
              <p className="text-xs text-gray-500">total</p>
            </Card>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Queue */}
          <div className="lg:col-span-2">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedFilter('due')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === 'due' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Due Now
                </button>
                <button
                  onClick={() => setSelectedFilter('new')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === 'new' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  New Cards
                </button>
                <button
                  onClick={() => setSelectedFilter('difficult')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === 'difficult' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Difficult
                </button>
              </div>
              
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Learning Cards */}
            <div className="space-y-4">
              {learningItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer ${item.color}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xs font-medium text-gray-500">{item.category}</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-500">{item.difficulty}</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-500">{item.duration}</span>
                        </div>
                        
                        <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-black rounded-full"
                                style={{ width: `${item.mastery}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{item.mastery}%</span>
                          </div>
                          
                          <span className="text-xs text-gray-500">Last seen {item.lastSeen}</span>
                        </div>
                      </div>
                      
                      <button className="ml-4 p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {/* Add New Card */}
              <Card className="p-6 bg-white border border-gray-200 border-dashed hover:border-gray-300 transition-colors cursor-pointer">
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Add new card</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="p-6 bg-white border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5" />
                <h3 className="font-medium">AI Insights</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    You learn ML concepts 40% faster before noon. Consider scheduling advanced topics in the morning.
                  </p>
                  <button className="text-xs font-medium text-black hover:underline">
                    Optimize schedule →
                  </button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    3 cards are becoming difficult. Review them now to prevent forgetting.
                  </p>
                  <button className="text-xs font-medium text-black hover:underline">
                    Review now →
                  </button>
                </div>
              </div>
            </Card>

            {/* Upcoming */}
            <Card className="p-6 bg-white border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5" />
                <h3 className="font-medium">Upcoming Reviews</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="text-sm font-medium">8 cards</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tomorrow</span>
                  <span className="text-sm font-medium">12 cards</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This week</span>
                  <span className="text-sm font-medium">47 cards</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-white border border-gray-200">
              <h3 className="font-medium mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
                  Start focused session
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
                  Review difficult cards
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
                  Practice with voice
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
                  Export to Anki
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant Slide-out */}
      <AnimatePresence>
        {isAIAssistantOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 border-l border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">AI Assistant</h3>
                <button 
                  onClick={() => setIsAIAssistantOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    How can I help you learn more effectively today?
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button className="text-left px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Explain this concept simply
                  </button>
                  <button className="text-left px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Give me a real-world example
                  </button>
                  <button className="text-left px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Test my understanding
                  </button>
                  <button className="text-left px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Find related concepts
                  </button>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}