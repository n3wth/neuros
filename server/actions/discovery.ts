'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { checkRateLimit } from '@/lib/rate-limit-server'
import { RateLimitExceededError } from '@/lib/rate-limit'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { cache, cacheKeys, cacheTTL } from '@/lib/cache'

const openai = env.OPENAI_API_KEY ? new OpenAI({
  apiKey: env.OPENAI_API_KEY
}) : null

interface TrendingTopic {
  id: string
  title: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cardCount: number
  learners: number
  trending: boolean
  color: string
  description: string
  exampleCards: string[]
}

interface SuggestionResult {
  suggestions?: string[]
  error?: string
}

interface TopicsResult {
  topics?: TrendingTopic[]
  error?: string
}

export async function generateAISuggestions(userLevel: 'new' | 'beginner' | 'intermediate' | 'advanced' = 'new', forceRefresh: boolean = false): Promise<SuggestionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Check cache first unless force refresh
    const cacheKey = cacheKeys.aiSuggestions(user.id, userLevel)
    if (!forceRefresh) {
      const cached = cache.get<string[]>(cacheKey)
      if (cached) {
        logger.debug('Returning cached AI suggestions', {
          metadata: { userId: user.id, userLevel, cacheHit: true }
        })
        return { suggestions: cached }
      }
    }

    if (!openai) {
      // Return fallback suggestions if OpenAI is not configured
      const fallback = getFallbackSuggestions(userLevel)
      // Cache even fallback suggestions to reduce computation
      cache.set(cacheKey, fallback, cacheTTL.aiSuggestions)
      return { suggestions: fallback }
    }

    // Check rate limit
    try {
      await checkRateLimit(user.id, 'GLOBAL_AI')
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        logger.warn('Rate limit exceeded for AI suggestions', { 
          metadata: { userId: user.id, retryAfter: error.retryAfter }
        })
        // Return cached suggestions if available, otherwise fallback
        const cached = cache.get<string[]>(cacheKey)
        if (cached) {
          return { suggestions: cached }
        }
        const fallback = getFallbackSuggestions(userLevel)
        cache.set(cacheKey, fallback, cacheTTL.shortLived) // Short cache for rate limited
        return { suggestions: fallback }
      }
      throw error
    }

    const levelPrompts = {
      new: "You're helping someone brand new to spaced repetition learning. Suggest beginner-friendly topics.",
      beginner: "You're helping someone who has started learning. Suggest topics that build on basics.",
      intermediate: "You're helping an experienced learner. Suggest more advanced or specialized topics.",
      advanced: "You're helping an expert learner. Suggest challenging, cutting-edge topics."
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a learning expert helping users discover interesting topics to study using spaced repetition flashcards. Generate exactly 4 concise, actionable suggestions for creating flashcard decks. Each suggestion should be a clear command starting with an action verb like "Create cards about...", "Learn...", "Master...", "Study...", etc. Keep each suggestion under 10 words. Focus on popular, practical topics that people want to learn in 2025.`
        },
        {
          role: 'user',
          content: `${levelPrompts[userLevel]} Generate 4 diverse learning suggestions covering different areas like technology, languages, science, business, or personal development. Make them specific and engaging.`
        }
      ],
      temperature: 0.9,
      max_tokens: 200
    })

    const content = response.choices[0]?.message?.content || ''
    const suggestions = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0 && line.length < 80)
      .slice(0, 4)

    if (suggestions.length < 4) {
      // Pad with fallback suggestions if AI didn't generate enough
      const fallbacks = getFallbackSuggestions(userLevel)
      while (suggestions.length < 4 && fallbacks.length > 0) {
        const fallback = fallbacks.shift()
        if (fallback && !suggestions.includes(fallback)) {
          suggestions.push(fallback)
        }
      }
    }

    logger.info('Generated AI suggestions', { 
      metadata: { userId: user.id, userLevel, count: suggestions.length }
    })

    return { suggestions }
  } catch (error) {
    logger.error('Failed to generate AI suggestions', { 
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
    return {
      suggestions: getFallbackSuggestions(userLevel)
    }
  }
}

export async function getTrendingTopics(): Promise<TopicsResult> {
  try {
    const supabase = await createClient()
    
    // In a real implementation, this would fetch from your database
    // For now, returning curated topics that could be stored in a topics table
    const topics: TrendingTopic[] = [
      {
        id: 'ai-fundamentals',
        title: 'AI & Machine Learning Basics',
        category: 'Technology',
        difficulty: 'beginner',
        cardCount: 47,
        learners: 3420,
        trending: true,
        color: '#8B5CF6',
        description: 'Master the fundamentals of artificial intelligence and machine learning',
        exampleCards: [
          'What is a neural network?',
          'Difference between AI and ML',
          'What is deep learning?'
        ]
      },
      {
        id: 'web3-crypto',
        title: 'Web3 & Blockchain',
        category: 'Technology',
        difficulty: 'intermediate',
        cardCount: 35,
        learners: 2156,
        trending: true,
        color: '#3B82F6',
        description: 'Understand blockchain technology and the decentralized web',
        exampleCards: [
          'What is a smart contract?',
          'How does proof of stake work?',
          'What is DeFi?'
        ]
      },
      {
        id: 'spanish-basics',
        title: 'Spanish for Beginners',
        category: 'Languages',
        difficulty: 'beginner',
        cardCount: 120,
        learners: 5823,
        trending: false,
        color: '#EF4444',
        description: 'Start your journey to Spanish fluency',
        exampleCards: [
          'Common Spanish greetings',
          'Numbers 1-100 in Spanish',
          'Essential Spanish verbs'
        ]
      },
      {
        id: 'psychology-101',
        title: 'Psychology Fundamentals',
        category: 'Science',
        difficulty: 'beginner',
        cardCount: 68,
        learners: 4120,
        trending: true,
        color: '#10B981',
        description: 'Explore the human mind and behavior',
        exampleCards: [
          'What is cognitive bias?',
          'Pavlov\'s classical conditioning',
          'Maslow\'s hierarchy of needs'
        ]
      },
      {
        id: 'finance-investing',
        title: 'Personal Finance & Investing',
        category: 'Business',
        difficulty: 'intermediate',
        cardCount: 82,
        learners: 6234,
        trending: true,
        color: '#F59E0B',
        description: 'Build wealth through smart financial decisions',
        exampleCards: [
          'What is compound interest?',
          'Dollar cost averaging explained',
          'Understanding P/E ratios'
        ]
      },
      {
        id: 'climate-science',
        title: 'Climate Science Essentials',
        category: 'Science',
        difficulty: 'intermediate',
        cardCount: 56,
        learners: 3892,
        trending: true,
        color: '#06B6D4',
        description: 'Understand climate change and environmental science',
        exampleCards: [
          'What is the greenhouse effect?',
          'Carbon cycle explained',
          'Renewable energy types'
        ]
      }
    ]

    // You could randomize or filter based on user preferences
    return { topics }
  } catch (error) {
    logger.error('Failed to get trending topics', { 
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
    return { error: 'Failed to load trending topics' }
  }
}

function getFallbackSuggestions(userLevel: string): string[] {
  const suggestions = {
    new: [
      "Learn essential Spanish phrases for travel",
      "Master JavaScript fundamentals",
      "Study human psychology basics",
      "Create cards for world capitals"
    ],
    beginner: [
      "Learn Python programming concepts",
      "Study French conversation skills",
      "Master personal finance basics",
      "Create cards for historical events"
    ],
    intermediate: [
      "Master advanced React patterns",
      "Study machine learning algorithms",
      "Learn business strategy frameworks",
      "Create cards for medical terminology"
    ],
    advanced: [
      "Study quantum computing principles",
      "Master advanced calculus concepts",
      "Learn venture capital strategies",
      "Create cards for neuroscience research"
    ]
  }
  
  return suggestions[userLevel as keyof typeof suggestions] || suggestions.new
}