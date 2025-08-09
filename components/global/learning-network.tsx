'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface ActiveLearner {
  id: string
  name: string
  location: { lat: number; lng: number; city: string; country: string }
  topic: string
  avatar?: string
  joinedAt: string
  learningStreak: number
  cardsCompleted: number
}

interface LearningPulse {
  from: ActiveLearner
  to: ActiveLearner
  type: 'knowledge-share' | 'collaboration' | 'peer-review' | 'achievement'
  timestamp: string
}

export default function GlobalLearningNetwork() {
  const [activeLearners, setActiveLearners] = useState<ActiveLearner[]>([])
  const [pulses, setPulses] = useState<LearningPulse[]>([])
  const [stats, setStats] = useState({
    totalActive: 0,
    countriesRepresented: 0,
    knowledgeExchanges: 0,
    collectiveHours: 0,
  })
  const [selectedLearner, setSelectedLearner] = useState<ActiveLearner | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('global-learning')
      .on('presence', { event: 'sync' }, () => {
        const state = subscription.presenceState()
        const presenceData = Object.values(state).flat()
        // Map presence data to ActiveLearner format
        const learners = presenceData
          .map((p: unknown) => {
            // Type guard and transform the data
            if (p && typeof p === 'object' && 'id' in p) {
              return p as ActiveLearner
            }
            return null
          })
          .filter((l): l is ActiveLearner => l !== null)
        setActiveLearners(learners)
        updateStats(learners)
      })
      .on('broadcast', { event: 'learning-pulse' }, ({ payload }) => {
        const pulse = payload as LearningPulse
        setPulses(prev => [...prev.slice(-9), pulse]) // Keep last 10 pulses
        
        // Animate pulse effect
        setTimeout(() => {
          setPulses(prev => prev.filter(p => p !== pulse))
        }, 5000)
      })
      .subscribe()

    // Track current user's presence
    subscription.track({
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: 'Anonymous Learner',
      location: getApproximateLocation(),
      topic: 'General Learning',
      joinedAt: new Date().toISOString(),
      learningStreak: Math.floor(Math.random() * 30),
      cardsCompleted: Math.floor(Math.random() * 100),
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  function getApproximateLocation() {
    // In production, use geolocation API or IP-based location
    const cities = [
      { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA' },
      { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
      { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
      { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
      { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
      { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
      { lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India' },
      { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' },
    ]
    return cities[Math.floor(Math.random() * cities.length)]
  }

  function updateStats(learners: ActiveLearner[]) {
    const countries = new Set(learners.map(l => l.location.country))
    const totalHours = learners.reduce((sum, l) => {
      const joined = new Date(l.joinedAt)
      const now = new Date()
      return sum + (now.getTime() - joined.getTime()) / (1000 * 60 * 60)
    }, 0)

    setStats({
      totalActive: learners.length,
      countriesRepresented: countries.size,
      knowledgeExchanges: Math.floor(Math.random() * 1000) + learners.length * 10,
      collectiveHours: Math.round(totalHours),
    })
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          <g stroke="currentColor" strokeWidth="0.5" fill="none">
            {/* Simplified world map outlines */}
            <path d="M200,200 Q300,180 400,200 T600,200" /> {/* North America */}
            <path d="M450,250 Q500,230 550,250 T650,250" /> {/* Europe */}
            <path d="M700,280 Q750,260 800,280" /> {/* Asia */}
            <path d="M400,350 Q450,330 500,350" /> {/* South America */}
            <path d="M550,380 Q600,360 650,380" /> {/* Africa */}
            <path d="M750,400 Q800,380 850,400" /> {/* Australia */}
          </g>
        </svg>
      </div>

      {/* Active Learners */}
      <AnimatePresence>
        {activeLearners.map(learner => (
          <motion.div
            key={learner.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer hover:scale-150 transition-transform"
            style={{
              left: `${(learner.location.lng + 180) / 360 * 100}%`,
              top: `${(90 - learner.location.lat) / 180 * 100}%`,
            }}
            onClick={() => setSelectedLearner(learner)}
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Learning Pulses (connections) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {pulses.map((pulse, index) => {
            const x1 = `${(pulse.from.location.lng + 180) / 360 * 100}%`
            const y1 = `${(90 - pulse.from.location.lat) / 180 * 100}%`
            const x2 = `${(pulse.to.location.lng + 180) / 360 * 100}%`
            const y2 = `${(90 - pulse.to.location.lat) / 180 * 100}%`
            
            return (
              <motion.line
                key={`${pulse.from.id}-${pulse.to.id}-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={{
                  'knowledge-share': '#10B981',
                  'collaboration': '#3B82F6',
                  'peer-review': '#F59E0B',
                  'achievement': '#EC4899',
                }[pulse.type]}
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="10"
                  to="0"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </motion.line>
            )
          })}
        </AnimatePresence>
      </svg>

      {/* Stats Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold mb-4">Global Learning Network</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Active Learners</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalActive.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Countries</p>
            <p className="text-xl font-semibold">{stats.countriesRepresented}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Knowledge Exchanges</p>
            <p className="text-xl font-semibold text-green-600">
              {stats.knowledgeExchanges.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Collective Hours</p>
            <p className="text-xl font-semibold text-purple-600">
              {stats.collectiveHours.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Selected Learner Details */}
      <AnimatePresence>
        {selectedLearner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-xl max-w-sm"
          >
            <button
              onClick={() => setSelectedLearner(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
              <div className="flex-1">
                <h4 className="font-semibold">{selectedLearner.name}</h4>
                <p className="text-sm text-gray-600">
                  {selectedLearner.location.city}, {selectedLearner.location.country}
                </p>
                <p className="text-sm mt-1">
                  Learning: <span className="font-medium">{selectedLearner.topic}</span>
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs">
                  <div>
                    <span className="text-gray-600">Streak:</span>
                    <span className="font-semibold ml-1">
                      {selectedLearner.learningStreak} days
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cards:</span>
                    <span className="font-semibold ml-1">
                      {selectedLearner.cardsCompleted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Legend */}
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur rounded-lg p-3">
        <p className="text-xs font-semibold mb-2">Live Activity</p>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-green-500" />
            <span className="text-xs">Knowledge Share</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span className="text-xs">Collaboration</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-yellow-500" />
            <span className="text-xs">Peer Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-pink-500" />
            <span className="text-xs">Achievement</span>
          </div>
        </div>
      </div>
    </div>
  )
}