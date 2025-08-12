#!/bin/bash

# Simple browser helper that Claude Code can easily use
# Fixes the common Playwright MCP issues automatically

browser_clean() {
    echo "🧹 Cleaning browser state..."
    pkill -f "mcp-chrome" 2>/dev/null || true
    rm -rf "/Users/oliver/Library/Caches/ms-playwright/mcp-chrome" 2>/dev/null || true
    echo "✅ Browser cleaned"
}

browser_setup() {
    browser_clean
    
    # Check if dev server is running
    if ! curl -sf http://localhost:3000 >/dev/null 2>&1; then
        echo "🚀 Starting dev server..."
        npm run dev &
        
        # Wait for server
        for i in {1..30}; do
            if curl -sf http://localhost:3000 >/dev/null 2>&1; then
                echo "✅ Dev server ready"
                break
            fi
            sleep 1
        done
    else
        echo "✅ Dev server already running"
    fi
}

case "$1" in
    "clean")
        browser_clean
        ;;
    "setup")
        browser_setup
        ;;
    *)
        echo "Usage: ./scripts/browser-helper.sh [clean|setup]"
        echo ""
        echo "clean  - Fix browser lock issues"
        echo "setup  - Clean browser + ensure dev server running"
        ;;
esac