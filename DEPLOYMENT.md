# Production Deployment Guide

## Environment Configuration

### Required Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site URL Configuration (CRITICAL for email auth)
NEXT_PUBLIC_SITE_URL=https://neuros.newth.ai

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### Supabase Email Auth Configuration

**IMPORTANT**: In your Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://neuros.newth.ai`
3. Add **Redirect URLs**:
   - `https://neuros.newth.ai/auth/callback`
   - `https://neuros.newth.ai/`

This fixes the localhost email authorization issue.

## Deployment Steps

1. **Update Environment Variables** in your hosting platform (Vercel/Netlify)
2. **Update Supabase Settings** as described above
3. **Deploy** using your platform's deployment method

## Production Optimizations Included

✅ **Build Quality & Security**
- Strict TypeScript & ESLint checking enabled
- Error boundaries implemented

✅ **Performance Optimizations**  
- Dashboard code splitting (187kB → ~140kB)
- Next.js font optimization
- Package import optimization

✅ **API Protection**
- OpenAI rate limiting system
- User-based limits to prevent abuse

✅ **Monitoring & Analysis**
- Bundle analyzer configured
- Performance monitoring ready

## Verification Checklist

- [ ] Environment variables configured correctly
- [ ] Supabase URL configuration updated
- [ ] Build succeeds without errors
- [ ] Email authentication works with production URL
- [ ] Rate limiting active and working

## Support

If you encounter issues, verify:
1. All environment variables are set
2. Supabase URL configuration matches your domain
3. Build completes successfully with no TypeScript errors