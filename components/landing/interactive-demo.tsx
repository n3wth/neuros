'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, Brain } from 'lucide-react'

export default function InteractiveDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const demoSteps = [
    {
      title: "Initial Assessment",
      description: "AI analyzes your current knowledge and learning preferences",
      visual: {
        type: "progress",
        data: { progress: 0, status: "Analyzing..." }
      }
    },
    {
      title: "Personalized Path",
      description: "Custom learning sequence generated based on your cognitive profile",
      visual: {
        type: "pathway", 
        data: { nodes: 5, completed: 0, current: 1 }
      }
    },
    {
      title: "Adaptive Content",
      description: "Difficulty adjusts in real-time based on your performance",
      visual: {
        type: "difficulty",
        data: { level: "Beginner", confidence: 85 }
      }
    },
    {
      title: "Spaced Repetition",
      description: "AI predicts optimal review timing to maximize retention",
      visual: {
        type: "schedule",
        data: { reviews: [1, 3, 7, 14, 30], current: 1 }
      }
    },
    {
      title: "Knowledge Mastery",
      description: "Track your progress and celebrate achievements",
      visual: {
        type: "mastery",
        data: { subjects: 8, mastered: 6, retention: 94 }
      }
    }
  ]

  const startDemo = () => {
    setIsPlaying(true)
    setActiveStep(0)
    
    // Auto-progress through steps
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 3000)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setActiveStep(0)
  }

  const ProgressVisual = ({ data }: { data: { status: string } }) => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <motion.div 
          className="w-24 h-24 border-4 border-gray-200 border-t-blue-500 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-sm text-gray-600">{data.status}</p>
      </div>
    </div>
  )

  const PathwayVisual = ({ data }: { data: { nodes: number; completed: number; current: number } }) => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="flex items-center gap-4">
        {Array.from({ length: data.nodes }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <motion.div 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                i < data.completed ? 'bg-emerald-500 border-emerald-500 text-white' :
                i === data.current ? 'border-blue-500 text-blue-500' :
                'border-gray-300 text-gray-300'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: i === data.current ? 1.1 : 1,
                transition: { duration: 0.3 }
              }}
            >
              {i < data.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{i + 1}</span>
              )}
            </motion.div>
            {i < data.nodes - 1 && (
              <div className={`w-8 h-0.5 ${
                i < data.completed ? 'bg-emerald-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const DifficultyVisual = ({ data }: { data: { level: string; confidence: number } }) => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center">
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.level}</div>
          <div className="text-sm text-gray-600">Current Difficulty</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.confidence}%` }}
            transition={{ duration: 1.5 }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">{data.confidence}% confidence</div>
      </div>
    </div>
  )

  const ScheduleVisual = ({ data }: { data: { reviews: number[]; current: number } }) => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="grid grid-cols-5 gap-2">
        {data.reviews.map((day: number, i: number) => (
          <div key={i} className="text-center">
            <motion.div 
              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold ${
                i <= data.current ? 'bg-emerald-500 border-emerald-500 text-white' :
                'border-gray-300 text-gray-600'
              }`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              {day}d
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )

  const MasteryVisual = ({ data }: { data: { subjects: number; mastered: number; retention: number } }) => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center">
        <motion.div 
          className="text-4xl font-bold text-emerald-500 mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {data.retention}%
        </motion.div>
        <div className="text-sm text-gray-600 mb-4">Retention Rate</div>
        <div className="text-xs text-gray-500">
          {data.mastered}/{data.subjects} subjects mastered
        </div>
      </div>
    </div>
  )

  const renderVisual = (visual: { type: string; data: Record<string, unknown> }) => {
    switch (visual.type) {
      case 'progress': return <ProgressVisual data={visual.data} />
      case 'pathway': return <PathwayVisual data={visual.data} />
      case 'difficulty': return <DifficultyVisual data={visual.data} />
      case 'schedule': return <ScheduleVisual data={visual.data} />
      case 'mastery': return <MasteryVisual data={visual.data} />
      default: return null
    }
  }

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-6">
            <Brain className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">See it in action</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
            Experience the
            <br />
            <span className="text-gray-600">learning revolution</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch how our AI creates a personalized learning experience that adapts 
            to your unique cognitive patterns and goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Demo Controls & Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Controls */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={startDemo}
                disabled={isPlaying}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Playing...' : 'Start Demo'}
              </button>
              
              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {demoSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`relative p-6 rounded-xl border transition-all duration-300 ${
                    activeStep === index 
                      ? 'border-blue-300 bg-blue-50' 
                      : activeStep > index
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      activeStep === index
                        ? 'bg-blue-500 text-white'
                        : activeStep > index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {activeStep > index ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 transition-colors ${
                        activeStep >= index ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm transition-colors ${
                        activeStep >= index ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {activeStep === index && (
                      <motion.div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Demo Area */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              {/* Demo Screen */}
              <div className="h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    {renderVisual(demoSteps[activeStep]?.visual)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Demo Footer */}
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {demoSteps[activeStep]?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Step {activeStep + 1} of {demoSteps.length}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {demoSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === activeStep ? 'bg-blue-500' :
                          index < activeStep ? 'bg-emerald-500' :
                          'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}