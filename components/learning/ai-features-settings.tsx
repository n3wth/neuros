'use client'

import { 
  LightbulbIcon, 
  TrendingIcon, 
  ChartIcon, 
  InfoIcon,
  AwardIcon,
  ChevronRightIcon,
  WandIcon
} from '@/components/icons/line-icons'
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
      className="cursor-pointer transition-all duration-500 hover:shadow-md bg-white border-black/5 rounded-xl overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-5 flex-1">
            {icon && (
              <div className="p-3 bg-stone-50 rounded-xl group-hover:bg-stone-100 transition-colors duration-300">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-light text-black">{title}</h3>
                  {algorithm && (
                    <p className="text-xs text-black/60 font-light mt-2 font-mono">{algorithm}</p>
                  )}
                </div>
                <ChevronRightIcon className={cn(
                  "h-5 w-5 text-black/40 transition-transform duration-300",
                  expanded && "rotate-90"
                )} />
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-base text-black/60 font-light leading-relaxed mb-6">{description}</p>
        
        {research && (
          <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-4 w-4 text-blue-600 mt-1 shrink-0" />
              <p className="text-sm text-blue-800/80 font-light leading-relaxed">{research}</p>
            </div>
          </div>
        )}
        
        {stats && (
          <div className="flex items-center gap-8 pt-3">
            {stats.primary && (
              <div>
                <div className="text-3xl font-serif font-light text-black">{stats.primary.value}</div>
                <div className="text-xs text-black/50 mt-1 font-light">{stats.primary.label}</div>
              </div>
            )}
            {stats.secondary && (
              <div>
                <div className="text-3xl font-serif font-light text-black">{stats.secondary.value}</div>
                <div className="text-xs text-black/50 mt-1 font-light">{stats.secondary.label}</div>
              </div>
            )}
            {stats.tertiary && (
              <div>
                <div className="text-3xl font-serif font-light text-black">{stats.tertiary.value}</div>
                <div className="text-xs text-black/50 mt-1 font-light">{stats.tertiary.label}</div>
              </div>
            )}
            {badge && (
              <Badge className="ml-auto bg-black text-white rounded-full px-3 py-1">
                {badge}
              </Badge>
            )}
          </div>
        )}
        
        {metrics && metrics.length > 0 && (
          <div className="space-y-4 pt-6">
            {metrics.map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light text-black/70">{metric.label}</span>
                  <span className="text-sm font-serif text-black">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2.5 bg-black/5" />
                {(metric.subtitle || metric.detail) && (
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-black/50 font-light">{metric.subtitle}</span>
                    <span className="text-black/60 font-light">{metric.detail}</span>
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
    <div className={cn("space-y-6", className)}>
      <FeatureCard
        title="SM-2 Spaced Repetition Algorithm"
        algorithm="SuperMemo 2.0 (1987) • Forgetting Curve Optimization"
        description="Algorithm that calculates review intervals based on your performance, helping move information from short-term to long-term memory."
        research="The SM-2 algorithm adjusts ease factors based on your 0-5 quality ratings to determine when to show cards again."
        stats={{
          primary: { value: "200%", label: "Faster Acquisition" },
          secondary: { value: "50%", label: "Better Retention" }
        }}
        icon={<LightbulbIcon className="h-7 w-7 text-black/70" />}
        onClick={() => handleFeatureClick('spacing')}
        expanded={expandedCard === 'spacing'}
      />
      
      <FeatureCard
        title="Zone of Proximal Development"
        algorithm="Vygotsky's ZPD Theory • Item Response Theory"
        description="Dynamically adjusts content difficulty to keep you in the optimal learning zone - challenging enough to grow, but not so hard you get frustrated."
        research="Uses Item Response Theory concepts to calibrate question difficulty based on your performance history."
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
        icon={<TrendingIcon className="h-7 w-7 text-black/70" />}
        onClick={() => handleFeatureClick('difficulty')}
        expanded={expandedCard === 'difficulty'}
      />
      
      <FeatureCard
        title="Predictive Learning Analytics"
        algorithm="Machine Learning • Engagement Tracking"
        description="Advanced analytics track persistence, consistency, and engagement patterns to predict success and identify when you need support."
        research="Tracks learning patterns to identify areas that may need more attention. Consistent practice leads to better outcomes."
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
        icon={<ChartIcon className="h-7 w-7 text-black/70" />}
        onClick={() => handleFeatureClick('analytics')}
        expanded={expandedCard === 'analytics'}
      />
      
      <Card className="bg-stone-50/50 border-black/10 rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-black/5">
                <WandIcon className="h-6 w-6 text-black/70" />
              </div>
              <div>
                <h4 className="text-lg font-serif font-light text-black">Live Algorithm Demo</h4>
                <p className="text-sm text-black/60 font-light">SM-2 in action</p>
              </div>
            </div>
            
            <div className="space-y-5 bg-white rounded-xl p-6 border border-black/5">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-black/50 text-xs font-light mb-1">Ease Factor</p>
                  <p className="font-mono font-light text-lg text-black">2.36</p>
                </div>
                <div>
                  <p className="text-black/50 text-xs font-light mb-1">Quality Rating</p>
                  <p className="font-mono font-light text-lg text-black">4/5</p>
                </div>
                <div>
                  <p className="text-black/50 text-xs font-light mb-1">Current Interval</p>
                  <p className="font-mono font-light text-lg text-black">6 days</p>
                </div>
                <div>
                  <p className="text-black/50 text-xs font-light mb-1">Next Interval</p>
                  <p className="font-mono font-light text-lg text-green-700">14 days</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-black/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-light text-black/70">Memory Strength</span>
                  <span className="text-sm font-serif text-black">87%</span>
                </div>
                <Progress value={87} className="h-3 bg-black/5" />
                <p className="text-xs text-black/50 font-light mt-3 leading-relaxed">
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
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-lg">
            <LightbulbIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-black/10">
            <div className="w-8 h-8 bg-orange-500 rounded-full animate-spin-slow" />
          </div>
          <div className="absolute -top-2 -left-2">
            <Badge className="bg-black text-white text-xs rounded-full">
              <AwardIcon className="w-3 h-3 mr-1" />
              v2.0
            </Badge>
          </div>
        </div>
      </div>
      
      <AIFeaturesSettings className={className} onFeatureClick={onFeatureClick} />
    </div>
  )
}