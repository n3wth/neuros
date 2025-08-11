'use client'

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, prompt user to refresh
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  }
}

// Install prompt handling
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function setupInstallPrompt() {
  if (typeof window === 'undefined') return

  let deferredPrompt: BeforeInstallPromptEvent | null = null

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent

    // Show custom install button
    const installButton = document.getElementById('install-app-button')
    if (installButton) {
      installButton.style.display = 'block'
      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          console.log(`User response to install prompt: ${outcome}`)
          deferredPrompt = null
        }
      })
    }
  })

  // iOS install instructions
  const isIOS = typeof window !== 'undefined' ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false
  const isInStandaloneMode = typeof window !== 'undefined' && ('standalone' in window.navigator) && (window.navigator as { standalone?: boolean }).standalone

  if (isIOS && !isInStandaloneMode) {
    // Show iOS install instructions
    setTimeout(() => {
      const message = 'To install this app, tap the share button and select "Add to Home Screen"'
      console.log(message)
      // You could show a custom UI element here
    }, 2000)
  }
}