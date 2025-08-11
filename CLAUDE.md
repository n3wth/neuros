# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev              # Start development server (port 3000)
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # TypeScript type checking
```

### Testing Commands
```bash
npm run test            # Run Vitest unit tests
npm run test:ui         # Interactive Vitest UI
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run Playwright E2E tests (headless)
npm run test:e2e:ui     # Playwright test UI
npm run test:e2e:debug  # Debug Playwright tests (headed)

# Generate comprehensive test manifest
node scripts/generate-test-manifest.js
npm run test:report     # Generate and view test coverage report
```

### Browser Testing Commands
```bash
npm run browser:clean   # Fix browser lock issues (use before MCP Playwright)
npm run browser:setup   # Clean browser + ensure dev server running

# Quick browser fix workflow:
# 1. Run: npm run browser:clean
# 2. Use MCP Playwright tools normally
```

### Database Management
```bash
npm run db:start        # Start local Supabase
npm run db:stop         # Stop local Supabase  
npm run db:reset        # Reset database and apply migrations
npm run db:types        # Generate TypeScript types from schema
npm run db:push         # Deploy migrations to production
```

### Analysis Tools
```bash
npm run analyze         # Bundle size analysis
npm run analyze:server  # Server bundle analysis
npm run analyze:browser # Browser bundle analysis
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.4 with App Router
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Language**: TypeScript/JavaScript with JSDoc support
- **Styling**: Tailwind CSS v4 (via PostCSS) + shadcn/ui components
- **AI Integration**: OpenAI GPT-4o for card generation
- **Testing**: Vitest (unit) + Playwright (E2E)

### Project Structure
```
app/
├── (auth)/           # Authentication pages (signin, signup, reset)
├── (dashboard)/      # Protected dashboard routes
├── (public)/         # Public marketing pages
├── api/              # API routes
└── auth/callback/    # Supabase auth callback

server/
├── actions/          # Server Actions (use server directive)
│   ├── ai.ts        # AI card generation with rate limiting
│   ├── auth.ts      # Authentication actions
│   ├── cards.ts     # Card CRUD operations
│   └── reviews.ts   # Spaced repetition logic
└── queries/          # Database query functions

components/
├── ui/              # Reusable shadcn/ui components
├── features/        # Feature-specific components
├── learning/        # Learning system components
├── landing/         # Landing page components
└── icons/           # Custom SVG icons (line-icons.tsx)

supabase/
└── migrations/      # SQL migrations (source of truth)
```

### Key Architectural Patterns

#### Server Components by Default
- All components are Server Components unless marked with `'use client'`
- Use Server Actions for mutations (marked with `'use server'`)
- Client components only when needed for interactivity

#### Database-First Development
- **CRITICAL**: All schema changes must go through migrations
- Never modify database directly - use migrations in `supabase/migrations/`
- After adding migrations: `npm run db:reset` then `npm run db:types`
- Types are auto-generated in `types/supabase.ts`

#### Rate Limiting System
- Implemented in `lib/rate-limit-server.ts` for server-side
- Multiple tiers: CARD_GENERATION, GLOBAL_AI, IMAGE_GENERATION
- Uses sliding window algorithm with Redis-like in-memory store
- Throws `RateLimitExceededError` with retry information

#### Authentication Flow
- Supabase Auth with email/password
- Protected routes use middleware in `middleware.ts`
- Auth callback at `/auth/callback` handles OAuth returns
- Server Actions check authentication via `supabase.auth.getUser()`

#### AI Integration Pattern
```typescript
// Standard pattern in server/actions/ai.ts
1. Authenticate user
2. Check rate limits (checkMultipleRateLimits)
3. Call OpenAI with structured output
4. Store results in database
5. Return to client
```

## Critical Development Rules

### Database Operations
1. **ALWAYS** use migrations for schema changes
2. Run `npm run db:types` after any migration
3. Use transactions for multi-table operations
4. Check user authentication before database writes

### Error Handling
- Guard window access: `if (typeof window === 'undefined')`
- Wrap async operations in try-catch blocks
- Use `RateLimitExceededError` for rate limit violations
- Return meaningful error messages from Server Actions

### Testing Requirements
- Test with `npm run build` before committing
- Run `npm run test:e2e` for critical user flows
- Use `generate-test-manifest.js` to identify untested areas
- Priority test areas: auth flows, dashboard, API routes

### UI/UX Conventions
- Custom line-art SVG icons only (no emoji icons)
- Editorial design aesthetic with clean typography
- Use shadcn/ui components from `components/ui/`
- Responsive design with mobile-first approach
- **CRITICAL**: NO GRADIENT BACKGROUNDS - User hates gradients, use solid colors only

## Environment Variables

Required in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=
```

## Pre-commit Hooks

Husky runs on commit (currently with some checks disabled for rapid deployment):
- Linting (active)
- Type checking (temporarily disabled)
- Tests (temporarily disabled)

Re-enable in `.husky/pre-commit` when stabilized.

## Browser Testing Best Practices

### MCP Playwright Workflow
1. **Always run first**: `npm run browser:clean` (fixes 90% of browser issues)
2. Use MCP Playwright tools normally
3. If you get browser lock errors, repeat step 1

### Parallel Testing Options
- **MCP Playwright**: Single browser session with tabs (sequential)
- **E2E Tests**: `npm run test:e2e` (true parallel with multiple workers)
- **Manual Testing**: Use `npm run browser:setup` for consistent dev environment

### Common Browser Issues & Fixes
- **"Browser is already in use"**: Run `npm run browser:clean`
- **Dev server not running**: Run `npm run browser:setup`
- **Stuck browser processes**: Browser helper automatically kills them

## Common Development Tasks

### Adding a New Feature
1. Create migrations if database changes needed
2. Generate types: `npm run db:types`
3. Implement Server Actions in `server/actions/`
4. Create UI components (Server Components by default)
5. Add client interactivity only where needed
6. Test with `npm run build` and `npm run test:e2e`

### Debugging Issues
- **Browser testing**: Run `npm run browser:clean` first
- Check browser console for client-side errors
- Check terminal for Server Component errors
- Use `npm run dev:debug` for Node.js debugging
- Review rate limit logs in server console
- Check Supabase logs: `supabase status`

### Performance Optimization
- Use `npm run analyze` to check bundle sizes
- Implement dynamic imports for heavy components
- Use Server Components to reduce client bundle
- Enable `optimizePackageImports` in next.config.ts