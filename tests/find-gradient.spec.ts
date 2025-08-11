import { test, expect } from '@playwright/test'

test.describe('Find Remaining Gradient', () => {
  test('Identify specific gradient element', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Get detailed info about gradient elements
    const gradientDetails = await page.evaluate(() => {
      const results = []
      const allElements = document.querySelectorAll('*')
      
      allElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el)
        const bgImage = computedStyle.backgroundImage
        
        if (bgImage && (bgImage.includes('gradient') || bgImage.includes('linear-gradient') || bgImage.includes('radial-gradient'))) {
          results.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            backgroundImage: bgImage,
            innerHTML: el.innerHTML.substring(0, 100), // First 100 chars
            parentElement: el.parentElement?.tagName + ' (' + el.parentElement?.className + ')',
            outerHTML: el.outerHTML.substring(0, 200) // First 200 chars
          })
        }
      })
      
      return results
    })
    
    console.log('Found gradient elements:')
    gradientDetails.forEach((element, index) => {
      console.log(`\nElement ${index + 1}:`)
      console.log(`Tag: ${element.tagName}`)
      console.log(`Class: ${element.className}`)
      console.log(`ID: ${element.id}`)
      console.log(`Background: ${element.backgroundImage}`)
      console.log(`Parent: ${element.parentElement}`)
      console.log(`HTML snippet: ${element.outerHTML}`)
    })
    
    expect(gradientDetails.length).toBe(0) // This will still fail but give us the info
  })
})