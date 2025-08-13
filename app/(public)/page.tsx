import { createClient } from '@/lib/supabase/server'
import ProfessionalHero from '@/components/landing/professional-hero'
import AIShowcase from '@/components/landing/ai-showcase'
import TrustIndicators from '@/components/landing/trust-indicators'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <ProfessionalHero isAuthenticated={!!user} isDevelopment={isDevelopment} />
      <AIShowcase />
      <TrustIndicators />
    </div>
  )
}