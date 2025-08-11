'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { createCard } from './cards'
import { checkMultipleRateLimits } from '@/lib/rate-limit-server'
import { RateLimitExceededError } from '@/lib/rate-limit'
import { env } from '@/lib/env'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
})

// Retry utility with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Don't retry on authentication or configuration errors
      if (lastError.message.includes('Not authenticated') || 
          lastError.message.includes('API key') ||
          lastError.message.includes('configuration')) {
        throw lastError
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      console.log(`AI request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, lastError.message)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Generate flashcards from text using AI
export async function generateCardsFromText(
  text: string,
  options?: {
    topic?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    count?: number
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Check rate limits (both specific and global)
  const rateLimitResult = await checkMultipleRateLimits(user.id, ['CARD_GENERATION', 'GLOBAL_AI'])
  if (!rateLimitResult.allowed) {
    throw new RateLimitExceededError(
      rateLimitResult.message || 'Rate limit exceeded',
      rateLimitResult.retryAfter || 0,
      rateLimitResult.resetTime,
      'CARD_GENERATION'
    )
  }

  const count = options?.count || 20
  const difficulty = options?.difficulty || 'intermediate'

  try {
    const completion = await retryWithBackoff(() => 
      openai.chat.completions.create({
        model: "gpt-4o", // Use gpt-4o which supports structured outputs
        messages: [
          {
            role: "system",
            content: `You are an expert educator creating flashcards for spaced repetition learning. 
            Create ${count} flashcards from the provided text. 
            Each flashcard should:
            - Test a single, specific concept
            - Have a clear, concise question (front)
            - Have a precise answer (back)
            - Include a brief explanation for deeper understanding
            - Be appropriate for ${difficulty} level learners
            
            Return JSON in this exact format:
            {
              "cards": [
                {
                  "front": "Question or prompt",
                  "back": "Answer",
                  "explanation": "Brief explanation of why this is the answer",
                  "tags": ["tag1", "tag2"]
                }
              ]
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    )

    const response = JSON.parse(completion.choices[0].message.content || '{}')
    
    if (!response.cards || !Array.isArray(response.cards)) {
      throw new Error('Invalid response format from AI')
    }

    // Create cards in database
    const createdCards = []
    for (const card of response.cards) {
      try {
        const created = await createCard({
          front: card.front,
          back: card.back,
          explanation: card.explanation,
          difficulty,
          tags: card.tags || [],
          topic_id: options?.topic
        })
        createdCards.push(created)
      } catch (cardError) {
        console.error('Error creating card:', {
          cardData: {
            front: card.front,
            back: card.back,
            explanation: card.explanation,
            difficulty,
            tags: card.tags || []
          },
          error: cardError
        })
        throw cardError
      }
    }

    // Log AI generation
    await supabase.from('ai_generations').insert({
      user_id: user.id,
      prompt: text,
      response: response,
      generation_type: 'card',
      tokens_used: completion.usage?.total_tokens
    })

    return {
      success: true,
      cards: createdCards,
      tokensUsed: completion.usage?.total_tokens
    }
  } catch (error) {
    // Re-throw rate limit errors without modification
    if (error instanceof RateLimitExceededError) {
      throw error
    }
    
    console.error('AI generation error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
      userId: user.id,
      timestamp: new Date().toISOString()
    })
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing')
      }
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        throw new Error('OpenAI API rate limit or quota exceeded. Please try again later.')
      }
      if (error.message.includes('network') || error.message.includes('timeout')) {
        throw new Error('Network error connecting to OpenAI API. Please check your connection.')
      }
      throw new Error(`AI generation failed: ${error.message}`)
    }
    
    throw new Error('Failed to generate cards: Unknown error')
  }
}

// Generate an explanation for a concept
export async function generateExplanation(
  concept: string,
  level: 'simple' | 'detailed' | 'eli5' = 'simple'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Check rate limits
  const rateLimitResult = await checkMultipleRateLimits(user.id, ['EXPLANATION', 'GLOBAL_AI'])
  if (!rateLimitResult.allowed) {
    throw new RateLimitExceededError(
      rateLimitResult.message || 'Rate limit exceeded',
      rateLimitResult.retryAfter || 0,
      rateLimitResult.resetTime,
      'EXPLANATION'
    )
  }

  const prompts = {
    simple: 'Explain this concept clearly and concisely',
    detailed: 'Provide a comprehensive explanation with examples',
    eli5: 'Explain this like I\'m five years old, using simple analogies'
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompts[level]
        },
        {
          role: "user",
          content: concept
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const explanation = completion.choices[0].message.content

    // Log AI generation
    await supabase.from('ai_generations').insert({
      user_id: user.id,
      prompt: concept,
      response: { explanation, level },
      generation_type: 'explanation',
      tokens_used: completion.usage?.total_tokens
    })

    return {
      explanation,
      tokensUsed: completion.usage?.total_tokens
    }
  } catch (error) {
    // Re-throw rate limit errors without modification
    if (error instanceof RateLimitExceededError) {
      throw error
    }
    
    console.error('AI explanation error:', {
      error,
      userId: user.id,
      concept,
      level,
      timestamp: new Date().toISOString()
    })
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.')
    }
    
    throw new Error('Failed to generate explanation')
  }
}

// Generate practice questions for a card
export async function generatePracticeQuestions(
  cardFront: string,
  cardBack: string,
  count: number = 3
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Check rate limits
  const rateLimitResult = await checkMultipleRateLimits(user.id, ['PRACTICE_QUESTIONS', 'GLOBAL_AI'])
  if (!rateLimitResult.allowed) {
    throw new RateLimitExceededError(
      rateLimitResult.message || 'Rate limit exceeded',
      rateLimitResult.retryAfter || 0,
      rateLimitResult.resetTime,
      'PRACTICE_QUESTIONS'
    )
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate ${count} additional practice questions related to this flashcard.
          Each question should test the same concept from different angles.
          Return JSON in this format:
          {
            "questions": [
              {
                "question": "Practice question",
                "answer": "Expected answer",
                "hint": "Optional hint"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Card Front: ${cardFront}\nCard Back: ${cardBack}`
        }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    // Log AI generation
    await supabase.from('ai_generations').insert({
      user_id: user.id,
      prompt: `${cardFront} | ${cardBack}`,
      response: response,
      generation_type: 'quiz',
      tokens_used: completion.usage?.total_tokens
    })

    return {
      questions: response.questions || [],
      tokensUsed: completion.usage?.total_tokens
    }
  } catch (error) {
    // Re-throw rate limit errors without modification
    if (error instanceof RateLimitExceededError) {
      throw error
    }
    
    console.error('AI practice questions error:', {
      error,
      userId: user.id,
      cardFront,
      timestamp: new Date().toISOString()
    })
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.')
    }
    
    throw new Error('Failed to generate practice questions')
  }
}

// Generate a learning path for a topic
export async function generateLearningPath(
  topic: string,
  currentLevel: 'beginner' | 'intermediate' | 'advanced',
  goals?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Check rate limits
  const rateLimitResult = await checkMultipleRateLimits(user.id, ['LEARNING_PATH', 'GLOBAL_AI'])
  if (!rateLimitResult.allowed) {
    throw new RateLimitExceededError(
      rateLimitResult.message || 'Rate limit exceeded',
      rateLimitResult.retryAfter || 0,
      rateLimitResult.resetTime,
      'LEARNING_PATH'
    )
  }

  try {
    const completion = await retryWithBackoff(() =>
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Create a structured learning path for someone at ${currentLevel} level.
            Include prerequisites, core concepts, practical exercises, and milestones.
            ${goals ? `Learning goals: ${goals}` : ''}
            Return JSON in this format:
            {
              "path": {
                "title": "Learning path title",
                "duration": "Estimated time",
                "prerequisites": ["prerequisite1", "prerequisite2"],
                "modules": [
                  {
                    "title": "Module title",
                    "concepts": ["concept1", "concept2"],
                    "exercises": ["exercise1", "exercise2"],
                    "milestone": "What learner will achieve"
                  }
                ],
                "resources": ["resource1", "resource2"]
              }
            }`
          },
          {
            role: "user",
            content: topic
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    )

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      path: response.path,
      tokensUsed: completion.usage?.total_tokens
    }
  } catch (error) {
    // Re-throw rate limit errors without modification
    if (error instanceof RateLimitExceededError) {
      throw error
    }
    
    console.error('AI learning path error:', {
      error,
      userId: user.id,
      topic,
      currentLevel,
      timestamp: new Date().toISOString()
    })
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.')
    }
    
    throw new Error('Failed to generate learning path')
  }
}

// Analyze user's learning patterns and provide insights
export async function generateLearningInsights(
  stats: {
    totalCards: number
    mastered: number
    struggling: number
    averageAccuracy: number
    studyTimeMinutes: number
    bestTimeOfDay?: number
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  // Check rate limits
  const rateLimitResult = await checkMultipleRateLimits(user.id, ['INSIGHTS', 'GLOBAL_AI'])
  if (!rateLimitResult.allowed) {
    throw new RateLimitExceededError(
      rateLimitResult.message || 'Rate limit exceeded',
      rateLimitResult.retryAfter || 0,
      rateLimitResult.resetTime,
      'INSIGHTS'
    )
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Analyze these learning statistics and provide actionable insights.
          Be specific, encouraging, and practical.
          Return JSON in this format:
          {
            "insights": [
              {
                "type": "strength" | "improvement" | "suggestion",
                "title": "Insight title",
                "description": "Detailed insight",
                "action": "Recommended action"
              }
            ],
            "summary": "Brief overall assessment"
          }`
        },
        {
          role: "user",
          content: JSON.stringify(stats)
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      insights: response.insights || [],
      summary: response.summary,
      tokensUsed: completion.usage?.total_tokens
    }
  } catch (error) {
    // Re-throw rate limit errors without modification
    if (error instanceof RateLimitExceededError) {
      throw error
    }
    
    console.error('AI insights error:', {
      error,
      userId: user.id,
      stats,
      timestamp: new Date().toISOString()
    })
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.')
    }
    
    throw new Error('Failed to generate insights')
  }
}