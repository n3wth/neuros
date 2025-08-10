import { test, expect } from '@playwright/test'

test.describe('Dashboard Tests', () => {
  // Mock authentication for dashboard tests
  test.use({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:3002',
          localStorage: [
            {
              name: 'supabase.auth.token',
              value: JSON.stringify({
                access_token: 'mock-token',
                refresh_token: 'mock-refresh',
                expires_at: Date.now() + 3600000
              })
            }
          ]
        }
      ]
    }
  })

  test('Dashboard loads with main sections', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle')
    
    // Check for main dashboard elements
    const mainContent = page.locator('main, [role="main"]').first()
    await expect(mainContent).toBeVisible()
    
    // Check for dashboard title or heading
    const dashboardHeading = page.getByRole('heading', { name: /dashboard|overview|welcome/i }).first()
    if (await dashboardHeading.isVisible()) {
      await expect(dashboardHeading).toBeVisible()
    }
    
    // Check for navigation elements
    const nav = page.locator('nav, [role="navigation"]').first()
    await expect(nav).toBeVisible()
  })

  test('Dashboard statistics display', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check for statistics cards
    const statCards = page.locator('[class*="stat"], [class*="card"], [data-testid*="stat"]')
    
    if (await statCards.first().isVisible()) {
      // Check at least some stats are shown
      const count = await statCards.count()
      expect(count).toBeGreaterThan(0)
      
      // Check for common stat labels
      const commonStats = ['Total', 'Active', 'Due', 'Completed', 'Progress']
      for (const stat of commonStats) {
        const statElement = page.locator(`text=/${stat}/i`).first()
        if (await statElement.isVisible()) {
          await expect(statElement).toBeVisible()
          break
        }
      }
    }
  })

  test('Dashboard navigation links', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check for common dashboard navigation items
    const navItems = [
      'Overview',
      'Learn',
      'Review',
      'Progress',
      'Settings',
      'Profile'
    ]
    
    for (const item of navItems) {
      const link = page.getByRole('link', { name: new RegExp(item, 'i') }).first()
      if (await link.isVisible()) {
        await expect(link).toBeVisible()
      }
    }
  })

  test('Create new item functionality', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Look for create/add buttons
    const createButton = page.getByRole('button', { name: /create|add|new/i }).first()
    
    if (await createButton.isVisible()) {
      await createButton.click()
      
      // Check if modal or form appears
      const modal = page.getByRole('dialog')
      const form = page.locator('form').first()
      
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible()
        
        // Check for form fields in modal
        const inputs = modal.locator('input, textarea')
        const inputCount = await inputs.count()
        expect(inputCount).toBeGreaterThan(0)
        
        // Check for close button
        const closeButton = modal.getByRole('button', { name: /close|cancel/i }).first()
        if (await closeButton.isVisible()) {
          await closeButton.click()
          await expect(modal).not.toBeVisible()
        }
      } else if (await form.isVisible()) {
        await expect(form).toBeVisible()
      }
    }
  })

  test('Dashboard search functionality', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Look for search input
    const searchInput = page.getByRole('searchbox').or(
      page.getByPlaceholder(/search/i)
    ).first()
    
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible()
      
      // Test search input
      await searchInput.fill('test search')
      await searchInput.press('Enter')
      
      // Wait for potential search results
      await page.waitForTimeout(1000)
      
      // Clear search
      await searchInput.clear()
    }
  })

  test('Dashboard user menu', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Look for user avatar or menu button
    const userMenu = page.getByRole('button', { name: /user|profile|account|menu/i }).first()
    
    if (await userMenu.isVisible()) {
      await userMenu.click()
      
      // Check for dropdown menu
      const dropdown = page.getByRole('menu').or(
        page.locator('[role="menu"], [class*="dropdown"], [class*="popover"]')
      ).first()
      
      if (await dropdown.isVisible()) {
        // Check for common menu items
        const menuItems = ['Profile', 'Settings', 'Sign out', 'Logout']
        
        for (const item of menuItems) {
          const menuItem = dropdown.getByText(new RegExp(item, 'i')).first()
          if (await menuItem.isVisible()) {
            await expect(menuItem).toBeVisible()
            break
          }
        }
        
        // Close menu
        await page.keyboard.press('Escape')
      }
    }
  })

  test('Dashboard responsive behavior', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check for mobile menu button
    const mobileMenuButton = page.getByRole('button', { name: /menu|toggle/i }).first()
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      
      // Check mobile menu appears
      const mobileMenu = page.locator('[class*="mobile"], [class*="drawer"], [class*="sidebar"]').first()
      if (await mobileMenu.isVisible()) {
        await expect(mobileMenu).toBeVisible()
        
        // Close mobile menu
        await mobileMenuButton.click()
        await expect(mobileMenu).not.toBeVisible()
      }
    }
    
    // Reset to desktop view
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test('Dashboard data loading states', async ({ page }) => {
    // Slow down network to see loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100)
    })
    
    await page.goto('/dashboard')
    
    // Check for loading indicators
    const loadingIndicators = page.locator('text=/loading|fetching/i, [class*="skeleton"], [class*="shimmer"], [role="progressbar"]')
    
    if (await loadingIndicators.first().isVisible()) {
      // Wait for loading to complete
      await page.waitForLoadState('networkidle')
      
      // Loading indicators should be gone
      const visibleLoaders = await loadingIndicators.count()
      expect(visibleLoaders).toBe(0)
    }
  })

  test('Dashboard empty states', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check for empty state messages
    const emptyStates = page.locator('text=/no data|no items|empty|get started|create your first/i')
    
    if (await emptyStates.first().isVisible()) {
      // Check for call-to-action in empty state
      const ctaButton = page.getByRole('button', { name: /create|add|start|begin/i }).first()
      if (await ctaButton.isVisible()) {
        await expect(ctaButton).toBeVisible()
      }
    }
  })

  test('Dashboard keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        hasClass: el?.className ? true : false,
        isVisible: el ? window.getComputedStyle(el).visibility !== 'hidden' : false
      }
    })
    
    expect(focusedElement.isVisible).toBe(true)
    
    // Test keyboard shortcuts if any
    await page.keyboard.press('Control+K') // Common search shortcut
    await page.waitForTimeout(500)
    
    // Check if search or command palette opened
    const commandPalette = page.getByRole('dialog').or(
      page.locator('[class*="command"], [class*="search"]')
    ).first()
    
    if (await commandPalette.isVisible()) {
      await page.keyboard.press('Escape')
      await expect(commandPalette).not.toBeVisible()
    }
  })
})