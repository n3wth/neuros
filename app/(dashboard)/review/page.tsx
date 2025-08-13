import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MobileReviewInterface from '@/components/learning/mobile-review-interface'
import { logger } from '@/lib/logger'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
  try {
    const supabase = await createClient()
    
    // Log the auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      logger.error('Review auth error', {
        error: authError,
        action: 'review_load'
      })
      redirect('/signin')
    }

    if (!user) {
      logger.info('Review redirect - no user', {
        action: 'review_redirect'
      })
      redirect('/signin')
    }

    // Log successful auth
    logger.info('Review page loaded', {
      userId: user.id,
      action: 'review_load_success'
    })

    // Mobile-optimized review experience  
    return <MobileReviewInterface sessionId={user.id} />
  } catch (error) {
    // Only catch non-redirect errors
    const err = error as Error & { digest?: string }
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error // Re-throw redirect errors
    }
    
    // Log actual errors
    logger.error('Review page error', {
      error: err,
      action: 'review_error'
    })
    
    // Re-throw to trigger error boundary
    throw error
  }
}