'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Card = Database['public']['Tables']['cards']['Row']
type UserCard = Database['public']['Tables']['user_cards']['Row']

interface RealtimeUpdate {
  type: 'card_created' | 'card_updated' | 'card_deleted' | 'review_submitted'
  payload: any
}

export function useRealtimeCards(userId?: string) {
  const [cards, setCards] = useState<Card[]>([])
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Set up realtime subscriptions
    const cardsChannel = supabase
      .channel('cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Card change received:', payload)
          
          if (payload.eventType === 'INSERT') {
            setCards(prev => [payload.new as Card, ...prev])
            setUpdates(prev => [...prev, {
              type: 'card_created',
              payload: payload.new
            }])
          } else if (payload.eventType === 'UPDATE') {
            setCards(prev => prev.map(card => 
              card.id === payload.new.id ? payload.new as Card : card
            ))
            setUpdates(prev => [...prev, {
              type: 'card_updated',
              payload: payload.new
            }])
          } else if (payload.eventType === 'DELETE') {
            setCards(prev => prev.filter(card => card.id !== payload.old.id))
            setUpdates(prev => [...prev, {
              type: 'card_deleted',
              payload: payload.old
            }])
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Subscribe to user_cards changes for review updates
    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_cards',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Review update received:', payload)
          setUpdates(prev => [...prev, {
            type: 'review_submitted',
            payload: payload.new
          }])
        }
      )
      .subscribe()

    // Clean up subscriptions on unmount
    return () => {
      cardsChannel.unsubscribe()
      reviewsChannel.unsubscribe()
    }
  }, [userId])

  return {
    cards,
    updates,
    isConnected,
    clearUpdates: () => setUpdates([])
  }
}

export function useRealtimeStats(userId?: string) {
  const [stats, setStats] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Subscribe to study_stats changes
    const statsChannel = supabase
      .channel('stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'study_stats',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('Stats update received:', payload)
          
          // Fetch fresh stats
          const { data, error } = await supabase
            .from('study_stats')
            .select('*')
            .eq('user_id', userId)
            .single()
          
          if (!error && data) {
            setStats(data)
          }
        }
      )
      .subscribe()

    return () => {
      statsChannel.unsubscribe()
    }
  }, [userId])

  return stats
}

export function useRealtimePresence(sessionId?: string) {
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!sessionId) return

    const presenceChannel = supabase.channel(`study-session-${sessionId}`)
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState()
        const users = Object.keys(state).flatMap(key => state[key])
        setActiveUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            online_at: new Date().toISOString(),
            user_id: sessionId
          })
        }
      })

    return () => {
      presenceChannel.unsubscribe()
    }
  }, [sessionId])

  return activeUsers
}