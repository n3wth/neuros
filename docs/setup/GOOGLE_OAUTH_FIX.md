# Google OAuth Production Fix Guide

## Critical Configuration for Production

### 1. Google Cloud Console Settings

You need to update the Google OAuth configuration in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Update the following settings:

#### Authorized JavaScript origins:
- `https://neuros.newth.ai`
- `https://tqvclhkpomsmhmsugjrv.supabase.co`

#### Authorized redirect URIs (ONLY this one):
- `https://tqvclhkpomsmhmsugjrv.supabase.co/auth/v1/callback`

### 2. Supabase Dashboard Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (tqvclhkpomsmhmsugjrv)
3. Go to Authentication > URL Configuration
4. Ensure Site URL is set to: `https://neuros.newth.ai`
5. Ensure Redirect URLs includes: `https://neuros.newth.ai/**`
6. Go to Authentication > Providers > Google
7. Ensure the following:
   - Google is ENABLED
   - Client ID: `139088416552-o0ch5parpckgf9o73onlj4l3uvv0617m.apps.googleusercontent.com`
   - Client Secret: (your secret from Google Console)

### 3. Vercel Environment Variables

Ensure these are set in Vercel dashboard:

```
NEXT_PUBLIC_SITE_URL=https://neuros.newth.ai
NEXT_PUBLIC_SUPABASE_URL=https://tqvclhkpomsmhmsugjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your anon key]
SUPABASE_SERVICE_ROLE_KEY=[your service role key]
```

### 4. Test the Flow

1. Clear browser cookies for neuros.newth.ai
2. Go to https://neuros.newth.ai/signin
3. Click "Sign in with Google"
4. Check browser console for errors
5. Check Network tab for the auth flow

### Common Issues and Solutions

#### Issue: "Redirect URI mismatch"
**Solution**: The redirect URI in Google Console MUST exactly match what Supabase sends. No trailing slashes!

#### Issue: Dashboard loads but shows error
**Solution**: Check if the user is actually created in Supabase after OAuth. Go to Supabase Dashboard > Authentication > Users.

#### Issue: Stuck on loading after Google auth
**Solution**: This usually means the callback route isn't properly handling the OAuth response. Check the browser's Network tab for the `/auth/callback` request.

### Debug Steps

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard > Logs > Auth
   - Look for errors during the OAuth flow

2. **Check Vercel Logs**:
   - Go to Vercel Dashboard > Functions tab
   - Look for errors in the `/auth/callback` route

3. **Browser Console**:
   - Open DevTools before clicking "Sign in with Google"
   - Watch for any JavaScript errors
   - Check the Network tab for failed requests

### Quick Test Script

Run this in browser console to test auth state:
```javascript
// Check if user is authenticated
const checkAuth = async () => {
  const res = await fetch('/api/debug-test');
  const data = await res.json();
  console.log('Auth status:', data);
};
checkAuth();
```

### Contact for Client Secret

If you need the Google OAuth Client Secret:
1. It should be stored in your password manager
2. Or check the Supabase Dashboard (it's already configured there)
3. Never commit it to the repository

## Action Items

1. [ ] Update Google Cloud Console redirect URIs
2. [ ] Verify Supabase OAuth settings
3. [ ] Check Vercel environment variables
4. [ ] Test the complete flow
5. [ ] Monitor logs during testing