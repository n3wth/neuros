'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Brain, Zap, Target, ChevronRight, Play, Pause } from 'lucide-react'

export default function AIShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeDemo, setActiveDemo] = useState('spaced')
  const [isPlaying, setIsPlaying] = useState(true)

  const demos = {
    spaced: {
      title: 'Intelligent Spacing Algorithm',
      description: 'Our AI analyzes your forgetting curve and optimizes review timing for maximum retention.',
      metrics: ['2.3x better retention', '40% less study time', 'Personalized to you']
    },
    adaptive: {
      title: 'Adaptive Difficulty',
      description: 'Content difficulty adjusts in real-time based on your performance and confidence levels.',
      metrics: ['Progressive challenge', 'Never too easy', 'Never overwhelming']
    },
    insights: {
      title: 'Learning Analytics',
      description: 'Deep insights into your learning patterns, strengths, and areas for improvement.',
      metrics: ['Daily progress', 'Concept mastery', 'Predictive modeling']
    }
  }

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Learning, reimagined with AI
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Traditional learning apps use fixed algorithms. Neuros uses advanced neural networks 
            that adapt to your unique learning patterns in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-4">
              {Object.entries(demos).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                    activeDemo === key 
                      ? 'bg-white shadow-lg border border-gray-200' 
                      : 'bg-white/50 hover:bg-white border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium mb-2 ${
                        activeDemo === key ? 'text-black' : 'text-gray-700'
                      }`}>
                        {demo.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        activeDemo === key ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {demo.description}
                      </p>
                      
                      {activeDemo === key && (
                        <motion.div 
                          className="mt-4 flex flex-wrap gap-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {demo.metrics.map((metric, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-3 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded-full"
                            >
                              {metric}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 ml-4 transition-transform ${
                      activeDemo === key ? 'rotate-90 text-black' : 'text-gray-400'
                    }`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Demo Controls */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">Live Demonstration</h4>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Progress visualization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Memory Strength</span>
                  <span>87%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isPlaying ? '87%' : '87%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Next Review</span>
                  <span>Optimizing...</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full"
                    animate={{ width: isPlaying ? ['20%', '60%', '45%'] : '45%' }}
                    transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Demo Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[500px] bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* AI Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Central node */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black rounded-full flex items-center justify-center"
                  animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Orbiting nodes */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60) * Math.PI / 180
                  const x = Math.cos(angle) * 100
                  const y = Math.sin(angle) * 100
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-12 h-12"
                      style={{
                        transform: `translate(${x - 24}px, ${y - 24}px)`
                      }}
                      animate={isPlaying ? {
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      } : {}}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity
                      }}
                    >
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        {i % 2 === 0 ? (
                          <Zap className="w-6 h-6 text-gray-600" />
                        ) : (
                          <Target className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[...Array(6)].map((_, i) => {
                    const angle = (i * 60) * Math.PI / 180
                    const x = Math.cos(angle) * 100 + 128
                    const y = Math.sin(angle) * 100 + 128
                    
                    return (
                      <motion.line
                        key={`line-${i}`}
                        x1="128"
                        y1="128"
                        x2={x}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={isPlaying ? { pathLength: 1 } : {}}
                        transition={{
                          duration: 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold">2.3x</div>
                  <div className="text-xs text-gray-600">Faster Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">92%</div>
                  <div className="text-xs text-gray-600">Retention Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">AI</div>
                  <div className="text-xs text-gray-600">Powered</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}