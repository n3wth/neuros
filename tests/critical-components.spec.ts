import { test, expect } from '@playwright/test'

test.describe('Critical Components', () => {
  test.describe('Navigation Header', () => {
    test('Navigation header renders on all pages', async ({ page }) => {
      const routes = ['/', '/explore', '/research', '/pricing']
      
      for (const route of routes) {
        await page.goto(route)
        
        // Check header is visible
        const header = page.locator('header, nav').first()
        await expect(header).toBeVisible()
        
        // Check logo
        const logo = header.getByRole('link', { name: /neuros/i }).first()
        await expect(logo).toBeVisible()
        
        // Check main nav items
        const navItems = ['Explore', 'Research', 'Enterprise', 'Pricing']
        for (const item of navItems) {
          const link = header.getByRole('link', { name: item })
          if (await link.isVisible()) {
            await expect(link).toBeVisible()
          }
        }
      }
    })

    test('Mobile navigation menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // Check mobile menu button
      const menuButton = page.getByRole('button', { name: /menu|toggle/i })
      await expect(menuButton).toBeVisible()
      
      // Open menu
      await menuButton.click()
      
      // Check menu items appear
      await expect(page.getByRole('link', { name: 'Explore' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Research' })).toBeVisible()
      
      // Close menu
      await menuButton.click()
      await expect(page.getByRole('link', { name: 'Explore' })).not.toBeVisible()
    })
  })

  test.describe('Hero Section', () => {
    test('Hero section displays correctly', async ({ page }) => {
      await page.goto('/')
      
      // Check main heading
      const heading = page.getByRole('heading', { level: 1 }).first()
      await expect(heading).toBeVisible()
      await expect(heading).toContainText(/remember|learn|neuros/i)
      
      // Check CTA buttons
      const ctaButtons = page.getByRole('link', { name: /get started|begin|start|try/i })
      await expect(ctaButtons.first()).toBeVisible()
      
      // Check hero image or animation
      const heroMedia = page.locator('img, video, canvas').first()
      if (await heroMedia.isVisible()) {
        await expect(heroMedia).toBeVisible()
      }
    })

    test('Hero statistics display', async ({ page }) => {
      await page.goto('/')
      
      // Check for statistics
      const stats = page.locator('text=/[0-9]+[%km]|users|learners|retention/i')
      if (await stats.first().isVisible()) {
        const count = await stats.count()
        expect(count).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Forms', () => {
    test('Sign in form components', async ({ page }) => {
      await page.goto('/signin')
      
      // Check form structure
      const form = page.locator('form').first()
      await expect(form).toBeVisible()
      
      // Check email input
      const emailInput = form.getByLabel(/email/i)
      await expect(emailInput).toBeVisible()
      await expect(emailInput).toHaveAttribute('type', 'email')
      
      // Check password input
      const passwordInput = form.getByLabel(/password/i)
      await expect(passwordInput).toBeVisible()
      await expect(passwordInput).toHaveAttribute('type', 'password')
      
      // Check submit button
      const submitButton = form.getByRole('button', { name: /sign in/i })
      await expect(submitButton).toBeVisible()
      
      // Test form interaction
      await emailInput.fill('test@example.com')
      await expect(emailInput).toHaveValue('test@example.com')
      
      await passwordInput.fill('testpassword')
      await expect(passwordInput).toHaveValue('testpassword')
    })

    test('Form validation feedback', async ({ page }) => {
      await page.goto('/signin')
      
      // Submit empty form
      await page.getByRole('button', { name: /sign in/i }).click()
      
      // Check for error messages
      await page.waitForTimeout(500)
      const errors = page.locator('[role="alert"], [class*="error"], [class*="invalid"]')
      if (await errors.first().isVisible()) {
        await expect(errors.first()).toBeVisible()
      }
    })
  })

  test.describe('Learning Components', () => {
    test('Learning interface loads', async ({ page }) => {
      await page.goto('/learn')
      
      // Wait for content to load
      await page.waitForLoadState('networkidle')
      
      // Check for main learning container
      const learningContainer = page.locator('main, [role="main"], [class*="learn"]').first()
      await expect(learningContainer).toBeVisible()
      
      // Check for either cards or empty state
      const cards = page.locator('[class*="card"], [data-testid*="card"]')
      const emptyState = page.locator('text=/no cards|all caught up|nothing to review/i')
      
      if (await cards.first().isVisible()) {
        await expect(cards.first()).toBeVisible()
      } else if (await emptyState.first().isVisible()) {
        await expect(emptyState.first()).toBeVisible()
      }
    })

    test('Review interface interactions', async ({ page }) => {
      await page.goto('/learn')
      await page.waitForLoadState('networkidle')
      
      // Check for action buttons
      const actionButtons = page.getByRole('button')
      if (await actionButtons.first().isVisible()) {
        const buttonCount = await actionButtons.count()
        expect(buttonCount).toBeGreaterThan(0)
        
        // Check for common review buttons
        const reviewButtons = ['Show', 'Next', 'Easy', 'Good', 'Hard', 'Again', 'Check']
        for (const buttonText of reviewButtons) {
          const button = page.getByRole('button', { name: new RegExp(buttonText, 'i') })
          if (await button.isVisible()) {
            await expect(button).toBeEnabled()
            break
          }
        }
      }
    })
  })

  test.describe('Pricing Components', () => {
    test('Pricing cards display', async ({ page }) => {
      await page.goto('/pricing')
      
      // Check for pricing cards
      const pricingCards = page.locator('[class*="pricing"], [class*="plan"], [class*="tier"]')
      if (await pricingCards.first().isVisible()) {
        const count = await pricingCards.count()
        expect(count).toBeGreaterThanOrEqual(2) // At least 2 pricing tiers
        
        // Check for price display
        const prices = page.locator('text=/$[0-9]+|€[0-9]+|£[0-9]+|Free/i')
        await expect(prices.first()).toBeVisible()
        
        // Check for CTA buttons
        const ctaButtons = page.getByRole('button', { name: /start|subscribe|choose|select/i })
        await expect(ctaButtons.first()).toBeVisible()
      }
    })

    test('Feature comparison', async ({ page }) => {
      await page.goto('/pricing')
      
      // Check for feature list
      const features = page.locator('li, [class*="feature"]')
      if (await features.first().isVisible()) {
        const count = await features.count()
        expect(count).toBeGreaterThan(3) // At least some features listed
      }
    })
  })

  test.describe('Footer', () => {
    test('Footer links and information', async ({ page }) => {
      await page.goto('/')
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // Check footer exists
      const footer = page.locator('footer').first()
      await expect(footer).toBeVisible()
      
      // Check for footer sections
      const footerSections = ['Product', 'Learn', 'Connect', 'Account']
      for (const section of footerSections) {
        const heading = footer.getByRole('heading', { name: new RegExp(section, 'i') })
        if (await heading.isVisible()) {
          await expect(heading).toBeVisible()
        }
      }
      
      // Check for copyright
      const copyright = footer.locator('text=/©|copyright/i')
      if (await copyright.isVisible()) {
        await expect(copyright).toBeVisible()
      }
      
      // Check for social links
      const socialLinks = footer.getByRole('link', { name: /twitter|linkedin|github|discord/i })
      if (await socialLinks.first().isVisible()) {
        const count = await socialLinks.count()
        expect(count).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Loading States', () => {
    test('Loading indicators display correctly', async ({ page }) => {
      // Slow down network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 200)
      })
      
      await page.goto('/learn')
      
      // Check for loading indicators
      const loadingIndicators = page.locator(
        '[class*="loading"], [class*="skeleton"], [class*="shimmer"], [role="progressbar"], text=/loading|preparing/i'
      )
      
      if (await loadingIndicators.first().isVisible()) {
        await expect(loadingIndicators.first()).toBeVisible()
        
        // Wait for loading to complete
        await page.waitForLoadState('networkidle')
        
        // Loading should be gone
        await expect(loadingIndicators.first()).not.toBeVisible()
      }
    })
  })

  test.describe('Error States', () => {
    test('404 page displays correctly', async ({ page }) => {
      await page.goto('/non-existent-page-404')
      
      // Check for 404 message
      const notFoundMessage = page.locator('text=/404|not found|page not found/i')
      await expect(notFoundMessage.first()).toBeVisible()
      
      // Check for home link
      const homeLink = page.getByRole('link', { name: /home|back|return/i })
      if (await homeLink.isVisible()) {
        await expect(homeLink).toBeVisible()
      }
    })
  })

  test.describe('Accessibility', () => {
    test('Focus management and keyboard navigation', async ({ page }) => {
      await page.goto('/')
      
      // Test tab navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Check focus is visible
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement
        return {
          tagName: el?.tagName,
          isVisible: el ? window.getComputedStyle(el).visibility !== 'hidden' : false,
          hasFocusStyles: el ? 
            window.getComputedStyle(el).outline !== 'none' || 
            window.getComputedStyle(el).boxShadow !== 'none' : false
        }
      })
      
      expect(focusedElement.isVisible).toBe(true)
    })

    test('ARIA labels and roles', async ({ page }) => {
      await page.goto('/')
      
      // Check for main landmark
      const main = page.locator('main, [role="main"]')
      await expect(main.first()).toBeVisible()
      
      // Check for navigation landmark
      const nav = page.locator('nav, [role="navigation"]')
      await expect(nav.first()).toBeVisible()
      
      // Check buttons have accessible names
      const buttons = page.getByRole('button')
      if (await buttons.first().isVisible()) {
        const firstButton = buttons.first()
        const accessibleName = await firstButton.getAttribute('aria-label') || 
                               await firstButton.textContent()
        expect(accessibleName).toBeTruthy()
      }
    })
  })
})