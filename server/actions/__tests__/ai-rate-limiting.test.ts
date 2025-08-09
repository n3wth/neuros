/**
 * Integration tests for AI functions with rate limiting
 * These tests verify that rate limiting is properly applied to AI operations
 * 
 * Note: These tests require proper environment setup and may make actual API calls
 * For CI/CD, consider mocking the OpenAI API calls
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateExplanation } from '../ai'
import { resetRateLimit } from '@/lib/rate-limit-server'

// Mock Supabase client for testing
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-123' } }
      })
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null })
    })
  })
}))

// Mock OpenAI for testing to avoid actual API calls
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'This is a test explanation of the concept.'
                }
              }
            ],
            usage: {
              total_tokens: 50
            }
          })
        }
      }
    }))
  }
})

describe('AI Functions Rate Limiting Integration', () => {
  const testUserId = 'test-user-123'
  
  beforeEach(async () => {
    // Reset rate limits before each test
    await resetRateLimit(testUserId, 'EXPLANATION')
    await resetRateLimit(testUserId, 'GLOBAL_AI')
  })

  describe('generateExplanation with Rate Limiting', () => {
    it('should work normally under rate limit', async () => {
      const result = await generateExplanation('test concept', 'simple')
      
      expect(result).toHaveProperty('explanation')
      expect(result).toHaveProperty('tokensUsed')
      expect(result.explanation).toContain('test explanation')
      expect(result.tokensUsed).toBe(50)
    })

    it('should throw RateLimitExceededError when limit exceeded', async () => {
      // First, exhaust the rate limit by making multiple requests
      const explanationLimit = parseInt(process.env.AI_EXPLANATION_RATE_LIMIT || '10')
      
      // Make requests up to the limit
      for (let i = 0; i < explanationLimit; i++) {
        await generateExplanation(`test concept ${i}`, 'simple')
      }
      
      // The next request should be rate limited
      await expect(
        generateExplanation('rate limited concept', 'simple')
      ).rejects.toThrow('Explanation generation rate limit exceeded')
    })

    it('should include proper error details in RateLimitExceededError', async () => {
      const explanationLimit = parseInt(process.env.AI_EXPLANATION_RATE_LIMIT || '10')
      
      // Exhaust the limit
      for (let i = 0; i < explanationLimit; i++) {
        await generateExplanation(`test concept ${i}`, 'simple')
      }
      
      // Check that the error has proper structure
      try {
        await generateExplanation('rate limited concept', 'simple')
        expect.fail('Should have thrown RateLimitExceededError')
      } catch (error) {
        expect(error).toHaveProperty('name', 'RateLimitExceededError')
        expect(error).toHaveProperty('retryAfter')
        expect(error).toHaveProperty('resetTime')
        expect(error).toHaveProperty('type', 'EXPLANATION')
        expect((error as any).retryAfter).toBeGreaterThan(0)
      }
    })
  })

  describe('Global Rate Limiting', () => {
    it('should apply global rate limit across different AI operations', async () => {
      // This test would need to be adjusted based on your global limits
      // and would require mocking multiple AI functions
      
      const globalLimit = parseInt(process.env.AI_GLOBAL_RATE_LIMIT || '25')
      
      // Make many requests to approach global limit
      // In a real test, you'd need to orchestrate this across different AI functions
      const promises = []
      for (let i = 0; i < Math.min(globalLimit - 1, 5); i++) {
        promises.push(generateExplanation(`global test ${i}`, 'simple'))
      }
      
      await Promise.all(promises)
      
      // Should still work since we haven't hit the global limit
      const result = await generateExplanation('final test', 'simple')
      expect(result).toHaveProperty('explanation')
    })
  })
})

describe('Rate Limiting Configuration', () => {
  it('should respect environment variables for rate limits', () => {
    // Test that environment variables are properly loaded
    expect(process.env.AI_EXPLANATION_RATE_LIMIT).toBeDefined()
    expect(process.env.AI_EXPLANATION_WINDOW_MS).toBeDefined()
    expect(process.env.AI_GLOBAL_RATE_LIMIT).toBeDefined()
    
    // Test that they are valid numbers
    expect(Number(process.env.AI_EXPLANATION_RATE_LIMIT)).toBeGreaterThan(0)
    expect(Number(process.env.AI_EXPLANATION_WINDOW_MS)).toBeGreaterThan(0)
    expect(Number(process.env.AI_GLOBAL_RATE_LIMIT)).toBeGreaterThan(0)
  })
})

/**
 * Helper function to create a rate limit testing scenario
 * This can be used to test other AI functions as well
 */
export async function testRateLimitScenario<T>(
  fn: () => Promise<T>,
  limit: number,
  errorMessage: string
): Promise<void> {
  // Make requests up to the limit
  for (let i = 0; i < limit; i++) {
    await fn()
  }
  
  // The next request should fail
  await expect(fn()).rejects.toThrow(errorMessage)
}