import OpenAI from 'openai'
import { env } from '@/lib/env'

if (!env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

// Default configuration for different use cases
export const defaultModels = {
  chat: 'gpt-4o-mini',
  analysis: 'gpt-4o',
  embedding: 'text-embedding-3-small'
} as const

export const defaultConfig = {
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
} as const