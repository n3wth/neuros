# GitHub Actions CI/CD Setup Guide

This guide will help you configure GitHub Actions for automated testing and deployment to Vercel.

## Prerequisites

- Vercel account with your project deployed
- GitHub repository with admin access

## Step 1: Get Vercel Credentials

1. **Install Vercel CLI locally** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Link your project** (run in project root):
   ```bash
   vercel link
   ```
   
   This creates a `.vercel` folder with `project.json` containing your IDs.

3. **Get your Vercel Token**:
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it (e.g., "GitHub Actions")
   - Copy the token (you won't see it again!)

4. **Get Project and Org IDs**:
   ```bash
   cat .vercel/project.json
   ```
   
   You'll see:
   ```json
   {
     "projectId": "prj_...",
     "orgId": "team_..."
   }
   ```

## Step 2: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these repository secrets:

### Required Vercel Secrets:
- `VERCEL_TOKEN`: Your Vercel token from Step 1.3
- `VERCEL_ORG_ID`: The `orgId` from `.vercel/project.json`
- `VERCEL_PROJECT_ID`: The `projectId` from `.vercel/project.json`

### Required Supabase Secrets:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

### Optional Secrets:
- `OPENAI_API_KEY`: If using AI features (add to Vercel env vars too)

## Step 3: Configure Environments (Optional)

GitHub Environments provide deployment protection rules:

1. Go to Settings → Environments
2. Create two environments:
   - `production`: For main branch deployments
   - `preview`: For PR deployments

3. For `production`, consider adding:
   - Required reviewers
   - Deployment branch rule: `main`
   - Wait timer (e.g., 5 minutes)

## Step 4: Test the Workflow

1. **Create a test PR**:
   ```bash
   git checkout -b test-ci
   echo "# Test" >> README.md
   git add .
   git commit -m "Test CI/CD"
   git push origin test-ci
   ```

2. **Open a PR** on GitHub
   - Watch the Actions tab
   - Check for:
     - ✅ Code Quality (lint, typecheck)
     - ✅ Unit Tests
     - ✅ E2E Tests
     - ✅ Build Test
     - ✅ Preview Deployment

3. **Merge to main**:
   - After PR checks pass
   - Production deployment should trigger

## Workflow Features

### Quality Gates
- **ESLint**: Code style and quality
- **TypeScript**: Type safety
- **Unit Tests**: Component and function tests
- **E2E Tests**: Full user journey tests with Playwright
- **Build Verification**: Ensures production build succeeds

### Deployment Strategy
- **Preview Deployments**: Every PR gets a unique URL
- **Production Deployments**: Only from `main` branch
- **Environment URLs**: Tracked in GitHub deployments

### Performance Monitoring
- **Lighthouse**: Automated performance checks on PR previews
- **Test Reports**: Playwright reports uploaded as artifacts

## Troubleshooting

### Common Issues

1. **"Invalid token" error**:
   - Regenerate Vercel token
   - Update `VERCEL_TOKEN` secret

2. **"Project not found" error**:
   - Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
   - Run `vercel link` locally to confirm

3. **E2E tests failing**:
   - Check Supabase secrets are set
   - Verify `.env.local` values match secrets

4. **Build failing**:
   - Check all required env vars are in secrets
   - Look at build logs for missing dependencies

### Debugging Commands

```bash
# Check workflow syntax
cat .github/workflows/ci-cd.yml | yq

# Test locally with act
act push -W .github/workflows/ci-cd.yml --secret-file .env.local

# Check Vercel CLI connection
vercel whoami
```

## Customization

### Skip CI
Add `[skip ci]` to commit message to skip workflows:
```bash
git commit -m "docs: Update README [skip ci]"
```

### Manual Deployment
Trigger deployment manually from Actions tab → CI/CD Pipeline → Run workflow

### Add More Checks
Edit `.github/workflows/ci-cd.yml` to add:
- Bundle size checks
- Security scanning
- Coverage reports
- Slack notifications

## Best Practices

1. **Keep secrets secure**: Never commit `.vercel` folder
2. **Use environments**: Separate production/preview settings
3. **Monitor costs**: GitHub Actions has usage limits
4. **Cache dependencies**: Speeds up workflows significantly
5. **Fail fast**: Run quick checks (lint) before slow ones (E2E)

## Support

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Troubleshooting Deployments](https://vercel.com/docs/deployments/troubleshoot)