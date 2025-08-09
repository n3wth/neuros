import { describe, it, expect, beforeEach } from 'vitest'
import { 
  checkRateLimit, 
  checkMultipleRateLimits,
  getRateLimitStatus,
  resetRateLimit,
  getRateLimitStats,
  clearAllRateLimits
} from '../rate-limit-server'
import { 
  RateLimitExceededError,
  RATE_LIMIT_CONFIGS
} from '../rate-limit'

describe('Rate Limiting', () => {
  const testUserId = 'test-user-123'
  
  beforeEach(async () => {
    // Clear all rate limits for clean test state
    await clearAllRateLimits()
  })

  describe('checkRateLimit', () => {
    it('should allow first request', async () => {
      const result = await checkRateLimit(testUserId, 'EXPLANATION')
      
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests - 1)
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })

    it('should track multiple requests correctly', async () => {
      // Make several requests
      await checkRateLimit(testUserId, 'EXPLANATION')
      await checkRateLimit(testUserId, 'EXPLANATION')
      const result = await checkRateLimit(testUserId, 'EXPLANATION')
      
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests - 3)
    })

    it('should deny requests when limit exceeded', async () => {
      const limit = RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests
      
      // Use up all requests
      for (let i = 0; i < limit; i++) {
        const result = await checkRateLimit(testUserId, 'EXPLANATION')
        expect(result.allowed).toBe(true)
      }
      
      // Next request should be denied
      const result = await checkRateLimit(testUserId, 'EXPLANATION')
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
      expect(result.message).toContain('Explanation generation rate limit exceeded')
    })

    it('should handle different users independently', async () => {
      const user1 = 'user1'
      const user2 = 'user2'
      
      // User 1 uses all requests
      const limit = RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests
      for (let i = 0; i < limit; i++) {
        await checkRateLimit(user1, 'EXPLANATION')
      }
      
      // User 1 should be blocked
      const user1Result = await checkRateLimit(user1, 'EXPLANATION')
      expect(user1Result.allowed).toBe(false)
      
      // User 2 should still be allowed
      const user2Result = await checkRateLimit(user2, 'EXPLANATION')
      expect(user2Result.allowed).toBe(true)
    })
  })

  describe('checkMultipleRateLimits', () => {
    it('should check all limits and allow when all pass', async () => {
      const result = await checkMultipleRateLimits(testUserId, ['EXPLANATION', 'GLOBAL_AI'])
      
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('should fail if any limit is exceeded', async () => {
      // Exhaust the explanation limit
      const explanationLimit = RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests
      for (let i = 0; i < explanationLimit; i++) {
        await checkRateLimit(testUserId, 'EXPLANATION')
      }
      
      // Should fail even though global limit is not exceeded
      const result = await checkMultipleRateLimits(testUserId, ['EXPLANATION', 'GLOBAL_AI'])
      expect(result.allowed).toBe(false)
      expect(result.message).toContain('Explanation generation rate limit exceeded')
    })
  })

  describe('getRateLimitStatus', () => {
    it('should return status without incrementing counter', async () => {
      // Make one request to set initial state
      await checkRateLimit(testUserId, 'EXPLANATION')
      
      // Check status multiple times
      const status1 = await getRateLimitStatus(testUserId, 'EXPLANATION')
      const status2 = await getRateLimitStatus(testUserId, 'EXPLANATION')
      
      // Should return same remaining count
      expect(status1.remaining).toBe(status2.remaining)
      expect(status1.remaining).toBe(RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests - 1)
    })
  })

  describe('resetRateLimit', () => {
    it('should clear rate limit for user', async () => {
      // Use up some requests
      await checkRateLimit(testUserId, 'EXPLANATION')
      await checkRateLimit(testUserId, 'EXPLANATION')
      
      // Reset limit
      await resetRateLimit(testUserId, 'EXPLANATION')
      
      // Should be back to full limit
      const result = await checkRateLimit(testUserId, 'EXPLANATION')
      expect(result.remaining).toBe(RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests - 1)
    })
  })

  describe('getRateLimitStats', () => {
    it('should return statistics about current state', async () => {
      // Make some requests
      await checkRateLimit(testUserId, 'EXPLANATION')
      await checkRateLimit(testUserId, 'CARD_GENERATION')
      
      const stats = await getRateLimitStats()
      
      expect(stats.totalEntries).toBe(2)
      expect(stats.entriesByType.EXPLANATION).toBe(1)
      expect(stats.entriesByType.CARD_GENERATION).toBe(1)
      expect(stats.oldestEntry).toBeTypeOf('number')
      expect(stats.newestEntry).toBeTypeOf('number')
    })
  })

  describe('RateLimitExceededError', () => {
    it('should create error with correct properties', () => {
      const error = new RateLimitExceededError(
        'Test message',
        60,
        Date.now() + 60000,
        'EXPLANATION'
      )
      
      expect(error.message).toBe('Test message')
      expect(error.name).toBe('RateLimitExceededError')
      expect(error.retryAfter).toBe(60)
      expect(error.type).toBe('EXPLANATION')
      expect(error instanceof Error).toBe(true)
    })
  })

  describe('Configuration', () => {
    it('should have valid default configurations', () => {
      // Check that all configs have required properties
      Object.entries(RATE_LIMIT_CONFIGS).forEach(([, config]) => {
        expect(config.maxRequests).toBeGreaterThan(0)
        expect(config.windowMs).toBeGreaterThan(0)
        expect(config.message).toBeTypeOf('string')
      })
    })

    it('should have different limits for different operations', () => {
      // Card generation should be more restrictive than explanations
      expect(RATE_LIMIT_CONFIGS.CARD_GENERATION.maxRequests)
        .toBeLessThan(RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests)
      
      // Learning paths should be most restrictive
      expect(RATE_LIMIT_CONFIGS.LEARNING_PATH.maxRequests)
        .toBeLessThan(RATE_LIMIT_CONFIGS.CARD_GENERATION.maxRequests)
    })
  })
})