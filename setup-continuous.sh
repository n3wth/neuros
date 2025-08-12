#!/bin/bash

# Setup Continuous Autonomous Development

echo "🔄 Setting up Continuous Improvement System"
echo "==========================================="

# Option 1: GitHub Actions (Already configured)
echo ""
echo "1️⃣ GitHub Actions (RECOMMENDED)"
echo "   ✅ Already configured in .github/workflows/ai-development.yml"
echo "   📅 Runs every 6 hours automatically"
echo "   🔗 View at: https://github.com/olivernewth/neuros/actions"

# Option 2: Local Cron Job
echo ""
echo "2️⃣ Local Cron Job (Alternative)"
echo "   To set up a local cron job that runs every 6 hours:"
echo ""
echo "   Run: crontab -e"
echo "   Add: 0 */6 * * * cd $PWD && /usr/bin/python3 ai-improve-simple.py >> ai-improve.log 2>&1"

# Option 3: Server Deployment
echo ""
echo "3️⃣ Server Deployment (Advanced)"
echo "   Deploy to your SSH Docker server for 24/7 operation"
echo ""

read -p "Which option would you like to activate? (1/2/3): " choice

case $choice in
    1)
        echo "✅ GitHub Actions is already active!"
        echo "Next run will happen automatically."
        echo "Monitor at: https://github.com/olivernewth/neuros/actions"
        ;;
    2)
        # Add to crontab
        (crontab -l 2>/dev/null; echo "0 */6 * * * cd $PWD && /usr/bin/python3 ai-improve-simple.py >> ai-improve.log 2>&1") | crontab -
        echo "✅ Cron job added! Will run every 6 hours."
        echo "Check logs at: $PWD/ai-improve.log"
        ;;
    3)
        echo "Deploying to server..."
        scp ai-improve-simple.py docker:~/neuros-autonomous/
        ssh docker "cd ~/neuros-autonomous && python3 ai-improve-simple.py"
        echo "✅ Deployed to server!"
        ;;
    *)
        echo "No changes made."
        ;;
esac

echo ""
echo "📊 Current Status:"
echo "  • GitHub Actions: Active (runs every 6 hours)"
echo "  • Local script: Ready (run with: python3 ai-improve-simple.py)"
echo "  • Monitor PRs: https://github.com/olivernewth/neuros/pulls"