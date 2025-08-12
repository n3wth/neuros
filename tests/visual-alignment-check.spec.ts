import { test, expect } from '@playwright/test'

test.describe('Visual Alignment Testing', () => {
  const viewports = [
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Desktop Medium', width: 1440, height: 900 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile Large', width: 390, height: 844 },
    { name: 'Mobile Small', width: 375, height: 667 }
  ]

  viewports.forEach(({ name, width, height }) => {
    test(`Homepage Visual Alignment - ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height })
      
      // Navigate to homepage
      await page.goto('http://localhost:3001')
      await page.waitForLoadState('networkidle')
      
      // Take screenshot
      const screenshotPath = `test-results/alignment-${name.toLowerCase().replace(' ', '-')}-${width}x${height}.png`
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      })
      console.log(`Screenshot saved: ${screenshotPath}`)
      
      // Get accessibility tree to analyze layout
      const accessibilityTree = await page.accessibility.snapshot()
      
      // Analyze specific sections for alignment issues
      const alignmentIssues = await page.evaluate(() => {
        const issues = []
        
        // Helper function to check if elements overlap
        const checkOverlap = (el1, el2) => {
          const rect1 = el1.getBoundingClientRect()
          const rect2 = el2.getBoundingClientRect()
          return !(rect1.right < rect2.left || 
                  rect2.right < rect1.left || 
                  rect1.bottom < rect2.top || 
                  rect2.bottom < rect1.top)
        }
        
        // Check hero section layout
        const heroSection = document.querySelector('section')
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect()
          if (heroRect.height < 400 && window.innerWidth >= 768) {
            issues.push({
              section: 'hero',
              element: 'hero-section',
              issue: 'Hero section appears too short for desktop viewport',
              height: heroRect.height
            })
          }
          
          // Check hero text alignment
          const heroHeading = heroSection.querySelector('h1')
          const heroText = heroSection.querySelector('p')
          if (heroHeading && heroText) {
            const headingRect = heroHeading.getBoundingClientRect()
            const textRect = heroText.getBoundingClientRect()
            
            if (Math.abs(headingRect.left - textRect.left) > 5) {
              issues.push({
                section: 'hero',
                element: 'hero-text-alignment',
                issue: 'Heading and paragraph text not aligned',
                headingLeft: headingRect.left,
                textLeft: textRect.left
              })
            }
          }
          
          // Check for elements cut off at viewport edge
          const heroChildren = heroSection.querySelectorAll('*')
          heroChildren.forEach((child, index) => {
            const rect = child.getBoundingClientRect()
            if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
              issues.push({
                section: 'hero',
                element: `hero-child-${index}`,
                issue: 'Element extends beyond viewport',
                elementTag: child.tagName,
                className: child.className,
                rect: { width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom }
              })
            }
          })
        }
        
        // Check navigation alignment
        const nav = document.querySelector('nav') || document.querySelector('header')
        if (nav) {
          const navItems = nav.querySelectorAll('a, button')
          if (navItems.length > 1) {
            const firstItemRect = navItems[0].getBoundingClientRect()
            let hasAlignmentIssue = false
            
            navItems.forEach((item, index) => {
              if (index > 0) {
                const itemRect = item.getBoundingClientRect()
                // Check vertical alignment
                if (Math.abs(firstItemRect.top - itemRect.top) > 3) {
                  hasAlignmentIssue = true
                }
              }
            })
            
            if (hasAlignmentIssue) {
              issues.push({
                section: 'navigation',
                element: 'nav-items',
                issue: 'Navigation items not vertically aligned',
                itemCount: navItems.length
              })
            }
          }
        }
        
        // Check feature cards grid alignment
        const featureCards = document.querySelectorAll('[class*="grid"] > div, [class*="flex"] > div')
        if (featureCards.length >= 3) {
          const cardRects = Array.from(featureCards).map(card => card.getBoundingClientRect())
          const firstRowCards = cardRects.filter(rect => Math.abs(rect.top - cardRects[0].top) < 10)
          
          if (firstRowCards.length > 1) {
            const heights = firstRowCards.map(rect => rect.height)
            const minHeight = Math.min(...heights)
            const maxHeight = Math.max(...heights)
            
            if (maxHeight - minHeight > 20) {
              issues.push({
                section: 'features',
                element: 'feature-cards',
                issue: 'Feature cards have inconsistent heights',
                heightDifference: maxHeight - minHeight,
                cardCount: firstRowCards.length
              })
            }
            
            // Check horizontal alignment
            const tops = firstRowCards.map(rect => rect.top)
            const minTop = Math.min(...tops)
            const maxTop = Math.max(...tops)
            
            if (maxTop - minTop > 5) {
              issues.push({
                section: 'features',
                element: 'feature-cards',
                issue: 'Feature cards not horizontally aligned',
                topDifference: maxTop - minTop
              })
            }
          }
        }
        
        // Check button alignment
        const buttons = document.querySelectorAll('button, a[class*="button"]')
        buttons.forEach((button, index) => {
          const rect = button.getBoundingClientRect()
          const computedStyle = window.getComputedStyle(button)
          
          // Check if button text is centered
          const textAlign = computedStyle.textAlign
          if (textAlign !== 'center' && button.textContent.trim()) {
            issues.push({
              section: 'buttons',
              element: `button-${index}`,
              issue: 'Button text not centered',
              textAlign: textAlign,
              buttonText: button.textContent.trim()
            })
          }
        })
        
        // Check footer spacing
        const footer = document.querySelector('footer')
        if (footer) {
          const footerRect = footer.getBoundingClientRect()
          const bodyRect = document.body.getBoundingClientRect()
          
          // Check if footer is properly positioned
          if (footerRect.bottom > bodyRect.bottom + 10) {
            issues.push({
              section: 'footer',
              element: 'footer-position',
              issue: 'Footer extends beyond body bounds',
              footerBottom: footerRect.bottom,
              bodyBottom: bodyRect.bottom
            })
          }
          
          // Check footer internal spacing
          const footerChildren = footer.children
          if (footerChildren.length > 1) {
            let hasSpacingIssue = false
            for (let i = 0; i < footerChildren.length - 1; i++) {
              const currentRect = footerChildren[i].getBoundingClientRect()
              const nextRect = footerChildren[i + 1].getBoundingClientRect()
              const gap = nextRect.top - currentRect.bottom
              
              if (gap < 0) { // Overlapping
                hasSpacingIssue = true
                break
              }
            }
            
            if (hasSpacingIssue) {
              issues.push({
                section: 'footer',
                element: 'footer-spacing',
                issue: 'Footer elements have spacing issues or overlap',
                childrenCount: footerChildren.length
              })
            }
          }
        }
        
        // Check for elements with inconsistent padding/margins
        const allElements = document.querySelectorAll('section, div[class*="container"], div[class*="wrapper"]')
        const paddingIssues = []
        
        allElements.forEach((el, index) => {
          const computedStyle = window.getComputedStyle(el)
          const paddingTop = parseFloat(computedStyle.paddingTop)
          const paddingBottom = parseFloat(computedStyle.paddingBottom)
          const marginTop = parseFloat(computedStyle.marginTop)
          const marginBottom = parseFloat(computedStyle.marginBottom)
          
          // Check for very large or unusual spacing values
          if (paddingTop > 200 || paddingBottom > 200 || marginTop > 200 || marginBottom > 200) {
            paddingIssues.push({
              element: `section-${index}`,
              className: el.className,
              paddingTop,
              paddingBottom,
              marginTop,
              marginBottom
            })
          }
        })
        
        if (paddingIssues.length > 0) {
          issues.push({
            section: 'spacing',
            element: 'large-spacing',
            issue: 'Elements with unusually large padding/margin values',
            affectedElements: paddingIssues
          })
        }
        
        return issues
      })
      
      // Log all found issues
      console.log(`\n=== ALIGNMENT ISSUES FOUND FOR ${name} (${width}x${height}) ===`)
      if (alignmentIssues.length === 0) {
        console.log('✅ No alignment issues detected')
      } else {
        alignmentIssues.forEach((issue, index) => {
          console.log(`\n${index + 1}. ${issue.section.toUpperCase()} - ${issue.element}`)
          console.log(`   Issue: ${issue.issue}`)
          console.log(`   Details:`, JSON.stringify(issue, null, 4))
        })
      }
      
      // Store issues in test results for reporting
      await page.evaluate((issues) => {
        window.__alignmentIssues = issues
      }, alignmentIssues)
    })
  })
  
  test('Comprehensive Alignment Report', async ({ page }) => {
    // This test aggregates all viewport results
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    console.log('\n=== COMPREHENSIVE VISUAL ALIGNMENT REPORT ===')
    console.log('Screenshots have been saved to test-results/ directory')
    console.log('Review the individual viewport test results above for specific issues')
    console.log('\n🔍 Key Areas Analyzed:')
    console.log('  • Hero section layout and text alignment')
    console.log('  • Navigation bar item alignment') 
    console.log('  • Feature cards grid consistency')
    console.log('  • Button text centering')
    console.log('  • Footer positioning and spacing')
    console.log('  • Element overflow beyond viewport')
    console.log('  • Inconsistent padding/margin values')
    
    console.log('\n📱 Tested Viewports:')
    viewports.forEach(({ name, width, height }) => {
      console.log(`  • ${name}: ${width}x${height}px`)
    })
  })
})