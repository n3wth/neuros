#!/bin/bash

# Quick script to show logs that Claude can easily read

LOG_DIR="/Users/oliver/gh/neuros/logs"

if [ "$1" = "latest" ] || [ $# -eq 0 ]; then
    if [ -f "$LOG_DIR/latest.log" ]; then
        echo "=== LATEST LOG (last 100 lines) ==="
        echo "File: $(readlink $LOG_DIR/latest.log)"
        echo ""
        tail -100 "$LOG_DIR/latest.log"
    else
        echo "No logs found yet. Start logging with: npm run dev:log"
    fi
elif [ "$1" = "full" ]; then
    if [ -f "$LOG_DIR/latest.log" ]; then
        echo "=== FULL LATEST LOG ==="
        echo "File: $(readlink $LOG_DIR/latest.log)"
        echo ""
        cat "$LOG_DIR/latest.log"
    else
        echo "No logs found yet."
    fi
elif [ "$1" = "live" ]; then
    if [ -f "$LOG_DIR/latest.log" ]; then
        echo "=== FOLLOWING LIVE LOG (Ctrl+C to stop) ==="
        echo "File: $(readlink $LOG_DIR/latest.log)"
        echo ""
        tail -f "$LOG_DIR/latest.log"
    else
        echo "No logs found yet."
    fi
elif [ "$1" = "list" ]; then
    echo "=== AVAILABLE LOG FILES ==="
    ls -la "$LOG_DIR"/*.log 2>/dev/null || echo "No log files found"
else
    echo "Usage: $0 [latest|full|live|list]"
    echo ""
    echo "  latest  - Show last 100 lines (default)"
    echo "  full    - Show entire latest log"
    echo "  live    - Follow log in real-time"
    echo "  list    - List all log files"
fi