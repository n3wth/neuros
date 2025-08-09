'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Lightbulb, 
  TrendingUp,
  BookOpen,
  Send,
  Mic,
  Volume2,
  ChevronRight,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react'

interface AIAssistantProps {
  userName: string
  currentCard?: any
}

export default function AIAssistant({ userName, currentCard }: AIAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const [showInsight, setShowInsight] = useState(true)

  const suggestions = [
    {
      type: 'insight',
      icon: Lightbulb,
      title: 'Pattern Detected',
      content: `${userName}, you learn GenAI concepts 40% faster in the morning. Consider scheduling advanced topics before noon.`,
      action: 'Optimize Schedule',
      color: 'from-yellow-600 to-orange-600'
    },
    {
      type: 'recommendation',
      icon: Target,
      title: 'Next Best Action',
      content: 'Based on your mastery of Transformers, I recommend diving into "Attention Mechanisms" next. It builds perfectly on what you know.',
      action: 'Add to Queue',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      type: 'motivation',
      icon: TrendingUp,
      title: 'Achievement Unlocked',
      content: "You're in the top 5% of learners this week! Your consistency with daily reviews is paying off.",
      action: 'View Stats',
      color: 'from-purple-600 to-pink-600'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const quickActions = [
    { label: 'Explain Simply', icon: BookOpen },
    { label: 'Real-World Example', icon: Lightbulb },
    { label: 'Test My Knowledge', icon: Brain },
    { label: 'Similar Concepts', icon: Sparkles }
  ]

  const currentSug = suggestions[currentSuggestion]
  const Icon = currentSug.icon

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border-white/10">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">AI Learning Assistant</h3>
              <p className="text-sm text-gray-400">Powered by advanced cognitive models</p>
            </div>
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
              Active
            </Badge>
          </div>

          {/* Dynamic Suggestions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSuggestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <div className={`p-4 rounded-xl bg-gradient-to-r ${currentSug.color} bg-opacity-10 border border-white/10`}>
                <div className="flex items-start gap-3 mb-2">
                  <Icon className="w-5 h-5 text-white mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">{currentSug.title}</p>
                    <p className="text-sm text-gray-300">{currentSug.content}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Button 
                    size="sm" 
                    className="bg-white/10 backdrop-blur text-white hover:bg-white/20 border border-white/20"
                  >
                    {currentSug.action}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                  <button
                    onClick={() => setCurrentSuggestion((prev) => (prev + 1) % suggestions.length)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <ActionIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-300">{action.label}</span>
                </button>
              )
            })}
          </div>

          {/* Chat Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything about your learning..."
              className="w-full px-4 py-3 bg-white/5 backdrop-blur rounded-xl border border-white/10 text-white placeholder-gray-400 pr-24 focus:outline-none focus:border-white/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-600/20 text-red-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Card Context */}
      {currentCard && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <div className="p-4">
            <h4 className="text-sm font-medium text-white mb-3">Currently Learning</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Topic</span>
                <span className="text-xs text-white">{currentCard.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Optimal Time</span>
                <span className="text-xs text-white">{currentCard.timeEstimate} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Your Pace</span>
                <span className="text-xs text-green-400">On Track</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Learning Tips */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h4 className="text-sm font-medium text-white">Pro Tips</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 text-xs mt-0.5">•</span>
              <span className="text-xs text-gray-300">Use Socratic mode for complex topics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 text-xs mt-0.5">•</span>
              <span className="text-xs text-gray-300">Review cards right before sleep for better retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 text-xs mt-0.5">•</span>
              <span className="text-xs text-gray-300">Enable voice mode while commuting</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}