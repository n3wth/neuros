# Next.js 15.4 + Supabase + JavaScript Best Practices

## 🚀 Core Principles

### 1. Type Generation for JavaScript/JSDoc

```bash
# After ANY schema change:
supabase gen types --lang=typescript --local > types/supabase.js

# Use JSDoc for type safety in JavaScript:
/** @typedef {import('./types/supabase').Database} Database */
```

### 2. Server-First Architecture (Next.js 15.4)

```javascript
// ✅ Server Components by default
export default async function Page() {
  const data = await getServerData() // Direct DB calls
  return <ClientComponent initialData={data} />
}

// ✅ Use after() for non-blocking operations
import { after } from 'next/server'

export async function createPost(data) {
  const post = await db.posts.create(data)
  
  after(async () => {
    // Non-blocking: analytics, cache warming, webhooks
    await trackEvent('post_created', { postId: post.id })
    await sendNotification(post.authorId)
  })
  
  return post
}
```

### 3. Supabase Client Separation

```javascript
// lib/supabase/client.js - Browser only
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

// lib/supabase/server.js - Server only
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```
### Supabase Migration-First Development

When working with Supabase databases, **ALWAYS** use migrations for ANY schema changes:
### Core Rules

1. **NEVER modify the database directly** - No manual CREATE TABLE, ALTER TABLE, etc.
    
2. **ALWAYS create a migration file** for schema changes:
    
    ```bash
    supabase migration new descriptive_name_here
    ```
    
3. **Migration naming convention**:
    
    - `create_[table]_table` - New tables
    - `add_[column]_to_[table]` - New columns
    - `update_[table]_[change]` - Modifications
    - `create_[name]_index` - Indexes
    - `add_[table]_rls` - RLS policies
4. **After EVERY migration**:
    ```bash
    supabase db reset                          # Apply locally
    supabase gen types --local > types/supabase.js  # Update types
    ```
5. **Example workflow for adding a field**:
    ```bash
    # Wrong ❌
    ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0;
    
    # Right ✅
    supabase migration new add_views_to_posts
    # Then write SQL in the generated file
    # Then: supabase db reset && npm run db:types
    ```
6. **Include in EVERY migration**:
    
    - Enable RLS on new tables
    - Add proper indexes
    - Consider adding triggers for updated_at
7. **Commit both**:
    
    - Migration file (`supabase/migrations/*.sql`)
    - Updated types (`types/supabase.js`)

This ensures reproducible database states across all environments and team members.

## 📁 Project Structure (Next.js 15.4 + Supabase)

```
├── app/                      # App Router
│   ├── (auth)/              # Auth group routes
│   ├── (dashboard)/         # Protected routes
│   ├── api/                 # API routes
│   └── globals.css          # Tailwind v4
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── features/            # Feature components
├── lib/
│   ├── supabase/           # Client configs
│   └── utils.ts            # cn() + helpers
├── server/                  # Server-only code
│   ├── queries/            # DB queries
│   └── actions/            # Server Actions
├── hooks/                   # Client hooks
├── test/                    # Test utilities
│   └── setup.ts            # Vitest setup
├── types/
│   └── supabase.js         # Generated types
└── supabase/
    ├── migrations/         # Database migrations
    └── config.toml         # Supabase configuration
```

## 🎯 Next.js 15.3 Patterns

### Server Actions with Revalidation

```typescript
// server/actions/posts.ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { after } from 'next/server'

export async function createPost(formData: PostInput) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .insert(formData)
    .select()
    .single()

  if (error) throw error

  // Immediate revalidation
  revalidateTag('posts')
  revalidatePath('/dashboard')
  
  // Deferred operations
  after(async () => {
    await notifySubscribers(data.id)
  })

  return data
}
```

### Form Component with Prefetching

```typescript
// Using Next.js 15.3 stable Form component
import Form from 'next/form'

export function SearchForm() {
  return (
    <Form action="/search" prefetch={true}>
      <input name="q" placeholder="Search..." />
      <button type="submit">Search</button>
    </Form>
  )
}
```

### Connection API for Performance

```typescript
// Warm connections early for better performance
import { connection } from 'next/server'

export default async function Layout({ children }) {
  // Pre-warm database connection
  await connection()
  
  // Pre-connect to external services
  await fetch('https://api.service.com/warmup', { 
    method: 'HEAD' 
  })
  
  return <>{children}</>
}
```

## 🔐 Authentication Pattern (Already Implemented)

The starter includes a complete authentication setup:
- Sign up/Sign in pages at `/signup` and `/signin`
- Protected dashboard routes under `app/(dashboard)/`
- Server actions in `server/actions/auth.ts`
- Auth middleware configuration
- Profile creation on signup

```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

// app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  return <>{children}</>
}

// server/actions/auth.ts - Available auth actions
export async function signUp(formData: FormData)
export async function signIn(formData: FormData)
export async function signOut()
```

## 🎨 UI Components (shadcn/ui + Tailwind v4)

### Tailwind v4 Configuration

```css
/* app/globals.css */
@import "tailwindcss";

/* Define design tokens in @theme */
@theme {
  --color-primary: oklch(24% 0.15 256);
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(10% 0 0);
  
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius: 0.5rem;
}

/* No more @tailwind directives or @layer needed */
```

### Component Setup

```bash
# Initialize shadcn/ui with Tailwind v4
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button form card toast
```

```typescript
// Feature component using shadcn/ui
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function PostCard({ post }: { post: Post }) {
  const { toast } = useToast()
  
  async function handleLike() {
    const result = await likePost(post.id)
    
    toast({
      title: result.success ? "Liked!" : "Error",
      variant: result.success ? "default" : "destructive",
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
      <CardFooter>
        <Button onClick={handleLike}>Like</Button>
      </CardFooter>
    </Card>
  )
}
```

## 🔥 Real-time Subscriptions

```typescript
// hooks/use-realtime.ts
export function useRealtime<T extends keyof Database['public']['Tables']>(
  table: T,
  filter?: string
) {
  const [data, setData] = useState<Tables<T>[]>([])
  const supabase = createClient() // Client-side only

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as Tables<T>, ...prev])
          }
          // Handle UPDATE, DELETE
        }
      )
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [table, filter])

  return data
}
```

## 🧪 Testing Infrastructure (Vitest)

### When to Test

- **Business logic** in utilities and hooks
- **Server Actions** with mocked Supabase client
- **Component behavior** not visual appearance
- **Error states** and edge cases

### Setup

```bash
npm i -D vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})

// test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  }),
}))
```

### Testing Patterns

```typescript
// components/features/posts/__tests__/post-card.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCard } from '../post-card'

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test content',
    author: { name: 'John' },
  }

  it('renders post content', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('calls onLike when like button clicked', async () => {
    const onLike = vi.fn()
    const user = userEvent.setup()
    
    render(<PostCard post={mockPost} onLike={onLike} />)
    await user.click(screen.getByRole('button', { name: /like/i }))
    
    expect(onLike).toHaveBeenCalledWith(mockPost.id)
  })
})

// server/actions/__tests__/posts.test.ts
import { createPost } from '../posts'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server')

describe('createPost', () => {
  it('creates post and returns data', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ 
              data: { id: '1', title: 'New Post' }, 
              error: null 
            })),
          })),
        })),
      })),
    }
    
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
    
    const result = await createPost({ title: 'New Post', content: 'Content' })
    expect(result).toEqual({ id: '1', title: 'New Post' })
  })

  it('throws error on database failure', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ 
              data: null, 
              error: new Error('Database error') 
            })),
          })),
        })),
      })),
    }
    
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
    
    await expect(createPost({ title: 'Test', content: 'Test' }))
      .rejects.toThrow('Database error')
  })
})
```

## 📊 Database Patterns

### Type-Safe Queries

```typescript
// server/queries/posts.ts
import type { Database } from '@/types/supabase'

type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export async function getPosts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles!inner(username, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Row Level Security

```sql
-- Always enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public read, authenticated write
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
```

## 🚀 Performance Optimization

### Parallel Data Loading

```typescript
// Load data in parallel in Server Components
export default async function DashboardPage() {
  const [posts, profile, stats] = await Promise.all([
    getPosts(),
    getProfile(),
    getStats()
  ])
  
  return (
    <Dashboard 
      posts={posts} 
      profile={profile} 
      stats={stats} 
    />
  )
}
```

### Streaming with Suspense

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList />
      </Suspense>
    </>
  )
}

async function PostsList() {
  const posts = await getPosts() // This can be slow
  return <>{posts.map(post => <PostCard key={post.id} post={post} />)}</>
}
```

## 🔧 Development Workflow

### Essential Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "db:types": "supabase gen types --local > types/supabase.ts",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset"
  }
}
```

### Environment Variables

```typescript
// lib/env.ts - Validated env vars
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

## ⚡ Key Commands

```bash
# Development
npm run dev --turbo          # Fast refresh with Turbopack
supabase start              # Local Supabase

# Testing
npm run test                # Run tests in watch mode
npm run test:ui            # Open Vitest UI
npm run test:coverage      # Generate coverage report

# Database
supabase db reset           # Reset + migrate
supabase gen types --local > types/supabase.ts

# UI Components
npx shadcn@latest add       # Add components

# Production
npm run build              # Type-safe build
supabase db push          # Deploy migrations
```

## 🚨 Critical Rules

1. **Always regenerate types after schema changes**
2. **Use Server Components by default, Client Components when needed**
3. **Separate server and client Supabase instances**
4. **Use `after()` for non-blocking operations**
5. **Enable RLS on all tables**
6. **Compose UI with shadcn/ui components**
7. **Validate environment variables with Zod**
8. **Use Server Actions for mutations**
9. **Implement proper error boundaries**
10. **Stream data with Suspense for better UX**
11. **Test business logic, not implementation details**

## 🎓 Project-Specific: AI-Powered Learning Platform

### Core Features Implemented
- **Spaced Repetition System**: SM-2 algorithm in PostgreSQL & TypeScript
- **AI Card Generation**: OpenAI GPT-4 integration for smart flashcards
- **Real-time Updates**: Supabase subscriptions for live data
- **Professional Design**: OpenAI.com/Medium.com inspired aesthetic
- **Company Logos**: Local vector icons in `/components/icons/company-logos.tsx`

### Database Schema
- 7 tables: cards, topics, user_cards, reviews, study_sessions, study_stats, goals
- Real-time enabled for cards, user_cards, study_stats
- Image storage tables: card_images, topic_images

### API Keys Required
```env
OPENAI_API_KEY=sk-proj-...  # For AI features
ANTHROPIC_API_KEY=sk-ant-...  # Optional AI provider
```

### Key Server Actions
- `/server/actions/cards.ts` - CRUD operations
- `/server/actions/reviews.ts` - SM-2 algorithm implementation  
- `/server/actions/ai.ts` - AI card generation
- `/server/actions/images.ts` - DALL-E 3 image generation

### Navigation Routes
- `/` - Landing page with professional hero
- `/signin`, `/signup` - Authentication
- `/dashboard` - Main learning dashboard
- `/learn` - Card review interface
- `/explore` - Browse learning topics
- `/research` - Scientific background
- `/enterprise` - Business features
- `/pricing` - Subscription plans

### Testing Setup
- Vitest configured with React Testing Library
- Component tests in `__tests__` directories
- Mocked Supabase client for isolated testing

### VS Code Integration
- Full debugging configs in `.vscode/`
- Launch profiles for server, client, and full-stack debugging
- Tasks for common operations

## 🎨 Design System & Style Guide

### Visual Aesthetic
- **Design Philosophy**: Editorial-inspired, content-focused design with warm, humanist touches
- **Inspired By**: Premium publications (New Yorker, Monocle), modern editorial sites
- **Key Principle**: Typography-first, minimal ornamentation, let content breathe

### Color Palette
```css
/* Primary Background */
--color-background: #FAFAF9;  /* Warm off-white, softer than pure white */

/* Text Colors */
--color-text-primary: rgba(0, 0, 0, 0.87);    /* High contrast for readability */
--color-text-secondary: rgba(0, 0, 0, 0.60);  /* Subtle secondary text */
--color-text-tertiary: rgba(0, 0, 0, 0.40);   /* Hints and metadata */

/* Accent Colors (sparingly used) */
--color-accent-blue: #4169E1;    /* Royal blue for links/CTAs */
--color-accent-green: #22C55E;   /* Success states */
--color-accent-red: #FF6B6B;     /* Coral red for emphasis */
```

### Typography
```css
/* Primary Serif - Headlines & Display */
--font-serif: 'Playfair Display', 'Georgia', serif;
/* Used for: h1-h3, feature headlines, quotes */

/* Primary Sans - Body & UI */
--font-sans: 'Inter', -apple-system, sans-serif;
/* Used for: body text, navigation, buttons, forms */

/* Monospace - Code & Metadata */
--font-mono: 'JetBrains Mono', 'Menlo', monospace;
/* Used for: code snippets, timestamps, technical details */

/* Type Scale */
--text-xs: 0.75rem;     /* 12px - metadata, labels */
--text-sm: 0.875rem;    /* 14px - captions, hints */
--text-base: 1rem;      /* 16px - body text */
--text-lg: 1.125rem;    /* 18px - lead paragraphs */
--text-xl: 1.25rem;     /* 20px - section intros */
--text-2xl: 1.5rem;     /* 24px - subsection headers */
--text-3xl: 2rem;       /* 32px - section headers */
--text-4xl: 3rem;       /* 48px - page titles */
--text-5xl: 4rem;       /* 64px - hero headlines */
```

### Iconography System
- **Primary Icons**: Custom line-art icons in `/components/icons/line-icons.tsx`
- **Style**: Minimalist, single-stroke design with calligraphy-inspired curves
- **Stroke Width**: Consistent 1.5px for all icons
- **Usage**: Replace ALL emojis and icon fonts with custom line-art components
- **Philosophy**: Icons should complement, not dominate the content

### Component Patterns

#### Cards & Containers
- **Border Radius**: `rounded-3xl` (1.5rem) for major containers
- **Borders**: Subtle `border-black/5` for definition
- **Shadows**: Reserved for hover states (`hover:shadow-lg`)
- **Background**: White cards on warm background for depth

#### Buttons & Interactive Elements
- **Primary Button**: Black background, white text, `rounded-full`
- **Secondary Button**: Transparent with border, `rounded-full`
- **Hover States**: Subtle opacity changes, no color shifts
- **Focus States**: Clean outline, no glowing effects

#### Layout Principles
- **Max Width**: 1400px for content containers
- **Padding**: Generous whitespace (8-16 spacing units)
- **Grid**: 12-column base, often used as 3 or 4 column layouts
- **Sections**: Clear visual hierarchy with alternating backgrounds

### Animation & Motion
```javascript
/* Standard Transitions */
transition-colors: 300ms ease
transition-shadow: 500ms ease
transition-transform: 200ms ease

/* Framer Motion Defaults */
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.8 }

/* Stagger Children */
delay: index * 0.1  // Sequential reveal
```

### Required Libraries & Dependencies

#### Core Framework
- **Next.js 15.4**: App Router, Server Components first
- **React 18+**: With concurrent features
- **TypeScript/JavaScript**: Type-safe with JSDoc annotations

#### Styling
- **Tailwind CSS v4**: Modern CSS with @theme layer
- **NO Additional CSS Frameworks**: No Bootstrap, Material-UI, etc.
- **Custom CSS**: Minimal, only for complex animations

#### UI Components
- **shadcn/ui**: For base components (heavily customized)
- **Framer Motion**: For animations and interactions
- **Lucide React**: ONLY for utility icons (arrow, search, etc.)
- **Custom Line Icons**: Primary icon system

#### Database & Backend
- **Supabase**: PostgreSQL + Auth + Realtime
- **@supabase/ssr**: For SSR integration
- **Server Actions**: For all mutations

#### AI & Content
- **OpenAI SDK**: For GPT-4 integration
- **Anthropic SDK**: Optional alternative AI provider

### Development Rules

#### Component Creation
1. **NEVER use pre-made component libraries** (except shadcn/ui base)
2. **ALWAYS use custom line-art icons** instead of icon libraries
3. **PREFER native HTML elements** with Tailwind classes
4. **AVOID complex component abstractions** unless necessary

#### Styling Approach
1. **Typography First**: Start with text hierarchy
2. **Minimal Color**: Black, grays, and rare accent colors
3. **No Gradients**: Except subtle overlays for depth
4. **No Drop Shadows**: Use borders and backgrounds for depth

#### Code Organization
```
/components
  /icons          # Custom line-art icons only
  /ui             # Base shadcn/ui components
  /landing        # Homepage sections
  /dashboard      # App sections
  /[feature]      # Feature-specific components
```

### Accessibility Standards
- **WCAG 2.1 AA Compliance**: Minimum requirement
- **Keyboard Navigation**: Full support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: 4.5:1 minimum for body text
- **Focus Indicators**: Clear and visible

### Performance Guidelines
- **Server Components Default**: Client only when needed
- **Image Optimization**: Next.js Image component
- **Font Loading**: Preload critical fonts
- **Code Splitting**: Automatic with App Router
- **Lazy Loading**: For below-fold content

### Anti-Patterns (What NOT to Do)
❌ Using emoji as primary icons
❌ Generic "tech startup" aesthetic
❌ Neon colors or dark mode by default
❌ Complex gradient backgrounds
❌ Overly animated interfaces
❌ Icon-heavy navigation
❌ Dense, cramped layouts
❌ Multiple fonts beyond the system
❌ CSS-in-JS libraries (styled-components, emotion)
❌ Component libraries (MUI, Ant Design, Chakra)

### Example Implementation
```tsx
// ✅ GOOD: Editorial-inspired component
<div className="bg-white rounded-3xl p-8 border border-black/5 hover:shadow-lg transition-shadow">
  <BrainIcon className="w-10 h-10 mb-4 text-black/70 stroke-[1.5]" />
  <h3 className="text-2xl font-serif font-light mb-2">Intelligent Learning</h3>
  <p className="text-base text-black/60 font-light leading-relaxed">
    Our AI adapts to your learning style, creating a personalized experience.
  </p>
</div>

// ❌ BAD: Generic tech aesthetic
<Card className="gradient-border neon-glow">
  <CardHeader>
    <RocketEmoji /> <AnimatedText>AI-Powered Learning 🚀</AnimatedText>
  </CardHeader>
  <GradientButton>Get Started →</GradientButton>
</Card>
```