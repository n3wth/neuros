#!/bin/bash

# Script to set up port forwarding from port 80 to 3001
# This allows accessing neuros.local without specifying a port

echo "Setting up port forwarding for neuros.local..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to add port forwarding rule
add_port_forward() {
    echo "Adding port forwarding rule (80 -> 3001)..."
    echo "This requires sudo access."
    
    # Add the port forwarding rule
    echo "rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 3001" | sudo pfctl -ef -
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Port forwarding enabled${NC}"
        echo ""
        echo "You can now access the site at: http://neuros.local"
        echo "(No port number needed!)"
    else
        echo -e "${RED}❌ Failed to set up port forwarding${NC}"
        exit 1
    fi
}

# Function to remove port forwarding rule
remove_port_forward() {
    echo "Removing port forwarding rule..."
    sudo pfctl -F all -f /etc/pf.conf 2>/dev/null
    echo -e "${GREEN}✅ Port forwarding disabled${NC}"
}

# Function to check status
check_status() {
    if sudo pfctl -s nat 2>/dev/null | grep -q "port 80.*port 3001"; then
        echo -e "${GREEN}Port forwarding is ACTIVE${NC}"
        echo "http://neuros.local is forwarding to port 3001"
    else
        echo -e "${YELLOW}Port forwarding is NOT active${NC}"
        echo "Run this script with 'enable' to activate"
    fi
}

# Main script logic
case "$1" in
    enable)
        add_port_forward
        ;;
    disable)
        remove_port_forward
        ;;
    status)
        check_status
        ;;
    *)
        echo "Port 80 Forwarding Setup for neuros.local"
        echo "=========================================="
        echo ""
        echo "Usage: $0 {enable|disable|status}"
        echo ""
        echo "  enable  - Set up port forwarding (80 -> 3001)"
        echo "  disable - Remove port forwarding"
        echo "  status  - Check if forwarding is active"
        echo ""
        echo "Example:"
        echo "  $0 enable    # Enable forwarding"
        echo "  npm run dev:local  # Start dev server on port 3001"
        echo "  # Now visit http://neuros.local (no port!)"
        echo ""
        check_status
        ;;
esac