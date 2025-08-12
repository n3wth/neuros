#!/bin/bash

# Deploy Autonomous AI Development System
# Modern, lightweight approach using CrewAI

set -e

echo "🚀 Deploying Neuros Autonomous Development System"
echo "=================================================="

# Configuration
REMOTE_HOST="docker"
REMOTE_DIR="~/neuros-autonomous"

# Check for API keys
if [ -z "$ANTHROPIC_API_KEY" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Missing required API keys"
    echo "Using keys from .env.final..."
    source .env.final
fi

echo "📦 Preparing deployment package..."

# Create deployment directory
mkdir -p deploy-package
cp -r ai-crew deploy-package/
cp .env.final deploy-package/ai-crew/.env

# Create systemd service file
cat > deploy-package/neuros-ai.service << 'EOF'
[Unit]
Description=Neuros AI Autonomous Development
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/neuros-autonomous/ai-crew
Environment="OPENAI_API_KEY=${OPENAI_API_KEY}"
Environment="ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}"
Environment="GITHUB_TOKEN=${GITHUB_TOKEN}"
ExecStart=/bin/bash run.sh
Restart=always
RestartSec=3600

[Install]
WantedBy=multi-user.target
EOF

echo "📤 Copying files to server..."
ssh $REMOTE_HOST "mkdir -p $REMOTE_DIR"
scp -r deploy-package/* $REMOTE_HOST:$REMOTE_DIR/

echo "🔧 Setting up on server..."
ssh $REMOTE_HOST << 'REMOTE_SCRIPT'
cd ~/neuros-autonomous

# Make scripts executable
chmod +x ai-crew/run.sh

# Setup Python environment
cd ai-crew
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Load environment variables
set -a
source .env
set +a

# Test the crew
echo "🧪 Testing crew setup..."
python -c "from crew import NeurosDevCrew; print('✅ Crew imports successfully')"

echo "✅ Setup complete!"
echo ""
echo "To run the autonomous system:"
echo "  1. Manual: cd ~/neuros-autonomous/ai-crew && ./run.sh"
echo "  2. Service: sudo systemctl enable --now neuros-ai"
echo ""
echo "To monitor:"
echo "  - Logs: journalctl -u neuros-ai -f"
echo "  - GitHub: Check for AI-created pull requests"
REMOTE_SCRIPT

# Cleanup
rm -rf deploy-package

echo ""
echo "✅ Deployment complete!"
echo ""
echo "The AI crew will:"
echo "  • Analyze your codebase every 6 hours"
echo "  • Fix bugs and improve code quality"
echo "  • Create pull requests for review"
echo "  • Run tests before committing"
echo ""
echo "Monitor progress at: https://github.com/olivernewth/neuros/pulls"