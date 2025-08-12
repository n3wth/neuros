# Security and Performance Fixes

## Overview
This document outlines the security and performance issues identified by Supabase linter and how to apply the fixes.

## Issues Fixed

### 1. Security Issues (WARN level)

#### Function Search Path Issues
- **Issue**: Functions without search_path set can be vulnerable to search path manipulation
- **Functions affected**:
  - `handle_new_user`
  - `handle_updated_at`
  - `update_updated_at_column`
  - `calculate_next_review`
- **Fix**: Added `SET search_path = public` to all functions

#### Authentication Configuration
- **OTP Expiry**: Currently set to more than 1 hour (security risk)
- **Leaked Password Protection**: Currently disabled

### 2. Performance Issues (WARN level)

#### RLS Policy Optimization
- **Issue**: RLS policies using `auth.uid()` without SELECT wrapper cause re-evaluation for each row
- **Tables affected**: All tables with RLS policies
- **Fix**: Changed `auth.uid()` to `(SELECT auth.uid())` in all policies

### 3. Performance Issues (INFO level)

#### Missing Foreign Key Indexes
- **Issue**: Foreign keys without indexes cause slow queries
- **Fix**: Added indexes for all foreign key columns

#### Unused Indexes
- **Issue**: Several indexes have never been used
- **Fix**: Added monitoring comments, will remove if consistently unused

## How to Apply Fixes

### Step 1: Apply Database Migration

The migration file `20250812000000_fix_security_and_performance_issues.sql` has been created.

#### Option A: Via Supabase CLI (Recommended)
```bash
# Start local Supabase (requires Docker)
supabase start

# Apply migration locally first
supabase db reset

# Push to production
supabase db push
```

#### Option B: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/sql/new
2. Copy the contents of `supabase/migrations/20250812000000_fix_security_and_performance_issues.sql`
3. Run the SQL query

### Step 2: Configure Authentication Settings

These settings must be changed in the Supabase Dashboard:

#### Fix OTP Expiry
1. Navigate to [Authentication > Providers > Email](https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/auth/providers)
2. Set "OTP expiry duration" to 3600 seconds (1 hour) or less
3. Save changes

#### Enable Leaked Password Protection
1. Navigate to [Authentication > Security](https://supabase.com/dashboard/project/tqvclhkpomsmhmsugjrv/auth/security)
2. Enable "Leaked password protection"
3. Save changes

## Verification

After applying fixes, verify by:

1. Running the linter again:
```bash
supabase inspect db lint
```

2. Testing authentication flows:
- Sign up with a new user
- Password reset flow
- OTP verification

3. Monitoring query performance:
- Check query execution plans
- Monitor RLS policy performance

## Summary of Changes

### Migration Applied
✅ Fixed all function search paths
✅ Optimized all RLS policies
✅ Added missing foreign key indexes
✅ Documented unused indexes for monitoring

### Manual Dashboard Changes Required
⚠️ Reduce OTP expiry to ≤ 1 hour
⚠️ Enable leaked password protection

## Impact

- **Security**: Significantly improved by fixing function search paths and enabling password protection
- **Performance**: RLS policies will execute much faster at scale
- **Query Speed**: Foreign key lookups will be significantly faster
- **Maintenance**: Unused indexes documented for future cleanup