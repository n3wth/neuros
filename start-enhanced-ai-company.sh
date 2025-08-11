#!/bin/bash

# Enhanced Neuros AI Company - Production-Ready Self-Improving System
# KISS Principle: Each component does one thing exceptionally well

echo "🧠 Enhanced Neuros AI Company - Production System"
echo "================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Configuration
AI_SYSTEMS_DIR="$(pwd)"
LOG_DIR="$AI_SYSTEMS_DIR/logs"
HEALTH_CHECK_INTERVAL=30
SYSTEM_COMPONENTS=(
    "ai-quality-monitor"
    "enhanced-learning-optimizer" 
    "enhanced-deployment-manager"
    "ai-security-hardening"
    "ai-system-health-monitor"
)

# System state tracking
declare -A SYSTEM_PIDS
declare -A SYSTEM_STATUS
declare -A SYSTEM_START_TIMES

# Logging setup
setup_logging() {
    mkdir -p "$LOG_DIR"
    
    # Setup log rotation
    if command -v logrotate &> /dev/null; then
        cat > "$LOG_DIR/logrotate.conf" << EOF
$LOG_DIR/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 $(whoami) $(id -gn)
}
EOF
    fi
}

# Enhanced requirement checking
check_enhanced_requirements() {
    echo -e "${BLUE}✓ Checking enhanced requirements...${NC}"
    
    local requirements_met=true
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        local node_version=$(node --version | sed 's/v//')
        local required_version="18.0.0"
        
        if [[ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" == "$required_version" ]]; then
            echo -e "${GREEN}  ✓ Node.js $node_version${NC}"
        else
            echo -e "${RED}  ❌ Node.js $node_version (requires >= $required_version)${NC}"
            requirements_met=false
        fi
    else
        echo -e "${RED}  ❌ Node.js not found${NC}"
        requirements_met=false
    fi
    
    # Check Python version
    if command -v python3 &> /dev/null; then
        local python_version=$(python3 --version | cut -d' ' -f2)
        echo -e "${GREEN}  ✓ Python $python_version${NC}"
        
        # Check required Python packages
        if python3 -c "import asyncio, sqlite3, json" 2>/dev/null; then
            echo -e "${GREEN}  ✓ Python dependencies${NC}"
        else
            echo -e "${YELLOW}  ⚠ Some Python dependencies missing${NC}"
        fi
    else
        echo -e "${RED}  ❌ Python 3 not found${NC}"
        requirements_met=false
    fi
    
    # Check TypeScript/TSX
    if command -v npx &> /dev/null && npx tsx --version &> /dev/null; then
        echo -e "${GREEN}  ✓ TSX runtime${NC}"
    else
        echo -e "${YELLOW}  ⚠ Installing tsx...${NC}"
        npm install -g tsx 2>/dev/null || echo -e "${RED}  ❌ Failed to install tsx${NC}"
    fi
    
    # Check OpenAI key
    if [ -n "$OPENAI_API_KEY" ]; then
        echo -e "${GREEN}  ✓ OpenAI API key configured${NC}"
    else
        echo -e "${YELLOW}  ⚠ Warning: OPENAI_API_KEY not set - AI features limited${NC}"
    fi
    
    # Check disk space
    local available_space=$(df . | tail -1 | awk '{print $4}')
    if [ "$available_space" -gt 1000000 ]; then # 1GB
        echo -e "${GREEN}  ✓ Sufficient disk space${NC}"
    else
        echo -e "${YELLOW}  ⚠ Low disk space (${available_space}KB available)${NC}"
    fi
    
    # Check system resources
    if command -v free &> /dev/null; then
        local available_ram=$(free -m | awk 'NR==2{print $7}')
        if [ "$available_ram" -gt 500 ]; then
            echo -e "${GREEN}  ✓ Sufficient RAM (${available_ram}MB available)${NC}"
        else
            echo -e "${YELLOW}  ⚠ Low RAM (${available_ram}MB available)${NC}"
        fi
    fi
    
    if [ "$requirements_met" = false ]; then
        echo -e "${RED}❌ Requirements not met. Please fix the above issues.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All requirements met${NC}"
}

# Start individual system component
start_system_component() {
    local component=$1
    local log_file="$LOG_DIR/${component}.log"
    
    echo -e "${BLUE}🚀 Starting ${component}...${NC}"
    
    case $component in
        "ai-quality-monitor")
            node scripts/ai-quality-monitor.js > "$log_file" 2>&1 &
            ;;
        "enhanced-learning-optimizer")
            python3 scripts/enhanced-learning-optimizer.py --continuous > "$log_file" 2>&1 &
            ;;
        "enhanced-deployment-manager")
            npx tsx scripts/enhanced-deployment-manager.ts --continuous > "$log_file" 2>&1 &
            ;;
        "ai-security-hardening")
            # Security hardening runs periodically, not continuously
            (while true; do
                npx tsx scripts/ai-security-hardening.ts >> "$log_file" 2>&1
                sleep 3600 # Run every hour
            done) &
            ;;
        "ai-system-health-monitor")
            npx tsx scripts/ai-system-health-monitor.ts > "$log_file" 2>&1 &
            ;;
        *)
            echo -e "${RED}❌ Unknown component: $component${NC}"
            return 1
            ;;
    esac
    
    local pid=$!
    SYSTEM_PIDS[$component]=$pid
    SYSTEM_STATUS[$component]="starting"
    SYSTEM_START_TIMES[$component]=$(date +%s)
    
    # Wait a moment and check if process is still running
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        SYSTEM_STATUS[$component]="running"
        echo -e "${GREEN}✓ ${component} started (PID: $pid)${NC}"
        return 0
    else
        SYSTEM_STATUS[$component]="failed"
        echo -e "${RED}❌ ${component} failed to start${NC}"
        return 1
    fi
}

# Stop system component
stop_system_component() {
    local component=$1
    local pid=${SYSTEM_PIDS[$component]}
    
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        echo -e "${YELLOW}🛑 Stopping ${component} (PID: $pid)...${NC}"
        
        # Try graceful shutdown first
        kill -TERM "$pid" 2>/dev/null
        
        # Wait up to 10 seconds for graceful shutdown
        local count=0
        while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${RED}Force killing ${component}...${NC}"
            kill -KILL "$pid" 2>/dev/null
        fi
        
        SYSTEM_STATUS[$component]="stopped"
        unset SYSTEM_PIDS[$component]
        echo -e "${GREEN}✓ ${component} stopped${NC}"
    else
        echo -e "${YELLOW}${component} was not running${NC}"
    fi
}

# Health check for all components
perform_health_check() {
    local healthy_count=0
    local total_components=${#SYSTEM_COMPONENTS[@]}
    
    for component in "${SYSTEM_COMPONENTS[@]}"; do
        local pid=${SYSTEM_PIDS[$component]}
        
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            SYSTEM_STATUS[$component]="running"
            healthy_count=$((healthy_count + 1))
        else
            SYSTEM_STATUS[$component]="failed"
            echo -e "${RED}⚠ ${component} appears to have crashed${NC}"
            
            # Attempt restart
            echo -e "${YELLOW}🔄 Attempting to restart ${component}...${NC}"
            start_system_component "$component"
        fi
    done
    
    # Update overall system health
    if [ $healthy_count -eq $total_components ]; then
        OVERALL_HEALTH="healthy"
    elif [ $healthy_count -gt $((total_components / 2)) ]; then
        OVERALL_HEALTH="degraded"
    else
        OVERALL_HEALTH="critical"
    fi
}

# Enhanced status display
show_enhanced_status() {
    clear
    echo -e "${WHITE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${WHITE}║${CYAN}              Enhanced Neuros AI Company Status              ${WHITE}║${NC}"
    echo -e "${WHITE}╚══════════════════════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${WHITE}📊 System Overview${NC}"
    echo -e "├─ Overall Health: $(get_health_indicator $OVERALL_HEALTH) ${OVERALL_HEALTH^^}"
    echo -e "├─ Uptime: $(get_system_uptime)"
    echo -e "├─ Active Components: $(count_active_components)/${#SYSTEM_COMPONENTS[@]}"
    echo -e "└─ Last Check: $(date '+%H:%M:%S')"
    
    echo -e "\n${WHITE}🔧 AI System Components${NC}"
    
    for component in "${SYSTEM_COMPONENTS[@]}"; do
        local status=${SYSTEM_STATUS[$component]:-"unknown"}
        local pid=${SYSTEM_PIDS[$component]:-"N/A"}
        local start_time=${SYSTEM_START_TIMES[$component]}
        local uptime=""
        
        if [ -n "$start_time" ]; then
            local current_time=$(date +%s)
            local diff=$((current_time - start_time))
            uptime=$(format_duration $diff)
        fi
        
        local status_indicator=$(get_status_indicator "$status")
        local memory_usage=$(get_process_memory "$pid" 2>/dev/null || echo "N/A")
        
        echo -e "├─ ${status_indicator} ${component}"
        echo -e "│  ├─ Status: ${status^^}"
        echo -e "│  ├─ PID: ${pid}"
        echo -e "│  ├─ Uptime: ${uptime:-"N/A"}"
        echo -e "│  └─ Memory: ${memory_usage}"
    done
    
    # Show recent metrics if available
    show_system_metrics
    
    # Show recent alerts
    show_recent_alerts
    
    echo -e "\n${WHITE}⚡ Quick Commands${NC}"
    echo -e "├─ [R]estart component    ├─ [V]iew logs"
    echo -e "├─ [S]ecurity scan        ├─ [D]eployment check"  
    echo -e "├─ [H]ealth report        └─ [Q]uit"
    echo -e ""
    echo -e "${PURPLE}Press Ctrl+C to stop all systems${NC}"
}

# Get health indicator emoji/color
get_health_indicator() {
    case $1 in
        "healthy") echo -e "${GREEN}●${NC}" ;;
        "degraded") echo -e "${YELLOW}●${NC}" ;;
        "critical") echo -e "${RED}●${NC}" ;;
        *) echo -e "${WHITE}●${NC}" ;;
    esac
}

# Get status indicator
get_status_indicator() {
    case $1 in
        "running") echo -e "${GREEN}●${NC}" ;;
        "starting") echo -e "${YELLOW}●${NC}" ;;
        "failed") echo -e "${RED}●${NC}" ;;
        "stopped") echo -e "${WHITE}●${NC}" ;;
        *) echo -e "${WHITE}●${NC}" ;;
    esac
}

# Format duration in human readable format
format_duration() {
    local seconds=$1
    local days=$((seconds / 86400))
    local hours=$(((seconds % 86400) / 3600))
    local minutes=$(((seconds % 3600) / 60))
    local secs=$((seconds % 60))
    
    if [ $days -gt 0 ]; then
        echo "${days}d ${hours}h ${minutes}m"
    elif [ $hours -gt 0 ]; then
        echo "${hours}h ${minutes}m"
    elif [ $minutes -gt 0 ]; then
        echo "${minutes}m ${secs}s"
    else
        echo "${secs}s"
    fi
}

# Get system uptime
get_system_uptime() {
    local oldest_start=999999999999
    
    for start_time in "${SYSTEM_START_TIMES[@]}"; do
        if [ "$start_time" -lt "$oldest_start" ]; then
            oldest_start=$start_time
        fi
    done
    
    if [ "$oldest_start" != "999999999999" ]; then
        local current_time=$(date +%s)
        local diff=$((current_time - oldest_start))
        format_duration $diff
    else
        echo "N/A"
    fi
}

# Count active components
count_active_components() {
    local count=0
    for status in "${SYSTEM_STATUS[@]}"; do
        if [ "$status" = "running" ]; then
            count=$((count + 1))
        fi
    done
    echo $count
}

# Get process memory usage
get_process_memory() {
    local pid=$1
    if [ -n "$pid" ] && [ "$pid" != "N/A" ] && kill -0 "$pid" 2>/dev/null; then
        if command -v ps &> /dev/null; then
            ps -o rss= -p "$pid" 2>/dev/null | awk '{print int($1/1024)"MB"}' || echo "N/A"
        else
            echo "N/A"
        fi
    else
        echo "N/A"
    fi
}

# Show system metrics from reports
show_system_metrics() {
    echo -e "\n${WHITE}📈 Recent Metrics${NC}"
    
    # Quality metrics
    if [ -f "quality-report.json" ]; then
        local avg_complexity=$(jq -r '.summary.averageComplexity // "N/A"' quality-report.json 2>/dev/null)
        local test_coverage=$(jq -r '.summary.testCoverage // "N/A"' quality-report.json 2>/dev/null)
        echo -e "├─ Code Quality: ${avg_complexity} complexity, ${test_coverage} coverage"
    fi
    
    # Performance metrics
    if [ -f "optimization-report.json" ]; then
        local perf_score=$(jq -r '.metrics.lighthouse_score.average // "N/A"' optimization-report.json 2>/dev/null)
        echo -e "├─ Performance: ${perf_score} Lighthouse score"
    fi
    
    # Security metrics
    if [ -f "security-scan-results.json" ]; then
        local risk_level=$(jq -r '.overallRisk // "N/A"' security-scan-results.json 2>/dev/null)
        local vuln_count=$(jq -r '.totalVulnerabilities // "N/A"' security-scan-results.json 2>/dev/null)
        echo -e "├─ Security: ${risk_level^^} risk, ${vuln_count} vulnerabilities"
    fi
}

# Show recent alerts
show_recent_alerts() {
    if [ -f "ai-system-telemetry.json" ]; then
        local alerts=$(jq -r '.recentAlerts[]? // empty' ai-system-telemetry.json 2>/dev/null | head -3)
        if [ -n "$alerts" ]; then
            echo -e "\n${WHITE}🚨 Recent Alerts${NC}"
            echo "$alerts" | while read -r alert; do
                echo -e "├─ ${alert}"
            done
        fi
    fi
}

# Interactive mode for system management
interactive_mode() {
    echo -e "${CYAN}🎮 Entering interactive mode...${NC}"
    echo -e "${WHITE}Available commands: restart, logs, security, deploy, health, quit${NC}"
    
    while true; do
        read -p "ai-company> " command
        
        case $command in
            "restart"|"r")
                echo "Which component to restart? (or 'all')"
                select component in "${SYSTEM_COMPONENTS[@]}" "all" "cancel"; do
                    case $component in
                        "all")
                            restart_all_systems
                            break
                            ;;
                        "cancel")
                            break
                            ;;
                        *)
                            if [[ " ${SYSTEM_COMPONENTS[@]} " =~ " ${component} " ]]; then
                                stop_system_component "$component"
                                start_system_component "$component"
                            fi
                            break
                            ;;
                    esac
                done
                ;;
            "logs"|"l")
                echo "Which component's logs to view?"
                select component in "${SYSTEM_COMPONENTS[@]}" "cancel"; do
                    case $component in
                        "cancel")
                            break
                            ;;
                        *)
                            if [[ " ${SYSTEM_COMPONENTS[@]} " =~ " ${component} " ]]; then
                                echo -e "${BLUE}Showing last 50 lines of ${component} logs:${NC}"
                                tail -50 "$LOG_DIR/${component}.log" 2>/dev/null || echo "No logs found"
                                echo -e "${WHITE}Press Enter to continue...${NC}"
                                read
                            fi
                            break
                            ;;
                    esac
                done
                ;;
            "security"|"s")
                echo -e "${YELLOW}🛡️ Running security scan...${NC}"
                npx tsx scripts/ai-security-hardening.ts
                echo -e "${WHITE}Press Enter to continue...${NC}"
                read
                ;;
            "deploy"|"d")
                echo -e "${BLUE}🚀 Checking deployment readiness...${NC}"
                npx tsx scripts/enhanced-deployment-manager.ts --predict
                echo -e "${WHITE}Press Enter to continue...${NC}"
                read
                ;;
            "health"|"h")
                echo -e "${GREEN}🏥 Generating health report...${NC}"
                npx tsx scripts/ai-system-health-monitor.ts --report
                echo -e "${WHITE}Press Enter to continue...${NC}"
                read
                ;;
            "quit"|"q"|"exit")
                break
                ;;
            "help"|"?")
                echo -e "${WHITE}Available commands:${NC}"
                echo -e "  restart, r - Restart system components"
                echo -e "  logs, l    - View component logs"
                echo -e "  security, s - Run security scan"
                echo -e "  deploy, d  - Check deployment readiness"
                echo -e "  health, h  - Generate health report"
                echo -e "  quit, q    - Exit interactive mode"
                ;;
            *)
                echo -e "${RED}Unknown command: $command${NC}"
                echo -e "Type 'help' for available commands"
                ;;
        esac
    done
}

# Restart all systems
restart_all_systems() {
    echo -e "${YELLOW}🔄 Restarting all systems...${NC}"
    
    # Stop all systems
    for component in "${SYSTEM_COMPONENTS[@]}"; do
        stop_system_component "$component"
    done
    
    sleep 3
    
    # Start all systems
    for component in "${SYSTEM_COMPONENTS[@]}"; do
        start_system_component "$component"
        sleep 1
    done
}

# Cleanup and shutdown
cleanup_and_shutdown() {
    echo -e "\n${YELLOW}🛑 Shutting down Enhanced AI Company...${NC}"
    
    # Stop all system components
    for component in "${SYSTEM_COMPONENTS[@]}"; do
        stop_system_component "$component"
    done
    
    # Wait for all processes to stop
    sleep 2
    
    # Final cleanup
    echo -e "${GREEN}✓ All systems stopped cleanly${NC}"
    
    # Generate shutdown report
    echo -e "${BLUE}📊 Generating shutdown report...${NC}"
    {
        echo "# Enhanced AI Company Shutdown Report"
        echo "Generated: $(date)"
        echo ""
        echo "## System Statistics"
        echo "- Total Uptime: $(get_system_uptime)"
        echo "- Components Managed: ${#SYSTEM_COMPONENTS[@]}"
        echo "- Final Health Status: $OVERALL_HEALTH"
        echo ""
        echo "## Component Final Status"
        for component in "${SYSTEM_COMPONENTS[@]}"; do
            echo "- $component: ${SYSTEM_STATUS[$component]:-unknown}"
        done
    } > "shutdown-report-$(date +%Y%m%d-%H%M%S).md"
    
    exit 0
}

# Signal handlers
trap cleanup_and_shutdown SIGINT SIGTERM

# Main execution
main() {
    setup_logging
    check_enhanced_requirements
    
    echo -e "\n${GREEN}🚀 Starting Enhanced AI Company Systems...${NC}"
    
    # Start all system components
    local failed_components=0
    for component in "${SYSTEM_COMPONENTS[@]}"; do
        if ! start_system_component "$component"; then
            failed_components=$((failed_components + 1))
        fi
        sleep 2  # Stagger startups
    done
    
    if [ $failed_components -gt 0 ]; then
        echo -e "${YELLOW}⚠ Warning: $failed_components components failed to start${NC}"
        echo -e "${WHITE}System will continue with available components${NC}"
    else
        echo -e "${GREEN}✅ All systems started successfully!${NC}"
    fi
    
    # Initial health check
    perform_health_check
    
    echo -e "\n${WHITE}Enhanced AI Company is now operational!${NC}"
    echo -e "${CYAN}View the status dashboard or enter interactive mode${NC}"
    
    # Check if user wants interactive mode
    if [[ "$*" == *"--interactive"* ]]; then
        interactive_mode
    else
        # Main monitoring loop
        while true; do
            show_enhanced_status
            
            # Health check every interval
            perform_health_check
            
            sleep $HEALTH_CHECK_INTERVAL
        done
    fi
}

# Run main function if script is executed directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi