import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FullLearningDashboard from '@/components/learning/full-dashboard'
import { logger } from '@/lib/logger'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    
    // Log the auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      logger.error('Dashboard auth error', {
        error: authError,
        action: 'dashboard_load'
      })
      redirect('/signin')
    }

    if (!user) {
      logger.info('Dashboard redirect - no user', {
        action: 'dashboard_redirect'
      })
      redirect('/signin')
    }

    // Log successful auth
    logger.info('Dashboard loaded', {
      userId: user.id,
      action: 'dashboard_load_success'
    })

    // Pass only serializable user data to client component
    const serializedUser = {
      id: user.id,
      email: user.email || undefined
    }

    // Using the editorial-style dashboard that matches the main site design
    return <FullLearningDashboard user={serializedUser} />
  } catch (error) {
    // Only catch non-redirect errors
    const err = error as Error & { digest?: string }
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error // Re-throw redirect errors
    }
    
    // Log actual errors
    logger.error('Dashboard page error', {
      error: err,
      message: err?.message,
      stack: err?.stack,
      action: 'dashboard_error'
    })
    
    // Re-throw to trigger error boundary
    throw error
  }
}