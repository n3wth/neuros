# Manual Deployment Instructions

## Migration Ready for Production

The security and performance fixes have been successfully:
- ✅ Created as migration file: `supabase/migrations/20250812000000_fix_security_and_performance_issues.sql`
- ✅ Tested locally with `npm run db:reset`
- ✅ TypeScript types regenerated

## Deploy to Production

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to the SQL Editor:
   https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/sql/new

2. Copy the entire contents of:
   `supabase/migrations/20250812000000_fix_security_and_performance_issues.sql`

3. Paste into the SQL editor and click "Run"

4. Verify the migration succeeded by checking for any errors

### Option 2: Via Supabase CLI

1. Get your database password from:
   https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/settings/database

2. Run:
   ```bash
   supabase db push
   ```

3. Enter your database password when prompted

## Configure Authentication Settings

After the migration is applied, configure these settings in the Supabase Dashboard:

### 1. Fix OTP Expiry (Security)
- Navigate to: https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/auth/providers
- Click on "Email" provider
- Set "OTP expiry duration" to **3600** seconds (1 hour)
- Click "Save"

### 2. Enable Leaked Password Protection (Security)
- Navigate to: https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/auth/security
- Toggle ON "Leaked password protection"
- Click "Save"

## What This Migration Fixes

### Security Issues (CRITICAL)
- ✅ Function search paths secured (4 functions)
- ⚠️ OTP expiry needs manual configuration
- ⚠️ Leaked password protection needs manual enablement

### Performance Issues (IMPORTANT)
- ✅ RLS policies optimized (16 policies) - will significantly improve query performance
- ✅ Foreign key indexes added (6 indexes) - will speed up joins
- ✅ Unused indexes documented for monitoring (7 indexes)

## Verification

After deployment, verify the fixes:

1. Check that functions have search_path set:
   ```sql
   SELECT proname, prosrc 
   FROM pg_proc 
   WHERE proname IN ('handle_new_user', 'handle_updated_at', 'update_updated_at_column', 'calculate_next_review');
   ```

2. Check that RLS policies use SELECT wrapper:
   ```sql
   SELECT schemaname, tablename, policyname, qual 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. Verify indexes exist:
   ```sql
   SELECT indexname 
   FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND indexname LIKE 'idx_%';
   ```

## Impact

- **Security**: Significantly improved by preventing search path manipulation
- **Performance**: RLS policies will execute much faster at scale
- **Query Speed**: Foreign key lookups will be significantly faster
- **User Experience**: No visible changes, but faster response times

## Rollback (if needed)

If issues occur, you can rollback by restoring from a backup or manually reverting the changes. Always backup before applying migrations to production.