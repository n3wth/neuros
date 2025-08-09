import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateCardsFromText } from '../ai'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } }
      }))
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }))
}))

// Mock createCard function
vi.mock('../cards', () => ({
  createCard: vi.fn(() => Promise.resolve({
    id: 'card-id',
    front: 'Test front',
    back: 'Test back'
  }))
}))

describe('AI Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.global.mockOpenAICreate.mockClear()
    process.env.OPENAI_API_KEY = 'test-api-key'
  })

  describe('generateCardsFromText', () => {
    it('should generate cards with correct parameters', async () => {
      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              cards: [
                {
                  front: 'What is a Python variable?',
                  back: 'A container for storing data values',
                  explanation: 'Variables are fundamental in programming',
                  tags: ['python', 'basics']
                }
              ]
            })
          }
        }],
        usage: { total_tokens: 150 }
      })

      const result = await generateCardsFromText('Python basics: variables, functions', {
        difficulty: 'beginner',
        count: 5
      })

      expect(global.mockOpenAICreate).toHaveBeenCalledWith({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: expect.stringContaining('Create 5 flashcards')
          },
          {
            role: 'user',
            content: 'Python basics: variables, functions'
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      expect(result.success).toBe(true)
      expect(result.cards).toHaveLength(1)
      expect(result.tokensUsed).toBe(150)
    })

    it('should use default parameters when none provided', async () => {
      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              cards: Array.from({ length: 20 }, (_, i) => ({
                front: `Question ${i + 1}`,
                back: `Answer ${i + 1}`,
                explanation: `Explanation ${i + 1}`,
                tags: ['test']
              }))
            })
          }
        }],
        usage: { total_tokens: 500 }
      })

      const result = await generateCardsFromText('Test content')

      expect(global.mockOpenAICreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            expect.objectContaining({
              content: expect.stringContaining('Create 20 flashcards')
            }),
            expect.objectContaining({
              content: 'Test content'
            })
          ]
        })
      )

      expect(result.cards).toHaveLength(20)
    })

    it('should throw error when not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: null }
          }))
        }
      } as any)

      await expect(generateCardsFromText('test')).rejects.toThrow('Not authenticated')
    })

    it('should handle OpenAI API errors', async () => {
      // Make sure user is authenticated
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'test-user' } }
          }))
        },
        from: vi.fn()
      } as any)

      global.mockOpenAICreate.mockRejectedValue(new Error('OpenAI API error'))

      await expect(generateCardsFromText('test content')).rejects.toThrow('AI generation failed: OpenAI API error')
    })

    it('should handle invalid JSON response from OpenAI', async () => {
      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: 'invalid json'
          }
        }],
        usage: { total_tokens: 50 }
      })

      await expect(generateCardsFromText('test content')).rejects.toThrow()
    })

    it('should handle missing cards in response', async () => {
      // Make sure user is authenticated
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'test-user' } }
          }))
        },
        from: vi.fn()
      } as any)

      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              // Missing cards array
              message: 'No cards generated'
            })
          }
        }],
        usage: { total_tokens: 50 }
      })

      await expect(generateCardsFromText('test content')).rejects.toThrow('Invalid response format from AI')
    })

    it('should create cards in database for each generated card', async () => {
      // Make sure user is authenticated
      const { createClient } = await import('@/lib/supabase/server')
      const { createCard } = await import('../cards')
      
      const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }))
      const mockFrom = vi.fn(() => ({ insert: mockInsert }))
      
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'test-user' } }
          }))
        },
        from: mockFrom
      } as any)
      
      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              cards: [
                {
                  front: 'Question 1',
                  back: 'Answer 1',
                  explanation: 'Explanation 1',
                  tags: ['tag1']
                },
                {
                  front: 'Question 2',
                  back: 'Answer 2',
                  explanation: 'Explanation 2',
                  tags: ['tag2']
                }
              ]
            })
          }
        }],
        usage: { total_tokens: 200 }
      })

      await generateCardsFromText('test content', {
        difficulty: 'advanced',
        count: 2
      })

      expect(createCard).toHaveBeenCalledTimes(2)
      expect(createCard).toHaveBeenNthCalledWith(1, {
        front: 'Question 1',
        back: 'Answer 1',
        explanation: 'Explanation 1',
        difficulty: 'advanced',
        tags: ['tag1'],
        topic_id: undefined
      })
      expect(createCard).toHaveBeenNthCalledWith(2, {
        front: 'Question 2',
        back: 'Answer 2',
        explanation: 'Explanation 2',
        difficulty: 'advanced',
        tags: ['tag2'],
        topic_id: undefined
      })
    })

    it('should log AI generation to database', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      
      const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }))
      const mockFrom = vi.fn(() => ({ insert: mockInsert }))
      
      vi.mocked(createClient).mockReturnValue({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: { id: 'test-user' } }
          }))
        },
        from: mockFrom
      } as any)

      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              cards: [{
                front: 'Test',
                back: 'Test',
                explanation: 'Test',
                tags: []
              }]
            })
          }
        }],
        usage: { total_tokens: 100 }
      })

      await generateCardsFromText('test prompt')

      expect(mockFrom).toHaveBeenCalledWith('ai_generations')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'test-user',
        prompt: 'test prompt',
        response: expect.any(Object),
        generation_type: 'card',
        tokens_used: 100
      })
    })

    it('should use gpt-4o model', async () => {
      global.mockOpenAICreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              cards: [{
                front: 'Test',
                back: 'Test',
                explanation: 'Test',
                tags: []
              }]
            })
          }
        }],
        usage: { total_tokens: 100 }
      })

      await generateCardsFromText('test')

      expect(global.mockOpenAICreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o'
        })
      )
    })
  })
})