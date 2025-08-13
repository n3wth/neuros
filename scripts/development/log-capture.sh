#!/bin/bash

# Log Capture Script for Claude Code Integration
# Captures terminal output and saves to timestamped log files that Claude can read

LOG_DIR="/Users/oliver/gh/neuros/logs"
PROJECT_NAME="neuros"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to run command with logging
run_with_logging() {
    local cmd="$1"
    local log_file="$LOG_DIR/${PROJECT_NAME}_${TIMESTAMP}.log"
    
    echo "=== Starting $PROJECT_NAME at $(date) ===" | tee "$log_file"
    echo "Command: $cmd" | tee -a "$log_file"
    echo "Log file: $log_file" | tee -a "$log_file"
    echo "==========================================" | tee -a "$log_file"
    echo ""
    
    # Run the command and capture both stdout and stderr
    eval "$cmd" 2>&1 | tee -a "$log_file"
    
    echo "" | tee -a "$log_file"
    echo "=== Session ended at $(date) ===" | tee -a "$log_file"
    
    # Create symlink to latest log for easy access
    ln -sf "$log_file" "$LOG_DIR/latest.log"
    
    echo "📋 Log saved to: $log_file"
    echo "🔗 Latest log accessible at: $LOG_DIR/latest.log"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Examples:"
    echo "  $0 'npm run dev'              # Capture npm dev server logs"
    echo "  $0 'npm run build'            # Capture build logs"  
    echo "  $0 'npm run test:e2e'         # Capture test logs"
    echo "  $0                            # Show recent logs"
    echo ""
    echo "Log files are saved to: $LOG_DIR"
    echo "Latest log is always at: $LOG_DIR/latest.log"
}

# Main logic
if [ $# -eq 0 ]; then
    # No arguments - show recent logs
    if [ -f "$LOG_DIR/latest.log" ]; then
        echo "📋 Showing latest log file:"
        echo "File: $(readlink $LOG_DIR/latest.log)"
        echo ""
        tail -50 "$LOG_DIR/latest.log"
        echo ""
        echo "💡 To see full log: cat $LOG_DIR/latest.log"
        echo "💡 To follow live: tail -f $LOG_DIR/latest.log"
    else
        echo "No log files found. Run a command first:"
        show_usage
    fi
elif [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_usage
else
    # Run command with logging
    run_with_logging "$*"
fi