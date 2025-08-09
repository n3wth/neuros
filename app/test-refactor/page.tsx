'use client'

import DashboardStats from '@/components/learning/dashboard/DashboardStats'
import { dashboardStyles } from '@/lib/constants/styles'

export default function TestRefactorPage() {
  // Test data
  const mockStats = {
    totalCards: 42,
    mastered: 15,
    dueCards: 7
  }

  const mockStudyStats = {
    average_accuracy: 85,
    total_reviews: 234
  }

  return (
    <div className={dashboardStyles.page}>
      <div className={dashboardStyles.section}>
        <h1 className="text-3xl font-serif font-light mb-8">
          Fast Refresh Test - Working! 🚀
        </h1>
        
        <p className="mb-8 text-gray-600">
          Edit any part of this page or the imported components to test Fast Refresh.
          Changes should appear instantly without losing state.
        </p>

        <DashboardStats stats={mockStats} studyStats={mockStudyStats} />
        
        <div className="mt-8 p-6 bg-white rounded-3xl border border-black/5">
          <h2 className="text-xl font-light mb-4">Style Constants Test</h2>
          <button className={dashboardStyles.button.primary + ' px-6 py-3'}>
            Primary Button
          </button>
          <button className={dashboardStyles.button.secondary + ' px-6 py-3 ml-4'}>
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  )
}