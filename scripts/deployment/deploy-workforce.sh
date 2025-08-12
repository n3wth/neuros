#!/bin/bash

# Deploy Parallel AI Workforce
# This script deploys multiple AI agents as "employees" working in parallel on GitHub issues

set -e

echo "🌐 NEUROS AI WORKFORCE DEPLOYMENT SYSTEM"
echo "=========================================="
echo ""
echo "👥 Available Workforce:"
echo "   👨‍💻 30 Software Engineers"
echo "   🎨 30 UI/UX Designers"
echo "   💼 10 Product Managers"
echo "   🧪 5 QA Engineers"
echo "   📊 5 Data Analysts"
echo "   = 80 Total Parallel Workers"
echo ""

# Function to deploy a specific employee type
deploy_employee() {
    local type=$1
    local issue=$2
    local id=$3
    
    echo "🚀 Deploying $type #$id to Issue #$issue..."
    
    # Create worktree for this employee
    local type_lower=$(echo "$type" | tr '[:upper:]' '[:lower:]')
    local worktree_name="${type_lower}-${id}-issue-${issue}"
    local worktree_path=".worktrees/$worktree_name"
    
    if [ ! -d "$worktree_path" ]; then
        git worktree add "$worktree_path" -b "fix-${issue}-${type_lower}-${id}" 2>/dev/null || true
        echo "   ✅ $type #$id deployed to $worktree_path"
    else
        echo "   ⚠️  $type #$id already deployed"
    fi
}

# Function to deploy multiple employees in parallel
deploy_parallel_batch() {
    local employee_type=$1
    shift
    local issues=("$@")
    
    echo ""
    echo "📦 Deploying batch of ${employee_type}s..."
    
    local id=1
    for issue in "${issues[@]}"; do
        deploy_employee "$employee_type" "$issue" "$id" &
        ((id++))
        
        # Limit parallel deployments to avoid overwhelming the system
        if (( id % 5 == 0 )); then
            wait
        fi
    done
    
    wait
    echo "✅ Batch deployment complete"
}

# Main deployment logic
case "${1:-full}" in
    engineers)
        echo "👨‍💻 Deploying Software Engineers..."
        deploy_parallel_batch "Engineer" 7 5 14
        ;;
    
    designers)
        echo "🎨 Deploying UI/UX Designers..."
        deploy_parallel_batch "Designer" 23 22 21 20 19 18 14
        ;;
    
    pms)
        echo "💼 Deploying Product Managers..."
        deploy_parallel_batch "PM" 21 20
        ;;
    
    bugs)
        echo "🐛 Deploying Bug Squad (Engineers + QA)..."
        deploy_parallel_batch "Engineer" 7 5
        deploy_parallel_batch "QA" 7 5
        ;;
    
    full)
        echo "🌍 FULL WORKFORCE DEPLOYMENT"
        echo "================================"
        
        # Deploy specialized teams for each issue type
        echo ""
        echo "Phase 1: Critical Bugs"
        deploy_parallel_batch "Engineer" 7 5
        
        echo ""
        echo "Phase 2: Design & UX Issues"
        deploy_parallel_batch "Designer" 23 22 21 20 19 18 14
        
        echo ""
        echo "Phase 3: Performance & Optimization"
        deploy_parallel_batch "Engineer" 22
        
        echo ""
        echo "Phase 4: Content & Documentation"
        deploy_parallel_batch "PM" 21 20
        
        echo ""
        echo "🎉 DEPLOYMENT COMPLETE!"
        echo "Active Worktrees:"
        git worktree list | grep -c ".worktrees" || echo "0"
        ;;
    
    status)
        echo "📊 WORKFORCE STATUS"
        echo "=================="
        echo ""
        echo "Active Worktrees:"
        git worktree list | grep ".worktrees" | while read -r line; do
            worktree=$(echo "$line" | awk '{print $1}')
            branch=$(echo "$line" | awk '{print $3}' | tr -d '[]')
            echo "   👤 $branch"
        done
        
        echo ""
        echo "Total Active Employees: $(git worktree list | grep -c ".worktrees" || echo "0")"
        ;;
    
    cleanup)
        echo "🧹 Cleaning up worktrees..."
        git worktree list | grep ".worktrees" | awk '{print $1}' | while read -r worktree; do
            echo "   Removing $worktree"
            git worktree remove "$worktree" --force 2>/dev/null || true
        done
        echo "✅ Cleanup complete"
        ;;
    
    *)
        echo "Usage: $0 [full|engineers|designers|pms|bugs|status|cleanup]"
        echo ""
        echo "Commands:"
        echo "  full      - Deploy entire workforce (default)"
        echo "  engineers - Deploy software engineers only"
        echo "  designers - Deploy UI/UX designers only"
        echo "  pms       - Deploy product managers only"
        echo "  bugs      - Deploy bug squad (engineers + QA)"
        echo "  status    - Show workforce status"
        echo "  cleanup   - Remove all worktrees"
        exit 1
        ;;
esac

echo ""
echo "📝 Next Steps:"
echo "   1. Each employee (worktree) can work independently"
echo "   2. Run 'node ai-conductor-enhanced.js' for AI-powered automation"
echo "   3. Use './deploy-workforce.sh status' to monitor progress"
echo "   4. PRs will be created as employees complete their work"