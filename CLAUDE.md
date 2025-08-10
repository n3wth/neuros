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