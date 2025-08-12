/**
 * Refactored cards Server Actions following 2025 best practices
 * This demonstrates AI-optimized patterns for better code generation
 */

"use server"

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { 
  handleActionError, 
  ActionResult,
  throwError,
  withErrorHandler 
} from '@/lib/errors/error-handler'
import { 
  AuthenticationError,
  RateLimitError,
  ValidationError 
} from '@/lib/errors/app-errors'
import { checkRateLimit } from '@/lib/rate-limit-server'
import { openai } from '@/lib/openai'

// ============================================================================
// SCHEMAS - Centralized validation schemas for type safety
// ============================================================================

/**
 * Schema for creating a new flashcard
 * @property {string} deck_id - UUID of the parent deck
 * @property {string} front - Question/prompt (1-1000 chars)
 * @property {string} back - Answer/response (1-1000 chars)
 * @property {string[]} tags - Optional categorization tags
 */
const CreateCardSchema = z.object({
  deck_id: z.string().uuid('Invalid deck ID'),
  front: z.string().min(1, 'Front text is required').max(1000, 'Front text too long'),
  back: z.string().min(1, 'Back text is required').max(1000, 'Back text too long'),
  tags: z.array(z.string()).optional().default([])
})

/**
 * Schema for AI-powered card generation
 * @property {string} prompt - Generation prompt (1-500 chars)
 * @property {string} deck_id - Target deck for generated cards
 * @property {number} count - Number of cards to generate (1-10)
 * @property {object} options - Generation parameters
 */
const GenerateCardsSchema = z.object({
  prompt: z.string().min(1).max(500),
  deck_id: z.string().uuid(),
  count: z.number().int().min(1).max(10).default(1),
  options: z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    style: z.enum(['academic', 'casual', 'mnemonic']).optional(),
    temperature: z.number().min(0).max(1).optional()
  }).optional()
})

/**
 * Schema for updating an existing card
 */
const UpdateCardSchema = z.object({
  id: z.string().uuid(),
  front: z.string().min(1).max(1000).optional(),
  back: z.string().min(1).max(1000).optional(),
  tags: z.array(z.string()).optional()
})

// ============================================================================
// TYPE DEFINITIONS - Exported for use in components
// ============================================================================

export type CreateCardInput = z.infer<typeof CreateCardSchema>
export type GenerateCardsInput = z.infer<typeof GenerateCardsSchema>
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>

export interface Card {
  id: string
  deck_id: string
  front: string
  back: string
  ease_factor: number
  interval: number
  repetitions: number
  created_at: string
  updated_at: string
  tags?: string[]
}

// ============================================================================
// HELPER FUNCTIONS - Reusable logic
// ============================================================================

/**
 * Authenticates the current user and returns their ID
 * @throws {AuthenticationError} If user is not authenticated
 */
async function requireAuth(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new AuthenticationError('Please sign in to continue')
  }
  
  return user.id
}

/**
 * Verifies user owns the specified deck
 * @throws {NotFoundError} If deck doesn't exist or user doesn't own it
 */
async function verifyDeckOwnership(userId: string, deckId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: deck, error } = await supabase
    .from('decks')
    .select('id')
    .eq('id', deckId)
    .eq('user_id', userId)
    .single()
  
  if (error || !deck) {
    throwError.notFound('Deck', deckId)
  }
}

// ============================================================================
// SERVER ACTIONS - Main exported functions
// ============================================================================

/**
 * Creates a new flashcard in the specified deck
 * 
 * @param input - Card creation parameters
 * @returns Created card or error
 * 
 * @example
 * const result = await createCard({
 *   deck_id: 'uuid-123',
 *   front: 'What is the capital of France?',
 *   back: 'Paris',
 *   tags: ['geography', 'europe']
 * })
 */
export async function createCard(
  input: CreateCardInput
): Promise<ActionResult<Card>> {
  try {
    // 1. Authenticate user
    const userId = await requireAuth()
    
    // 2. Validate input
    const validated = CreateCardSchema.parse(input)
    
    // 3. Verify deck ownership
    await verifyDeckOwnership(userId, validated.deck_id)
    
    // 4. Create card in database
    const supabase = await createClient()
    const { data: card, error } = await supabase
      .from('cards')
      .insert({
        user_id: userId,
      topic_id: validated.topic_id,
        front: validated.front,
        back: validated.back,
        tags: validated.tags,
        ease_factor: 2.5,
        interval: 0,
        repetitions: 0
      })
      .select()
      .single()
    
    if (error) {
      throwError.database('Failed to create card', error)
    }
    
    return { success: true, data: card }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Generates flashcards using AI based on a prompt
 * 
 * @param input - Generation parameters
 * @returns Array of generated cards or error
 * @throws {RateLimitError} When rate limit is exceeded
 * 
 * @example
 * const result = await generateCards({
 *   prompt: 'Create flashcards about photosynthesis',
 *   deck_id: 'uuid-123',
 *   count: 5,
 *   options: { difficulty: 'intermediate' }
 * })
 */
export async function generateCards(
  input: GenerateCardsInput
): Promise<ActionResult<Card[]>> {
  try {
    // 1. Authenticate user
    const userId = await requireAuth()
    
    // 2. Validate input
    const validated = GenerateCardsSchema.parse(input)
    
    // 3. Check rate limits
    try {
      await checkRateLimit(userId, 'CARD_GENERATION')
    } catch (error) {
      if (error instanceof Error && error.message.includes('Rate limit')) {
        throw new RateLimitError(60, 10, '1 minute')
      }
      throw error
    }
    
    // 4. Verify deck ownership
    await verifyDeckOwnership(userId, validated.deck_id)
    
    // 5. Generate cards with OpenAI
    const systemPrompt = `Generate ${validated.count} flashcard(s) based on the user's prompt.
    Difficulty: ${validated.options?.difficulty || 'intermediate'}
    Style: ${validated.options?.style || 'academic'}
    Format each card as JSON: { "front": "question", "back": "answer" }`
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: validated.prompt }
      ],
      temperature: validated.options?.temperature ?? 0.7,
      response_format: { type: 'json_object' }
    })
    
    const content = completion.choices[0].message.content
    if (!content) {
      throwError.external('OpenAI', 'No response generated')
    }
    
    // 6. Parse generated cards
    const generatedData = JSON.parse(content)
    const cards = Array.isArray(generatedData.cards) 
      ? generatedData.cards 
      : [generatedData]
    
    // 7. Save cards to database
    const supabase = await createClient()
    const cardsToInsert = cards.map((card: any) => ({
      user_id: userId,
      topic_id: validated.topic_id,
      front: card.front,
      back: card.back,
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      ai_generated: true
    }))
    
    const { data: savedCards, error } = await supabase
      .from('cards')
      .insert(cardsToInsert)
      .select()
    
    if (error) {
      throwError.database('Failed to save generated cards', error)
    }
    
    return { success: true, data: savedCards }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Updates an existing flashcard
 * Uses the withErrorHandler utility for cleaner code
 */
export const updateCard = withErrorHandler(async (input: UpdateCardInput) => {
  const userId = await requireAuth()
  const validated = UpdateCardSchema.parse(input)
  
  const supabase = await createClient()
  
  // Verify ownership through join
  const { data: card, error } = await supabase
    .from('cards')
    .update({
      front: validated.front,
      back: validated.back,
      tags: validated.tags,
      updated_at: new Date().toISOString()
    })
    .eq('id', validated.id)
    .select(`
      *,
      decks!inner(user_id)
    `)
    .eq('decks.user_id', userId)
    .single()
  
  if (error || !card) {
    throwError.notFound('Card', validated.id)
  }
  
  return card
})

/**
 * Deletes a flashcard
 * 
 * @param cardId - UUID of the card to delete
 * @returns Success status or error
 */
export async function deleteCard(
  cardId: string
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    const userId = await requireAuth()
    
    if (!z.string().uuid().safeParse(cardId).success) {
      throw new ValidationError('Invalid card ID')
    }
    
    const supabase = await createClient()
    
    // Delete with ownership check
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId)
      .select('decks!inner(user_id)')
      .eq('decks.user_id', userId)
    
    if (error) {
      throwError.database('Failed to delete card', error)
    }
    
    return { success: true, data: { deleted: true } }
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Retrieves all cards for a specific deck
 * 
 * @param deckId - UUID of the deck
 * @returns Array of cards or error
 */
export async function getCardsByDeck(
  deckId: string
): Promise<ActionResult<Card[]>> {
  try {
    const userId = await requireAuth()
    
    if (!z.string().uuid().safeParse(deckId).success) {
      throw new ValidationError('Invalid deck ID')
    }
    
    await verifyDeckOwnership(userId, deckId)
    
    const supabase = await createClient()
    const { data: cards, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throwError.database('Failed to fetch cards', error)
    }
    
    return { success: true, data: cards || [] }
  } catch (error) {
    return handleActionError(error)
  }
}