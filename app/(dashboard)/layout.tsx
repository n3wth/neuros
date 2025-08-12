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
        <div className="bg-black/90 text-white/80 text-center py-1.5 text-xs sticky top-0 z-50">
          <span>Dev Mode • Test Account</span>
        </div>
      )}
      
      {children}
    </>
  )
}