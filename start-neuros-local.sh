#!/bin/bash

# Start script for neuros.local with port 80

echo "╔═══════════════════════════════════════════════════╗"
echo "║         Starting neuros.local on port 80         ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Check if neuros.local is in hosts file
if ! grep -q "neuros.local" /etc/hosts; then
    echo "⚠️  neuros.local not found in /etc/hosts"
    echo ""
    echo "Adding it now (requires sudo password)..."
    echo "127.0.0.1       neuros.local" | sudo tee -a /etc/hosts > /dev/null
    echo "✅ Added neuros.local to /etc/hosts"
    echo ""
fi

# Kill any existing processes on port 3001 and 80
echo "Checking for existing processes..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "Found process on port 3001, stopping it..."
    kill $(lsof -t -i:3001) 2>/dev/null
    sleep 1
fi

if lsof -i :80 > /dev/null 2>&1; then
    echo "Found process on port 80, stopping it..."
    sudo kill $(lsof -t -i:80) 2>/dev/null
    sleep 1
fi

# Start the Next.js dev server in background
echo "Starting Next.js development server on port 3001..."
npm run dev:local &
DEV_PID=$!

# Wait for dev server to start
echo "Waiting for dev server to start..."
sleep 5

# Check if dev server is running
if ! lsof -i :3001 > /dev/null 2>&1; then
    echo "❌ Failed to start dev server"
    exit 1
fi

echo "✅ Dev server running on port 3001"
echo ""

# Start the proxy server
echo "Starting proxy server (requires sudo password)..."
echo "This will forward port 80 to port 3001"
echo ""
sudo node proxy-80.js

# Cleanup on exit
trap "kill $DEV_PID 2>/dev/null" EXIT