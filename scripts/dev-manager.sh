#!/bin/bash

# Development Server Manager
# Manages multiple dev instances for Claude Code testing

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

function show_menu() {
    echo "================================================"
    echo "     Supa-Template Development Manager"
    echo "================================================"
    echo "1) Start main dev server (port 3000)"
    echo "2) Start test instance (auto-port)"
    echo "3) Start persistent tmux server"
    echo "4) Show running servers"
    echo "5) Kill all dev servers"
    echo "6) Start Docker Compose stack"
    echo "7) Stop Docker Compose stack"
    echo "q) Quit"
    echo "================================================"
}

function find_next_port() {
    local port=3000
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        ((port++))
    done
    echo $port
}

function start_main_server() {
    echo "Starting main development server..."
    cd "$PROJECT_DIR"
    PORT=3000 npm run dev &
    echo "✅ Main server started on http://localhost:3000"
}

function start_test_instance() {
    local port=$(find_next_port)
    echo "Starting test instance on port $port..."
    cd "$PROJECT_DIR"
    PORT=$port npm run dev &
    echo "✅ Test instance started on http://localhost:$port"
}

function start_tmux_server() {
    "$SCRIPT_DIR/persistent-dev.sh"
}

function show_running_servers() {
    echo "Running Next.js servers:"
    lsof -i -P | grep LISTEN | grep node | grep '300[0-9]' || echo "No servers running"
}

function kill_all_servers() {
    echo "Stopping all development servers..."
    pkill -f "next dev" || true
    tmux kill-session -t supa-dev 2>/dev/null || true
    echo "✅ All servers stopped"
}

function start_docker_stack() {
    echo "Starting Docker Compose stack..."
    cd "$PROJECT_DIR"
    docker-compose -f docker-compose.dev.yml up -d
    echo "✅ Docker stack started"
    echo "   Main: http://localhost:3000"
    echo "   Test1: http://localhost:3001"
    echo "   Test2: http://localhost:3002"
}

function stop_docker_stack() {
    echo "Stopping Docker Compose stack..."
    cd "$PROJECT_DIR"
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Docker stack stopped"
}

# Main loop
while true; do
    show_menu
    read -p "Select option: " choice
    
    case $choice in
        1) start_main_server ;;
        2) start_test_instance ;;
        3) start_tmux_server ;;
        4) show_running_servers ;;
        5) kill_all_servers ;;
        6) start_docker_stack ;;
        7) stop_docker_stack ;;
        q) echo "Goodbye!"; exit 0 ;;
        *) echo "Invalid option" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done