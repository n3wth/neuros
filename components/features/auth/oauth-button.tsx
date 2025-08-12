'use client'

import { useState } from 'react'
import { signInWithOAuth } from '@/server/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { SparkleIcon } from '@/components/icons/line-icons'

interface OAuthButtonProps {
  provider: 'google' | 'github'
  label?: string
}

export function OAuthButton({ provider, label }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleOAuth() {
    setIsLoading(true)
    try {
      const result = await signInWithOAuth(provider)
      
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const providerConfig = {
    google: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      label: label || 'Continue with Google',
      className: 'bg-white text-black hover:bg-gray-50 border border-black/20'
    },
    github: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      ),
      label: label || 'Continue with GitHub',
      className: 'bg-black text-white hover:bg-black/90'
    }
  }

  const config = providerConfig[provider]

  return (
    <button
      type="button"
      onClick={handleOAuth}
      disabled={isLoading}
      className={`w-full px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${config.className}`}
    >
      {isLoading ? (
        <SparkleIcon className="w-5 h-5 animate-spin" />
      ) : (
        config.icon
      )}
      {isLoading ? 'Connecting...' : config.label}
    </button>
  )
}