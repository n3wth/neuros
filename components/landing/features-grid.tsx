'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Brain, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Users, 
  Shield, 
  Target,
  TrendingUp,
  Code
} from 'lucide-react'

export default function FeaturesGrid() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      id: 1,
      title: "Adaptive AI Learning",
      description: "Neural network models that adapt to your learning style, pace, and retention patterns in real-time",
      icon: Brain,
      gradient: "from-blue-600 to-cyan-600",
      stats: "3x faster mastery",
      relevantTo: ["GenAI Engineers", "Product Managers", "Creative Technologists"]
    },
    {
      id: 2,
      title: "Spaced Repetition 2.0",
      description: "Advanced algorithm that knows exactly when you're about to forget, optimizing review timing",
      icon: Zap,
      gradient: "from-purple-600 to-pink-600",
      stats: "92% retention rate",
      relevantTo: ["Students", "Professionals", "Lifelong Learners"]
    },
    {
      id: 3,
      title: "Knowledge Graphs",
      description: "Visual connections between concepts that reveal hidden patterns in your learning",
      icon: Sparkles,
      gradient: "from-orange-600 to-red-600",
      stats: "Connect 1000+ concepts",
      relevantTo: ["Researchers", "Analysts", "System Thinkers"]
    },
    {
      id: 4,
      title: "Socratic AI Dialogue",
      description: "Engage in natural conversations that deepen understanding through guided questioning",
      icon: BookOpen,
      gradient: "from-green-600 to-teal-600",
      stats: "Like having a personal tutor",
      relevantTo: ["Philosophy", "Critical Thinking", "Deep Learning"]
    },
    {
      id: 5,
      title: "Collaborative Learning",
      description: "Learn with peers, share insights, and build knowledge communities around your interests",
      icon: Users,
      gradient: "from-indigo-600 to-blue-600",
      stats: "Join 50K+ learners",
      relevantTo: ["Teams", "Study Groups", "Communities"]
    },
    {
      id: 6,
      title: "Privacy-First Design",
      description: "Your learning data stays yours. End-to-end encryption with local-first architecture",
      icon: Shield,
      gradient: "from-gray-600 to-gray-800",
      stats: "Zero-knowledge proof",
      relevantTo: ["Privacy Advocates", "Enterprise", "Sensitive Fields"]
    }
  ]


  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for How You Actually Learn
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Combining cognitive science, AI, and beautiful design to create the most effective learning experience ever built
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(feature.id)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative group"
              >
                <div className="h-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>

                  {/* Stats Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white">
                      {feature.stats}
                    </span>
                  </div>

                  {/* Relevant To */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2">Perfect for:</p>
                    <div className="flex flex-wrap gap-1">
                      {feature.relevantTo.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-400"
                        >
                          {tag}{i < feature.relevantTo.length - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Gradient Effect */}
                  {hoveredFeature === feature.id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-2xl pointer-events-none`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>


        {/* Technical Specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              99.9%
            </div>
            <p className="text-gray-400 text-sm">Uptime SLA</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              &lt;50ms
            </div>
            <p className="text-gray-400 text-sm">Response Time</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              <Code className="w-8 h-8 mx-auto mb-2 text-green-400" />
              Open API
            </div>
            <p className="text-gray-400 text-sm">Full Developer Access</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              SOC 2
            </div>
            <p className="text-gray-400 text-sm">Type II Certified</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}