#!/bin/bash

# Enhanced browser helper with auto-recovery and monitoring
# Automatically fixes common Playwright MCP issues

browser_clean() {
    echo "🧹 Cleaning browser state..."
    
    # Kill all browser-related processes
    pkill -f "mcp-chrome" 2>/dev/null || true
    pkill -f "chromium" 2>/dev/null || true
    pkill -f "Google Chrome Helper" 2>/dev/null || true
    
    # Clean multiple cache locations
    rm -rf "/Users/oliver/Library/Caches/ms-playwright/mcp-chrome" 2>/dev/null || true
    rm -rf "/tmp/playwright*" 2>/dev/null || true
    rm -rf "/var/folders/*/T/playwright*" 2>/dev/null || true
    
    # Clear any lock files
    find /tmp -name "*.lock" -type f -mmin +5 -delete 2>/dev/null || true
    
    echo "✅ Browser cleaned"
}

browser_setup() {
    browser_clean
    
    # Check if dev server is running
    if ! curl -sf http://localhost:3000 >/dev/null 2>&1; then
        echo "🚀 Starting dev server..."
        npm run dev &
        DEV_PID=$!
        
        # Wait for server with progress indicator
        echo -n "⏳ Waiting for dev server"
        for i in {1..30}; do
            if curl -sf http://localhost:3000 >/dev/null 2>&1; then
                echo ""
                echo "✅ Dev server ready (PID: $DEV_PID)"
                break
            fi
            echo -n "."
            sleep 1
        done
        
        if ! curl -sf http://localhost:3000 >/dev/null 2>&1; then
            echo ""
            echo "❌ Dev server failed to start"
            exit 1
        fi
    else
        echo "✅ Dev server already running"
    fi
}

browser_monitor() {
    echo "📊 Browser Process Monitor"
    echo "=========================="
    
    # Check for browser processes
    echo "Browser Processes:"
    ps aux | grep -E "(mcp-chrome|chromium|playwright)" | grep -v grep || echo "  None found"
    
    # Check cache sizes
    echo ""
    echo "Cache Sizes:"
    if [ -d "/Users/oliver/Library/Caches/ms-playwright" ]; then
        du -sh "/Users/oliver/Library/Caches/ms-playwright" 2>/dev/null || echo "  No cache"
    else
        echo "  No cache directory"
    fi
    
    # Check dev server
    echo ""
    echo "Dev Server Status:"
    if curl -sf http://localhost:3000 >/dev/null 2>&1; then
        echo "  ✅ Running on port 3000"
    else
        echo "  ❌ Not running"
    fi
}

browser_auto() {
    # Automatic mode - clean if needed, ensure dev server
    echo "🤖 Auto-fixing browser environment..."
    
    # Check if cleanup is needed
    if pgrep -f "mcp-chrome" > /dev/null 2>&1; then
        echo "  Detected stale browser processes"
        browser_clean
    fi
    
    # Ensure dev server is running
    if ! curl -sf http://localhost:3000 >/dev/null 2>&1; then
        echo "  Dev server not detected"
        browser_setup
    else
        echo "✅ Environment ready"
    fi
}

case "$1" in
    "clean")
        browser_clean
        ;;
    "setup")
        browser_setup
        ;;
    "monitor")
        browser_monitor
        ;;
    "auto")
        browser_auto
        ;;
    *)
        echo "Usage: ./scripts/browser-helper.sh [clean|setup|monitor|auto]"
        echo ""
        echo "  clean   - Fix browser lock issues"
        echo "  setup   - Clean browser + ensure dev server running"
        echo "  monitor - Show browser process status"
        echo "  auto    - Automatically fix issues (recommended)"
        echo ""
        echo "Quick fix: npm run browser:clean"
        ;;
esac