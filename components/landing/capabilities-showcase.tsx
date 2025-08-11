'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Clock, Target, BarChart3, Zap, Users } from 'lucide-react'

export default function CapabilitiesShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const capabilities = [
    {
      icon: Brain,
      title: "Cognitive Mapping",
      description: "AI analyzes your learning patterns to create personalized knowledge maps",
      features: ["Memory consolidation tracking", "Knowledge gap analysis", "Optimal review scheduling"],
      color: "blue"
    },
    {
      icon: Clock,
      title: "Spaced Repetition 2.0",
      description: "Advanced algorithms predict exactly when you'll forget and intervene at the perfect moment",
      features: ["Forgetting curve prediction", "Dynamic interval adjustment", "Context-aware reminders"],
      color: "emerald"
    },
    {
      icon: Target,
      title: "Adaptive Difficulty",
      description: "Content difficulty evolves in real-time based on your performance and confidence",
      features: ["Real-time adjustment", "Confidence calibration", "Progressive complexity"],
      color: "amber"
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      description: "Comprehensive insights into your learning journey with actionable recommendations",
      features: ["Performance trends", "Optimal study times", "Subject mastery tracking"],
      color: "purple"
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "AI-powered explanations and connections that deepen understanding instantly",
      features: ["Conceptual linking", "Multi-angle explanations", "Real-world applications"],
      color: "rose"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers and experts while maintaining your personalized learning path",
      features: ["Study groups", "Expert mentorship", "Peer challenges"],
      color: "cyan"
    }
  ]

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      accent: "text-blue-700"
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200", 
      icon: "text-emerald-600",
      accent: "text-emerald-700"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      accent: "text-amber-700"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600", 
      accent: "text-purple-700"
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "text-rose-600",
      accent: "text-rose-700"
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "text-cyan-600",
      accent: "text-cyan-700"
    }
  }

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">Core Capabilities</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
            Learning technology that
            <br />
            <span className="text-gray-600">understands you completely</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Six revolutionary capabilities working together to create the most effective 
            learning experience ever built.
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 + (index * 0.1),
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <div className={`
                relative h-full p-8 bg-white rounded-2xl border border-gray-200 
                hover:shadow-xl hover:-translate-y-1 transition-all duration-500
                group-hover:${colorClasses[capability.color as keyof typeof colorClasses].border}
              `}>
                
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-xl ${colorClasses[capability.color as keyof typeof colorClasses].bg} 
                  flex items-center justify-center mb-6 transition-colors duration-300
                `}>
                  <capability.icon className={`
                    w-8 h-8 ${colorClasses[capability.color as keyof typeof colorClasses].icon}
                  `} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-900 transition-colors">
                  {capability.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {capability.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`
                        w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0
                        ${colorClasses[capability.color as keyof typeof colorClasses].icon.replace('text-', 'bg-')}
                      `} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${
                      capability.color === 'blue' ? '#dbeafe20' :
                      capability.color === 'emerald' ? '#d1fae520' :
                      capability.color === 'amber' ? '#fef3c720' :
                      capability.color === 'purple' ? '#f3e8ff20' :
                      capability.color === 'rose' ? '#fdf2f820' :
                      '#ecfeff20'
                    }, transparent 70%)`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-600 mb-6">
            Experience all six capabilities working together
          </p>
          <button className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
            Try interactive demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}