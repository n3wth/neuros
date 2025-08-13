'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUpIcon,
  GlobeIcon,
  BookOpenIcon,
  BrainIcon,
  RocketIcon,
  StarIcon,
  PlusIcon,
  ChevronRightIcon,
  HashIcon,
  UsersIcon,
  ZapIcon
} from 'lucide-react'
import { SparkleIcon, RefreshIcon } from '@/components/icons/line-icons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { generateAISuggestions, getTrendingTopics } from '@/server/actions/discovery'

interface TrendingTopic {
  id: string
  title: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cardCount: number
  learners: number
  trending: boolean
  color: string
  description: string
  exampleCards: string[]
}

interface DiscoveryDashboardProps {
  onCreateCard: (prompt?: string) => void
  onStartLearning: (topicId: string) => void
  userLevel?: 'new' | 'beginner' | 'intermediate' | 'advanced'
}

export default function DiscoveryDashboard({ 
  onCreateCard, 
  onStartLearning,
  userLevel = 'new' 
}: DiscoveryDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const categories = [
    { id: 'all', name: 'All Topics', icon: GlobeIcon },
    { id: 'Technology', name: 'Technology', icon: RocketIcon },
    { id: 'Languages', name: 'Languages', icon: BookOpenIcon },
    { id: 'Science', name: 'Science', icon: BrainIcon },
    { id: 'Business', name: 'Business', icon: TrendingUpIcon },
    { id: 'History', name: 'History', icon: BookOpenIcon }
  ]

  useEffect(() => {
    // Load initial data
    loadInitialData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadInitialData = async () => {
    // Load trending topics
    const topicsResult = await getTrendingTopics()
    if (topicsResult.topics) {
      setTrendingTopics(topicsResult.topics)
    }
    
    // Generate AI suggestions
    loadAISuggestions()
  }

  const loadAISuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true)
    try {
      const result = await generateAISuggestions(userLevel)
      if (result.suggestions && result.suggestions.length > 0) {
        setAiSuggestions(result.suggestions)
      } else {
        // Fallback suggestions if AI fails
        setAiSuggestions([
          "Create cards about machine learning basics",
          "Learn essential Spanish phrases",
          "Master JavaScript fundamentals",
          "Study human psychology concepts"
        ])
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
      // Use fallback suggestions
      setAiSuggestions([
        "Create cards about AI fundamentals",
        "Learn a new programming language",
        "Study world history events",
        "Master personal finance basics"
      ])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }, [userLevel])

  const filteredTopics = selectedCategory === 'all' 
    ? trendingTopics 
    : trendingTopics.filter(topic => topic.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-50 text-green-700 border-green-200'
      case 'intermediate': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'advanced': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section for New Users */}
      {userLevel === 'new' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 border border-black/5"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <SparkleIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Welcome to Neuros</span>
            </div>
            <h2 className="text-3xl font-serif font-light mb-3">
              Start with what interests you
            </h2>
            <p className="text-lg text-black/60 mb-6 max-w-2xl">
              Choose from trending topics or let AI create a personalized learning path. 
              Our spaced repetition system will help you remember everything.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onCreateCard()}
                className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-2.5"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Custom Cards
              </Button>
              <Button
                onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="rounded-full px-6 py-2.5"
              >
                <TrendingUpIcon className="w-4 h-4 mr-2" />
                Explore Trending
              </Button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl" />
        </motion.div>
      )}

      {/* AI-Powered Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <SparkleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">AI Suggestions</h3>
              <p className="text-sm text-black/60">Personalized topics based on popular learning paths</p>
            </div>
          </div>
          <Button
            onClick={loadAISuggestions}
            variant="ghost"
            size="sm"
            className="rounded-full"
            disabled={isLoadingSuggestions}
          >
            <RefreshIcon className={`w-4 h-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            {isLoadingSuggestions ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-2"
              >
                <Card className="p-8 bg-white/50 border-black/5">
                  <div className="flex items-center justify-center gap-3">
                    <RefreshIcon className="w-5 h-5 animate-spin text-black/40" />
                    <span className="text-black/60">Generating personalized suggestions...</span>
                  </div>
                </Card>
              </motion.div>
            ) : (
              aiSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="p-4 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group border-black/5"
                    onClick={() => onCreateCard(suggestion)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-black/80 group-hover:text-black transition-colors">
                          {suggestion}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <ZapIcon className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-black/50">Quick generate</span>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-black/30 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={`rounded-full px-4 py-2 whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? 'bg-black text-white' 
                    : 'hover:bg-black/5'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </motion.div>

      {/* Trending Topics Grid */}
      <motion.div
        id="trending"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUpIcon className="w-5 h-5 text-black/60" />
          <h3 className="text-xl font-semibold">Trending Topics</h3>
          {filteredTopics.filter(t => t.trending).length > 0 && (
            <Badge className="bg-red-50 text-red-600 border-red-200">
              {filteredTopics.filter(t => t.trending).length} hot
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300 border-black/5 group cursor-pointer h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${topic.color}15` }}
                  >
                    <HashIcon className="w-6 h-6" style={{ color: topic.color }} />
                  </div>
                  {topic.trending && (
                    <Badge className="bg-red-50 text-red-600 border-red-200">
                      <TrendingUpIcon className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                <h4 className="text-lg font-semibold mb-2">{topic.title}</h4>
                <p className="text-sm text-black/60 mb-4 flex-grow">{topic.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                    <div className="flex items-center gap-3 text-black/50">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-3 h-3" />
                        {topic.learners.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        {topic.cardCount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5">
                    <p className="text-xs text-black/50 mb-2">Example cards:</p>
                    <div className="space-y-1">
                      {topic.exampleCards.slice(0, 2).map((card, i) => (
                        <p key={i} className="text-xs text-black/70 truncate">
                          • {card}
                        </p>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => onStartLearning(topic.id)}
                    className="w-full bg-black text-white hover:bg-black/90 rounded-full py-2 mt-3 group-hover:shadow-lg transition-all"
                  >
                    Start Learning
                    <ChevronRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid sm:grid-cols-3 gap-4 mt-8"
      >
        <Card 
          className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200/50 hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => onCreateCard("Import my notes and create study cards")}
        >
          <BookOpenIcon className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold mb-1">Import Notes</h4>
          <p className="text-sm text-black/60">Convert PDFs & docs to cards</p>
        </Card>

        <Card 
          className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200/50 hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => onCreateCard("Create a study plan for my upcoming exam")}
        >
          <RocketIcon className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold mb-1">Exam Prep</h4>
          <p className="text-sm text-black/60">AI-powered study plans</p>
        </Card>

        <Card 
          className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200/50 hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => onCreateCard("Help me learn from this article or video")}
        >
          <GlobeIcon className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold mb-1">Learn from Web</h4>
          <p className="text-sm text-black/60">Extract knowledge from URLs</p>
        </Card>
      </motion.div>
    </div>
  )
}