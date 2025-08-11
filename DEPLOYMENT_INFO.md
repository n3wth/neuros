# Deployment Information

## Current Status

### PR #32: enhance-explore-patterns
- **Status**: ✅ **READY** (mock client deployed)
- **Deployment ID**: `dpl_Ho8wdFvktqSGZVuoCspEQoLDGreV`
- **Latest Commit**: `f8e49bf` (fix: improve TypeScript types for mock Supabase client)
- **Preview URL**: https://neuros-git-enhance-explore-patterns-newth.vercel.app
- **Direct URL**: https://neuros-2ex68dt9u-newth.vercel.app
- **Branch Alias**: neuros-git-enhance-explore-patterns-newth.vercel.app
- **Fix Applied**: Mock Supabase client that returns null/empty data instead of making HTTP requests
- **Last Updated**: 2025-01-11 01:25 UTC

### Production (main branch)
- **Status**: ✅ READY
- **Deployment ID**: `dpl_9YEXLihVRWLDA3B9uucn7q6HVztg`  
- **Production URL**: https://neuros.newth.ai
- **Last Updated**: 2025-01-11 01:00 UTC
- **Commit**: `8db3a8a` (fix: replace silent error handling with proper exceptions)

## Vercel Project Info
- **Project ID**: `prj_tilPD4LXD0M7zeZOZowY48lH9VMR`
- **Team ID**: `team_PV0n17OmGsIdCREzzoy8wVp7`
- **Team**: Oliver Newth

## Recent Key Changes
- ✅ **MERGED PR #32**: Refined background patterns (2-6x smaller for subtle detail)
- ✅ **MERGED PR #34**: Fixed SVG background aspect ratios to prevent stretching
- ✅ Added mock Supabase client for preview deployments (now with real env vars in Vercel)
- ✅ Added GitHub Actions permissions for PR comments
- ✅ Made all public pages dynamic to prevent build failures
- ✅ Added TextMorph component with particle effects
- ❌ PR #26, #27 have merge conflicts (need rebase)

## Quick Commands
```bash
# Check deployment status with Vercel MCP
mcp__vercel__get_deployment("dpl_FsLRzwHdnqYZ289gsChmqDcga2L6", "team_PV0n17OmGsIdCREzzoy8wVp7")

# List recent deployments
mcp__vercel__list_deployments("prj_tilPD4LXD0M7zeZOZowY48lH9VMR", "team_PV0n17OmGsIdCREzzoy8wVp7")

# Check GitHub PR status
gh pr view 32 --repo n3wth/neuros
```

---
*Last updated: 2025-01-11 01:07 UTC*