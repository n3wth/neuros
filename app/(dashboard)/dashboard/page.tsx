import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FullLearningDashboard from '@/components/learning/full-dashboard'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Pass only serializable user data to client component
  const serializedUser = {
    id: user.id,
    email: user.email || undefined
  }

  // Using the editorial-style dashboard that matches the main site design
  return <FullLearningDashboard user={serializedUser} />
}