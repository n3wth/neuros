# CLAUDE_COMPACT.md - Minimized Instructions

## Quick Start
```bash
npm run dev          # Development
npm run build        # Production build
npm run test         # Tests
npm run test:e2e     # E2E tests with Playwright
npm run db:reset     # Apply migrations
npm run db:types     # Generate types
node scripts/generate-test-manifest.js  # Generate test coverage report
```

## Tech Stack
- Next.js 15.4 (App Router, Server Components)
- Supabase (PostgreSQL + Auth)
- TypeScript/JavaScript with JSDoc
- Tailwind CSS v4 + shadcn/ui
- OpenAI GPT-4 for AI features

## Project Structure
```
app/              # Routes (public/auth/dashboard)
server/actions/   # Server Actions
components/       # UI components
  icons/line-icons.tsx  # Custom SVG icons
supabase/migrations/    # DB schema
types/supabase.js       # Generated types
```

## Key Patterns
- Server Components by default
- Server Actions for mutations
- Migration-first DB development
- Custom line-art icons (no emojis)
- Editorial design aesthetic
- No emojis in code, commits, or documentation (user preference)

## Critical Rules
1. ALWAYS use migrations for DB changes
2. Run `npm run db:types` after migrations
3. Guard window usage: `if (typeof window === 'undefined')`
4. Test with `npm run build` before deploy
5. Use absolute paths for file operations

## Git Worktrees for Parallel Development

### Setup and Best Practices
Git worktrees enable parallel development on multiple issues/features simultaneously. The project uses `.worktrees/` directory (gitignored) for all worktrees.

### When to Use Worktrees
- Working on multiple GitHub issues in parallel
- Testing different approaches without branch switching
- Reviewing PRs while continuing development
- Running multiple dev servers for testing interactions
- Keeping main branch stable while experimenting

### Quick Setup
```bash
# Create worktree for an issue
git worktree add .worktrees/issue-X -b fix-issue-X origin/main

# List all worktrees
git worktree list

# Remove worktree when done
git worktree remove .worktrees/issue-X
```

### Working in Worktrees
```bash
# Navigate to worktree
cd .worktrees/issue-5

# Install dependencies
npm install

# Copy env file
cp ../../.env.local .

# Make changes and test
npm run dev

# Commit and push
git add .
git commit -m "fix: description - Fixes #5"
git push -u origin fix-issue-5
```

### Parallel Development Workflow
1. Create worktrees for each issue: `.worktrees/issue-N`
2. Work on fixes simultaneously in different terminals
3. Each worktree has its own branch tracking an issue
4. Push all branches and create PRs
5. Clean up worktrees after PRs are merged

### Important Notes
- `.worktrees/` is gitignored - never commit worktree directories
- Each worktree needs its own `node_modules` and `.env.local`
- Use different ports when running multiple dev servers
- Always create worktrees from latest main: `origin/main`

## Deployment Tracking

### Deployment Status File
- **Location**: `DEPLOYMENT_INFO.md` (root directory)
- **Purpose**: Track current deployment status, URLs, and recent changes
- **Usage**: Always check this file first for current preview/production URLs
- **Update**: Keep updated after successful deployments

### Quick Deployment Check
```bash
# Always read deployment info first
cat DEPLOYMENT_INFO.md

# Then verify with Vercel MCP if needed
mcp__vercel__list_deployments("prj_tilPD4LXD0M7zeZOZowY48lH9VMR", "team_PV0n17OmGsIdCREzzoy8wVp7")
```

## Testing Awareness

### Automatic Test Discovery
Run `node scripts/generate-test-manifest.js` to:
- Discover all routes, components, and API endpoints
- Identify untested areas
- Generate priority testing targets
- Create TEST_COVERAGE.md report

### Test Files Location
- E2E tests: `tests/` or `e2e/`
- Component tests: Co-located with components (*.test.tsx)
- API tests: `app/**/route.test.ts`

### Testing Commands
```bash
# Generate test manifest (run this first!)
node scripts/generate-test-manifest.js

# View test coverage report
cat TEST_COVERAGE.md

# Run all tests
npm test

# Run E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/mobile.spec.ts

# Debug tests with UI
npx playwright test --ui
```

### Priority Testing Areas
1. Authentication flows (/signin, /signup)
2. Dashboard (/dashboard)
3. API routes with POST methods
4. Server actions with database operations
5. Payment/billing components

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

See full CLAUDE.md for detailed patterns and examples.