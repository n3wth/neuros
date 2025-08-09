'use client'

import { useState, useEffect } from 'react'
import { 
  getUserCards, 
  getDueCards, 
  getCardStats,
  getUpcomingCards 
} from '@/server/actions/cards'
import { 
  startStudySession, 
  endStudySession,
  getStudyStats 
} from '@/server/actions/reviews'
import { generateLearningInsights } from '@/server/actions/ai'

export function useDashboard() {
  const [cards, setCards] = useState<any[]>([])
  const [dueCards, setDueCards] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [studyStats, setStudyStats] = useState<any>(null)
  const [upcomingCards, setUpcomingCards] = useState<any>({})
  const [aiInsights, setAiInsights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [userCards, dueCardsData, cardStats, studyStatsData, upcomingData] = await Promise.all([
        getUserCards(),
        getDueCards(10),
        getCardStats(),
        getStudyStats(),
        getUpcomingCards()
      ])

      setCards(userCards as any)
      setDueCards(dueCardsData as any)
      setStats(cardStats)
      setStudyStats(studyStatsData)
      setUpcomingCards(upcomingData as any)

      if (studyStatsData && cardStats) {
        try {
          const insights = await generateLearningInsights({
            totalCards: cardStats.totalCards || 0,
            mastered: cardStats.mastered || 0,
            struggling: cardStats.difficult || 0,
            averageAccuracy: studyStatsData.average_accuracy || 0,
            studyTimeMinutes: studyStatsData.total_study_time_minutes || 0
          })
          setAiInsights(insights?.insights || [])
        } catch {
          setAiInsights([{
            type: 'info',
            title: 'Welcome to Neuros!',
            description: 'Start creating cards to receive personalized learning insights powered by AI.',
            action: 'Create your first card'
          }])
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const startReview = async () => {
    try {
      const session = await startStudySession()
      if (session?.id) {
        setCurrentSessionId(session.id)
      }
      return session
    } catch (error) {
      console.error('Failed to start study session:', error)
      throw error
    }
  }

  const endReview = async () => {
    if (currentSessionId) {
      try {
        await endStudySession(currentSessionId)
        setCurrentSessionId(null)
        await loadDashboardData()
      } catch (error) {
        console.error('Failed to end study session:', error)
        throw error
      }
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return {
    cards,
    dueCards,
    stats,
    studyStats,
    upcomingCards,
    aiInsights,
    isLoading,
    error,
    currentSessionId,
    loadDashboardData,
    startReview,
    endReview
  }
}