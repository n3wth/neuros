'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparkleIcon,
  RefreshIcon,
  RocketIcon,
  BookIcon,
  GlobeIcon,
  BrainIcon,
  TrendingIcon,
  ChevronRightIcon,
  PlusIcon,
  ZapIcon
} from '@/components/icons/line-icons'
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
  const [isLoadingTopics, setIsLoadingTopics] = useState(true)

  const categories = [
    { id: 'all', name: 'All Topics', icon: GlobeIcon },
    { id: 'Technology', name: 'Technology', icon: RocketIcon },
    { id: 'Languages', name: 'Languages', icon: BookIcon },
    { id: 'Science', name: 'Science', icon: BrainIcon },
    { id: 'Business', name: 'Business', icon: TrendingIcon },
    { id: 'History', name: 'History', icon: BookIcon }
  ]

  useEffect(() => {
    loadTrendingTopics()
    loadAISuggestions()
  }, [userLevel]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadTrendingTopics = async () => {
    setIsLoadingTopics(true)
    try {
      const result = await getTrendingTopics()
      if (result.topics) {
        setTrendingTopics(result.topics)
      }
    } catch (error) {
      console.error('Failed to load trending topics:', error)
    } finally {
      setIsLoadingTopics(false)
    }
  }

  const loadAISuggestions = async (forceRefresh = false) => {
    setIsLoadingSuggestions(true)
    try {
      const result = await generateAISuggestions(userLevel, forceRefresh)
      if (result.suggestions) {
        setAiSuggestions(result.suggestions)
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

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
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-light mb-3 text-black/90">
          Discover Your Next Learning Adventure
        </h1>
        <p className="text-lg text-black/60 font-light leading-[1.6]">
          Explore trending topics and get personalized AI suggestions
        </p>
      </motion.div>

      {/* AI Suggestions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="p-8 bg-white border-black/5">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <SparkleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-normal text-black/90">
                  AI-Powered Suggestions
                </h2>
                <p className="text-sm text-black/60 mt-1 leading-relaxed">
                  Personalized learning ideas just for you
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadAISuggestions(true)}
              disabled={isLoadingSuggestions}
              className="hover:bg-black/5"
            >
              <RefreshIcon className={`w-4 h-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {isLoadingSuggestions ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-black/5 rounded-xl"></div>
                  </div>
                ))}
              </>
            ) : (
              <AnimatePresence mode="wait">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => onCreateCard(suggestion)}
                    className="group relative p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <ZapIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-sm font-normal text-black/80 leading-relaxed flex-1">
                        {suggestion}
                      </p>
                    </div>
                    <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black/70 border-black/10 hover:border-black/30 hover:bg-black/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Trending Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-normal text-black/90">
            Trending Topics
          </h2>
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
            <TrendingIcon className="w-3 h-3 mr-1" />
            {filteredTopics.filter(t => t.trending).length} trending
          </Badge>
        </div>

        {isLoadingTopics ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-64 bg-black/5"></Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="group relative h-full p-6 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-black/5"
                    onClick={() => onStartLearning(topic.id)}
                  >
                    {/* Trending Badge */}
                    {topic.trending && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-400 blur-md opacity-50 animate-pulse"></div>
                          <Badge className="relative bg-orange-400 text-white border-0">
                            <TrendingIcon className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Category & Difficulty */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {topic.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(topic.difficulty)}`}>
                        {topic.difficulty}
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-serif font-normal mb-2 text-black/90 group-hover:text-purple-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-black/60 mb-4 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-black/50">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">#</span>
                        <span>{topic.cardCount} cards</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👥</span>
                        <span>{topic.learners.toLocaleString()} learners</span>
                      </div>
                    </div>

                    {/* Example Cards */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-black/40 uppercase tracking-wider">
                        Sample cards:
                      </p>
                      {topic.exampleCards.slice(0, 2).map((card, i) => (
                        <div key={i} className="text-sm text-black/70 pl-3 border-l-2 border-purple-100 leading-relaxed">
                          {card}
                        </div>
                      ))}
                    </div>

                    {/* Hover Action */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-purple-600 text-white rounded-full">
                        <PlusIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Quick Start CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <Card className="p-8 bg-purple-50 border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-serif font-normal mb-2 text-black/90">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-black/60 leading-relaxed">
                Create your own custom learning deck with AI assistance
              </p>
            </div>
            <Button
              onClick={() => onCreateCard()}
              size="lg"
              className="bg-black text-white hover:bg-black/90"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Custom Deck
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}