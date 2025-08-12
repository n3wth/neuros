# Playwright Background Testing Setup

This guide helps you run Playwright tests without browser windows taking over your screen.

## Quick Start

### Option 1: Headless Mode (Recommended)
No visible browser window at all:
```bash
npm run test:e2e
```

### Option 2: Background Mode
Browser runs but positioned off-screen:
```bash
npm run test:e2e:bg
```

### Option 3: Debug Mode
Normal visible browser for debugging:
```bash
npm run test:e2e:debug
```

## MCP Playwright Configuration

When using Playwright through Claude Code's MCP server, the browser behavior depends on the MCP server configuration. To prevent it from taking over your screen:

1. **For macOS**: The browser window will be positioned off-screen at coordinates -2400,-2400
2. **For Windows**: The browser will start minimized
3. **For Linux**: The browser will run in headless mode by default

## Environment Variables

Set these in `.env.local` or export them in your shell:

```bash
# Run completely headless (no UI)
export PLAYWRIGHT_HEADLESS=true

# Run with browser off-screen
export PLAYWRIGHT_BACKGROUND=true

# Normal mode for debugging
export PLAYWRIGHT_HEADLESS=false
```

## Configuration Files

- `playwright-background.config.js` - Main Playwright configuration
- `scripts/playwright-helper.js` - Helper utilities for browser launching
- `.env.playwright` - Environment variable template

## Tips

1. **For CI/CD**: Always use headless mode
2. **For local development**: Use background mode to see tests run without interruption
3. **For debugging**: Use debug mode with slowMo to see what's happening

## Troubleshooting

If browser windows still appear:
1. Check that PLAYWRIGHT_HEADLESS is set to true
2. Verify the config file is being loaded
3. For MCP-based Playwright, the configuration is controlled by the MCP server settings

## Available Scripts

```bash
# Check current configuration
npm run playwright:config

# Run tests headless
npm run test:e2e

# Run tests in background
npm run test:e2e:bg

# Debug tests with visible browser
npm run test:e2e:debug
```