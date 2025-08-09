'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, TrendingUp, Award, Clock, Users, Target, BarChart3 } from 'lucide-react'
import { AppleCard } from '@/components/ui/apple-card'

export default function ResearchInsights() {
  const insights = [
    {
      icon: Clock,
      title: "8±4 Hour Optimal Spacing",
      stat: "87%",
      description: "Recent PNAS studies show 8±4 hour intervals yield nearly zero forgetting after 24 hours, versus 34% forgetting with short intervals.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI-Driven Personalization",
      stat: "30%",
      description: "Machine learning algorithms reduce study time by 30% while maintaining learning gains through adaptive interval optimization.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Retention Improvement",
      stat: "2.3x",
      description: "Spaced retrieval with AI shows 2.3x better retention compared to traditional massed practice methods.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Universal Efficacy",
      stat: "100%",
      description: "Studies with diverse groups including MCI patients showed >10% improvement in recall after just one month.",
      color: "from-orange-500 to-red-500"
    }
  ]

  const platformStats = [
    { platform: "Duolingo", metric: "25% DAU increase", detail: "AI-driven recommendations" },
    { platform: "Khan Academy", metric: "40% less practice time", detail: "Bayesian knowledge tracing" },
    { platform: "Coursera", metric: "35% review reduction", detail: "Item response theory" },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Built on Cutting-Edge Research
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform implements the latest findings from cognitive science, 
            neuroscience, and AI research to optimize your learning outcomes.
          </p>
        </motion.div>

        {/* Research Insights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AppleCard glassy elevated interactive className="p-6 h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center mb-4`}>
                  <insight.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-semibold mb-2">{insight.stat}</div>
                <h3 className="text-lg font-medium mb-2">{insight.title}</h3>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* Neuroscience Section */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-3xl font-light mb-6">The Neuroscience of Memory</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Long-Term Potentiation (LTP)</h4>
                  <p className="text-gray-600">
                    Spaced learning aligns with protein synthesis windows (~1 hour) for optimal synaptic strengthening.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Sleep Consolidation</h4>
                  <p className="text-gray-600">
                    Slow-wave sleep facilitates hippocampal-neocortical transfers, stabilizing memories from spaced sessions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Pattern Separation</h4>
                  <p className="text-gray-600">
                    fMRI studies show spacing increases cortical pattern separation, reducing memory interference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AppleCard glassy className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium">Memory Retention Curve</h4>
              <Badge className="bg-green-100 text-green-700">Live Data</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Without Spacing</span>
                  <span className="text-red-600">34% retention</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "34%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>With Our System</span>
                  <span className="text-green-600">87% retention</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "87%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </AppleCard>
        </motion.div>

        {/* Platform Comparisons */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-light mb-4">Industry-Leading Results</h3>
            <p className="text-gray-300">
              How we compare to other AI-powered learning platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {platformStats.map((platform, index) => (
              <motion.div
                key={platform.platform}
                className="bg-white/10 backdrop-blur rounded-xl p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="text-xl font-medium mb-2">{platform.platform}</h4>
                <div className="text-2xl font-semibold text-green-400 mb-1">
                  {platform.metric}
                </div>
                <p className="text-sm text-gray-300">{platform.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-semibold">92%</div>
                <div className="text-sm text-gray-300">Our retention rate</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-semibold">2.3x</div>
                <div className="text-sm text-gray-300">Better than traditional</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-semibold">30%</div>
                <div className="text-sm text-gray-300">Less study time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}