'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Target, Flame, Users, Star, Clock } from 'lucide-react'

interface Achievement {
  id: string
  title?: string
  name?: string
  description: string
  category?: string
  points?: number
  unlocked?: boolean
  progress?: number
  unlockedAt?: string
}

interface StudyStreak {
  current_streak: number | null
  longest_streak: number | null
  last_study_date: string | null
  total_study_days: number | null
}

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'streak': return <Flame className="h-5 w-5" />
    case 'mastery': return <Target className="h-5 w-5" />
    case 'social': return <Users className="h-5 w-5" />
    case 'milestone': return <Trophy className="h-5 w-5" />
    case 'special': return <Star className="h-5 w-5" />
    default: return <Trophy className="h-5 w-5" />
  }
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'streak': return 'bg-orange-500/10 text-orange-500'
    case 'mastery': return 'bg-purple-500/10 text-purple-500'
    case 'social': return 'bg-blue-500/10 text-blue-500'
    case 'milestone': return 'bg-green-500/10 text-green-500'
    case 'special': return 'bg-yellow-500/10 text-yellow-500'
    default: return 'bg-gray-500/10 text-gray-500'
  }
}

export function AchievementsDisplay() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set())
  const [streak, setStreak] = useState<StudyStreak | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAchievements()
    loadStreak()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAchievements = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check if we have the new achievements table structure
    // For now, we'll check by attempting to query and handling the error
    let hasNameColumn = false
    
    try {
      await supabase
        .from('achievements')
        .select('name')
        .limit(1)
      hasNameColumn = true
    } catch {
      hasNameColumn = false
    }

    if (hasNameColumn) {
      // New structure with categories
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: false })

      const { data: userAchievementsData } = await supabase
        .from('user_achievements')
        .select('achievement_id, progress, unlocked_at')
        .eq('user_id', user.id)

      if (allAchievements) {
        const achievementsMap = new Map(
          userAchievementsData?.map(ua => [ua.achievement_id, ua]) || []
        )

        const enrichedAchievements = allAchievements.map(a => ({
          ...a,
          unlocked: achievementsMap.has(a.id),
          progress: achievementsMap.get(a.id)?.progress || 0,
          unlockedAt: achievementsMap.get(a.id)?.unlocked_at || undefined
        }))

        setAchievements(enrichedAchievements)
        setUserAchievements(new Set(achievementsMap.keys()))
      }
    } else {
      // Old structure
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })

      if (data) {
        setAchievements(data.map(a => ({ ...a, unlocked: true })))
      }
    }

    setLoading(false)
  }

  const loadStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('study_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setStreak(data)
    }
  }

  if (loading) {
    return <div>Loading achievements...</div>
  }

  return (
    <div className="space-y-6">
      {streak && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{streak.current_streak || 0}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{streak.longest_streak || 0}</p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{streak.total_study_days || 0}</p>
                <p className="text-sm text-muted-foreground">Total Days</p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {streak.last_study_date 
                    ? new Date(streak.last_study_date).toLocaleDateString()
                    : 'Never'}
                </p>
                <p className="text-sm text-muted-foreground">Last Study</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            {userAchievements.size} of {achievements.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-background' 
                    : 'bg-muted/30 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-lg ${getCategoryColor(achievement.category)}`}>
                  {getCategoryIcon(achievement.category)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">
                        {achievement.name || achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.points && (
                      <Badge variant="secondary">
                        {achievement.points} pts
                      </Badge>
                    )}
                  </div>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <Progress value={achievement.progress} className="h-2" />
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}