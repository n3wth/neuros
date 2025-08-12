/**
 * Test data factories for consistent test data generation
 * Following 2025 best practices for AI-assisted test writing
 */

import type { Card } from '@/server/actions/cards-refactored'

/**
 * Creates a test user object
 * @param overrides - Partial user data to override defaults
 * @returns Complete user object for testing
 */
export function makeUser(overrides?: Partial<{
  id: string
  email: string
  created_at: string
}>) {
  return {
    id: crypto.randomUUID(),
    email: `test-${Date.now()}@example.com`,
    created_at: new Date().toISOString(),
    ...overrides
  }
}

/**
 * Creates a test deck object
 * @param overrides - Partial deck data to override defaults
 * @returns Complete deck object for testing
 */
export function makeDeck(overrides?: Partial<{
  id: string
  user_id: string
  name: string
  description: string
  created_at: string
}>) {
  return {
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    name: 'Test Deck',
    description: 'A deck for testing',
    created_at: new Date().toISOString(),
    card_count: 0,
    ...overrides
  }
}

/**
 * Creates a test card object
 * @param overrides - Partial card data to override defaults
 * @returns Complete card object for testing
 */
export function makeCard(overrides?: Partial<Card>): Card {
  return {
    id: crypto.randomUUID(),
    deck_id: crypto.randomUUID(),
    front: 'Default question',
    back: 'Default answer',
    ease_factor: 2.5,
    interval: 0,
    repetitions: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [],
    ...overrides
  }
}

/**
 * Creates a test review object
 * @param overrides - Partial review data to override defaults
 * @returns Complete review object for testing
 */
export function makeReview(overrides?: Partial<{
  id: string
  card_id: string
  user_id: string
  quality: number
  reviewed_at: string
  next_review: string
}>) {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  return {
    id: crypto.randomUUID(),
    card_id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    quality: 3, // 0-5 scale, 3 is "Good"
    reviewed_at: now.toISOString(),
    next_review: tomorrow.toISOString(),
    ...overrides
  }
}

/**
 * Creates multiple test cards
 * @param count - Number of cards to create
 * @param overrides - Partial card data to apply to all cards
 * @returns Array of card objects
 */
export function makeCards(
  count: number, 
  overrides?: Partial<Card>
): Card[] {
  return Array.from({ length: count }, (_, i) => 
    makeCard({
      front: `Question ${i + 1}`,
      back: `Answer ${i + 1}`,
      ...overrides
    })
  )
}

/**
 * Creates a test profile with associated data
 * @returns Complete test profile with deck and cards
 */
export function makeTestProfile() {
  const user = makeUser()
  const deck = makeDeck({ user_id: user.id })
  const cards = makeCards(5, { deck_id: deck.id })
  
  return {
    user,
    deck,
    cards
  }
}

/**
 * Creates test data for spaced repetition scenarios
 * @returns Cards with various review states
 */
export function makeSpacedRepetitionScenario() {
  const deckId = crypto.randomUUID()
  
  return {
    newCard: makeCard({
      deck_id: deckId,
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0
    }),
    
    learningCard: makeCard({
      deck_id: deckId,
      ease_factor: 2.3,
      interval: 1,
      repetitions: 2
    }),
    
    reviewCard: makeCard({
      deck_id: deckId,
      ease_factor: 2.7,
      interval: 7,
      repetitions: 5
    }),
    
    matureCard: makeCard({
      deck_id: deckId,
      ease_factor: 3.0,
      interval: 90,
      repetitions: 15
    })
  }
}

/**
 * Creates test data for AI generation scenarios
 */
export function makeAIGenerationInput() {
  return {
    basicPrompt: {
      prompt: 'Create flashcards about photosynthesis',
      deck_id: crypto.randomUUID(),
      count: 3
    },
    
    advancedPrompt: {
      prompt: 'Create advanced medical terminology flashcards about the cardiovascular system',
      deck_id: crypto.randomUUID(),
      count: 5,
      options: {
        difficulty: 'advanced' as const,
        style: 'academic' as const,
        temperature: 0.7
      }
    }
  }
}

/**
 * Creates test error scenarios
 */
export function makeErrorScenarios() {
  return {
    invalidUUID: 'not-a-uuid',
    nonExistentUUID: '00000000-0000-0000-0000-000000000000',
    emptyString: '',
    longString: 'x'.repeat(1001),
    negativNumber: -1,
    largeNumber: 1000000
  }
}