import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/')
  })

  test('Sign in flow', async ({ page }) => {
    // Navigate to sign in
    await page.getByRole('link', { name: /sign in/i }).first().click()
    await expect(page).toHaveURL(/\/signin/)
    
    // Check sign in form is visible
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    
    // Check form elements
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)
    const submitButton = page.getByRole('button', { name: /sign in/i })
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // Check forgot password link
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible()
    
    // Check sign up link
    await expect(page.getByText(/don't have an account/i)).toBeVisible()
  })

  test('Sign up flow', async ({ page }) => {
    // Navigate to sign up
    await page.getByRole('link', { name: /get started|sign up/i }).first().click()
    await expect(page).toHaveURL(/\/signup/)
    
    // Check sign up form is visible
    await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible()
    
    // Check form elements
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)
    const submitButton = page.getByRole('button', { name: /sign up|create account/i })
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // Check sign in link
    await expect(page.getByText(/already have an account/i)).toBeVisible()
  })

  test('Forgot password flow', async ({ page }) => {
    // Navigate to sign in first
    await page.goto('/signin')
    
    // Click forgot password
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/\/forgot-password/)
    
    // Check forgot password form
    await expect(page.getByRole('heading', { name: /forgot password|reset password/i })).toBeVisible()
    
    // Check email input
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toBeVisible()
    
    // Check submit button
    const submitButton = page.getByRole('button', { name: /send reset|reset password/i })
    await expect(submitButton).toBeVisible()
    
    // Check back to sign in link
    await expect(page.getByRole('link', { name: /back to sign in|sign in/i })).toBeVisible()
  })

  test('Reset password page loads', async ({ page }) => {
    // Navigate directly to reset password (would normally come from email link)
    await page.goto('/reset-password')
    
    // Check page loads
    await expect(page.getByRole('heading', { name: /reset password|new password/i })).toBeVisible()
    
    // Check for password inputs
    const passwordInputs = page.getByLabel(/password/i)
    await expect(passwordInputs).toHaveCount(2) // New password and confirm password
  })

  test('Protected route redirects to sign in', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard')
    
    // Should redirect to sign in
    await expect(page).toHaveURL(/\/signin/)
    
    // Check for redirect message or sign in form
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('Sign in form validation', async ({ page }) => {
    await page.goto('/signin')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Check for validation messages
    const validationMessages = page.locator('text=/required|invalid|enter/i')
    await expect(validationMessages.first()).toBeVisible()
    
    // Test invalid email format
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Check for email validation
    const emailError = page.locator('text=/valid email|invalid email/i')
    await expect(emailError.first()).toBeVisible()
  })

  test('Sign up form validation', async ({ page }) => {
    await page.goto('/signup')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign up|create account/i }).click()
    
    // Check for validation messages
    const validationMessages = page.locator('text=/required|invalid|enter/i')
    await expect(validationMessages.first()).toBeVisible()
    
    // Test password requirements
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).first().fill('weak')
    await page.getByRole('button', { name: /sign up|create account/i }).click()
    
    // Check for password validation
    const passwordError = page.locator('text=/characters|strong|weak/i')
    await expect(passwordError.first()).toBeVisible()
  })

  test('OAuth sign in options', async ({ page }) => {
    await page.goto('/signin')
    
    // Check for OAuth buttons
    const oauthButtons = page.getByRole('button', { name: /google|github|facebook/i })
    
    // If OAuth is configured, test presence
    const count = await oauthButtons.count()
    if (count > 0) {
      await expect(oauthButtons.first()).toBeVisible()
    }
  })

  test('Remember me functionality', async ({ page }) => {
    await page.goto('/signin')
    
    // Look for remember me checkbox
    const rememberMe = page.getByRole('checkbox', { name: /remember me/i })
    
    if (await rememberMe.isVisible()) {
      // Check it's unchecked by default
      await expect(rememberMe).not.toBeChecked()
      
      // Check it
      await rememberMe.check()
      await expect(rememberMe).toBeChecked()
    }
  })

  test('Terms and privacy links in signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Check for terms and privacy links
    const termsLink = page.getByRole('link', { name: /terms/i })
    const privacyLink = page.getByRole('link', { name: /privacy/i })
    
    if (await termsLink.isVisible()) {
      await expect(termsLink).toHaveAttribute('href', /terms/)
    }
    
    if (await privacyLink.isVisible()) {
      await expect(privacyLink).toHaveAttribute('href', /privacy/)
    }
  })
})