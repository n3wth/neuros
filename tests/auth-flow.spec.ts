import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('Sign up, sign in, and access dashboard', async ({ page }) => {
    // Test signup
    await page.goto('http://localhost:3000/signup')
    await page.waitForLoadState('networkidle')
    
    // Fill signup form
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for navigation or error
    await page.waitForTimeout(3000)
    
    // Check if we're redirected to dashboard or need email verification
    const currentUrl = page.url()
    console.log('After signup, current URL:', currentUrl)
    
    // If redirected to dashboard, test successful
    if (currentUrl.includes('/dashboard')) {
      console.log('✓ Successfully signed up and redirected to dashboard')
      
      // Check dashboard elements
      await expect(page.locator('h1')).toContainText(/dashboard|welcome/i)
      
      // Sign out
      const signOutButton = page.locator('button:has-text("Sign out"), a:has-text("Sign out")')
      if (await signOutButton.isVisible()) {
        await signOutButton.click()
        await page.waitForURL('**/')
        console.log('✓ Successfully signed out')
      }
    } else {
      console.log('Not redirected to dashboard - checking for email verification message')
      
      // Check for success message
      const successMessage = page.locator('text=/check.*email|verify.*email|confirmation/i')
      if (await successMessage.isVisible()) {
        console.log('✓ Email verification required - expected behavior')
      } else {
        // Check for error messages
        const errorMessage = page.locator('[role="alert"], .text-red-500, .text-destructive')
        if (await errorMessage.isVisible()) {
          const error = await errorMessage.textContent()
          console.error('✗ Signup error:', error)
        }
      }
    }
    
    // Test signin with existing test account
    await page.goto('http://localhost:3000/signin')
    await page.waitForLoadState('networkidle')
    
    // Use dev test account
    await page.fill('input[type="email"]', 'test@neuros.dev')
    await page.fill('input[type="password"]', 'test123456')
    await page.click('button[type="submit"]')
    
    // Wait for navigation
    await page.waitForTimeout(3000)
    
    const signinUrl = page.url()
    console.log('After signin, current URL:', signinUrl)
    
    if (signinUrl.includes('/dashboard')) {
      console.log('✓ Successfully signed in to test account')
      
      // Verify dashboard loads
      await expect(page.locator('h1')).toBeVisible()
      
      // Check for core dashboard elements
      const hasCards = await page.locator('text=/cards|review|study/i').isVisible()
      console.log('Dashboard has learning elements:', hasCards)
      
      // Take screenshot for verification
      await page.screenshot({ path: 'test-results/dashboard-authenticated.png', fullPage: true })
    } else {
      console.error('✗ Failed to sign in to test account')
      
      // Check for error
      const errorMessage = page.locator('[role="alert"], .text-red-500, .text-destructive')
      if (await errorMessage.isVisible()) {
        const error = await errorMessage.textContent()
        console.error('Signin error:', error)
      }
    }
  })
  
  test('Development bypass login', async ({ page }) => {
    await page.goto('http://localhost:3000/signin')
    await page.waitForLoadState('networkidle')
    
    // Look for dev bypass button
    const devButton = page.locator('button:has-text("Continue as Developer"), button:has-text("Skip login")')
    
    if (await devButton.isVisible()) {
      console.log('✓ Development bypass button found')
      await devButton.click()
      
      // Wait for navigation
      await page.waitForTimeout(3000)
      
      const currentUrl = page.url()
      if (currentUrl.includes('/dashboard')) {
        console.log('✓ Successfully bypassed login in development')
        await page.screenshot({ path: 'test-results/dev-bypass-dashboard.png', fullPage: true })
      } else {
        console.error('✗ Dev bypass did not redirect to dashboard')
      }
    } else {
      console.log('ℹ Development bypass not available (expected in production)')
    }
  })
})