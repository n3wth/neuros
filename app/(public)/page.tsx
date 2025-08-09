import { createClient } from '@/lib/supabase/server'
import ProfessionalHero from '@/components/landing/professional-hero'
import AIShowcase from '@/components/landing/ai-showcase'
import TrustIndicators from '@/components/landing/trust-indicators'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <ProfessionalHero isAuthenticated={!!user} />
      <AIShowcase />
      <TrustIndicators />
    </div>
  )
}