#!/bin/bash

echo "This script will add neuros.local to your /etc/hosts file"
echo "You'll need to enter your password when prompted."
echo ""
echo "Running: sudo sh -c 'echo \"127.0.0.1       neuros.local\" >> /etc/hosts'"
echo ""

sudo sh -c 'echo "127.0.0.1       neuros.local" >> /etc/hosts'

if [ $? -eq 0 ]; then
    echo "✅ Successfully added neuros.local to /etc/hosts"
    echo ""
    echo "You can now access the site at:"
    echo "  - http://neuros.local:3001 (current setup)"
    echo "  - http://neuros.local (if using port 80 proxy)"
else
    echo "❌ Failed to add entry. Please run manually:"
    echo "sudo sh -c 'echo \"127.0.0.1       neuros.local\" >> /etc/hosts'"
fi