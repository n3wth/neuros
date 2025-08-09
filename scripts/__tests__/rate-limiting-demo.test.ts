import { describe, it, expect } from 'vitest'
import { checkRateLimit, getRateLimitStatus, clearAllRateLimits } from '../../lib/rate-limit-server'
import { RATE_LIMIT_CONFIGS } from '../../lib/rate-limit'

describe('Rate Limiting Demo', () => {
  it('should demonstrate rate limiting functionality', async () => {
    await clearAllRateLimits()
    
    const testUserId = 'manual-test-user'
    console.log('🧪 Testing Rate Limiting System\n')
    
    // Test basic rate limiting
    console.log('1. Testing basic rate limit functionality...')
    
    const limit = RATE_LIMIT_CONFIGS.EXPLANATION.maxRequests
    console.log(`   - Explanation limit: ${limit} requests per ${RATE_LIMIT_CONFIGS.EXPLANATION.windowMs / 1000} seconds`)
    
    // Make several requests
    for (let i = 1; i <= limit; i++) {
      const result = await checkRateLimit(testUserId, 'EXPLANATION')
      console.log(`   - Request ${i}: ${result.allowed ? '✅ ALLOWED' : '❌ DENIED'}, ${result.remaining} remaining`)
      expect(result.allowed).toBe(true)
    }
    
    // Next request should be denied
    const denied = await checkRateLimit(testUserId, 'EXPLANATION')
    console.log(`   - Request ${limit + 1}: ${denied.allowed ? '❌ UNEXPECTED ALLOW' : '✅ CORRECTLY DENIED'}`)
    expect(denied.allowed).toBe(false)
    
    if (!denied.allowed) {
      console.log(`   - Retry after: ${denied.retryAfter} seconds`)
      console.log(`   - Message: "${denied.message}"`)
      expect(denied.retryAfter).toBeGreaterThan(0)
      expect(denied.message).toContain('rate limit exceeded')
    }
    
    console.log()
    
    // Test status checking
    console.log('2. Testing rate limit status...')
    const status = await getRateLimitStatus(testUserId, 'EXPLANATION')
    console.log(`   - Current status: ${status.allowed ? 'Available' : 'Rate Limited'}`)
    console.log(`   - Remaining: ${status.remaining}`)
    console.log(`   - Reset time: ${new Date(status.resetTime).toLocaleTimeString()}`)
    expect(status.allowed).toBe(false)
    expect(status.remaining).toBe(0)
    
    console.log()
    
    // Test different user
    console.log('3. Testing different user (should be allowed)...')
    const differentUser = await checkRateLimit('different-user', 'EXPLANATION')
    console.log(`   - Different user first request: ${differentUser.allowed ? '✅ ALLOWED' : '❌ DENIED'}`)
    expect(differentUser.allowed).toBe(true)
    
    console.log()
    
    // Show all configurations
    console.log('4. Current Rate Limit Configurations:')
    Object.entries(RATE_LIMIT_CONFIGS).forEach(([key, config]) => {
      console.log(`   - ${key}: ${config.maxRequests} requests per ${config.windowMs / 1000} seconds`)
    })
    
    console.log('\n✅ Rate limiting test completed!')
  })
})