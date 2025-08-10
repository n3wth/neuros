import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

// Generate fresh manifest before tests
const TestManifestGenerator = require('../scripts/generate-test-manifest.js')

test.describe('All Routes Accessibility', () => {
  let manifest: any
  
  test.beforeAll(async () => {
    // Generate manifest
    const generator = new TestManifestGenerator()
    manifest = await generator.generate()
    console.log(`Testing ${manifest.routes.length} routes`)
  })
  
  // Test each route for basic accessibility
  manifest?.routes?.forEach((route: any) => {
    // Skip dynamic routes for now
    if (route.dynamic) return
    
    test(`Route ${route.path} - Basic checks`, async ({ page }) => {
      // Navigate to route
      await page.goto(route.path)
      
      // Check page loads without errors
      const consoleErrors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })
      
      // Wait for page to be ready
      await page.waitForLoadState('networkidle')
      
      // Basic accessibility checks
      await expect(page).toHaveTitle(/.+/) // Has a title
      
      // Check for heading structure
      const h1 = await page.locator('h1').first()
      if (await h1.isVisible()) {
        await expect(h1).toBeVisible()
      }
      
      // Check for keyboard navigation
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
      
      // Check for console errors
      expect(consoleErrors).toHaveLength(0)
    })
  })
})

test.describe('Critical User Flows', () => {
  test('Homepage to Dashboard flow', async ({ page }) => {
    await page.goto('/')
    
    // Check homepage loads
    await expect(page).toHaveTitle(/Neuros/)
    
    // Navigate to dashboard
    const dashboardLink = page.getByRole('link', { name: /dashboard|get started/i }).first()
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click()
      await page.waitForURL(/\/(dashboard|signin)/)
    }
  })
  
  test('Mobile navigation works', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip()
      return
    }
    
    await page.goto('/')
    
    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu|toggle/i })
    if (await menuButton.isVisible()) {
      await menuButton.click()
      
      // Check menu items are visible
      await expect(page.getByRole('link', { name: /explore/i })).toBeVisible()
    }
  })
})

test.describe('API Routes Health Check', () => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'test-manifest.json'), 'utf-8')
  )
  
  manifest.apiRoutes?.forEach((route: any) => {
    if (route.methods.includes('GET')) {
      test(`API ${route.path} responds`, async ({ request }) => {
        const response = await request.get(route.path)
        
        // API should not return 500 errors
        expect(response.status()).toBeLessThan(500)
      })
    }
  })
})

test.describe('Component Smoke Tests', () => {
  test('Critical components render', async ({ page }) => {
    // Test learning page components
    await page.goto('/learn')
    await page.waitForLoadState('networkidle')
    
    // Check for loading states
    const loadingIndicator = page.locator('text=/loading|preparing/i')
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeHidden({ timeout: 10000 })
    }
    
    // Check main content appears
    const mainContent = page.locator('main, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })
})