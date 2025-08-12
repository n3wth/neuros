#!/usr/bin/env ts-node
/**
 * Manual test script for rate limiting functionality
 * Run this to verify rate limiting is working correctly in the AI functions
 * 
 * Usage: npx ts-node scripts/test-rate-limiting.ts
 */

import { checkRateLimit, getRateLimitStatus, RATE_LIMIT_CONFIGS } from '../lib/rate-limit.ts'

async function testRateLimiting() {
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
  }
  
  // Next request should be denied
  const denied = await checkRateLimit(testUserId, 'EXPLANATION')
  console.log(`   - Request ${limit + 1}: ${denied.allowed ? '❌ UNEXPECTED ALLOW' : '✅ CORRECTLY DENIED'}`)
  
  if (!denied.allowed) {
    console.log(`   - Retry after: ${denied.retryAfter} seconds`)
    console.log(`   - Message: "${denied.message}"`)
  }
  
  console.log()
  
  // Test status checking
  console.log('2. Testing rate limit status...')
  const status = await getRateLimitStatus(testUserId, 'EXPLANATION')
  console.log(`   - Current status: ${status.allowed ? 'Available' : 'Rate Limited'}`)
  console.log(`   - Remaining: ${status.remaining}`)
  console.log(`   - Reset time: ${new Date(status.resetTime).toLocaleTimeString()}`)
  
  console.log()
  
  // Test multiple rate limits
  console.log('3. Testing multiple rate limits...')
  const multiResult = await checkRateLimit(testUserId, 'GLOBAL_AI')
  console.log(`   - Global AI limit check: ${multiResult.allowed ? '✅ ALLOWED' : '❌ DENIED'}`)
  console.log(`   - Global remaining: ${multiResult.remaining}`)
  
  console.log()
  
  // Show all configurations
  console.log('4. Current Rate Limit Configurations:')
  Object.entries(RATE_LIMIT_CONFIGS).forEach(([key, config]) => {
    console.log(`   - ${key}: ${config.maxRequests} requests per ${config.windowMs / 1000} seconds`)
  })
  
  console.log('\n✅ Rate limiting test completed!')
  console.log('\n📝 To test with actual AI functions:')
  console.log('   1. Start the development server: npm run dev')
  console.log('   2. Navigate to your app and try generating cards/explanations')
  console.log('   3. Make rapid requests to trigger rate limiting')
  console.log('   4. Check the browser console for rate limit error messages')
}

// Only run if called directly
if (require.main === module) {
  testRateLimiting().catch(console.error)
}

export { testRateLimiting }