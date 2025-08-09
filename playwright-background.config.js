// Playwright configuration for background/headless testing
// This configuration helps prevent browser windows from taking over your screen

module.exports = {
  // Run in headless mode by default
  use: {
    headless: true, // Set to false only when you need to debug visually
    
    // Launch browser in background with minimal UI disruption
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-position=-2400,-2400', // Position window off-screen
        '--window-size=1280,720'
      ]
    },
    
    // Reduce viewport to minimize resource usage
    viewport: { width: 1280, height: 720 },
    
    // Disable animations for faster tests
    reducedMotion: 'reduce',
    
    // Don't bring browser to foreground
    bypassCSP: true,
    
    // Video recording only on failure (less intrusive)
    video: 'retain-on-failure',
    
    // Screenshots only on failure
    screenshot: 'only-on-failure'
  },

  // Additional options for less intrusive testing
  globalSetup: undefined,
  globalTeardown: undefined,
  
  // Timeout settings
  timeout: 30000,
  
  // Reporter configuration
  reporter: [['list'], ['html', { open: 'never' }]], // Don't auto-open HTML report
}

// Usage notes:
// 1. For headless mode (no visible browser):
//    Set headless: true (default above)
//
// 2. For background mode (browser visible but not in focus):
//    Set headless: false and use window-position to move off-screen
//
// 3. For debugging (need to see the browser):
//    Set headless: false and comment out window-position