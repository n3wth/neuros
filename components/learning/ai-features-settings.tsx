'use client'

import { ChevronRight, Brain, TrendingUp, BarChart, Zap, Clock, Award, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  algorithm?: string
  research?: string
  stats?: {
    primary?: { value: string; label: string }
    secondary?: { value: string; label: string }
    tertiary?: { value: string; label: string }
  }
  metrics?: {
    label: string
    value: number
    subtitle?: string
    detail?: string
  }[]
  badge?: string
  icon?: React.ReactNode
  onClick?: () => void
  expanded?: boolean
}

function FeatureCard({ 
  title, 
  description, 
  algorithm,
  research,
  stats, 
  metrics, 
  badge,
  icon,
  onClick,
  expanded = false 
}: FeatureCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg bg-white border-gray-200 overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {icon && (
              <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  {algorithm && (
                    <p className="text-xs text-blue-600 font-medium mt-1">{algorithm}</p>
                  )}
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  expanded && "rotate-90"
                )} />
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
        
        {research && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-700">{research}</p>
            </div>
          </div>
        )}
        
        {stats && (
          <div className="flex items-center gap-6 pt-2">
            {stats.primary && (
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.primary.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stats.primary.label}</div>
              </div>
            )}
            {stats.secondary && (
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.secondary.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stats.secondary.label}</div>
              </div>
            )}
            {stats.tertiary && (
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.tertiary.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stats.tertiary.label}</div>
              </div>
            )}
            {badge && (
              <Badge className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                {badge}
              </Badge>
            )}
          </div>
        )}
        
        {metrics && metrics.length > 0 && (
          <div className="space-y-3 pt-4">
            {metrics.map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
                {(metric.subtitle || metric.detail) && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-500">{metric.subtitle}</span>
                    <span className="text-gray-600">{metric.detail}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface AIFeaturesSettingsProps {
  className?: string
  onFeatureClick?: (feature: string) => void
}

export default function AIFeaturesSettings({ className, onFeatureClick }: AIFeaturesSettingsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const handleFeatureClick = (feature: string) => {
    setExpandedCard(expandedCard === feature ? null : feature)
    if (onFeatureClick) {
      onFeatureClick(feature)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <FeatureCard
        title="SM-2 Spaced Repetition Algorithm"
        algorithm="SuperMemo 2.0 (1987) • Forgetting Curve Optimization"
        description="Scientifically proven algorithm that calculates optimal review intervals based on your performance, ensuring information moves from short-term to long-term memory."
        research="Research shows SM-2 delivers 2x faster learning compared to traditional methods. The algorithm adjusts ease factors (2.5 default) based on your 0-5 quality ratings."
        stats={{
          primary: { value: "200%", label: "Faster Acquisition" },
          secondary: { value: "50%", label: "Better Retention" }
        }}
        icon={<Brain className="h-6 w-6 text-blue-600" />}
        onClick={() => handleFeatureClick('spacing')}
        expanded={expandedCard === 'spacing'}
      />
      
      <FeatureCard
        title="Zone of Proximal Development"
        algorithm="Vygotsky's ZPD Theory • Item Response Theory"
        description="Dynamically adjusts content difficulty to keep you in the optimal learning zone - challenging enough to grow, but not so hard you get frustrated."
        research="Maintains 80% target success rate based on educational psychology research. Uses IRT (Item Response Theory) to calibrate question difficulty to your ability level."
        stats={{
          primary: { value: "80%", label: "Target Success" },
          secondary: { value: "35%", label: "Faster Progress" }
        }}
        metrics={[
          { 
            label: "Current Performance Zone", 
            value: 82,
            subtitle: "Optimal challenge level",
            detail: "Adjusting..."
          }
        ]}
        icon={<TrendingUp className="h-6 w-6 text-green-600" />}
        onClick={() => handleFeatureClick('difficulty')}
        expanded={expandedCard === 'difficulty'}
      />
      
      <FeatureCard
        title="Predictive Learning Analytics"
        algorithm="Machine Learning • Engagement Tracking"
        description="Advanced analytics track persistence, consistency, and engagement patterns to predict success and identify when you need support."
        research="Studies show 65% accuracy in predicting at-risk learners. Students with high consistency achieve 65% better performance outcomes."
        stats={{
          primary: { value: "65%", label: "Prediction Accuracy" },
          secondary: { value: "92%", label: "Retention Rate" }
        }}
        badge="AI-Powered"
        metrics={[
          { 
            label: "Consistency Score", 
            value: 88,
            subtitle: "Last 30 days",
            detail: "Excellent"
          },
          { 
            label: "Engagement Index", 
            value: 75,
            subtitle: "Time on task",
            detail: "Above average"
          }
        ]}
        icon={<BarChart className="h-6 w-6 text-purple-600" />}
        onClick={() => handleFeatureClick('analytics')}
        expanded={expandedCard === 'analytics'}
      />
      
      <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Live Algorithm Demo</h4>
                <p className="text-xs text-gray-600">SM-2 in action</p>
              </div>
            </div>
            
            <div className="space-y-3 bg-white rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Ease Factor</p>
                  <p className="font-mono font-semibold">2.36</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Quality Rating</p>
                  <p className="font-mono font-semibold">4/5</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Current Interval</p>
                  <p className="font-mono font-semibold">6 days</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Next Interval</p>
                  <p className="font-mono font-semibold text-green-600">14 days</p>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Memory Strength</span>
                  <span className="text-sm font-semibold text-gray-900">87%</span>
                </div>
                <Progress value={87} className="h-2 bg-gray-200" />
                <p className="text-xs text-gray-500 mt-2">
                  Based on 12 successful reviews • Last reviewed 3 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced version with floating icon
export function AIFeaturesSettingsWithIcons({ className, onFeatureClick }: AIFeaturesSettingsProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -right-16 top-8 z-10">
        <div className="relative animate-pulse">
          <div className="w-24 h-24 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-2xl">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-spin-slow" />
          </div>
          <div className="absolute -top-2 -left-2">
            <Badge className="bg-green-500 text-white text-xs">
              <Award className="w-3 h-3 mr-1" />
              v2.0
            </Badge>
          </div>
        </div>
      </div>
      
      <AIFeaturesSettings className={className} onFeatureClick={onFeatureClick} />
    </div>
  )
}