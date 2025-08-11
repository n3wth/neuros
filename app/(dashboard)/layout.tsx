import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Force dynamic rendering - this layout uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signin')
  }
  
  // Check if in development mode and using test account
  const isTestUser = user.email === 'test@neuros.dev'
  const isDevelopment = process.env.NODE_ENV === 'development'
  const showTestIndicator = isDevelopment && isTestUser
  
  return (
    <>
      {/* Development Test Mode Indicator */}
      {showTestIndicator && (
        <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Development Mode - Test Account ({user.email})</span>
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      )}
      
      {children}
    </>
  )
}