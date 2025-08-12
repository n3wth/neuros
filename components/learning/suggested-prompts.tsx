'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { 
  SparkleIcon, 
  BookIcon, 
  LightbulbIcon, 
  RocketIcon,
  BeakerIcon,
  HeartIcon,
  ChartIcon,
  PlusIcon,
  ArrowRight
} from '@/components/icons/line-icons'

interface SuggestedPrompt {
  id: string
  category: string
  icon: React.ReactNode
  title: string
  prompt: string
  examples: string[]
  color: string
}

const prompts: SuggestedPrompt[] = [
  {
    id: 'languages',
    category: 'Languages',
    icon: <BookIcon className="w-5 h-5" />,
    title: 'Learn a New Language',
    prompt: 'Create flashcards for common phrases in',
    examples: ['Spanish greetings', 'French numbers 1-20', 'Japanese hiragana'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'coding',
    category: 'Programming',
    icon: <BeakerIcon className="w-5 h-5" />,
    title: 'Master Coding Concepts',
    prompt: 'Generate cards to learn',
    examples: ['JavaScript array methods', 'Python list comprehensions', 'React hooks'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'science',
    category: 'Science',
    icon: <RocketIcon className="w-5 h-5" />,
    title: 'Explore Science',
    prompt: 'Create study cards about',
    examples: ['The solar system', 'Human anatomy basics', 'Chemical elements'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'history',
    category: 'History',
    icon: <ChartIcon className="w-5 h-5" />,
    title: 'Historical Events',
    prompt: 'Make cards covering',
    examples: ['World War II key dates', 'Ancient civilizations', 'American Revolution'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'trivia',
    category: 'General Knowledge',
    icon: <LightbulbIcon className="w-5 h-5" />,
    title: 'Fun Facts & Trivia',
    prompt: 'Generate interesting facts about',
    examples: ['World capitals', 'Famous inventions', 'Movie quotes'],
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'personal',
    category: 'Personal Growth',
    icon: <HeartIcon className="w-5 h-5" />,
    title: 'Self-Improvement',
    prompt: 'Create cards for',
    examples: ['Daily affirmations', 'Productivity tips', 'Mindfulness exercises'],
    color: 'from-pink-500 to-rose-500'
  }
]

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void
  variant?: 'grid' | 'carousel'
}

export default function SuggestedPrompts({ onSelectPrompt, variant = 'grid' }: SuggestedPromptsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  return (
    <div className="w-full">
      {/* Editorial header with subtle animation */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-12 bg-black/30" />
          <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
            Quick Start
          </p>
        </div>
        <h3 className="text-[clamp(2rem,4vw,3rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-6 text-black">
          What fascinates you?
        </h3>
        <p className="text-lg sm:text-xl text-black/60 font-light leading-[1.6] max-w-3xl">
          Select a learning path below, or craft your own. Our AI creates cards precisely
          calibrated to your forgetting curve.
        </p>
      </motion.div>

      {variant === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 + index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              onMouseEnter={() => setHoveredCard(prompt.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className="relative h-full bg-white rounded-3xl border border-black/5 p-8 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden"
                onClick={() => onSelectPrompt(`${prompt.prompt} ${prompt.examples[0]}`)}
              >
                {/* Subtle background accent */}
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  animate={{
                    scale: hoveredCard === prompt.id ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div 
                    className={`w-full h-full bg-gradient-to-br ${prompt.color} rounded-full blur-3xl opacity-20`}
                  />
                </motion.div>
                
                <div className="relative">
                  <div className="mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                      style={{ backgroundColor: `${prompt.color.split(' ')[1].replace('to-', '')}20` }}
                    >
                      <motion.div
                        animate={hoveredCard === prompt.id ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <prompt.icon 
                          className="w-7 h-7" 
                          style={{ color: prompt.color.split(' ')[1].replace('to-', '') }}
                        />
                      </motion.div>
                    </div>
                    <p className="text-xs font-mono text-black/40 tracking-[0.2em] uppercase mb-3">
                      {prompt.category}
                    </p>
                  </div>
                  
                  <h4 className="text-2xl font-serif font-light mb-4 leading-tight text-black">
                    {prompt.title}
                  </h4>
                  
                  <div className="space-y-3 mb-6">
                    {prompt.examples.slice(0, 2).map((example, i) => (
                      <motion.button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectPrompt(`${prompt.prompt} ${example}`)
                        }}
                        className="block w-full text-left text-sm text-black/60 hover:text-black rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-black/5 group"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                        <span className="ml-2">{example}</span>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-black/5">
                    <motion.div 
                      className="flex items-center justify-between group"
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-sm font-light text-black/70">Start learning</span>
                      <div className="w-8 h-8 rounded-full bg-black/5 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="min-w-[280px] snap-center"
              >
                <Card 
                  className="relative p-6 bg-white rounded-2xl border border-black/5 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
                  onClick={() => onSelectPrompt(`${prompt.prompt} ${prompt.examples[0]}`)}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    <div 
                      className={`w-full h-full bg-gradient-to-br ${prompt.color} rounded-full blur-xl`}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${prompt.color} bg-opacity-10 flex items-center justify-center text-black/70`}>
                        {prompt.icon}
                      </div>
                      <span className="text-xs font-mono text-black/40 uppercase tracking-wider">
                        {prompt.category}
                      </span>
                    </div>
                    
                    <h4 className="text-base font-light mb-2 text-black/90">
                      {prompt.title}
                    </h4>
                    
                    <p className="text-sm text-black/60 mb-3">
                      {prompt.examples[0]}
                    </p>
                    
                    <button className="flex items-center gap-2 text-xs text-black/50 hover:text-black transition-colors">
                      <SparkleIcon className="w-3 h-3" />
                      <span>Start learning</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Custom card option with editorial style */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="inline-block">
          <div className="h-px w-full bg-black/10 mb-6" />
          <button
            onClick={() => onSelectPrompt('')}
            className="group inline-flex items-center gap-3 text-black/60 hover:text-black transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full border border-black/20 group-hover:border-black group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-300">
              <PlusIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-light">Or craft your own learning journey</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 transition-all duration-300" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}