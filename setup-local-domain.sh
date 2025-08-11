#!/bin/bash

# Setup script for neuros.local domain

echo "Setting up neuros.local domain..."

# Check if neuros.local already exists in /etc/hosts
if grep -q "neuros.local" /etc/hosts; then
    echo "✅ neuros.local is already configured in /etc/hosts"
else
    echo "Adding neuros.local to /etc/hosts..."
    echo "This requires sudo access. You'll be prompted for your password."
    echo "127.0.0.1       neuros.local" | sudo tee -a /etc/hosts
    echo "✅ Added neuros.local to /etc/hosts"
fi

echo ""
echo "To use neuros.local:"
echo "1. Run: npm run dev"
echo "2. Open: http://neuros.local:3001 in your browser"
echo ""
echo "Note: Your dev server is configured to run on port 3001"