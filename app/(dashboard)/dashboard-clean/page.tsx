import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import FullLearningDashboard from '@/components/learning/full-dashboard'
import MobileOptimizedDashboard from '@/components/learning/mobile-optimized-dashboard'

// Force dynamic rendering and disable all caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Clean page component that forces fresh state
function CleanPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Clear all service workers
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  registration.unregister();
                }
              });
            }
            // Clear all localStorage and sessionStorage
            if (typeof Storage !== "undefined") {
              localStorage.clear();
              sessionStorage.clear();
            }
            // Clear all caches
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => {
                  caches.delete(name);
                });
              });
            }
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

export default async function DashboardCleanPage() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      redirect('/signin')
    }

    const serializedUser = {
      id: user.id,
      email: user.email || undefined
    }

    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent) || 
                    parseInt(headersList.get('sec-ch-viewport-width') || '1024') < 768

    const dashboardComponent = isMobile 
      ? <MobileOptimizedDashboard user={serializedUser} />
      : <FullLearningDashboard user={serializedUser} />

    return (
      <CleanPageWrapper>
        {dashboardComponent}
      </CleanPageWrapper>
    )
  } catch (error) {
    const err = error as Error & { digest?: string }
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    throw error
  }
}