'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

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
  
  // Track subscription state to prevent race conditions
  const cardsChannelRef = useRef<RealtimeChannel | null>(null)
  const reviewsChannelRef = useRef<RealtimeChannel | null>(null)
  const cleanupInProgressRef = useRef(false)

  useEffect(() => {
    if (!userId) {
      // Clear connection state when no userId
      setIsConnected(false)
      return
    }

    // Prevent creating new subscriptions while cleanup is in progress
    if (cleanupInProgressRef.current) {
      return
    }

    // Clean up any existing subscriptions before creating new ones
    const cleanupExistingSubscriptions = async () => {
      if (cardsChannelRef.current) {
        await cardsChannelRef.current.unsubscribe()
        cardsChannelRef.current = null
      }
      if (reviewsChannelRef.current) {
        await reviewsChannelRef.current.unsubscribe()
        reviewsChannelRef.current = null
      }
      setIsConnected(false)
    }

    const setupSubscriptions = async () => {
      cleanupInProgressRef.current = true
      
      // Clean up existing subscriptions first
      await cleanupExistingSubscriptions()

      // Set up realtime subscriptions with unique channel names to prevent conflicts
      const channelId = `cards-${userId}-${Date.now()}`
      const cardsChannel = supabase
        .channel(channelId)
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
          if (cardsChannelRef.current === cardsChannel) {
            setIsConnected(status === 'SUBSCRIBED')
          }
        })

      // Store reference to prevent duplicate subscriptions
      cardsChannelRef.current = cardsChannel

      // Subscribe to user_cards changes for review updates with unique channel name
      const reviewChannelId = `reviews-${userId}-${Date.now()}`
      const reviewsChannel = supabase
        .channel(reviewChannelId)
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

      // Store reference to prevent duplicate subscriptions
      reviewsChannelRef.current = reviewsChannel
      
      cleanupInProgressRef.current = false
    }

    setupSubscriptions()

    // Clean up subscriptions on unmount or userId change
    return () => {
      cleanupInProgressRef.current = true
      
      const cleanup = async () => {
        if (cardsChannelRef.current) {
          await cardsChannelRef.current.unsubscribe()
          cardsChannelRef.current = null
        }
        if (reviewsChannelRef.current) {
          await reviewsChannelRef.current.unsubscribe()
          reviewsChannelRef.current = null
        }
        setIsConnected(false)
        cleanupInProgressRef.current = false
      }
      
      cleanup()
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
  
  // Track subscription state to prevent race conditions
  const statsChannelRef = useRef<RealtimeChannel | null>(null)
  const cleanupInProgressRef = useRef(false)

  useEffect(() => {
    if (!userId) return

    // Prevent creating new subscriptions while cleanup is in progress
    if (cleanupInProgressRef.current) {
      return
    }

    const setupSubscription = async () => {
      cleanupInProgressRef.current = true
      
      // Clean up existing subscription before creating new one
      if (statsChannelRef.current) {
        await statsChannelRef.current.unsubscribe()
        statsChannelRef.current = null
      }

      // Subscribe to user_stats changes with unique channel name
      const channelId = `stats-${userId}-${Date.now()}`
      const statsChannel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_stats',
            filter: `user_id=eq.${userId}`
          },
          async (payload) => {
            console.log('Stats update received:', payload)
            
            // Fetch fresh stats
            const { data, error } = await supabase
              .from('user_stats')
              .select('*')
              .eq('user_id', userId)
              .single()
            
            if (!error && data) {
              setStats(data)
            }
          }
        )
        .subscribe()

      // Store reference to prevent duplicate subscriptions
      statsChannelRef.current = statsChannel
      cleanupInProgressRef.current = false
    }

    setupSubscription()

    return () => {
      cleanupInProgressRef.current = true
      
      const cleanup = async () => {
        if (statsChannelRef.current) {
          await statsChannelRef.current.unsubscribe()
          statsChannelRef.current = null
        }
        cleanupInProgressRef.current = false
      }
      
      cleanup()
    }
  }, [userId])

  return stats
}

export function useRealtimePresence(sessionId?: string) {
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const supabase = createClient()
  
  // Track subscription state to prevent race conditions
  const presenceChannelRef = useRef<RealtimeChannel | null>(null)
  const cleanupInProgressRef = useRef(false)

  useEffect(() => {
    if (!sessionId) return

    // Prevent creating new subscriptions while cleanup is in progress
    if (cleanupInProgressRef.current) {
      return
    }

    const setupSubscription = async () => {
      cleanupInProgressRef.current = true
      
      // Clean up existing subscription before creating new one
      if (presenceChannelRef.current) {
        await presenceChannelRef.current.unsubscribe()
        presenceChannelRef.current = null
      }

      // Create presence channel with unique identifier to prevent conflicts
      const channelId = `study-session-${sessionId}-${Date.now()}`
      const presenceChannel = supabase.channel(channelId)
      
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          // Only update state if this is still the current channel
          if (presenceChannelRef.current === presenceChannel) {
            const state = presenceChannel.presenceState()
            const users = Object.keys(state).flatMap(key => state[key])
            setActiveUsers(users)
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', newPresences)
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', leftPresences)
        })
        .subscribe(async (status) => {
          // Only track presence if this is still the current channel
          if (status === 'SUBSCRIBED' && presenceChannelRef.current === presenceChannel) {
            await presenceChannel.track({
              online_at: new Date().toISOString(),
              user_id: sessionId
            })
          }
        })

      // Store reference to prevent duplicate subscriptions
      presenceChannelRef.current = presenceChannel
      cleanupInProgressRef.current = false
    }

    setupSubscription()

    return () => {
      cleanupInProgressRef.current = true
      
      const cleanup = async () => {
        if (presenceChannelRef.current) {
          await presenceChannelRef.current.unsubscribe()
          presenceChannelRef.current = null
        }
        setActiveUsers([])
        cleanupInProgressRef.current = false
      }
      
      cleanup()
    }
  }, [sessionId])

  return activeUsers
}