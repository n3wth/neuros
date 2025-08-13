'use server'

import { createClient } from '@/lib/supabase/server'

export type Insight = {
  type: 'achievement' | 'pattern' | 'suggestion' | 'warning' | 'milestone'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action?: string
  metric?: string | number
  icon?: 'trophy' | 'trend' | 'lightbulb' | 'alert' | 'flag'
}

/**
 * Generate data-driven insights based on actual user behavior
 * No AI API calls needed - pure data analysis
 */
export async function generateDataDrivenInsights(): Promise<Insight[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const insights: Insight[] = []

  // Fetch all relevant data in parallel
  const [
    userStats,
    recentReviews,
    cardStats,
    topicPerformance,
    timePatterns,
    strugglingCards
  ] = await Promise.all([
    getUserStats(supabase, user.id),
    getRecentReviews(supabase, user.id),
    getCardStatistics(supabase, user.id),
    getTopicPerformance(supabase, user.id),
    getStudyTimePatterns(supabase, user.id),
    getStrugglingCards(supabase, user.id)
  ])

  // 1. Streak-based insights
  if (userStats.current_streak_days >= 7) {
    insights.push({
      type: 'achievement',
      priority: 'high',
      title: `${userStats.current_streak_days}-Day Streak! 🔥`,
      description: `You've studied consistently for ${userStats.current_streak_days} days. Your dedication is building lasting knowledge.`,
      metric: userStats.current_streak_days,
      icon: 'trophy'
    })
  } else if (userStats.current_streak_days === 0 && userStats.last_study_date) {
    const daysSinceLastStudy = Math.floor((Date.now() - new Date(userStats.last_study_date).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLastStudy >= 3) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'Time to get back on track',
        description: `It's been ${daysSinceLastStudy} days since your last review. Even 5 minutes today will help maintain your knowledge.`,
        action: 'Start a quick review session',
        icon: 'alert'
      })
    }
  }

  // 2. Accuracy-based insights
  if (recentReviews.length >= 10) {
    const recentAccuracy = recentReviews.filter(r => r.quality >= 3).length / recentReviews.length
    
    if (recentAccuracy >= 0.9) {
      insights.push({
        type: 'achievement',
        priority: 'medium',
        title: 'Outstanding accuracy!',
        description: `You got ${Math.round(recentAccuracy * 100)}% correct in your last ${recentReviews.length} reviews. You're mastering this material.`,
        metric: `${Math.round(recentAccuracy * 100)}%`,
        icon: 'trophy'
      })
    } else if (recentAccuracy < 0.6) {
      insights.push({
        type: 'suggestion',
        priority: 'high',
        title: 'Consider reviewing more frequently',
        description: `Your recent accuracy is ${Math.round(recentAccuracy * 100)}%. Shorter, more frequent sessions might help improve retention.`,
        action: 'Try 5-minute daily reviews',
        icon: 'lightbulb'
      })
    }
  }

  // 3. Study time patterns
  if (timePatterns.bestHour !== null) {
    insights.push({
      type: 'pattern',
      priority: 'low',
      title: `Peak performance at ${formatHour(timePatterns.bestHour)}`,
      description: `You tend to perform best when studying around ${formatHour(timePatterns.bestHour)}. Your accuracy is ${Math.round(timePatterns.bestHourAccuracy * 100)}% during this time.`,
      metric: formatHour(timePatterns.bestHour),
      icon: 'trend'
    })
  }

  // 4. Topic-specific insights
  if (topicPerformance.weakestTopic && topicPerformance.weakestTopicAccuracy < 0.7) {
    insights.push({
      type: 'suggestion',
      priority: 'medium',
      title: `Focus on ${topicPerformance.weakestTopic}`,
      description: `This topic has your lowest accuracy at ${Math.round(topicPerformance.weakestTopicAccuracy * 100)}%. Consider creating more cards or spending extra time here.`,
      action: 'Create practice cards',
      icon: 'lightbulb'
    })
  }

  if (topicPerformance.strongestTopic && topicPerformance.strongestTopicAccuracy >= 0.85) {
    insights.push({
      type: 'achievement',
      priority: 'low',
      title: `Mastering ${topicPerformance.strongestTopic}`,
      description: `With ${Math.round(topicPerformance.strongestTopicAccuracy * 100)}% accuracy, you've nearly mastered this topic!`,
      metric: `${Math.round(topicPerformance.strongestTopicAccuracy * 100)}%`,
      icon: 'trophy'
    })
  }

  // 5. Card difficulty insights
  if (strugglingCards.length >= 3) {
    insights.push({
      type: 'warning',
      priority: 'high',
      title: `${strugglingCards.length} challenging cards`,
      description: 'These cards have been reviewed multiple times with low success. Consider breaking them into simpler concepts.',
      action: 'Review difficult cards',
      metric: strugglingCards.length,
      icon: 'alert'
    })
  }

  // 6. Milestone insights
  const totalReviews = userStats.total_reviews || 0
  const milestones = [100, 500, 1000, 5000, 10000]
  const nextMilestone = milestones.find(m => m > totalReviews)
  
  if (nextMilestone && (nextMilestone - totalReviews) <= 50) {
    insights.push({
      type: 'milestone',
      priority: 'medium',
      title: `Approaching ${nextMilestone.toLocaleString()} reviews!`,
      description: `Just ${nextMilestone - totalReviews} more reviews to reach this milestone. Keep going!`,
      metric: nextMilestone - totalReviews,
      icon: 'flag'
    })
  }

  // 7. Velocity insights
  if (cardStats.newCardsLastWeek > cardStats.newCardsWeekBefore * 2 && cardStats.newCardsLastWeek >= 10) {
    insights.push({
      type: 'pattern',
      priority: 'medium',
      title: 'Learning velocity increased!',
      description: `You created ${cardStats.newCardsLastWeek} cards this week, ${Math.round((cardStats.newCardsLastWeek / cardStats.newCardsWeekBefore - 1) * 100)}% more than last week.`,
      metric: `+${Math.round((cardStats.newCardsLastWeek / cardStats.newCardsWeekBefore - 1) * 100)}%`,
      icon: 'trend'
    })
  }

  // 8. Due cards insight
  if (cardStats.dueCards > 20) {
    insights.push({
      type: 'suggestion',
      priority: 'high',
      title: `${cardStats.dueCards} cards ready for review`,
      description: 'You have a backlog building up. Consider a focused review session to stay on track.',
      action: 'Start review session',
      metric: cardStats.dueCards,
      icon: 'alert'
    })
  } else if (cardStats.dueCards === 0 && cardStats.totalCards > 0) {
    insights.push({
      type: 'achievement',
      priority: 'low',
      title: 'All caught up!',
      description: 'No cards due for review. Great job staying on top of your learning!',
      icon: 'trophy'
    })
  }

  // Sort insights by priority
  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// Helper functions for data fetching
async function getUserStats(supabase: any, userId: string) {
  const { data } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return data || {
    total_reviews: 0,
    current_streak_days: 0,
    average_accuracy: 0,
    last_study_date: null
  }
}

async function getRecentReviews(supabase: any, userId: string, limit = 20) {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return data || []
}

async function getCardStatistics(supabase: any, userId: string) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  
  const [totalCards, dueCards, thisWeek, lastWeek] = await Promise.all([
    supabase.from('cards').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('user_cards').select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('next_review_date', now.toISOString()),
    supabase.from('cards').select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString()),
    supabase.from('cards').select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', oneWeekAgo.toISOString())
  ])
  
  return {
    totalCards: totalCards.count || 0,
    dueCards: dueCards.count || 0,
    newCardsLastWeek: thisWeek.count || 0,
    newCardsWeekBefore: lastWeek.count || 0
  }
}

async function getTopicPerformance(supabase: any, userId: string) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      quality,
      cards!inner (
        topic_id,
        topics (
          name
        )
      )
    `)
    .eq('user_id', userId)
    .not('cards.topic_id', 'is', null)
  
  if (!reviews || reviews.length === 0) {
    return { weakestTopic: null, strongestTopic: null }
  }
  
  // Group by topic and calculate accuracy
  const topicStats = new Map()
  
  reviews.forEach(review => {
    const topicName = review.cards?.topics?.name
    if (!topicName) return
    
    if (!topicStats.has(topicName)) {
      topicStats.set(topicName, { correct: 0, total: 0 })
    }
    
    const stats = topicStats.get(topicName)
    stats.total++
    if (review.quality >= 3) stats.correct++
  })
  
  let weakest = { topic: null, accuracy: 1 }
  let strongest = { topic: null, accuracy: 0 }
  
  topicStats.forEach((stats, topic) => {
    const accuracy = stats.correct / stats.total
    if (stats.total >= 5) { // Only consider topics with enough data
      if (accuracy < weakest.accuracy) {
        weakest = { topic, accuracy }
      }
      if (accuracy > strongest.accuracy) {
        strongest = { topic, accuracy }
      }
    }
  })
  
  return {
    weakestTopic: weakest.topic,
    weakestTopicAccuracy: weakest.accuracy,
    strongestTopic: strongest.topic,
    strongestTopicAccuracy: strongest.accuracy
  }
}

async function getStudyTimePatterns(supabase: any, userId: string) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('created_at, quality')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (!reviews || reviews.length === 0) {
    return { bestHour: null, bestHourAccuracy: 0 }
  }
  
  // Group by hour of day
  const hourStats = new Map()
  
  reviews.forEach(review => {
    const hour = new Date(review.created_at).getHours()
    if (!hourStats.has(hour)) {
      hourStats.set(hour, { correct: 0, total: 0 })
    }
    
    const stats = hourStats.get(hour)
    stats.total++
    if (review.quality >= 3) stats.correct++
  })
  
  let bestHour = { hour: null, accuracy: 0 }
  
  hourStats.forEach((stats, hour) => {
    if (stats.total >= 5) { // Only consider hours with enough data
      const accuracy = stats.correct / stats.total
      if (accuracy > bestHour.accuracy) {
        bestHour = { hour, accuracy }
      }
    }
  })
  
  return {
    bestHour: bestHour.hour,
    bestHourAccuracy: bestHour.accuracy
  }
}

async function getStrugglingCards(supabase: any, userId: string) {
  const { data } = await supabase
    .from('user_cards')
    .select(`
      card_id,
      ease_factor,
      total_reviews,
      correct_reviews,
      cards (
        front
      )
    `)
    .eq('user_id', userId)
    .lt('ease_factor', 2.0) // Cards with low ease factor are struggling
    .gte('total_reviews', 3) // Only cards that have been reviewed multiple times
    .order('ease_factor', { ascending: true })
    .limit(5)
  
  return data || []
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}