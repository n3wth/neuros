# Deployment Information

## Current Status

### PR #36: fix-8-mastery-level-negative  
- **Status**: ✅ READY (in review)
- **Branch**: `fix-8-mastery-level-negative`
- **Latest Commit**: `63d8419` (fix: prevent mastery level from going negative)
- **Issue**: Fixes #8 - mastery level bounds checking
- **Last Updated**: 2025-08-11 UTC

### PR #32: enhance-explore-patterns
- **Status**: ✅ READY  
- **Deployment ID**: `dpl_FsLRzwHdnqYZ289gsChmqDcga2L6`
- **Preview URL**: https://neuros-git-enhance-explore-patterns-newth.vercel.app
- **Branch Alias**: neuros-git-enhance-explore-patterns-newth.vercel.app
- **Last Updated**: 2025-01-11 01:05 UTC
- **Commit**: `139a7f7` (fix: handle missing Supabase environment variables gracefully)

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
- ✅ **PR #36**: Fixed mastery level calculation to prevent negative values
- ✅ Fixed 500 errors in preview deployments (Supabase env var handling)
- ✅ Added GitHub Actions permissions for PR comments
- ✅ Made all public pages dynamic to prevent build failures
- ✅ Refined background patterns to be 2-6x smaller for subtle detail
- ✅ Added TextMorph component with particle effects

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