'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'

type Card = Database['public']['Tables']['cards']['Row']
type CardInsert = Database['public']['Tables']['cards']['Insert']
type UserCard = Database['public']['Tables']['user_cards']['Row']

// Create a new card
export async function createCard(data: {
  front: string
  back: string
  explanation?: string
  topic_id?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Create the card
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .insert({
      ...data,
      user_id: user.id
    })
    .select()
    .single()

  if (cardError) throw cardError

  // Create user_card entry for tracking progress
  const { error: userCardError } = await supabase
    .from('user_cards')
    .insert({
      user_id: user.id,
      card_id: card.id,
      next_review_date: new Date().toISOString()
    })

  if (userCardError) throw userCardError

  revalidatePath('/dashboard')
  return card
}

// Get all cards for the current user
export async function getUserCards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      topics (
        id,
        name,
        color
      ),
      user_cards (
        ease_factor,
        interval_days,
        repetitions,
        next_review_date,
        last_review_date,
        total_reviews,
        correct_reviews,
        mastery_level
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Get cards due for review
export async function getDueCards(limit: number = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('user_cards')
    .select(`
      *,
      cards!inner (
        id,
        front,
        back,
        explanation,
        difficulty,
        tags,
        topics (
          id,
          name,
          color
        )
      )
    `)
    .eq('user_id', user.id)
    .lte('next_review_date', now)
    .order('next_review_date', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

// Get upcoming cards (next 7 days)
export async function getUpcomingCards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('user_cards')
    .select(`
      next_review_date,
      cards!inner (
        id,
        front,
        difficulty
      )
    `)
    .eq('user_id', user.id)
    .gt('next_review_date', now.toISOString())
    .lte('next_review_date', nextWeek.toISOString())
    .order('next_review_date', { ascending: true })

  if (error) throw error

  // Group by day
  const grouped = data?.reduce((acc, item) => {
    if (!item.next_review_date) return acc
    const date = new Date(item.next_review_date).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {} as Record<string, typeof data>)

  return grouped
}

// Update a card
export async function updateCard(
  cardId: string,
  updates: Partial<CardInsert>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', cardId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/dashboard')
  return data
}

// Delete a card
export async function deleteCard(cardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) throw error
  
  revalidatePath('/dashboard')
  return { success: true }
}

// Get card statistics
export async function getCardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Get total cards
  const { count: totalCards } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get cards by mastery level
  const { data: masteryData } = await supabase
    .from('user_cards')
    .select('mastery_level')
    .eq('user_id', user.id)

  const mastered = masteryData?.filter(c => c.mastery_level != null && c.mastery_level >= 80).length || 0
  const learning = masteryData?.filter(c => c.mastery_level != null && c.mastery_level >= 40 && c.mastery_level < 80).length || 0
  const difficult = masteryData?.filter(c => c.mastery_level != null && c.mastery_level < 40).length || 0

  // Get due cards count
  const { count: dueCards } = await supabase
    .from('user_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_date', new Date().toISOString())

  return {
    totalCards: totalCards || 0,
    mastered,
    learning,
    difficult,
    dueCards: dueCards || 0
  }
}

// Get user completion state for smart messaging
export async function getUserCompletionState() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Get total cards count
  const { count: totalCards } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // If no cards, user is new
  if (!totalCards || totalCards === 0) {
    return {
      type: 'new_user',
      totalCards: 0,
      dueCards: 0,
      nextReviewTime: null,
      completedToday: false
    }
  }

  // Get due cards count
  const { count: dueCards } = await supabase
    .from('user_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_date', new Date().toISOString())

  // Get today's review count to determine if user completed reviews today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const { data: todayReviews } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())

  // Get next review time for cards not due yet
  const { data: nextReview } = await supabase
    .from('user_cards')
    .select('next_review_date')
    .eq('user_id', user.id)
    .gt('next_review_date', new Date().toISOString())
    .order('next_review_date', { ascending: true })
    .limit(1)

  const completedToday = (todayReviews?.length || 0) > 0
  const hasDueCards = (dueCards || 0) > 0

  if (hasDueCards) {
    return {
      type: 'has_due_cards',
      totalCards: totalCards || 0,
      dueCards: dueCards || 0,
      nextReviewTime: null,
      completedToday
    }
  }

  if (completedToday) {
    return {
      type: 'completed_today',
      totalCards: totalCards || 0,
      dueCards: 0,
      nextReviewTime: nextReview?.[0]?.next_review_date || null,
      completedToday: true
    }
  }

  // User has cards but none due and hasn't completed today
  return {
    type: 'no_cards_due',
    totalCards: totalCards || 0,
    dueCards: 0,
    nextReviewTime: nextReview?.[0]?.next_review_date || null,
    completedToday: false
  }
}