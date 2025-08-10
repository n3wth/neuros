'use client'

import { useState, useEffect } from 'react'

interface MobileFeatures {
  isMobile: boolean
  isTablet: boolean
  isTouch: boolean
  isIOS: boolean
  isAndroid: boolean
  isPWA: boolean
  orientation: 'portrait' | 'landscape'
  hasNotch: boolean
  supportsVibration: boolean
}

export function useMobile(): MobileFeatures {
  const [features, setFeatures] = useState<MobileFeatures>({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    isIOS: false,
    isAndroid: false,
    isPWA: false,
    orientation: 'portrait',
    hasNotch: false,
    supportsVibration: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkFeatures = () => {
      const ua = navigator.userAgent
      const width = window.innerWidth
      const height = window.innerHeight

      // Device detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(ua) || width < 768
      const isTablet = /iPad|Android/i.test(ua) && width >= 768 && width < 1024
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isIOS = /iPhone|iPad|iPod/i.test(ua)
      const isAndroid = /Android/i.test(ua)

      // PWA detection
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true

      // Orientation
      const orientation = width > height ? 'landscape' : 'portrait'

      // Notch detection (iPhone X and later)
      const hasNotch = isIOS && 
                      window.devicePixelRatio >= 2 &&
                      ((width === 375 && height === 812) || // iPhone X/XS/11 Pro
                       (width === 414 && height === 896) || // iPhone XR/11/11 Pro Max
                       (width === 390 && height === 844) || // iPhone 12/13/14
                       (width === 393 && height === 852) || // iPhone 14 Pro
                       (width === 430 && height === 932))   // iPhone 14 Pro Max

      // Vibration API support
      const supportsVibration = 'vibrate' in navigator

      setFeatures({
        isMobile,
        isTablet,
        isTouch,
        isIOS,
        isAndroid,
        isPWA,
        orientation,
        hasNotch,
        supportsVibration,
      })
    }

    checkFeatures()

    // Listen for orientation changes
    const handleOrientationChange = () => checkFeatures()
    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return features
}

// Utility functions for mobile interactions
export function vibrate(pattern: number | number[] = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

export function shareContent(data: ShareData) {
  if (navigator.share) {
    return navigator.share(data)
  }
  // Fallback to copying to clipboard
  if (data.url) {
    navigator.clipboard.writeText(data.url)
  }
}