import { createClient } from '@/lib/supabase/server'
import ModernHero from '@/components/landing/modern-hero'
import CapabilitiesShowcase from '@/components/landing/capabilities-showcase'
import SocialProof from '@/components/landing/social-proof'
import InteractiveDemo from '@/components/landing/interactive-demo'
import CallToAction from '@/components/landing/call-to-action'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <div className="min-h-screen bg-white">
      <ModernHero isAuthenticated={!!user} />
      <CapabilitiesShowcase />
      <InteractiveDemo />
      <SocialProof />
      <CallToAction isAuthenticated={!!user} />
    </div>
  )
}