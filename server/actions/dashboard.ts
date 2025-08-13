'use server'

import { createClient } from '@/lib/supabase/server'
import { 
  getUserCards, 
  getDueCards, 
  getCardStats,
  getUpcomingCards,
  getUserCompletionState 
} from './cards'
import { getStudyStats } from './reviews'
import { generateDataDrivenInsights } from './insights'
import { logger } from '@/lib/logger'

/**
 * Mobile-optimized dashboard data loader
 * Batches all dashboard data requests into a single server action
 * to reduce network requests and improve mobile performance
 */
export async function loadDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const startTime = Date.now()
  
  try {
    // Execute all data fetching in parallel for optimal performance
    const [
      userCards,
      dueCardsData,
      cardStats,
      studyStatsData,
      upcomingData,
      userCompletionState,
      insights
    ] = await Promise.allSettled([
      getUserCards(),
      getDueCards(10),
      getCardStats(),
      getStudyStats(),
      getUpcomingCards(),
      getUserCompletionState(),
      generateDataDrivenInsights().catch(() => []) // Optional - fail gracefully
    ])

    // Process results with proper error handling
    const processSettledResult = <T>(result: PromiseSettledResult<T>, fallback: T): T => {
      return result.status === 'fulfilled' ? result.value : fallback
    }

    const dashboardData = {
      cards: processSettledResult(userCards, []).map(card => ({
        id: card.id,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || 'medium',
        topics: card.topics ? {
          name: card.topics.name,
          color: card.topics.color || '#999999'
        } : undefined,
        user_cards: card.user_cards?.map(uc => ({
          mastery_level: uc.mastery_level || 0
        }))
      })),
      
      dueCards: processSettledResult(dueCardsData, []).map(item => ({
        id: item.id,
        cards: {
          front: item.cards.front,
          back: item.cards.back,
          topics: item.cards.topics ? {
            name: item.cards.topics.name
          } : undefined
        },
        mastery_level: item.mastery_level || 0,
        total_reviews: item.total_reviews || 0
      })),
      
      stats: processSettledResult(cardStats, null),
      
      studyStats: processSettledResult(studyStatsData, null) ? {
        total_reviews: processSettledResult(studyStatsData, null)?.total_reviews || 0,
        average_accuracy: processSettledResult(studyStatsData, null)?.average_accuracy || 0,
        total_study_time_minutes: processSettledResult(studyStatsData, null)?.total_study_time_minutes || 0,
        current_streak_days: processSettledResult(studyStatsData, null)?.current_streak_days || 0
      } : null,
      
      upcomingCards: (() => {
        const upcoming = processSettledResult(upcomingData, {})
        const formattedUpcoming: Record<string, Array<{ id: string }>> = {}
        
        Object.entries(upcoming).forEach(([date, items]) => {
          if (Array.isArray(items)) {
            formattedUpcoming[date] = items.map((item: any) => ({ 
              id: item.cards?.id || item.id || ''
            }))
          }
        })
        
        return formattedUpcoming
      })(),
      
      completionState: processSettledResult(userCompletionState, null),
      
      insights: processSettledResult(insights, []).slice(0, 5), // Limit insights for mobile
      
      _metadata: {
        loadTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        userId: user.id
      }
    }

    // Log performance for monitoring
    logger.info('Dashboard data loaded (batched)', {
      userId: user.id,
      loadTime: dashboardData._metadata.loadTime,
      cardCount: dashboardData.cards.length,
      dueCount: dashboardData.dueCards.length,
      action: 'dashboard_data_batch_success'
    })

    return dashboardData
  } catch (error) {
    logger.error('Dashboard batch load failed', {
      userId: user.id,
      error,
      loadTime: Date.now() - startTime,
      action: 'dashboard_data_batch_error'
    })
    throw error
  }
}

/**
 * Lightweight mobile dashboard data for quick loading
 * Returns essential data only for mobile first-paint optimization
 */
export async function loadMobileDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const startTime = Date.now()
  
  try {
    // Load only essential data for mobile first paint
    const [cardStats, studyStatsData, userCompletionState] = await Promise.allSettled([
      getCardStats(),
      getStudyStats(), 
      getUserCompletionState()
    ])

    const processSettledResult = <T>(result: PromiseSettledResult<T>, fallback: T): T => {
      return result.status === 'fulfilled' ? result.value : fallback
    }

    const mobileData = {
      stats: processSettledResult(cardStats, null),
      studyStats: processSettledResult(studyStatsData, null),
      completionState: processSettledResult(userCompletionState, null),
      _metadata: {
        loadTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        userId: user.id,
        type: 'mobile_optimized'
      }
    }

    logger.info('Mobile dashboard data loaded', {
      userId: user.id,
      loadTime: mobileData._metadata.loadTime,
      action: 'mobile_dashboard_success'
    })

    return mobileData
  } catch (error) {
    logger.error('Mobile dashboard load failed', {
      userId: user.id,
      error,
      loadTime: Date.now() - startTime,
      action: 'mobile_dashboard_error'
    })
    throw error
  }
}

/**
 * Progressive dashboard data loading
 * Loads critical data first, then non-critical data
 */
export async function loadDashboardDataProgressive() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // First, load critical data quickly
  const criticalData = await loadMobileDashboardData()
  
  // Then load secondary data in the background
  setTimeout(async () => {
    try {
      const [dueCardsData, upcomingData, insights] = await Promise.allSettled([
        getDueCards(5), // Reduce initial load
        getUpcomingCards(),
        generateDataDrivenInsights().catch(() => [])
      ])
      
      // This would typically trigger a state update in the client component
      logger.info('Progressive dashboard data loaded', {
        userId: user.id,
        action: 'progressive_dashboard_secondary'
      })
    } catch (error) {
      logger.error('Progressive secondary data failed', { userId: user.id, error })
    }
  }, 0)
  
  return criticalData
}