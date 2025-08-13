#!/bin/bash

# Load environment variables
source .env.local

# Push migrations to production
echo "Pushing database migrations to production..."
supabase db push --db-url "postgresql://postgres.tqvclhkpomsmhmsugjrv:${SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres" "$@"

echo "✅ Migrations pushed successfully!"