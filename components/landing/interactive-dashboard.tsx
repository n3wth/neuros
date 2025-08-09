'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, Zap, Target, TrendingUp, Sparkles, BookOpen, Trophy, Activity } from 'lucide-react'

export default function InteractiveDashboard() {
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const learningCards = [
    {
      id: 1,
      title: "GenAI Fundamentals",
      category: "Technology",
      progress: 75,
      nextReview: "2 hours",
      mastery: 4.2,
      icon: Brain,
      gradient: "from-blue-600 to-cyan-600",
      concepts: ["Transformers", "LLMs", "Fine-tuning", "RAG Systems"]
    },
    {
      id: 2,
      title: "Product Strategy",
      category: "Career",
      progress: 60,
      nextReview: "Tomorrow",
      mastery: 3.8,
      icon: Target,
      gradient: "from-purple-600 to-pink-600",
      concepts: ["OKRs", "Roadmapping", "User Research", "A/B Testing"]
    },
    {
      id: 3,
      title: "Creative Coding",
      category: "Art & Tech",
      progress: 45,
      nextReview: "3 days",
      mastery: 3.2,
      icon: Sparkles,
      gradient: "from-orange-600 to-red-600",
      concepts: ["p5.js", "Three.js", "Shaders", "Generative Art"]
    },
    {
      id: 4,
      title: "Mindfulness & Focus",
      category: "Wellness",
      progress: 90,
      nextReview: "Daily",
      mastery: 4.5,
      icon: Activity,
      gradient: "from-green-600 to-teal-600",
      concepts: ["Meditation", "Flow States", "Stress Management", "Sleep"]
    }
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Learning Universe
          </h2>
          <p className="text-xl text-gray-400">
            AI adapts to your pace, remembers what you forget, and surfaces insights when you need them
          </p>
        </motion.div>

        {/* Main Dashboard */}
        <div className="relative max-w-7xl mx-auto">
          {/* Glass container */}
          <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
            
            {/* Stats Bar */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Daily Streak</p>
                    <p className="text-white text-2xl font-bold">47</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Cards Mastered</p>
                    <p className="text-white text-2xl font-bold">1,283</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Learning Score</p>
                    <p className="text-white text-2xl font-bold">8,450</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">This Week</p>
                    <p className="text-white text-2xl font-bold">+24%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Cards Grid */}
            <div className="relative z-10 grid md:grid-cols-2 gap-6">
              {learningCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setActiveCard(card.id)}
                    onHoverEnd={() => setActiveCard(null)}
                    className="relative group"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white text-lg font-semibold">{card.title}</h3>
                            <p className="text-gray-400 text-sm">{card.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Next Review</p>
                          <p className="text-white text-sm font-medium">{card.nextReview}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{card.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${card.gradient}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${card.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Concepts */}
                      <div className="flex flex-wrap gap-2">
                        {card.concepts.map((concept, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/5 backdrop-blur rounded-full text-xs text-gray-300 border border-white/10"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>

                      {/* Mastery Score */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Mastery Level</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-4 h-4 rounded-full ${
                                  star <= Math.floor(card.mastery)
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                                    : 'bg-white/10'
                                }`}
                              />
                            ))}
                            <span className="text-white text-sm ml-2">{card.mastery}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      {activeCard === card.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* AI Assistant Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10 mt-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">AI Learning Assistant</p>
                  <p className="text-gray-300 text-sm">
                    "Based on your learning patterns, I recommend reviewing 'Transformer Architecture' before your meeting tomorrow. 
                    You've shown 92% retention on related concepts. Ready for a quick 5-minute session?"
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-white/10 backdrop-blur rounded-xl text-white text-sm hover:bg-white/20 transition-colors">
                      Start Session
                    </button>
                    <button className="px-4 py-2 bg-transparent text-gray-400 text-sm hover:text-white transition-colors">
                      Remind Me Later
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}