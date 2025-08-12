#!/bin/bash

echo "Testing neuros.local setup..."
echo "=============================="
echo ""

# Test 1: Check hosts file
echo "1. Checking /etc/hosts file..."
if grep -q "neuros.local" /etc/hosts; then
    echo "   ✅ neuros.local found in /etc/hosts"
    grep "neuros.local" /etc/hosts | head -1
else
    echo "   ❌ neuros.local NOT found in /etc/hosts"
    echo "   Run: ./add-hosts-entry.sh"
fi
echo ""

# Test 2: Check dev server
echo "2. Checking dev server on port 3001..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "   ✅ Dev server is running on port 3001"
else
    echo "   ❌ Dev server is NOT running"
    echo "   Run: npm run dev:local"
fi
echo ""

# Test 3: Test localhost access
echo "3. Testing localhost:3001..."
if curl -I http://localhost:3001 2>/dev/null | grep -q "200 OK"; then
    echo "   ✅ localhost:3001 is responding"
else
    echo "   ❌ localhost:3001 is not responding"
fi
echo ""

# Test 4: Test neuros.local resolution
echo "4. Testing DNS resolution..."
if ping -c 1 neuros.local > /dev/null 2>&1; then
    echo "   ✅ neuros.local resolves to IP"
    ping -c 1 neuros.local | grep "64 bytes" | head -1
else
    echo "   ❌ neuros.local does not resolve"
    echo "   Add to /etc/hosts first"
fi
echo ""

# Test 5: Test neuros.local:3001
if grep -q "neuros.local" /etc/hosts; then
    echo "5. Testing neuros.local:3001..."
    if curl -I http://neuros.local:3001 2>/dev/null | grep -q "200 OK"; then
        echo "   ✅ neuros.local:3001 is working!"
        echo ""
        echo "   🎉 SUCCESS! You can access the site at:"
        echo "   http://neuros.local:3001"
    else
        echo "   ❌ neuros.local:3001 is not responding"
    fi
fi
echo ""

# Test 6: Check port 80
echo "6. Checking port 80..."
if lsof -i :80 > /dev/null 2>&1; then
    echo "   ✅ Port 80 has a service running"
    echo "   You can likely access: http://neuros.local"
else
    echo "   ℹ️  Port 80 is not in use"
    echo "   To use http://neuros.local (without port):"
    echo "   Run: npm run proxy:80 (requires sudo)"
fi