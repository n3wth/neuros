'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Dashboard error:', error)
    
    // Log additional details
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error digest:', error.digest)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-red-500"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-serif font-light mb-4">Something went wrong</h1>
        
        <p className="text-black/60 mb-6">
          We encountered an unexpected error. Please try refreshing the page or go back.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-black text-white hover:bg-black/90"
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="border-black/20"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}