'use client'

import { useEffect, useState } from 'react'
import NeurosLearningDashboard from './neuros-dashboard'
import MobileReviewInterface from './mobile-review-interface'
import { useMobile } from '@/hooks/use-mobile'
import LoadingSkeleton from '@/components/ui/loading-skeleton'

interface User {
  id: string
  email?: string
}

interface AdaptiveLearningInterfaceProps {
  user: User
}

export default function AdaptiveLearningInterface({ user }: AdaptiveLearningInterfaceProps) {
  const [mounted, setMounted] = useState(false)
  const { isMobile, isTablet } = useMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingSkeleton type="review" message="Loading your learning environment..." showIcon={true} />
  }

  // Show mobile interface for mobile and tablet devices
  if (isMobile || isTablet) {
    return <MobileReviewInterface sessionId={user.id} />
  }

  // Desktop experience
  return <NeurosLearningDashboard user={user} />
}