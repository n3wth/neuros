'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { 
  SparkleIcon, 
  BookIcon, 
  LightbulbIcon, 
  RocketIcon,
  BeakerIcon,
  HeartIcon,
  ChartIcon,
  PlusIcon
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
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-serif font-light mb-3 text-black/90">
          What would you like to learn?
        </h3>
        <p className="text-black/60 font-light max-w-2xl mx-auto">
          Choose a topic below or create your own. Our AI will generate personalized flashcards
          optimized for spaced repetition learning.
        </p>
      </div>

      {variant === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card 
                className="relative p-6 bg-white rounded-2xl border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => onSelectPrompt(`${prompt.prompt} ${prompt.examples[0]}`)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  <div 
                    className={`w-full h-full bg-gradient-to-br ${prompt.color} rounded-full blur-2xl`}
                  />
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${prompt.color} bg-opacity-10 flex items-center justify-center text-black/70`}>
                      {prompt.icon}
                    </div>
                    <span className="text-xs font-mono text-black/40 uppercase tracking-wider">
                      {prompt.category}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-light mb-3 text-black/90">
                    {prompt.title}
                  </h4>
                  
                  <div className="space-y-2">
                    {prompt.examples.slice(0, 2).map((example, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectPrompt(`${prompt.prompt} ${example}`)
                        }}
                        className="block w-full text-left text-sm text-black/60 hover:text-black hover:bg-black/5 rounded-lg px-3 py-2 transition-all duration-200"
                      >
                        <span className="mr-2">→</span>
                        {example}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <button className="flex items-center gap-2 text-xs text-black/50 hover:text-black transition-colors group">
                      <PlusIcon className="w-3 h-3" />
                      <span>Try this topic</span>
                    </button>
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

      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => onSelectPrompt('')}
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Or create your own custom cards
        </button>
      </motion.div>
    </div>
  )
}