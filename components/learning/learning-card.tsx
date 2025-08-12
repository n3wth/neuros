'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, BarChart3, Calendar, RefreshCw } from 'lucide-react'

interface LearningCardProps {
  card: {
    id: string
    title: string
    category: string
    type: string
    difficulty: string
    timeEstimate: number
    dueIn: string
    priority: string
    masteryLevel: number
    lastReviewed: string
    reviewCount: number
    icon: React.ComponentType<{ className?: string }>
    gradient: string
  }
  isActive: boolean
  onActivate: () => void
}

export default function LearningCard({ card, isActive, onActivate }: LearningCardProps) {
  const Icon = card.icon
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10'
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10'
      case 'low': return 'border-green-500/50 bg-green-500/10'
      default: return 'border-white/10 bg-white/5'
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return { color: 'bg-green-600/20 text-green-400', label: 'Beginner' }
      case 'intermediate': return { color: 'bg-yellow-600/20 text-yellow-400', label: 'Intermediate' }
      case 'advanced': return { color: 'bg-red-600/20 text-red-400', label: 'Advanced' }
      default: return { color: 'bg-gray-600/20 text-gray-400', label: difficulty }
    }
  }

  const difficultyInfo = getDifficultyBadge(card.difficulty)

  return (
    <Card 
      className={`bg-white/5 backdrop-blur-xl border transition-all duration-300 hover:bg-white/10 cursor-pointer ${
        isActive ? 'border-white/30 shadow-lg shadow-white/10' : getPriorityColor(card.priority)
      }`}
      onClick={onActivate}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={difficultyInfo.color + ' border-0'}>
                  {difficultyInfo.label}
                </Badge>
                <span className="text-xs text-gray-400">• {card.type}</span>
                <span className="text-xs text-gray-400">• {card.timeEstimate} min</span>
              </div>
            </div>
          </div>

          <Button 
            size="sm"
            className="bg-white/10 backdrop-blur text-white hover:bg-white/20 border border-white/20"
          >
            Start
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Due</span>
            </div>
            <p className="text-sm font-medium text-white">{card.dueIn}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Mastery</span>
            </div>
            <p className="text-sm font-medium text-white">{card.masteryLevel}/5.0</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <RefreshCw className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Reviews</span>
            </div>
            <p className="text-sm font-medium text-white">{card.reviewCount}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Last</span>
            </div>
            <p className="text-sm font-medium text-white">{card.lastReviewed}</p>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="mt-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(card.masteryLevel / 5) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}