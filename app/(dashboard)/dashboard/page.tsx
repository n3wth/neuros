import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FullLearningDashboard from '@/components/learning/full-dashboard'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/signin')
    }

    return <FullLearningDashboard user={user} />
  } catch (error) {
    console.error('Dashboard page error:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-light mb-4">Something went wrong</h1>
          <p className="text-black/60">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    )
  }
}