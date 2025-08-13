import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Log the callback attempt
  logger.info('Auth callback received', {
    hasCode: !!code,
    hasError: !!error,
    error: error,
    errorDescription: errorDescription,
    origin: requestUrl.origin
  })

  // Handle OAuth errors from provider
  if (error) {
    logger.error('OAuth provider error', {
      error: error,
      errorDescription: errorDescription,
      action: 'oauth_callback_error'
    })
    const errorUrl = new URL('/signin', requestUrl.origin)
    errorUrl.searchParams.set('error', errorDescription || error || 'Authentication failed')
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    try {
      const supabase = await createClient()
      
      logger.info('Exchanging code for session', {
        action: 'oauth_code_exchange'
      })
      
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        logger.error('Session exchange failed', {
          error: sessionError,
          message: sessionError.message,
          action: 'oauth_session_exchange_error'
        })
        const errorUrl = new URL('/signin', requestUrl.origin)
        errorUrl.searchParams.set('error', sessionError.message || 'Failed to authenticate')
        return NextResponse.redirect(errorUrl)
      }

      // Log successful auth
      if (data?.user) {
        logger.info('OAuth authentication successful', {
          userId: data.user.id,
          email: data.user.email,
          provider: data.user.app_metadata?.provider,
          action: 'oauth_success'
        })
      }

      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (err) {
      logger.error('Unexpected auth callback error', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        action: 'oauth_callback_unexpected_error'
      })
      const errorUrl = new URL('/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'An unexpected error occurred during authentication')
      return NextResponse.redirect(errorUrl)
    }
  }

  // No code or error - redirect to signin
  logger.warn('Auth callback with no code or error', {
    action: 'oauth_callback_invalid'
  })
  return NextResponse.redirect(new URL('/signin', requestUrl.origin))
}