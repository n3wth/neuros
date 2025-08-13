#!/bin/bash

# Database Migration Helper for Neuros
# Automates migration creation and type generation

MIGRATION_NAME=$1

if [ -z "$MIGRATION_NAME" ]; then
    echo "❌ Usage: ./scripts/db-migrate.sh <migration-name>"
    echo ""
    echo "Examples:"
    echo "  ./scripts/db-migrate.sh add_user_preferences"
    echo "  ./scripts/db-migrate.sh create_learning_stats_table"
    echo "  ./scripts/db-migrate.sh add_index_to_cards"
    exit 1
fi

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Sanitize migration name (replace spaces and special chars with underscores)
SAFE_NAME=$(echo "$MIGRATION_NAME" | sed 's/[^a-zA-Z0-9_]/_/g' | tr '[:upper:]' '[:lower:]')

# Create migration file path
MIGRATION_FILE="supabase/migrations/${TIMESTAMP}_${SAFE_NAME}.sql"

# Create migration file with template
cat > "$MIGRATION_FILE" << EOF
-- Migration: ${MIGRATION_NAME}
-- Created: $(date '+%Y-%m-%d %H:%M:%S')
-- Description: TODO: Add description here

-- ============================================
-- UP Migration
-- ============================================

BEGIN;

-- TODO: Add your migration SQL here
-- Examples:

-- Create a new table:
-- CREATE TABLE IF NOT EXISTS public.example_table (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--     name TEXT NOT NULL,
--     description TEXT,
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Add a column:
-- ALTER TABLE public.existing_table 
-- ADD COLUMN IF NOT EXISTS new_column TEXT;

-- Create an index:
-- CREATE INDEX IF NOT EXISTS idx_table_column 
-- ON public.table_name(column_name);

-- Add RLS policies:
-- ALTER TABLE public.example_table ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view own data" ON public.example_table
--     FOR SELECT USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can insert own data" ON public.example_table
--     FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can update own data" ON public.example_table
--     FOR UPDATE USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can delete own data" ON public.example_table
--     FOR DELETE USING (auth.uid() = user_id);

COMMIT;

-- ============================================
-- DOWN Migration (optional - for rollback)
-- ============================================
-- Add rollback SQL here if needed:
-- DROP TABLE IF EXISTS public.example_table;
-- ALTER TABLE public.existing_table DROP COLUMN IF EXISTS new_column;
EOF

echo "✅ Created migration: $MIGRATION_FILE"
echo ""

# Ask if user wants to run the migration
read -p "Do you want to apply this migration now? (y/n) " -n 1 -r
echo ""

if [[ \$REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Resetting database and applying migrations..."
    npm run db:reset
    
    if [ $? -eq 0 ]; then
        echo "✅ Migration applied successfully"
        echo ""
        echo "🔄 Generating TypeScript types..."
        npm run db:types
        
        if [ $? -eq 0 ]; then
            echo "✅ Types generated successfully"
        else
            echo "❌ Failed to generate types"
            exit 1
        fi
    else
        echo "❌ Failed to apply migration"
        exit 1
    fi
else
    echo ""
    echo "Migration created but not applied."
    echo "To apply later, run:"
    echo "  npm run db:reset && npm run db:types"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit the migration file: $MIGRATION_FILE"
echo "2. Add your SQL statements"
echo "3. Test locally with: npm run db:reset"
echo "4. Generate types with: npm run db:types"
echo "5. Commit the migration file to git"