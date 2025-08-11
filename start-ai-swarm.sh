#!/bin/bash

# AI Swarm Quick Start - Launch the compound intelligence system
# This script sets up and runs the AI conductor for exponential productivity

set -e

echo "🚀 AI Worktree Swarm Initialization"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   Install: brew install gh"
    exit 1
fi

# Check if authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "   Run: gh auth login"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Prerequisites satisfied"
echo ""

# Initialize directories
echo "🏗️  Setting up infrastructure..."
mkdir -p .worktrees
mkdir -p .ai-memory
mkdir -p .automation-templates

# Initialize AI memory if it doesn't exist
if [ ! -f .ai-memory/patterns.json ]; then
    cat > .ai-memory/patterns.json << 'EOF'
{
  "patterns": [],
  "automations": [],
  "fixes": [],
  "impact": {
    "direct": 0,
    "automated": 0,
    "prevented": 0
  }
}
EOF
    echo "   ✅ AI memory initialized"
fi

# Add to package.json scripts if not present
if ! grep -q "ai:conductor" package.json 2>/dev/null; then
    echo ""
    echo "📝 Adding AI scripts to package.json..."
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['ai:conductor'] = 'node ai-conductor.js';
    pkg.scripts['ai:swarm:deploy'] = 'node ai-conductor.js --deploy';
    pkg.scripts['ai:swarm:status'] = 'node ai-conductor.js --status';
    pkg.scripts['ai:swarm:cleanup'] = 'node ai-conductor.js --cleanup';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('   ✅ Scripts added');
    "
fi

echo ""
echo "🎯 Swarm Deployment Options:"
echo "----------------------------"
echo ""
echo "1. 🚀 Full Auto Mode - Continuous improvement loop"
echo "   Discovers issues, deploys agents, creates PRs automatically"
echo ""
echo "2. 🎮 Guided Mode - You review before PR creation"
echo "   Discovers and fixes issues, but waits for approval"
echo ""
echo "3. 🔍 Discovery Only - Find opportunities"
echo "   Scans for all improvement opportunities without fixing"
echo ""
echo "4. 📊 Status Report - View compound impact"
echo "   Shows current impact metrics and patterns learned"
echo ""

read -p "Select mode (1-4): " mode

case $mode in
    1)
        echo ""
        echo "🚀 LAUNCHING FULL AUTO MODE"
        echo "==========================="
        echo ""
        echo "The AI conductor will:"
        echo "  • Scan for all issues and opportunities"
        echo "  • Deploy parallel agents to fix them"
        echo "  • Create PRs automatically"
        echo "  • Learn patterns and create automations"
        echo "  • Run continuous improvement cycles"
        echo ""
        echo "⚠️  This will create multiple worktrees and PRs"
        read -p "Continue? (y/n): " confirm
        
        if [ "$confirm" = "y" ]; then
            echo ""
            echo "🧠 Starting AI Conductor..."
            echo ""
            node ai-conductor.js
        else
            echo "Cancelled."
        fi
        ;;
        
    2)
        echo ""
        echo "🎮 LAUNCHING GUIDED MODE"
        echo "======================="
        echo ""
        node ai-conductor.js --guided
        ;;
        
    3)
        echo ""
        echo "🔍 DISCOVERY MODE"
        echo "================="
        echo ""
        node -e "
        const Conductor = require('./ai-conductor.js');
        const conductor = new Conductor();
        (async () => {
            await conductor.initialize();
            const opportunities = await conductor.discoverOpportunities();
            console.log('\n📊 Discovery Report:');
            console.log('===================\n');
            
            const grouped = {};
            opportunities.forEach(op => {
                grouped[op.type] = (grouped[op.type] || 0) + 1;
            });
            
            Object.entries(grouped).forEach(([type, count]) => {
                console.log(\`  • \${type}: \${count} issues\`);
            });
            
            console.log(\`\nTotal opportunities: \${opportunities.length}\`);
            console.log('\nTop 5 priorities:');
            opportunities.slice(0, 5).forEach((op, i) => {
                console.log(\`  \${i + 1}. \${op.worktreeName} (priority: \${op.priority})\`);
            });
        })();
        "
        ;;
        
    4)
        echo ""
        echo "📊 COMPOUND IMPACT STATUS"
        echo "========================"
        echo ""
        
        if [ -f .ai-memory/patterns.json ]; then
            node -e "
            const fs = require('fs');
            const memory = JSON.parse(fs.readFileSync('.ai-memory/patterns.json', 'utf8'));
            
            console.log('Current Impact Metrics:');
            console.log('----------------------');
            console.log(\`  Direct fixes: \${memory.impact.direct}\`);
            console.log(\`  Automated fixes: \${memory.impact.automated}\`);
            console.log(\`  Prevented issues: \${memory.impact.prevented}\`);
            console.log(\`  Patterns learned: \${memory.patterns.length}\`);
            console.log(\`  Automations created: \${memory.automations.length}\`);
            
            const multiplier = Math.pow(1.1, memory.patterns.length);
            const automationBoost = memory.automations.length * 10;
            const total = Math.floor((memory.impact.direct + memory.impact.automated + memory.impact.prevented) * multiplier + automationBoost);
            
            console.log(\`\n  🚀 Total Compound Impact: \${total}x\`);
            
            if (memory.patterns.length > 0) {
                console.log('\n\nRecent Patterns Learned:');
                console.log('------------------------');
                memory.patterns.slice(-3).forEach(p => {
                    console.log(\`  • \${p.type}: \${p.description || 'Pattern discovered'}\`);
                });
            }
            
            if (memory.automations.length > 0) {
                console.log('\n\nActive Automations:');
                console.log('-------------------');
                memory.automations.slice(-3).forEach(a => {
                    console.log(\`  • \${a.type}: \${a.impactMultiplier}x multiplier\`);
                });
            }
            "
        else
            echo "No AI memory found. Run the conductor first."
        fi
        
        # Show worktree status
        echo ""
        echo "Active Worktrees:"
        echo "-----------------"
        git worktree list | grep -c ".worktrees" | xargs echo "  Total worktrees:"
        echo ""
        git worktree list | grep ".worktrees" | head -5 | while read line; do
            echo "  • $line"
        done
        ;;
        
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "💡 Tips:"
echo "  • Run mode 4 periodically to see compound impact growth"
echo "  • Check .ai-memory/patterns.json for learned patterns"
echo "  • Review .automation-templates/ for generated automations"
echo "  • Use 'git worktree list' to see all active worktrees"
echo ""