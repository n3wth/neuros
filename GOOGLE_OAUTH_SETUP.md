# Google OAuth Setup Guide for Neuros

## Prerequisites
- Google Cloud Console account
- Supabase project (local or production)

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "OAuth client ID"
6. Choose "Web application"
7. Add the following to Authorized JavaScript origins:
   - For local development: `http://localhost:3000`
   - For production: `https://your-domain.com`
8. Add the following to Authorized redirect URIs:
   - For local Supabase: `http://127.0.0.1:54321/auth/v1/callback`
   - For production Supabase: `https://tqvclhkpomsmhmsugjrv.supabase.co/auth/v1/callback`

## Step 2: Configure Supabase

### For Local Development (using Supabase CLI)

1. Edit `supabase/config.toml` and add:
```toml
[auth.external.google]
enabled = true
client_id = "139088416552-o0ch5parpckgf9o73onlj4l3uvv0617m.apps.googleusercontent.com"
secret = "YOUR_CLIENT_SECRET"
```

2. Restart Supabase:
```bash
supabase stop
supabase start
```

### For Production Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Client ID: `139088416552-o0ch5parpckgf9o73onlj4l3uvv0617m.apps.googleusercontent.com`
   - Client Secret: (Your secret from Google Console)
5. Save the configuration

## Step 3: Environment Variables

Update your `.env.local` file:

```env
# For production Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://tqvclhkpomsmhmsugjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site URL for OAuth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

## Step 4: Test the Implementation

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `/signin` or `/signup`
3. Click "Sign in with Google" or "Sign up with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to `/dashboard`

## Troubleshooting

### Common Issues:

1. **"Redirect URI mismatch" error**
   - Ensure the redirect URI in Google Console exactly matches your Supabase callback URL
   - Check for trailing slashes or protocol differences (http vs https)

2. **"Invalid client" error**
   - Verify the Client ID and Secret are correctly configured in Supabase
   - Ensure Google provider is enabled in Supabase Authentication settings

3. **Local development issues**
   - Make sure `NEXT_PUBLIC_SITE_URL` is set to `http://localhost:3000`
   - If using local Supabase, ensure it's running: `supabase status`

4. **Production deployment**
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain
   - Add production domain to Google Console's authorized origins
   - Update Supabase callback URL in Google Console

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for sensitive credentials
- Enable "Skip nonce checks" in Supabase only if necessary for iOS apps
- Consider implementing rate limiting for OAuth endpoints

## Additional Resources

- [Supabase Google OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/pages/building-your-application/authentication)