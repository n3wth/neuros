'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { 
  BookIcon, 
  RocketIcon, 
  SparkleIcon, 
  ChartIcon, 
  HeartIcon 
} from '@/components/icons/line-icons'

interface StatsData {
  totalCards: number
  mastered: number
  dueCards: number
}

interface StudyStats {
  average_accuracy: number
  total_reviews: number
}

interface DashboardStatsProps {
  stats: StatsData | null
  studyStats: StudyStats | null
}

export default function DashboardStats({ stats, studyStats }: DashboardStatsProps) {
  const statCards = [
    { icon: BookIcon, label: 'Total', value: stats?.totalCards || 0, unit: 'cards' },
    { icon: RocketIcon, label: 'Mastered', value: stats?.mastered || 0, unit: 'cards' },
    { icon: SparkleIcon, label: 'Due', value: stats?.dueCards || 0, unit: 'today' },
    { icon: ChartIcon, label: 'Accuracy', value: `${studyStats?.average_accuracy || 0}%`, unit: 'average' },
    { icon: HeartIcon, label: 'Reviews', value: studyStats?.total_reviews || 0, unit: 'total' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-black/5 hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-6 h-6 text-black/70 stroke-[1.5]" />
              <span className="text-xs text-black/40 font-mono">{stat.label}</span>
            </div>
            <p className="text-3xl font-serif font-light text-black/90">{stat.value}</p>
            <p className="text-xs text-black/50 font-light">{stat.unit}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}