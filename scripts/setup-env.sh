#!/bin/bash

# Environment Setup Automation for Neuros
# Automatically configures .env.local with sensible defaults

echo "🔧 Neuros Environment Setup"
echo "=========================="

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to backup and recreate it? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        BACKUP_FILE=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
        cp .env.local "$BACKUP_FILE"
        echo "✅ Backed up to $BACKUP_FILE"
    else
        echo "Keeping existing .env.local"
        exit 0
    fi
fi

# Copy from example
echo "📋 Creating .env.local from .env.example..."
cp .env.example .env.local

# Function to update env variable
update_env() {
    local key=$1
    local value=$2
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^${key}=.*|${key}=${value}|" .env.local
    else
        # Linux
        sed -i "s|^${key}=.*|${key}=${value}|" .env.local
    fi
}

# Auto-detect Supabase local
if command -v supabase &> /dev/null; then
    echo "🔍 Detecting local Supabase configuration..."
    
    # Check if Supabase is running
    if supabase status 2>/dev/null | grep -q "RUNNING"; then
        echo "✅ Supabase is running"
        
        # Extract local URLs and keys
        SUPABASE_URL="http://localhost:54321"
        ANON_KEY=$(supabase status 2>/dev/null | grep "anon key" | awk '{print $NF}')
        SERVICE_KEY=$(supabase status 2>/dev/null | grep "service_role key" | awk '{print $NF}')
        
        if [ ! -z "$ANON_KEY" ]; then
            update_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
            update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$ANON_KEY"
            update_env "SUPABASE_SERVICE_ROLE_KEY" "$SERVICE_KEY"
            echo "✅ Configured local Supabase credentials"
        fi
    else
        echo "⚠️  Supabase is not running"
        echo "   Run 'supabase start' to start local Supabase"
        echo "   Then run this script again to auto-configure"
    fi
else
    echo "⚠️  Supabase CLI not found"
    echo "   Install with: brew install supabase/tap/supabase"
fi

# Configure site URL based on environment
echo ""
echo "🌐 Configuring site URL..."
echo "Select environment:"
echo "1) Local development (http://localhost:3000)"
echo "2) Local network (http://neuros.local)"
echo "3) Production (https://neuros.newth.ai)"
echo "4) Custom"

read -p "Enter choice (1-4): " -n 1 -r
echo ""

case $REPLY in
    1)
        update_env "NEXT_PUBLIC_SITE_URL" "http://localhost:3000"
        echo "✅ Set to localhost:3000"
        ;;
    2)
        update_env "NEXT_PUBLIC_SITE_URL" "http://neuros.local"
        echo "✅ Set to neuros.local"
        echo "   Make sure to run: sudo ./scripts/setup/setup-local-domain.sh"
        ;;
    3)
        update_env "NEXT_PUBLIC_SITE_URL" "https://neuros.newth.ai"
        echo "✅ Set to production URL"
        ;;
    4)
        read -p "Enter custom URL: " CUSTOM_URL
        update_env "NEXT_PUBLIC_SITE_URL" "$CUSTOM_URL"
        echo "✅ Set to $CUSTOM_URL"
        ;;
    *)
        echo "❌ Invalid choice, keeping default"
        ;;
esac

# Check for OpenAI API key
echo ""
echo "🤖 OpenAI Configuration..."

if [ ! -z "$OPENAI_API_KEY" ]; then
    echo "✅ Found OPENAI_API_KEY in environment"
    read -p "Use existing key? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        update_env "OPENAI_API_KEY" "$OPENAI_API_KEY"
        echo "✅ Configured OpenAI API key from environment"
    fi
else
    echo "⚠️  No OPENAI_API_KEY found in environment"
    echo "   You can add it later by editing .env.local"
    echo "   Get your key from: https://platform.openai.com/api-keys"
fi

# Configure rate limits (optional)
echo ""
echo "⚡ Rate Limit Configuration..."
echo "Use default rate limits? (recommended)"
read -p "(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Enter custom rate limits (press Enter to keep defaults):"
    
    read -p "Card generation limit (default: 5): " CARD_LIMIT
    if [ ! -z "$CARD_LIMIT" ]; then
        update_env "AI_CARD_GENERATION_RATE_LIMIT" "$CARD_LIMIT"
    fi
    
    read -p "Global AI limit (default: 25): " GLOBAL_LIMIT
    if [ ! -z "$GLOBAL_LIMIT" ]; then
        update_env "AI_GLOBAL_RATE_LIMIT" "$GLOBAL_LIMIT"
    fi
fi

# Validate configuration
echo ""
echo "🔍 Validating configuration..."

ERRORS=0

# Check required variables
check_env() {
    local key=$1
    local value=$(grep "^${key}=" .env.local | cut -d'=' -f2)
    if [ -z "$value" ] || [[ "$value" == *"your_"* ]] || [[ "$value" == *"your-"* ]]; then
        echo "❌ $key is not configured"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ $key configured"
    fi
}

check_env "NEXT_PUBLIC_SUPABASE_URL"
check_env "NEXT_PUBLIC_SUPABASE_ANON_KEY"
check_env "NEXT_PUBLIC_SITE_URL"

# OpenAI is optional but warn if not set
OPENAI_VALUE=$(grep "^OPENAI_API_KEY=" .env.local | cut -d'=' -f2)
if [ -z "$OPENAI_VALUE" ] || [[ "$OPENAI_VALUE" == *"your_"* ]]; then
    echo "⚠️  OPENAI_API_KEY not configured (AI features will be disabled)"
else
    echo "✅ OPENAI_API_KEY configured"
fi

# Summary
echo ""
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ Environment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Review .env.local for any additional configuration"
    echo "2. Start local Supabase: supabase start"
    echo "3. Run migrations: npm run db:reset"
    echo "4. Start development: npm run dev"
else
    echo "⚠️  Setup completed with $ERRORS missing configurations"
    echo ""
    echo "Please edit .env.local to add missing values:"
    echo "  code .env.local"
fi

# Offer to start services
echo ""
read -p "Start development environment now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting services..."
    
    # Start Supabase if not running
    if command -v supabase &> /dev/null; then
        if ! supabase status 2>/dev/null | grep -q "RUNNING"; then
            echo "Starting Supabase..."
            supabase start
        fi
    fi
    
    # Run database migrations
    echo "Running database migrations..."
    npm run db:reset
    
    # Generate types
    echo "Generating TypeScript types..."
    npm run db:types
    
    # Start dev server
    echo "Starting development server..."
    npm run dev
fi