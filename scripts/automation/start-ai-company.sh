#!/bin/bash

# Neuros AI Company - Simple Self-Improving System
# KISS Principle: Each component does one thing well

echo "🧠 Neuros AI Company - Starting Self-Improving Systems"
echo "=========================================="

# Simple environment check
check_requirements() {
    echo "✓ Checking requirements..."
    
    # Check Node
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 not found"
        exit 1
    fi
    
    # Check OpenAI key
    if [ -z "$OPENAI_API_KEY" ]; then
        echo "⚠️ Warning: OPENAI_API_KEY not set - AI features disabled"
    fi
    
    echo "✓ All requirements met"
}

# Start quality monitoring (runs every hour)
start_quality_monitor() {
    echo "📊 Starting Quality Monitor..."
    
    # Run initial quality check
    node scripts/ai-quality-monitor.js &
    
    # Schedule hourly runs
    while true; do
        sleep 3600
        node scripts/ai-quality-monitor.js --fix
    done &
    
    echo "✓ Quality Monitor running (PID: $!)"
}

# Start performance optimizer (learns from usage)
start_optimizer() {
    echo "🎯 Starting Performance Optimizer..."
    
    python3 scripts/self-learning-optimizer.py --continuous &
    
    echo "✓ Optimizer running (PID: $!)"
}

# Start deployment manager (watches for changes)
start_deployment_manager() {
    echo "🚀 Starting Deployment Manager..."
    
    npx tsx scripts/ai-deployment-manager.ts --continuous &
    
    echo "✓ Deployment Manager running (PID: $!)"
}

# Simple status dashboard
show_status() {
    echo ""
    echo "📈 Current Status:"
    echo "-----------------"
    
    # Show latest metrics if available
    if [ -f "quality-report.json" ]; then
        echo "Quality Score: $(jq -r '.summary.averageComplexity' quality-report.json)"
        echo "Test Coverage: $(jq -r '.summary.testCoverage' quality-report.json)"
    fi
    
    if [ -f "optimization-report.json" ]; then
        echo "Performance: $(jq -r '.metrics.lighthouse_score.average' optimization-report.json)"
    fi
    
    echo ""
    echo "🔧 Active Systems:"
    echo "- Quality Monitor: Running"
    echo "- Performance Optimizer: Learning"
    echo "- Deployment Manager: Watching"
    echo ""
    echo "Press Ctrl+C to stop all systems"
}

# Clean shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down AI systems..."
    pkill -f "ai-quality-monitor"
    pkill -f "self-learning-optimizer"
    pkill -f "ai-deployment-manager"
    echo "✓ All systems stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Main execution
main() {
    check_requirements
    
    echo ""
    echo "🚀 Starting AI-powered systems..."
    echo ""
    
    start_quality_monitor
    start_optimizer
    start_deployment_manager
    
    # Show status and wait
    while true; do
        sleep 10
        clear
        show_status
    done
}

# Run if not sourced
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi