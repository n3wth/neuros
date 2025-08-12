'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { BrainIcon, SparkleIcon, ChartIcon } from '@/components/icons/line-icons'

export default function AIShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      id: 'memory',
      title: 'Memory that mirrors yours',
      subtitle: 'Intelligent Spacing',
      description:
        'Our system learns your forgetting curve and delivers knowledge at the exact moment before you forget—creating permanent memories, not temporary knowledge.',
      icon: BrainIcon,
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
      description:
        "Like a personal tutor that knows exactly when to push you harder and when to ease up. Every session calibrated to your current ability.",
      icon: SparkleIcon,
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
      description:
        'See your learning patterns emerge. Discover your peak performance times, strongest subjects, and optimal review schedules.',
      icon: ChartIcon,
      stats: {
        main: '15min',
        label: 'daily optimal',
        sub: 'science-backed duration'
      }
    }
  ]

  return (
    <section ref={ref} className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <motion.div
          className="max-w-4xl mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              The Science
            </p>
          </div>

          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.1] tracking-[-0.02em] mb-8">
            Not just another
            <span className="block text-black/60 mt-2">learning app.</span>
          </h2>

          <p className="text-xl leading-[1.6] text-black/60 font-light max-w-3xl">
            We didn&apos;t build features. We built a cognitive architecture that understands
            how human memory actually works—then amplified it with AI.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white border rounded-3xl p-8 h-full"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-neutral-600" />
                </div>
              </div>

              <p className="text-xs font-mono text-black/40 uppercase tracking-wider mb-3">
                {feature.subtitle}
              </p>
              <h3 className="text-2xl font-light mb-4 leading-tight">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed text-black/60 font-light mb-8">
                {feature.description}
              </p>

              <div className="pt-6 border-t">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-light">{feature.stats.main}</span>
                  <div className="flex-1">
                    <p className="text-sm text-black/80">{feature.stats.label}</p>
                    <p className="text-xs text-black/40 mt-1">{feature.stats.sub}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-black/50 font-light mb-8">
            Ready to experience learning that actually sticks?
          </p>
          <button className="inline-flex items-center gap-4 px-8 py-4 bg-black text-white rounded-full hover:bg-black/90 transition-colors">
            <span className="text-base font-medium">See it in action</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

