#!/usr/bin/env node

/**
 * Test script to verify logging functionality
 * This will test the logger in different environments
 */

// Set environment to test different modes
const environments = ['development', 'production']

environments.forEach(env => {
  console.log(`\n=== Testing in ${env} mode ===\n`)
  process.env.NODE_ENV = env
  
  // Clear require cache to reload logger with new env
  delete require.cache[require.resolve('../lib/logger')]
  const { logger } = require('../lib/logger')
  
  // Test basic logging
  logger.debug('Debug message - should only appear in development')
  logger.info('Info message', { metadata: { test: true } })
  logger.warn('Warning message', { userId: 'test-user-123' })
  logger.error('Error message', { 
    error: new Error('Test error'),
    userId: 'test-user-123'
  })
  
  // Test action logging
  console.log('\nTesting action logging:')
  async function testAction() {
    try {
      await logger.action('testAction', 'user-123', async () => {
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 100))
        return { success: true }
      })
    } catch (error) {
      console.error('Action failed:', error)
    }
  }
  
  testAction()
  
  // Test API logging
  console.log('\nTesting API logging:')
  async function testApi() {
    try {
      await logger.api('openai', 'chat.completions', async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 50))
        return { data: 'test response' }
      })
    } catch (error) {
      console.error('API call failed:', error)
    }
  }
  
  testApi()
  
  // Test rate limit logging
  console.log('\nTesting rate limit logging:')
  logger.rateLimit('user-123', 'CARD_GENERATION', 60)
  
  // Test auth logging
  console.log('\nTesting auth logging:')
  logger.auth('signin', 'user-123')
  logger.auth('error', 'user-123', new Error('Auth failed'))
  
  // Test db logging
  console.log('\nTesting database logging:')
  logger.db('INSERT', 'cards', { userId: 'user-123' })
})

console.log('\n=== Logging test complete ===\n')
console.log('Check the output above to verify:')
console.log('1. Debug messages only appear in development mode')
console.log('2. Production mode uses JSON format')
console.log('3. Development mode uses human-readable format')
console.log('4. All log levels work correctly')
console.log('5. Context and metadata are properly included')