'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
})

// Generate abstract learning-themed images for cards
export async function generateCardImage(
  prompt: string,
  style: 'abstract' | 'minimal' | 'geometric' | 'gradient' = 'abstract'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const stylePrompts = {
    abstract: 'abstract artistic representation with flowing shapes and vibrant colors, modern digital art style',
    minimal: 'minimalist design with clean lines, simple geometric shapes, lots of white space, Bauhaus inspired',
    geometric: 'sacred geometry patterns, mathematical precision, interconnected shapes, technical drawing aesthetic',
    gradient: 'smooth gradient transitions, soft color blends, atmospheric depth, modern UI design inspired'
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an ${stylePrompts[style]} that represents the concept of "${prompt}". 
               The image should be educational, inspiring, and suitable for a learning flashcard. 
               Use a sophisticated color palette with blues, purples, and soft gradients. 
               No text or letters in the image.`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url
    
    if (!imageUrl) {
      throw new Error('No image generated')
    }

    // Save the image URL to database using ai_generations table
    const { data, error } = await supabase
      .from('ai_generations')
      .insert({
        user_id: user.id,
        generation_type: 'card_image',
        prompt,
        response: { imageUrl, style } as any
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      imageUrl,
      imageId: data.id
    }
  } catch (error) {
    logger.error('Image generation failed', {
      userId: user.id,
      error,
      metadata: { prompt, cardId }
    })
    throw new Error('Failed to generate image')
  }
}

// Generate a learning visualization for stats/progress
export async function generateProgressVisualization(
  stats: {
    totalCards: number
    mastered: number
    learning: number
    accuracy: number
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  try {
    const prompt = `Create an abstract data visualization showing learning progress:
                    - ${stats.mastered} items mastered (use green/emerald tones)
                    - ${stats.learning} items in progress (use blue/purple tones)
                    - ${stats.accuracy}% accuracy rate (use circular or radial patterns)
                    Create a beautiful, modern infographic style visualization with smooth gradients,
                    geometric shapes, and a sense of upward progress and achievement.
                    Style: clean, professional, inspiring. No text or numbers.`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1792x1024",
      quality: "standard",
      n: 1,
    })

    return {
      success: true,
      imageUrl: response.data?.[0]?.url
    }
  } catch (error) {
    logger.error('Visualization generation failed', {
      userId: user.id,
      error,
      metadata: { concept, cardId }
    })
    throw new Error('Failed to generate visualization')
  }
}

// Generate topic/category illustrations
export async function generateTopicIllustration(
  topic: string,
  concepts: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  try {
    const conceptsList = concepts.slice(0, 5).join(', ')
    
    const prompt = `Create a sophisticated abstract illustration for the topic "${topic}".
                    Incorporate visual metaphors for these concepts: ${conceptsList}.
                    Style: Modern editorial illustration, similar to those in The New York Times or Medium articles.
                    Use a cohesive color palette with 3-4 colors maximum.
                    The illustration should be conceptual and thought-provoking, avoiding literal representations.
                    Think architectural diagrams meets modern art.
                    No text, letters, or words in the image.`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    // Store in database using ai_generations table
    const { data, error } = await supabase
      .from('ai_generations')
      .insert({
        user_id: user.id,
        generation_type: 'topic_image',
        prompt,
        response: { imageUrl, topic, concepts } as any
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      imageUrl,
      imageId: data.id
    }
  } catch (error) {
    logger.error('Topic illustration failed', {
      userId: user.id,
      error,
      metadata: { topic, style }
    })
    throw new Error('Failed to generate topic illustration')
  }
}

// Batch generate images for multiple cards
export async function batchGenerateCardImages(
  cards: Array<{ id: string; front: string; topic?: string }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const results = []
  
  for (const card of cards) {
    try {
      const result = await generateCardImage(
        card.front,
        'abstract'
      )
      
      // Store image association in ai_generations table
      await supabase
        .from('ai_generations')
        .insert({
          user_id: user.id,
          card_id: card.id,
          generation_type: 'batch_image',
          prompt: card.front,
          response: { imageUrl: result.imageUrl } as any
        })

      results.push({
        cardId: card.id,
        success: true,
        imageUrl: result.imageUrl
      })
    } catch (error) {
      results.push({
        cardId: card.id,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      })
    }
  }

  return results
}