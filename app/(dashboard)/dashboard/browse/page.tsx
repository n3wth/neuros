import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import FullLearningDashboard from '@/components/learning/full-dashboard'
import MobileOptimizedDashboard from '@/components/learning/mobile-optimized-dashboard'
import { logger } from '@/lib/logger'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function DashboardBrowsePage() {
  try {
    const supabase = await createClient()
    
    // Log the auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      logger.error('Dashboard auth error', {
        error: authError,
        action: 'dashboard_browse_load'
      })
      redirect('/signin')
    }

    if (!user) {
      logger.info('Dashboard redirect - no user', {
        action: 'dashboard_browse_redirect'
      })
      redirect('/signin')
    }

    // Log successful auth
    logger.info('Dashboard Browse loaded', {
      userId: user.id,
      action: 'dashboard_browse_load_success'
    })

    // Pass only serializable user data to client component
    const serializedUser = {
      id: user.id,
      email: user.email || undefined
    }

    // Check if this is a mobile request
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent) || 
                    parseInt(headersList.get('sec-ch-viewport-width') || '1024') < 768

    // Use mobile-optimized dashboard for mobile devices
    if (isMobile) {
      return <MobileOptimizedDashboard user={serializedUser} initialViewMode="browse" />
    }

    // Use full dashboard for desktop
    return <FullLearningDashboard user={serializedUser} initialViewMode="browse" />
  } catch (error) {
    // Only catch non-redirect errors
    const err = error as Error & { digest?: string }
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error // Re-throw redirect errors
    }
    
    // Log actual errors
    logger.error('Dashboard Browse page error', {
      error: err,
      action: 'dashboard_browse_error'
    })
    
    // Re-throw to trigger error boundary
    throw error
  }
}