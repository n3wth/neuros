'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TestTube2 } from 'lucide-react'
import { ClockIcon, SparkleIcon, ChartIcon } from '@/components/icons/line-icons'
import { signInAsDeveloper } from '@/server/actions/auth'
import { useRouter } from 'next/navigation'

interface ProfessionalHeroProps {
  isAuthenticated: boolean
  isDevelopment?: boolean
}

export default function ProfessionalHero({ isAuthenticated, isDevelopment = false }: ProfessionalHeroProps) {
  const ref = useRef(null)
  const router = useRouter()
  const [activeWord, setActiveWord] = useState(0)
  const [isTestLoading, setIsTestLoading] = useState(false)
  
  const words = ['Remember', 'Master', 'Understand', 'Internalize']
  
  const handleTestLogin = async () => {
    setIsTestLoading(true)
    try {
      const result = await signInAsDeveloper()
      if (result.success) {
        router.push('/dashboard')
      } else {
        console.error('Test login failed:', result.error)
        setIsTestLoading(false)
      }
    } catch (error) {
      console.error('Test login error:', error)
      setIsTestLoading(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <section ref={ref} className="relative bg-[#FAFAF9]">
      {/* Clean background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.04) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="space-y-12">
          {/* Refined announcement */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Introducing GPT-5
            </p>
          </motion.div>

          {/* Editorial hero text */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] max-w-5xl text-black/90">
              <div className="mb-4">
                <div className="relative h-[1.2em]">
                  <AnimatePresence mode="sync">
                    <motion.span
                      key={words[activeWord]}
                      initial={{ opacity: 0, y: 15, filter: "blur(3px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -15, filter: "blur(3px)" }}
                      transition={{ 
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="absolute left-0"
                    >
                      {words[activeWord]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div>everything.</div>
              </div>
              <span className="block text-black/60 mt-4 font-light">
                No more forgetting.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl leading-[1.6] text-black/60 font-light max-w-3xl">
              We built a learning system that works like your brain does—making connections, 
              finding patterns, and storing memories exactly when they&apos;re about to fade.
            </p>
          </motion.div>


          {/* Refined CTAs */}
          <motion.div 
            className="pt-2 flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link 
              href={isAuthenticated ? "/dashboard" : "/signup"}
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-black hover:bg-black/90 text-white border-0 outline-none transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              style={{ backgroundColor: '#000', color: '#fff' }}
            >
              <span className="text-sm font-medium" style={{ color: '#fff' }}>Get started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: '#fff' }} />
            </Link>
            
            {/* Development Only: Quick Test Login */}
            {isDevelopment && !isAuthenticated && (
              <button
                onClick={handleTestLogin}
                disabled={isTestLoading}
                className="group inline-flex items-center gap-2 bg-black/10 text-black/60 px-8 py-3 rounded-full hover:bg-black/20 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                title="Development Only: Quick Test Login\nSigns in as test@neuros.dev with sample learning data"
              >
                <TestTube2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isTestLoading ? 'Loading...' : 'Test Login'}
                </span>
              </button>
            )}
          </motion.div>

          {/* Refined features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {[
              {
                icon: ClockIcon,
                title: 'Intelligent Spacing',
                description: 'Our system learns your forgetting curve and delivers knowledge at the exact moment before you forget—creating permanent memories.',
                color: '#FF6B6B'
              },
              {
                icon: SparkleIcon,
                title: 'AI Generation',
                description: 'Generate study materials from your content using AI. Import PDFs, documents, and notes to create learning cards.',
                color: '#4ECDC4'
              },
              {
                icon: ChartIcon,
                title: 'Deep Analytics',
                description: 'See your learning patterns emerge. Discover your peak performance times and optimal review schedules.',
                color: '#95E77E'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.05 }}
              >
                <div className="bg-white border border-black/5 rounded-xl p-6 lg:p-8 h-full hover:shadow-md transition-all duration-200 shadow-sm">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon 
                      className="w-7 h-7" 
                      style={{ color: feature.color }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-serif font-normal mb-4 leading-tight text-black/90">
                    {feature.title}
                  </h3>
                  
                  <p className="text-base leading-relaxed text-black/60 font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}