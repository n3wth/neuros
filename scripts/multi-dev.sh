#!/bin/bash

# Multi-instance development server launcher
# Usage: ./scripts/multi-dev.sh [instance_number]

INSTANCE=${1:-1}
BASE_PORT=3000
PORT=$((BASE_PORT + INSTANCE - 1))

echo "🚀 Starting development server instance $INSTANCE on port $PORT"

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port $PORT is already in use"
    echo "💡 Try: ./scripts/multi-dev.sh $((INSTANCE + 1))"
    exit 1
fi

# Set unique port and start server
PORT=$PORT npm run dev