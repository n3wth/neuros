'use client'

import { motion, useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles, Brain, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModernHeroProps {
  isAuthenticated: boolean
}

export default function ModernHero({ isAuthenticated }: ModernHeroProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  
  const features = [
    {
      icon: Brain,
      title: "Cognitive Architecture",
      description: "AI that understands how you learn best",
      metric: "87% retention"
    },
    {
      icon: Target,
      title: "Precision Timing",
      description: "Content delivered exactly when needed", 
      metric: "2.3x faster"
    },
    {
      icon: Sparkles,
      title: "Adaptive Intelligence",
      description: "Difficulty that evolves with your progress",
      metric: "15min daily"
    }
  ]

  return (
    <motion.section 
      ref={ref}
      className="relative min-h-screen bg-white text-gray-900 overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-gray-900 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-gray-600 rounded-full"
        animate={{
          x: [0, 15, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16">
        <div className="grid lg:grid-cols-12 gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                <Sparkles className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Introducing Neuros 2.0</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.05] tracking-tight">
                Learn like your
                <br />
                <span className="relative">
                  brain was designed
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gray-900 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-xl lg:text-2xl leading-relaxed text-gray-600 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              An AI learning system that understands your cognitive patterns, 
              delivers content at the perfect moment, and adapts to accelerate mastery.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button 
                asChild
                size="lg"
                className="group h-14 px-8 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-base font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                  Start learning now
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="group h-14 px-8 border-gray-300 hover:bg-gray-50 rounded-xl text-base font-medium transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                { value: "87%", label: "retention rate" },
                { value: "2.3x", label: "faster mastery" },
                { value: "50k+", label: "active learners" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="lg:col-span-5">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      hoveredFeature === index 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-gray-900 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {feature.description}
                      </p>
                      <div className="text-xs font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded-md inline-block">
                        {feature.metric}
                      </div>
                    </div>

                    <motion.div
                      className="w-6 h-6 text-gray-400"
                      animate={{
                        rotate: hoveredFeature === index ? 45 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-full h-full" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}