#!/bin/bash

# Parallel Development Helper Script
# This script helps run multiple instances of the Neuros project on different ports

print_usage() {
  echo "Usage: ./scripts/parallel-dev.sh [instance-number]"
  echo "  instance-number: 1, 2, 3, etc. (determines the port)"
  echo ""
  echo "Examples:"
  echo "  ./scripts/parallel-dev.sh 1    # Runs on port 3001"
  echo "  ./scripts/parallel-dev.sh 2    # Runs on port 3002"
  echo ""
  echo "Available worktrees:"
  git worktree list
}

if [ -z "$1" ]; then
  print_usage
  exit 1
fi

INSTANCE=$1
PORT=$((3000 + $INSTANCE))
SUPABASE_PORT=$((54321 + $INSTANCE * 10))

echo "Starting instance $INSTANCE on port $PORT"
echo "Supabase will use port $SUPABASE_PORT"
echo "----------------------------------------"

# Export environment variables for this instance
export PORT=$PORT
export NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:$SUPABASE_PORT"

# Check if we're in a worktree or main repo
CURRENT_DIR=$(pwd)
if [[ $CURRENT_DIR == *"neuros-worktrees"* ]]; then
  echo "Running from worktree: $CURRENT_DIR"
else
  echo "Running from main repository"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting Next.js on port $PORT..."
npm run dev -- --port $PORT