'use client'

import { motion, useInView, useMotionValue } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { BrainIcon, SparkleIcon, ChartIcon } from '@/components/icons/line-icons'

export default function AIShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const features = [
    {
      id: 'memory',
      title: 'Memory that mirrors yours',
      subtitle: 'Intelligent Spacing',
      description: 'Our system learns your forgetting curve and delivers knowledge at the exact moment before you forget—creating permanent memories, not temporary knowledge.',
      icon: BrainIcon,
      color: '#FF6B6B',
      stats: {
        main: '87%',
        label: 'retention after 30 days',
        sub: 'vs 23% traditional'
      }
    },
    {
      id: 'adaptive',
      title: 'Difficulty that evolves',
      subtitle: 'Adaptive Challenge',
      description: 'Like a personal tutor that knows exactly when to push you harder and when to ease up. Every session calibrated to your current ability.',
      icon: SparkleIcon,
      color: '#4ECDC4',
      stats: {
        main: '2.3×',
        label: 'faster mastery',
        sub: 'personalized pacing'
      }
    },
    {
      id: 'insights',
      title: 'Understanding, visualized',
      subtitle: 'Deep Analytics',
      description: 'See your learning patterns emerge. Discover your peak performance times, strongest subjects, and optimal review schedules.',
      icon: ChartIcon,
      color: '#95E77E',
      stats: {
        main: '15min',
        label: 'daily optimal',
        sub: 'science-backed duration'
      }
    }
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = (ref.current as HTMLElement).getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section ref={ref} className="py-32 bg-gradient-to-b from-white via-[#FAFAF9] to-white relative overflow-hidden">
      {/* Additional subtle gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="max-w-4xl mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              The Science
            </p>
          </motion.div>

          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-8">
            Not just another
            <span className="block text-black/60 mt-2">learning app.</span>
          </h2>
          
          <p className="text-xl leading-[1.6] text-black/60 font-light max-w-3xl">
            We didn&apos;t build features. We built a cognitive architecture that understands 
            how human memory actually works—then amplified it with AI.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="relative bg-white border border-black/5 rounded-3xl p-8 h-full overflow-hidden hover:shadow-xl transition-shadow duration-500">
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top left, ${feature.color}10 0%, transparent 50%)`,
                  }}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
                    style={{ 
                      backgroundColor: hoveredCard === feature.id ? `${feature.color}20` : '#F5F5F5' 
                    }}
                  >
                    <feature.icon 
                      className="w-7 h-7 transition-colors duration-300" 
                      style={{ 
                        color: hoveredCard === feature.id ? feature.color : '#666' 
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-3">
                    {feature.subtitle}
                  </p>
                  <h3 className="text-2xl font-serif font-light mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-black/60 font-light mb-8">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="pt-6 border-t border-black/5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-serif font-light">{feature.stats.main}</span>
                      <div className="flex-1">
                        <p className="text-sm text-black/80">{feature.stats.label}</p>
                        <p className="text-xs text-black/40 mt-1">{feature.stats.sub}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-8 right-8 w-10 h-10 rounded-full border border-black/10 flex items-center justify-center"
                  animate={hoveredCard === feature.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <ArrowRight className="w-4 h-4 text-black/30" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-black/50 font-light mb-8">
            Ready to experience learning that actually sticks?
          </p>
          <button className="group inline-flex items-center gap-4 px-8 py-4 bg-black text-white rounded-full hover:bg-black/90 transition-colors">
            <span className="text-base font-medium">See it in action</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  )
}