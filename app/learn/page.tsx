import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NeurosLearningDashboard from '@/components/learning/neuros-dashboard'

// Force dynamic rendering - this page uses cookies via Supabase
export const dynamic = 'force-dynamic'

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  return <NeurosLearningDashboard user={user} />
}