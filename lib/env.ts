import { z } from 'zod'

const envSchema = z.object({
  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Service role key is required').optional(),
  
  // OpenAI (optional but validated if present)
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').optional(),
  DATABASE_URL: z.string().url('Invalid database URL').optional(),
  
  // Security
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters').optional(),
  NEXTAUTH_URL: z.string().url('Invalid NextAuth URL').optional(),
})

// Validate environment variables on startup
let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:')
    error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    })
    process.exit(1)
  }
  throw error
}

export { env }