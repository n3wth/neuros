#!/bin/bash

# Test Generator for Neuros
# Creates test templates for unit, integration, and e2e tests

FEATURE=$1
TYPE=${2:-"unit"} # unit, e2e, or integration

if [ -z "$FEATURE" ]; then
    echo "❌ Usage: ./scripts/generate-test.sh <feature-name> [test-type]"
    echo ""
    echo "Test types:"
    echo "  unit         - Vitest unit test (default)"
    echo "  e2e          - Playwright end-to-end test"
    echo "  integration  - Integration test with database"
    echo ""
    echo "Examples:"
    echo "  ./scripts/generate-test.sh CardCreation"
    echo "  ./scripts/generate-test.sh UserAuth e2e"
    echo "  ./scripts/generate-test.sh ReviewSystem integration"
    exit 1
fi

# Convert feature name to different cases
PASCAL_CASE=$(echo "$FEATURE" | sed -r 's/(^|_)([a-z])/\U\2/g')
KEBAB_CASE=$(echo "$FEATURE" | sed 's/\([A-Z]\)/-\1/g' | tr '[:upper:]' '[:lower:]' | sed 's/^-//')
SNAKE_CASE=$(echo "$FEATURE" | sed 's/\([A-Z]\)/_\1/g' | tr '[:upper:]' '[:lower:]' | sed 's/^_//')

# Create test based on type
if [ "$TYPE" = "unit" ]; then
    TEST_FILE="tests/${KEBAB_CASE}.test.ts"
    
    cat > "$TEST_FILE" << EOF
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * Unit tests for ${PASCAL_CASE}
 * 
 * Test coverage checklist:
 * - [ ] Happy path scenarios
 * - [ ] Error handling
 * - [ ] Edge cases
 * - [ ] Input validation
 * - [ ] State changes
 */
describe('${PASCAL_CASE}', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Setup test data
    // TODO: Add test setup
  })
  
  afterEach(() => {
    // Cleanup
    vi.restoreAllMocks()
  })
  
  // Test happy path
  describe('Given valid input', () => {
    describe('When ${FEATURE} is executed', () => {
      it('Then should return expected result', async () => {
        // Arrange - Set up test data and mocks
        const input = {
          // TODO: Add test input
        }
        
        // Act - Execute the function under test
        // const result = await ${FEATURE}Function(input)
        
        // Assert - Verify the outcome
        // expect(result).toBeDefined()
        // expect(result.data).toEqual(expectedData)
        expect(true).toBe(true) // Placeholder
      })
      
      it('Then should update state correctly', async () => {
        // TODO: Test state changes
        expect(true).toBe(true) // Placeholder
      })
    })
  })
  
  // Test error handling
  describe('Given invalid input', () => {
    describe('When ${FEATURE} receives invalid data', () => {
      it('Then should throw validation error', async () => {
        // Arrange
        const invalidInput = {
          // TODO: Add invalid input
        }
        
        // Act & Assert
        // await expect(${FEATURE}Function(invalidInput))
        //   .rejects.toThrow('Validation error')
        expect(true).toBe(true) // Placeholder
      })
    })
    
    describe('When ${FEATURE} encounters network error', () => {
      it('Then should handle error gracefully', async () => {
        // TODO: Mock network error and test handling
        expect(true).toBe(true) // Placeholder
      })
    })
  })
  
  // Test edge cases
  describe('Edge cases', () => {
    it('should handle empty input', async () => {
      // TODO: Test with empty/null/undefined input
      expect(true).toBe(true) // Placeholder
    })
    
    it('should handle maximum input size', async () => {
      // TODO: Test with maximum allowed input
      expect(true).toBe(true) // Placeholder
    })
    
    it('should handle concurrent operations', async () => {
      // TODO: Test concurrent execution
      expect(true).toBe(true) // Placeholder
    })
  })
  
  // Test mocked dependencies
  describe('Mocked dependencies', () => {
    it('should call external service correctly', async () => {
      // Example: Mock Supabase or OpenAI
      // const mockSupabase = vi.fn().mockResolvedValue({ data: mockData })
      // vi.mock('@/lib/supabase/server', () => ({
      //   createClient: () => mockSupabase
      // }))
      
      // TODO: Test that dependencies are called correctly
      expect(true).toBe(true) // Placeholder
    })
  })
})

// Test utilities and helpers
describe('${PASCAL_CASE} Utilities', () => {
  describe('Helper functions', () => {
    it('should validate input correctly', () => {
      // TODO: Test validation helpers
      expect(true).toBe(true) // Placeholder
    })
    
    it('should format output correctly', () => {
      // TODO: Test formatting helpers
      expect(true).toBe(true) // Placeholder
    })
  })
})
EOF
    
    echo "✅ Created unit test: $TEST_FILE"

elif [ "$TYPE" = "e2e" ]; then
    TEST_FILE="e2e/${KEBAB_CASE}.spec.ts"
    
    cat > "$TEST_FILE" << EOF
import { test, expect, Page } from '@playwright/test'

/**
 * E2E tests for ${PASCAL_CASE}
 * 
 * Test scenarios:
 * - [ ] Complete user journey
 * - [ ] Form interactions
 * - [ ] Error states
 * - [ ] Loading states
 * - [ ] Mobile responsiveness
 */

// Test configuration
test.describe.configure({ mode: 'parallel' })

test.describe('${PASCAL_CASE} E2E Tests', () => {
  // Shared test setup
  test.beforeEach(async ({ page }) => {
    // Navigate to the feature
    await page.goto('http://localhost:3000')
    
    // TODO: Add authentication if needed
    // await authenticateUser(page)
    
    // Wait for app to be ready
    await page.waitForLoadState('networkidle')
  })
  
  // Happy path test
  test('should complete ${FEATURE} flow successfully', async ({ page }) => {
    // Step 1: Navigate to feature
    // TODO: Add navigation steps
    // await page.click('[data-testid="${KEBAB_CASE}-button"]')
    
    // Step 2: Interact with UI
    // TODO: Add user interactions
    // await page.fill('[data-testid="input-field"]', 'test value')
    // await page.click('[data-testid="submit-button"]')
    
    // Step 3: Verify results
    // TODO: Add assertions
    // await expect(page.locator('[data-testid="success-message"]'))
    //   .toBeVisible()
    // await expect(page).toHaveURL(/success/)
    
    // Placeholder assertion
    await expect(page).toHaveURL(/.*/)
  })
  
  // Test form validation
  test('should show validation errors for invalid input', async ({ page }) => {
    // TODO: Test form validation
    // await page.click('[data-testid="submit-button"]')
    // await expect(page.locator('.error-message'))
    //   .toContainText('Required field')
    
    await expect(page).toHaveURL(/.*/)
  })
  
  // Test error handling
  test('should handle server errors gracefully', async ({ page }) => {
    // Mock server error
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      })
    })
    
    // TODO: Trigger action and verify error handling
    // await page.click('[data-testid="action-button"]')
    // await expect(page.locator('[data-testid="error-toast"]'))
    //   .toContainText('Something went wrong')
    
    await expect(page).toHaveURL(/.*/)
  })
  
  // Test loading states
  test('should show loading state during operations', async ({ page }) => {
    // Slow down network to see loading states
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    // TODO: Trigger action and verify loading state
    // const button = page.locator('[data-testid="submit-button"]')
    // await button.click()
    // await expect(button).toBeDisabled()
    // await expect(page.locator('.spinner')).toBeVisible()
    
    await expect(page).toHaveURL(/.*/)
  })
  
  // Test mobile responsiveness
  test.describe('Mobile view', () => {
    test.use({ viewport: { width: 375, height: 667 } })
    
    test('should be responsive on mobile', async ({ page }) => {
      // TODO: Test mobile-specific behaviors
      // await expect(page.locator('[data-testid="mobile-menu"]'))
      //   .toBeVisible()
      
      await expect(page).toHaveURL(/.*/)
    })
  })
  
  // Test accessibility
  test('should be accessible', async ({ page }) => {
    // Basic accessibility checks
    // TODO: Add specific accessibility tests
    // await expect(page.locator('main')).toBeVisible()
    // const accessibilitySnapshot = await page.accessibility.snapshot()
    // expect(accessibilitySnapshot).toBeDefined()
    
    await expect(page).toHaveURL(/.*/)
  })
})

// Helper functions
async function authenticateUser(page: Page) {
  // TODO: Implement authentication helper
  // await page.goto('/signin')
  // await page.fill('[name="email"]', 'test@example.com')
  // await page.fill('[name="password"]', 'testpassword')
  // await page.click('[type="submit"]')
  // await page.waitForURL('/dashboard')
}

// Data helpers
function generateTestData() {
  return {
    // TODO: Generate test data
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString()
  }
}
EOF
    
    echo "✅ Created E2E test: $TEST_FILE"

elif [ "$TYPE" = "integration" ]; then
    TEST_FILE="tests/${KEBAB_CASE}.integration.test.ts"
    
    cat > "$TEST_FILE" << EOF
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

/**
 * Integration tests for ${PASCAL_CASE}
 * 
 * Tests interaction between:
 * - [ ] Server Actions
 * - [ ] Database operations
 * - [ ] External APIs
 * - [ ] Rate limiting
 * - [ ] Caching
 */

// Test database client
let supabase: ReturnType<typeof createClient>
let testUserId: string

describe('${PASCAL_CASE} Integration Tests', () => {
  // Setup test database connection
  beforeAll(async () => {
    // Initialize test database client
    // supabase = await createClient()
    
    // Create test user
    // const { data: { user } } = await supabase.auth.signUp({
    //   email: \`test-\${Date.now()}@example.com\`,
    //   password: 'testpassword123'
    // })
    // testUserId = user?.id || ''
    
    // TODO: Add test setup
  })
  
  // Cleanup after all tests
  afterAll(async () => {
    // Clean up test data
    // if (testUserId) {
    //   await supabase.from('profiles').delete().eq('id', testUserId)
    // }
    
    // TODO: Add cleanup
  })
  
  // Reset state before each test
  beforeEach(async () => {
    // Clear test data from specific tables
    // await supabase.from('${SNAKE_CASE}').delete().eq('user_id', testUserId)
    
    // TODO: Reset state
  })
  
  describe('Database operations', () => {
    it('should create and retrieve ${FEATURE} data', async () => {
      // Create test data
      // const testData = {
      //   user_id: testUserId,
      //   name: 'Test ${PASCAL_CASE}',
      //   // TODO: Add fields
      // }
      
      // Insert data
      // const { data: created, error: createError } = await supabase
      //   .from('${SNAKE_CASE}')
      //   .insert(testData)
      //   .select()
      //   .single()
      
      // expect(createError).toBeNull()
      // expect(created).toBeDefined()
      // expect(created?.name).toBe(testData.name)
      
      // Retrieve data
      // const { data: retrieved, error: retrieveError } = await supabase
      //   .from('${SNAKE_CASE}')
      //   .select('*')
      //   .eq('id', created?.id)
      //   .single()
      
      // expect(retrieveError).toBeNull()
      // expect(retrieved).toEqual(created)
      
      expect(true).toBe(true) // Placeholder
    })
    
    it('should update ${FEATURE} data correctly', async () => {
      // TODO: Test update operations
      expect(true).toBe(true) // Placeholder
    })
    
    it('should delete ${FEATURE} data with cascade', async () => {
      // TODO: Test deletion and cascading deletes
      expect(true).toBe(true) // Placeholder
    })
    
    it('should enforce RLS policies', async () => {
      // TODO: Test Row Level Security policies
      // Try to access another user's data and expect failure
      expect(true).toBe(true) // Placeholder
    })
  })
  
  describe('Server Action integration', () => {
    it('should execute ${FEATURE} action with database', async () => {
      // Import and test server action
      // const { ${FEATURE}Action } = await import('@/server/actions/${KEBAB_CASE}')
      
      // const result = await ${FEATURE}Action({
      //   // TODO: Add input
      // })
      
      // expect(result).toBeDefined()
      // if ('data' in result) {
      //   expect(result.data).toBeDefined()
      //   // Verify database was updated
      // } else {
      //   fail('Action returned error: ' + result.error)
      // }
      
      expect(true).toBe(true) // Placeholder
    })
    
    it('should handle transaction rollback on error', async () => {
      // TODO: Test transaction rollback
      expect(true).toBe(true) // Placeholder
    })
  })
  
  describe('Rate limiting integration', () => {
    it('should enforce rate limits across requests', async () => {
      // TODO: Test rate limiting
      // Make multiple requests and verify rate limiting kicks in
      
      expect(true).toBe(true) // Placeholder
    })
    
    it('should reset rate limits after window', async () => {
      // TODO: Test rate limit window reset
      expect(true).toBe(true) // Placeholder
    })
  })
  
  describe('External API integration', () => {
    it('should handle OpenAI API responses', async () => {
      // TODO: Test OpenAI integration
      // Mock or use test API key
      
      expect(true).toBe(true) // Placeholder
    })
    
    it('should handle API errors gracefully', async () => {
      // TODO: Test API error handling
      expect(true).toBe(true) // Placeholder
    })
  })
  
  describe('Caching integration', () => {
    it('should cache frequently accessed data', async () => {
      // TODO: Test caching behavior
      expect(true).toBe(true) // Placeholder
    })
    
    it('should invalidate cache on updates', async () => {
      // TODO: Test cache invalidation
      expect(true).toBe(true) // Placeholder
    })
  })
})

// Performance tests
describe('${PASCAL_CASE} Performance', () => {
  it('should complete operations within acceptable time', async () => {
    const startTime = Date.now()
    
    // TODO: Execute operation
    // await ${FEATURE}Operation()
    
    const duration = Date.now() - startTime
    expect(duration).toBeLessThan(1000) // Should complete within 1 second
  })
  
  it('should handle concurrent operations', async () => {
    // Test concurrent execution
    const operations = Array.from({ length: 10 }, (_, i) => {
      // TODO: Return promise for concurrent operation
      return Promise.resolve(i)
    })
    
    const results = await Promise.allSettled(operations)
    const successful = results.filter(r => r.status === 'fulfilled')
    
    expect(successful.length).toBeGreaterThan(0)
  })
})
EOF
    
    echo "✅ Created integration test: $TEST_FILE"
    
else
    echo "❌ Unknown test type: $TYPE"
    echo "Valid types: unit, e2e, integration"
    exit 1
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit the test file: $TEST_FILE"
echo "2. Implement the TODO sections"
echo "3. Run the test:"

if [ "$TYPE" = "unit" ] || [ "$TYPE" = "integration" ]; then
    echo "   npm run test -- $TEST_FILE"
    echo "   npm run test:watch -- $TEST_FILE"
elif [ "$TYPE" = "e2e" ]; then
    echo "   npm run test:e2e -- $TEST_FILE"
    echo "   npm run test:e2e:ui -- $TEST_FILE"
fi

echo ""
echo "4. Check coverage:"
echo "   npm run test:coverage"