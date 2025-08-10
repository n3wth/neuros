'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  DownloadIcon,
  CloseIcon,
  ShareIcon
} from '@/components/icons/line-icons'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if already installed
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true
    
    if (isPWA) return

    // Check if iOS
    const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Check if prompt was previously dismissed
    const dismissed = localStorage.getItem('install-prompt-dismissed')
    const dismissedTime = dismissed ? parseInt(dismissed) : 0
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    
    if (dismissedTime > oneDayAgo) return

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 30000) // Show after 30 seconds
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS specific prompt
    if (isIOSDevice) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 30000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('install-prompt-dismissed', Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 safe-bottom"
      >
        <Card className="bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl shadow-2xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <DownloadIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black/90 text-sm mb-1">
                  Install Neuros App
                </h3>
                <p className="text-xs text-black/60 leading-relaxed mb-3">
                  {isIOS 
                    ? 'Add to your home screen for the best experience. Tap the share button and select "Add to Home Screen".'
                    : 'Install our app for offline access and a better learning experience.'}
                </p>
                <div className="flex gap-2">
                  {isIOS ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDismiss}
                      className="bg-black text-white hover:bg-black/90 rounded-full px-4 py-1 text-xs"
                    >
                      <ShareIcon className="w-3 h-3 mr-1" />
                      Got it
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={handleInstall}
                        className="bg-black text-white hover:bg-black/90 rounded-full px-4 py-1 text-xs"
                      >
                        Install
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDismiss}
                        className="text-black/60 border-black/20 hover:bg-black/5 rounded-full px-4 py-1 text-xs"
                      >
                        Not now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <CloseIcon className="w-4 h-4 text-black/40" />
            </button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}