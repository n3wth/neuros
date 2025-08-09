'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Users, Trophy, Zap, Gift, Target, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareableAchievement {
  id: string
  title: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt: string
  shareCount: number
  viralScore: number
}

interface ViralChallenge {
  id: string
  name: string
  description: string
  participants: number
  deadline: string
  reward: string
  progress: number
}

export default function ViralMechanisms({ userId }: { userId: string }) {
  const [achievements] = useState<ShareableAchievement[]>([
    {
      id: '1',
      title: 'Knowledge Pioneer',
      description: 'First to master quantum computing basics',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString(),
      shareCount: 0,
      viralScore: 95,
    },
    {
      id: '2',
      title: '30-Day Streak',
      description: 'Learned consistently for 30 days',
      rarity: 'epic',
      unlockedAt: new Date().toISOString(),
      shareCount: 0,
      viralScore: 80,
    },
  ])

  const [challenges] = useState<ViralChallenge[]>([
    {
      id: '1',
      name: 'Global AI Challenge',
      description: 'Master AI fundamentals with 10,000 learners worldwide',
      participants: 8743,
      deadline: '2025-02-01',
      reward: 'Exclusive AI Mentor Badge + Premium Access',
      progress: 67,
    },
    {
      id: '2',
      name: 'Peer Teaching Week',
      description: 'Teach 5 concepts to other learners',
      participants: 3421,
      deadline: '2025-01-15',
      reward: 'Knowledge Sharer Certificate',
      progress: 40,
    },
  ])

  const [referralCode] = useState(`LEARN-${userId.slice(0, 6).toUpperCase()}`)
  const [referralCount] = useState(12)
  const [impactScore] = useState(2847)

  async function shareAchievement(achievement: ShareableAchievement) {
    const shareData = {
      title: `I just unlocked "${achievement.title}" on Neuros!`,
      text: achievement.description,
      url: `https://neuros.app/achievement/${achievement.id}?ref=${referralCode}`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Achievement shared successfully!')
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )
        toast.success('Share link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  function getRarityColor(rarity: ShareableAchievement['rarity']) {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-600',
    }
    return colors[rarity]
  }

  return (
    <div className="space-y-8">
      {/* Viral Impact Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Learning Impact
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 rounded-xl p-4">
            <p className="text-sm text-gray-600">Referrals</p>
            <p className="text-2xl font-bold text-indigo-600">{referralCount}</p>
            <p className="text-xs text-gray-500 mt-1">+3 this week</p>
          </div>
          
          <div className="bg-white/80 rounded-xl p-4">
            <p className="text-sm text-gray-600">Impact Score</p>
            <p className="text-2xl font-bold text-purple-600">{impactScore}</p>
            <p className="text-xs text-gray-500 mt-1">Top 5% globally</p>
          </div>
          
          <div className="bg-white/80 rounded-xl p-4">
            <p className="text-sm text-gray-600">Network</p>
            <p className="text-2xl font-bold text-green-600">247</p>
            <p className="text-xs text-gray-500 mt-1">Connected learners</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/60 rounded-lg">
          <p className="text-sm font-medium mb-1">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded font-mono text-sm">
              {referralCode}
            </code>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(referralCode)
                toast.success('Referral code copied!')
              }}
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Earn 1 month free for every 3 friends who join!
          </p>
        </div>
      </motion.div>

      {/* Shareable Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Share Your Achievements
        </h3>
        
        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRarityColor(
                      achievement.rarity
                    )} flex items-center justify-center`}
                  >
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="capitalize">{achievement.rarity}</span>
                      <span>Viral Score: {achievement.viralScore}%</span>
                      {achievement.shareCount > 0 && (
                        <span>Shared {achievement.shareCount} times</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareAchievement(achievement)}
                  className="flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Viral Challenges */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Viral Learning Challenges
        </h3>
        
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{challenge.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {challenge.participants.toLocaleString()} participants
                    </span>
                    <span className="text-gray-600">
                      Ends {new Date(challenge.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-blue-100">
                  <Gift className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">
                    {challenge.reward}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">
                  Join Challenge
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-1" />
                  Invite Friends
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Streak Multiplier */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200"
      >
        <h4 className="font-semibold mb-3">Streak Multiplier Active!</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Share your progress to unlock 2x learning points
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Current streak: 15 days • Multiplier: 1.5x
            </p>
          </div>
          <Button size="sm" variant="outline" className="bg-white">
            Share Progress
          </Button>
        </div>
      </motion.div>
    </div>
  )
}