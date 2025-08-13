import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorUrl = new URL('/signin', requestUrl.origin)
    errorUrl.searchParams.set('error', errorDescription || error || 'Authentication failed')
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        const errorUrl = new URL('/signin', requestUrl.origin)
        errorUrl.searchParams.set('error', sessionError.message || 'Failed to authenticate')
        return NextResponse.redirect(errorUrl)
      }

      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (err) {
      console.error('Unexpected error during authentication:', err)
      const errorUrl = new URL('/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'An unexpected error occurred during authentication')
      return NextResponse.redirect(errorUrl)
    }
  }

  // No code or error - redirect to signin
  return NextResponse.redirect(new URL('/signin', requestUrl.origin))
}