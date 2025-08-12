'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, Share2 } from 'lucide-react'
import { RealtimeChannel } from '@supabase/supabase-js'

interface SessionParticipant {
  id: string
  user_id: string
  nickname: string
  score: number
  cards_reviewed: number
  correct_answers: number
  is_active: boolean
}

interface CollaborativeSession {
  id: string
  name: string
  session_code: string
  host_id: string
  is_active: boolean
  max_participants: number
}

export function CollaborativeSession({ topicId }: { topicId?: string }) {
  const [session, setSession] = useState<CollaborativeSession | null>(null)
  const [participants, setParticipants] = useState<SessionParticipant[]>([])
  const [sessionCode, setSessionCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])

  const createSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('collaborative_sessions')
      .insert({
        name: `Study Session ${new Date().toLocaleTimeString()}`,
        topic_id: topicId,
        host_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return
    }

    setSession(data)
    setIsHost(true)
    joinRealtimeChannel(data.id)
  }

  const joinSession = async () => {
    if (!sessionCode) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Find session by code
    const { data: sessionData, error: sessionError } = await supabase
      .from('collaborative_sessions')
      .select('*')
      .eq('session_code', sessionCode)
      .eq('is_active', true)
      .single()

    if (sessionError || !sessionData) {
      console.error('Session not found')
      return
    }

    // Join as participant
    const { error: joinError } = await supabase
      .from('collaborative_participants')
      .insert({
        session_id: sessionData.id,
        user_id: user.id,
        nickname: user.email?.split('@')[0] || 'Anonymous'
      })

    if (joinError) {
      console.error('Error joining session:', joinError)
      return
    }

    setSession(sessionData)
    setIsHost(sessionData.host_id === user.id)
    joinRealtimeChannel(sessionData.id)
  }

  const joinRealtimeChannel = (sessionId: string) => {
    const newChannel = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaborative_participants',
          filter: `session_id=eq.${sessionId}`
        },
        () => {
          loadParticipants(sessionId)
        }
      )
      .on('broadcast', { event: 'card_answered' }, ({ userId, correct }) => {
        // Handle card answer events
        updateParticipantScore(userId, correct)
      })
      .subscribe()

    setChannel(newChannel)
    loadParticipants(sessionId)
  }

  const loadParticipants = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('collaborative_participants')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true)
      .order('score', { ascending: false })

    if (!error && data) {
      setParticipants(data)
    }
  }

  const updateParticipantScore = async (userId: string, correct: boolean) => {
    const participant = participants.find(p => p.user_id === userId)
    if (!participant) return

    const updates = {
      cards_reviewed: participant.cards_reviewed + 1,
      correct_answers: correct ? participant.correct_answers + 1 : participant.correct_answers,
      score: participant.score + (correct ? 10 : 0)
    }

    await supabase
      .from('collaborative_participants')
      .update(updates)
      .eq('id', participant.id)
  }

  const endSession = async () => {
    if (!session || !isHost) return

    await supabase
      .from('collaborative_sessions')
      .update({ 
        is_active: false,
        ended_at: new Date().toISOString()
      })
      .eq('id', session.id)

    setSession(null)
    if (channel) {
      supabase.removeChannel(channel)
      setChannel(null)
    }
  }

  const shareSession = () => {
    if (!session) return
    
    const shareUrl = `${window.location.origin}/join/${session.session_code}`
    navigator.clipboard.writeText(shareUrl)
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collaborative Study</CardTitle>
          <CardDescription>
            Study together with friends in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={createSession} className="w-full">
            <Users className="mr-2 h-4 w-4" />
            Host New Session
          </Button>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter session code"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
            />
            <Button onClick={joinSession}>Join</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{session.name}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={shareSession}>
              <Share2 className="h-4 w-4" />
            </Button>
            {isHost && (
              <Button size="sm" variant="destructive" onClick={endSession}>
                End Session
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Code: <code className="bg-muted px-2 py-1 rounded">{session.session_code}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants.length} participants</span>
          </div>

          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                  <span className="font-medium">{participant.nickname}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{participant.correct_answers}/{participant.cards_reviewed}</span>
                  <span className="font-bold">{participant.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}