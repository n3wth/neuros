'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { checkRateLimit, RateLimitExceededError } from '@/lib/rate-limit-redis'
import type { Database } from '@/types/supabase'

type Review = Database['public']['Tables']['reviews']['Insert']

// SM-2 Algorithm implementation
function calculateSM2(
  easeFactor: number,
  intervalDays: number,
  repetitions: number,
  rating: number // 0-5, where 0 is complete failure
): {
  easeFactor: number
  intervalDays: number
  repetitions: number
  nextReviewDate: Date
} {
  let newEaseFactor = easeFactor
  let newIntervalDays = intervalDays
  let newRepetitions = repetitions

  if (rating >= 3) {
    // Correct response
    if (repetitions === 0) {
      newIntervalDays = 1
    } else if (repetitions === 1) {
      newIntervalDays = 6
    } else {
      newIntervalDays = Math.round(intervalDays * easeFactor)
    }
    newRepetitions = repetitions + 1
  } else {
    // Incorrect response
    newRepetitions = 0
    newIntervalDays = 1
  }

  // Update ease factor
  newEaseFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
  newEaseFactor = Math.max(1.3, newEaseFactor) // Minimum ease factor

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays)

  return {
    easeFactor: newEaseFactor,
    intervalDays: newIntervalDays,
    repetitions: newRepetitions,
    nextReviewDate
  }
}

// Submit a review for a card
export async function submitReview(
  cardId: string,
  rating: number, // 0-5 rating
  responseTime: number, // in milliseconds
  sessionId?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  // Rate limit review submissions to prevent abuse
  try {
    await checkRateLimit(user.id, 'REVIEW_SUBMISSION')
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw new Error(`Too many review submissions. Please try again in ${error.retryAfter} seconds.`)
    }
    throw new Error('Rate limit check failed')
  }

  // Get current user_card data
  let { data: userCard, error: fetchError } = await supabase
    .from('user_cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('card_id', cardId)
    .single()

  if (fetchError) {
    // If user_card doesn't exist, create it
    const { data: newUserCard, error: createError } = await supabase
      .from('user_cards')
      .insert({
        user_id: user.id,
        card_id: cardId,
        ease_factor: 2.5,
        interval_days: 0,
        repetitions: 0,
        next_review_date: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) throw createError
    if (!newUserCard) throw new Error('Failed to create user card')
    userCard = newUserCard
  }

  if (!userCard) throw new Error('User card not found')

  // Calculate next review using SM-2
  const sm2Result = calculateSM2(
    userCard.ease_factor || 2.5,
    userCard.interval_days || 0,
    userCard.repetitions || 0,
    rating
  )

  // Update user_card with new values
  const { error: updateError } = await supabase
    .from('user_cards')
    .update({
      ease_factor: sm2Result.easeFactor,
      interval_days: sm2Result.intervalDays,
      repetitions: sm2Result.repetitions,
      next_review_date: sm2Result.nextReviewDate.toISOString(),
      last_review_date: new Date().toISOString(),
      total_reviews: (userCard.total_reviews || 0) + 1,
      correct_reviews: rating >= 3 ? (userCard.correct_reviews || 0) + 1 : (userCard.correct_reviews || 0),
      mastery_level: Math.max(0, Math.min(100, (userCard.mastery_level || 0) + (rating >= 3 ? 5 : -10))),
      average_response_time: userCard.average_response_time 
        ? Math.round((userCard.average_response_time + responseTime) / 2)
        : responseTime
    })
    .eq('id', userCard.id)

  if (updateError) throw updateError

  // Create review record
  const { error: reviewError } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      card_id: cardId,
      user_card_id: userCard.id,
      rating,
      response_time: responseTime,
      session_id: sessionId
    })

  if (reviewError) throw reviewError

  // Update user stats
  await updateUserStats(user.id)

  revalidatePath('/dashboard')
  
  const newMasteryLevel = Math.max(0, Math.min(100, (userCard.mastery_level || 0) + (rating >= 3 ? 5 : -10)))
  
  return {
    success: true,
    nextReviewDate: sm2Result.nextReviewDate,
    mastery: newMasteryLevel
  }
}

// Start a new study session
export async function startStudySession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: user.id,
      started_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// End a study session
export async function endStudySession(
  sessionId: string,
  stats?: {
    cardsStudied: number
    cardsCorrect: number
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data: session, error: fetchError } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (fetchError) throw fetchError

  const startTime = session.started_at ? new Date(session.started_at).getTime() : Date.now()
  const endTime = Date.now()
  const totalSeconds = Math.floor((endTime - startTime) / 1000)

  const { error: updateError } = await supabase
    .from('study_sessions')
    .update({
      ended_at: new Date().toISOString(),
      total_time_seconds: totalSeconds,
      cards_studied: stats?.cardsStudied || 0,
      cards_correct: stats?.cardsCorrect || 0,
      focus_score: calculateFocusScore(totalSeconds, stats?.cardsStudied || 0)
    })
    .eq('id', sessionId)

  if (updateError) throw updateError

  // Update user stats
  await updateUserStats(user.id)

  return { success: true, totalSeconds }
}

// Calculate focus score based on consistency
function calculateFocusScore(totalSeconds: number, cardsStudied: number): number {
  if (cardsStudied === 0) return 0
  
  const averageTimePerCard = totalSeconds / cardsStudied
  const idealTimePerCard = 30 // 30 seconds is ideal
  
  // Calculate score based on how close to ideal time
  const deviation = Math.abs(averageTimePerCard - idealTimePerCard)
  const score = Math.max(0, 100 - (deviation / idealTimePerCard) * 50)
  
  return Math.round(score)
}

// Update user statistics
async function updateUserStats(userId: string) {
  const supabase = await createClient()
  
  // Get aggregated stats
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('user_id', userId)

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('total_time_seconds')
    .eq('user_id', userId)
    .not('ended_at', 'is', null)

  const { data: userCards } = await supabase
    .from('user_cards')
    .select('mastery_level')
    .eq('user_id', userId)

  const totalReviews = reviews?.length || 0
  const correctReviews = reviews?.filter(r => r.rating >= 3).length || 0
  const accuracy = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0
  const totalMinutes = (sessions?.reduce((sum, s) => sum + (s.total_time_seconds || 0), 0) || 0) / 60
  const cardsMastered = userCards?.filter(c => (c.mastery_level || 0) >= 80).length || 0

  // Calculate streak
  const { data: recentSessions } = await supabase
    .from('study_sessions')
    .select('started_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(30)

  const currentStreak = calculateStreak(recentSessions?.map(s => s.started_at).filter((date): date is string => date !== null) || [])

  // Update or insert user stats
  const { error } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      total_cards: userCards?.length || 0,
      cards_mastered: cardsMastered,
      total_reviews: totalReviews,
      total_study_time_minutes: Math.round(totalMinutes),
      current_streak_days: currentStreak,
      longest_streak_days: Math.max(currentStreak, 0), // Would need to track this properly
      last_study_date: new Date().toISOString().split('T')[0],
      average_accuracy: Math.round(accuracy)
    })

  if (error) {
    logger.error('Error updating user stats', {
      userId: user.id,
      error
    });
    throw new Error('Failed to update user statistics');
  }
}

// Calculate study streak
function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
  
  // Check if studied today or yesterday
  const lastStudy = new Date(dates[0]).toDateString()
  if (lastStudy !== today && lastStudy !== yesterday) return 0
  
  let streak = 0
  const currentDate = new Date()
  
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toDateString()
    const studied = dates.some(d => new Date(d).toDateString() === dateStr)
    
    if (studied) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (i > 0) {
      // Allow one day gap only for yesterday
      break
    }
  }
  
  return streak
}

// Get review history for a card
export async function getCardReviewHistory(cardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id)
    .eq('card_id', cardId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

// Get study statistics
export async function getStudyStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore not found error
  
  return data || {
    total_cards: 0,
    cards_mastered: 0,
    total_reviews: 0,
    total_study_time_minutes: 0,
    current_streak_days: 0,
    longest_streak_days: 0,
    average_accuracy: 0
  }
}