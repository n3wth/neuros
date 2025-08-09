import { vi, describe, it, expect, beforeEach } from 'vitest'
import { 
  createCard, 
  getUserCards, 
  getDueCards, 
  getCardStats,
  updateCard,
  deleteCard 
} from '../cards'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'user-123' } },
        error: null
      }))
    },
    from: vi.fn((table: string) => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { 
              id: 'card-123',
              front: 'Test Question',
              back: 'Test Answer',
              user_id: 'user-123'
            },
            error: null
          }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [
              { id: '1', front: 'Q1', back: 'A1' },
              { id: '2', front: 'Q2', back: 'A2' }
            ],
            error: null
          }))
        })),
        single: vi.fn(() => Promise.resolve({
          data: { id: 'card-123' },
          error: null
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { id: 'card-123', front: 'Updated' },
              error: null
            }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          error: null
        }))
      })),
      rpc: vi.fn(() => Promise.resolve({
        data: [
          { 
            id: '1',
            card_id: 'card-1',
            mastery_level: 50,
            next_review: new Date().toISOString()
          }
        ],
        error: null
      }))
    }))
  }))
}))

describe('Card Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCard', () => {
    it('creates a new card successfully', async () => {
      const cardData = {
        front: 'Test Question',
        back: 'Test Answer',
        explanation: 'Test Explanation',
        difficulty: 'intermediate' as const
      }

      const result = await createCard(cardData)

      expect(result).toEqual({
        id: 'card-123',
        front: 'Test Question',
        back: 'Test Answer',
        user_id: 'user-123'
      })
    })

    it('throws error when not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: null },
            error: null
          }))
        }
      } as any)

      await expect(createCard({ 
        front: 'Q', 
        back: 'A' 
      })).rejects.toThrow('Not authenticated')
    })

    it('handles database errors', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'user-123' } },
            error: null
          }))
        },
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: null,
                error: new Error('Database error')
              }))
            }))
          }))
        }))
      } as any)

      await expect(createCard({ 
        front: 'Q', 
        back: 'A' 
      })).rejects.toThrow('Failed to create card')
    })
  })

  describe('getUserCards', () => {
    it('fetches user cards successfully', async () => {
      const cards = await getUserCards()

      expect(cards).toEqual([
        { id: '1', front: 'Q1', back: 'A1' },
        { id: '2', front: 'Q2', back: 'A2' }
      ])
    })

    it('returns empty array when no cards exist', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'user-123' } },
            error: null
          }))
        },
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({
                data: [],
                error: null
              }))
            }))
          }))
        }))
      } as any)

      const cards = await getUserCards()
      expect(cards).toEqual([])
    })
  })

  describe('getDueCards', () => {
    it('fetches due cards with limit', async () => {
      const cards = await getDueCards(10)

      expect(cards).toEqual([
        {
          id: '1',
          card_id: 'card-1',
          mastery_level: 50,
          next_review: expect.any(String)
        }
      ])
    })

    it('uses default limit when not provided', async () => {
      const cards = await getDueCards()
      expect(cards).toBeDefined()
    })
  })

  describe('getCardStats', () => {
    it('calculates card statistics', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'user-123' } },
            error: null
          }))
        },
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({
              data: [
                { mastery_level: 90 },
                { mastery_level: 80 },
                { mastery_level: 50 },
                { mastery_level: 30 },
                { mastery_level: 20 }
              ],
              error: null
            }))
          }))
        })),
        rpc: vi.fn(() => Promise.resolve({
          data: [{ count: 2 }],
          error: null
        }))
      } as any)

      const stats = await getCardStats()

      expect(stats).toEqual({
        totalCards: 5,
        dueCards: 2,
        mastered: 2,
        learning: 1,
        difficult: 2
      })
    })

    it('returns zero stats when no cards exist', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'user-123' } },
            error: null
          }))
        },
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        })),
        rpc: vi.fn(() => Promise.resolve({
          data: [],
          error: null
        }))
      } as any)

      const stats = await getCardStats()

      expect(stats).toEqual({
        totalCards: 0,
        dueCards: 0,
        mastered: 0,
        learning: 0,
        difficult: 0
      })
    })
  })

  describe('updateCard', () => {
    it('updates a card successfully', async () => {
      const result = await updateCard('card-123', {
        front: 'Updated Question'
      })

      expect(result).toEqual({
        id: 'card-123',
        front: 'Updated'
      })
    })

    it('throws error when card not found', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'user-123' } },
            error: null
          }))
        },
        from: vi.fn(() => ({
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: null,
                  error: new Error('Not found')
                }))
              }))
            }))
          }))
        }))
      } as any)

      await expect(updateCard('invalid-id', {
        front: 'Updated'
      })).rejects.toThrow('Failed to update card')
    })
  })

  describe('deleteCard', () => {
    it('deletes a card successfully', async () => {
      await expect(deleteCard('card-123')).resolves.not.toThrow()
    })

    it('throws error when deletion fails', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'user-123' } },
            error: null
          }))
        },
        from: vi.fn(() => ({
          delete: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({
              error: new Error('Deletion failed')
            }))
          }))
        }))
      } as any)

      await expect(deleteCard('card-123')).rejects.toThrow('Failed to delete card')
    })
  })
})