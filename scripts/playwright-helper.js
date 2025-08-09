#!/usr/bin/env node

/**
 * Playwright Helper Script
 * Configures Playwright to run in background/headless mode
 * preventing browser windows from taking over your screen
 */

const { chromium, firefox, webkit } = require('playwright');

async function launchBrowserInBackground(browserType = 'chromium', options = {}) {
  const browsers = { chromium, firefox, webkit };
  const browser = browsers[browserType];
  
  if (!browser) {
    throw new Error(`Invalid browser type: ${browserType}`);
  }

  const defaultOptions = {
    headless: true, // Change to false if you need to see the browser
    args: [
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-blink-features=AutomationControlled',
      '--window-position=-2400,-2400', // Position off-screen
      '--window-size=1280,720',
      '--start-minimized' // Start minimized on Windows
    ]
  };

  // Merge user options with defaults
  const launchOptions = { ...defaultOptions, ...options };

  return await browser.launch(launchOptions);
}

// Environment variable configuration
const PLAYWRIGHT_HEADLESS = process.env.PLAYWRIGHT_HEADLESS !== 'false';
const PLAYWRIGHT_BACKGROUND = process.env.PLAYWRIGHT_BACKGROUND === 'true';

function getPlaywrightConfig() {
  if (PLAYWRIGHT_HEADLESS) {
    return {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
  } else if (PLAYWRIGHT_BACKGROUND) {
    return {
      headless: false,
      args: [
        '--window-position=-2400,-2400',
        '--window-size=1280,720',
        '--start-minimized'
      ]
    };
  } else {
    return {
      headless: false
    };
  }
}

module.exports = {
  launchBrowserInBackground,
  getPlaywrightConfig,
  
  // Preset configurations
  configs: {
    headless: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    background: {
      headless: false,
      args: [
        '--window-position=-2400,-2400',
        '--window-size=1280,720',
        '--start-minimized'
      ]
    },
    debug: {
      headless: false,
      slowMo: 100,
      devtools: true
    }
  }
};

// CLI usage
if (require.main === module) {
  console.log('Playwright Helper Configuration');
  console.log('================================');
  console.log('Current settings:');
  console.log(`  PLAYWRIGHT_HEADLESS: ${PLAYWRIGHT_HEADLESS}`);
  console.log(`  PLAYWRIGHT_BACKGROUND: ${PLAYWRIGHT_BACKGROUND}`);
  console.log('\nTo run Playwright without taking over your screen:');
  console.log('  1. Headless mode (no visible browser):');
  console.log('     PLAYWRIGHT_HEADLESS=true npm test');
  console.log('  2. Background mode (browser off-screen):');
  console.log('     PLAYWRIGHT_BACKGROUND=true npm test');
  console.log('  3. Normal mode (for debugging):');
  console.log('     PLAYWRIGHT_HEADLESS=false npm test');
}