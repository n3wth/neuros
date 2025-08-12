#!/usr/bin/env node

/**
 * Browser Testing Helper for Neuros
 * Provides utilities for managing browser testing workflows with MCP Playwright
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

class BrowserTestHelper {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }

  /**
   * Clean browser state - kills processes and clears cache
   */
  cleanBrowserState() {
    console.log('🧹 Cleaning browser state...');
    try {
      execSync('pkill -f "mcp-chrome" || true', { stdio: 'pipe' });
      execSync('rm -rf "/Users/oliver/Library/Caches/ms-playwright/mcp-chrome" || true', { stdio: 'pipe' });
      console.log('✅ Browser state cleaned');
    } catch (error) {
      console.log('⚠️  Browser cleanup had some issues (probably fine)');
    }
  }

  /**
   * Start dev server if not running
   */
  ensureDevServer() {
    console.log('🚀 Checking dev server...');
    try {
      execSync(`curl -sf ${this.baseUrl} > /dev/null`, { stdio: 'pipe' });
      console.log('✅ Dev server is running');
    } catch (error) {
      console.log('🔄 Starting dev server...');
      execSync('npm run dev &', { stdio: 'inherit' });
      console.log('⏳ Waiting for server to start...');
      
      // Wait up to 30 seconds for server to start
      let attempts = 30;
      while (attempts > 0) {
        try {
          execSync(`curl -sf ${this.baseUrl} > /dev/null`, { stdio: 'pipe' });
          console.log('✅ Dev server started');
          break;
        } catch (e) {
          attempts--;
          if (attempts === 0) {
            throw new Error('Dev server failed to start');
          }
          execSync('sleep 1');
        }
      }
    }
  }

  /**
   * Run parallel E2E tests
   */
  runParallelTests() {
    console.log('🧪 Running parallel E2E tests...');
    try {
      execSync('npm run test:e2e', { stdio: 'inherit' });
      console.log('✅ Parallel tests completed');
    } catch (error) {
      console.log('❌ Some tests failed');
      process.exit(1);
    }
  }

  /**
   * Quick test setup - clean state and ensure server
   */
  quickSetup() {
    this.cleanBrowserState();
    this.ensureDevServer();
    console.log('🎯 Ready for browser testing!');
  }

  /**
   * Full test cycle
   */
  fullTestCycle() {
    this.quickSetup();
    this.runParallelTests();
  }

  /**
   * Test specific routes in sequence
   */
  testRoutes(routes = ['/', '/dashboard', '/explore']) {
    console.log('🗺️  Testing routes sequentially...');
    this.quickSetup();
    
    routes.forEach((route, index) => {
      console.log(`📍 Testing route ${index + 1}/${routes.length}: ${route}`);
      // Would integrate with MCP Playwright here
      // This is where you'd call the MCP browser navigation
    });
  }
}

// CLI interface
const helper = new BrowserTestHelper();

const command = process.argv[2];
switch (command) {
  case 'clean':
    helper.cleanBrowserState();
    break;
  case 'setup':
    helper.quickSetup();
    break;
  case 'test':
    helper.runParallelTests();
    break;
  case 'full':
    helper.fullTestCycle();
    break;
  case 'routes':
    const routes = process.argv.slice(3);
    helper.testRoutes(routes.length > 0 ? routes : undefined);
    break;
  default:
    console.log(`
🚀 Neuros Browser Test Helper

Usage:
  node scripts/browser-test-helper.js <command>

Commands:
  clean   - Clean browser state and cache
  setup   - Quick setup (clean + ensure dev server)
  test    - Run parallel E2E tests
  full    - Full cycle (setup + test)
  routes  - Test specific routes (optional: space-separated route list)

Examples:
  node scripts/browser-test-helper.js setup
  node scripts/browser-test-helper.js routes / /dashboard /explore
  node scripts/browser-test-helper.js full
`);
}