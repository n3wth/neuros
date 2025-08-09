# CLAUDE_COMPACT.md - Minimized Instructions

## Quick Start
```bash
npm run dev          # Development
npm run build        # Production build
npm run test         # Tests
npm run db:reset     # Apply migrations
npm run db:types     # Generate types
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

## Critical Rules
1. ALWAYS use migrations for DB changes
2. Run `npm run db:types` after migrations
3. Guard window usage: `if (typeof window === 'undefined')`
4. Test with `npm run build` before deploy
5. Use absolute paths for file operations

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

See full CLAUDE.md for detailed patterns and examples.