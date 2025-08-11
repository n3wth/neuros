import { test, expect } from '@playwright/test'

test.describe('Visual Consistency Testing', () => {
  test('Homepage - Baseline Design Standards', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Take homepage screenshot
    await page.screenshot({ 
      path: 'test-results/homepage-baseline.png', 
      fullPage: true 
    })
    
    // Check for no gradient backgrounds
    const elementsWithGradient = await page.locator('[style*="gradient"]').count()
    expect(elementsWithGradient).toBe(0)
    
    // Check for consistent background color (bg-[#FAFAF9])
    const bodyBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    console.log('Body background:', bodyBg)
    
    // Check for main content area background
    const mainSectionBg = await page.locator('section').first().evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    console.log('Main section background:', mainSectionBg)
    
    // Check font families
    const headingFont = await page.locator('h1').first().evaluate(el => 
      window.getComputedStyle(el).fontFamily
    )
    console.log('Heading font:', headingFont)
    
    // Check for consistent rounded corners
    const cardElements = await page.locator('[class*="rounded-3xl"]').count()
    console.log('Elements with rounded-3xl:', cardElements)
    
    // Check for consistent border styling
    const borderElements = await page.locator('[class*="border-black/5"]').count()
    console.log('Elements with border-black/5:', borderElements)
  })

  test('Sign In Page - Design Consistency', async ({ page }) => {
    await page.goto('http://localhost:3000/signin')
    await page.waitForLoadState('networkidle')
    
    // Take signin screenshot
    await page.screenshot({ 
      path: 'test-results/signin-page.png', 
      fullPage: true 
    })
    
    // Check for no gradient backgrounds
    const elementsWithGradient = await page.locator('[style*="gradient"]').count()
    expect(elementsWithGradient).toBe(0)
    
    // Check background consistency
    const pageBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    console.log('Signin page background:', pageBg)
    
    // Check form styling consistency
    const formBg = await page.locator('form').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    console.log('Form background:', formBg)
    
    // Check typography consistency
    const headingFont = await page.locator('h1').first().evaluate(el => 
      window.getComputedStyle(el).fontFamily
    )
    console.log('Signin heading font:', headingFont)
  })

  test('Dashboard - Authenticated Experience', async ({ page, context }) => {
    // First, sign up a test user
    await page.goto('http://localhost:3000/signup')
    await page.waitForLoadState('networkidle')
    
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'testpassword123'
    
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard (if successful) or handle auth flow
    await page.waitForTimeout(3000)
    
    // Check if we're on dashboard or need to handle email verification
    const currentUrl = page.url()
    console.log('Current URL after signup:', currentUrl)
    
    if (currentUrl.includes('/dashboard')) {
      // Take dashboard screenshot
      await page.screenshot({ 
        path: 'test-results/dashboard-authenticated.png', 
        fullPage: true 
      })
      
      // Check for no gradient backgrounds
      const elementsWithGradient = await page.locator('[style*="gradient"]').count()
      expect(elementsWithGradient).toBe(0)
      
      // Check background consistency
      const dashboardBg = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      )
      console.log('Dashboard background:', dashboardBg)
      
      // Check for consistent card styling
      const cardElements = await page.locator('[class*="rounded-3xl"]').count()
      console.log('Dashboard cards with rounded-3xl:', cardElements)
      
      // Check typography consistency
      const headingFont = await page.locator('h1').first().evaluate(el => 
        window.getComputedStyle(el).fontFamily
      )
      console.log('Dashboard heading font:', headingFont)
    } else {
      console.log('Not redirected to dashboard - might need email verification')
      await page.screenshot({ 
        path: 'test-results/auth-flow-intermediate.png', 
        fullPage: true 
      })
    }
  })

  test('Component Consistency Analysis', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Analyze design system consistency
    const designAnalysis = await page.evaluate(() => {
      const results = {
        gradientElements: [],
        backgroundColors: new Set(),
        fontFamilies: new Set(),
        borderRadii: new Set(),
        borderColors: new Set()
      }
      
      // Check all elements for gradients
      const allElements = document.querySelectorAll('*')
      allElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el)
        
        // Check for gradients
        const bgImage = computedStyle.backgroundImage
        if (bgImage && (bgImage.includes('gradient') || bgImage.includes('linear-gradient') || bgImage.includes('radial-gradient'))) {
          results.gradientElements.push({
            tagName: el.tagName,
            className: el.className,
            backgroundImage: bgImage
          })
        }
        
        // Collect background colors
        if (computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          results.backgroundColors.add(computedStyle.backgroundColor)
        }
        
        // Collect font families
        if (computedStyle.fontFamily) {
          results.fontFamilies.add(computedStyle.fontFamily)
        }
        
        // Collect border radius
        if (computedStyle.borderRadius && computedStyle.borderRadius !== '0px') {
          results.borderRadii.add(computedStyle.borderRadius)
        }
        
        // Collect border colors
        if (computedStyle.borderColor && computedStyle.borderColor !== 'rgba(0, 0, 0, 0)') {
          results.borderColors.add(computedStyle.borderColor)
        }
      })
      
      // Convert Sets to Arrays for JSON serialization
      return {
        gradientElements: results.gradientElements,
        backgroundColors: Array.from(results.backgroundColors),
        fontFamilies: Array.from(results.fontFamilies),
        borderRadii: Array.from(results.borderRadii),
        borderColors: Array.from(results.borderColors)
      }
    })
    
    console.log('Design Analysis Results:')
    console.log('Gradient elements found:', designAnalysis.gradientElements.length)
    console.log('Background colors in use:', designAnalysis.backgroundColors)
    console.log('Font families in use:', designAnalysis.fontFamilies)
    console.log('Border radii in use:', designAnalysis.borderRadii)
    console.log('Border colors in use:', designAnalysis.borderColors)
    
    // Verify no gradients are found
    expect(designAnalysis.gradientElements.length).toBe(0)
  })
})