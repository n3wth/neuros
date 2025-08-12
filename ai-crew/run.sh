#!/bin/bash

# Autonomous Development Runner for Neuros
# This script sets up and runs the AI crew continuously

set -e

echo "🚀 Neuros Autonomous Development System"
echo "======================================="

# Check for required environment variables
if [ -z "$OPENAI_API_KEY" ] || [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ Error: Missing API keys"
    echo "Please set OPENAI_API_KEY and ANTHROPIC_API_KEY environment variables"
    exit 1
fi

# Setup Python environment
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

# Run the crew
while true; do
    echo ""
    echo "🤖 Starting development cycle at $(date)"
    echo "----------------------------------------"
    
    # Run the crew
    python crew.py
    
    # Wait 6 hours before next run
    echo "😴 Sleeping for 6 hours until next cycle..."
    sleep 21600
done