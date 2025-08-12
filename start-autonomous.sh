#!/bin/bash

# Start Autonomous Development System for Neuros
# This runs locally and creates PRs on GitHub

echo "🚀 Starting Neuros Autonomous Development System"
echo "================================================"

# Load API keys from .env.final
source .env.final
export OPENAI_API_KEY
export ANTHROPIC_API_KEY
export GITHUB_TOKEN

# Option 1: GitHub Actions (runs every 6 hours)
echo ""
echo "📅 GitHub Actions Autonomous System:"
echo "  Status: CONFIGURED ✅"
echo "  Schedule: Every 6 hours"
echo "  Location: .github/workflows/ai-development.yml"
echo "  Next run: Check https://github.com/olivernewth/neuros/actions"
echo ""

# Option 2: Local CrewAI (run now)
echo "🤖 Local CrewAI System:"
read -p "  Run local AI crew now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd ai-crew
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -q -r requirements.txt
    python crew.py
fi

echo ""
echo "✅ Autonomous System Status:"
echo "  • GitHub Actions will run automatically"
echo "  • Check for AI-created PRs at: https://github.com/olivernewth/neuros/pulls"
echo "  • Monitor progress at: https://github.com/olivernewth/neuros/actions"