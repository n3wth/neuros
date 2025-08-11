'use client'

import { useCallback, useEffect, useRef } from 'react'
import { soundSystem, SoundType, AmbientType, SoundPreferences } from '@/lib/sound-system'

/**
 * Hook for playing UI sounds with optional haptic feedback
 */
export function useSound() {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      soundSystem.initialize()
      initialized.current = true
    }
  }, [])

  const playSound = useCallback((
    type: SoundType,
    options?: {
      volume?: number
      pitch?: number
      pan?: number
      haptic?: 'light' | 'medium' | 'heavy'
    }
  ) => {
    soundSystem.playSound(type, options)
    if (options?.haptic) {
      soundSystem.triggerHaptic(options.haptic)
    }
  }, [])

  const playClick = useCallback(() => {
    playSound('click', { haptic: 'light' })
  }, [playSound])

  const playHover = useCallback(() => {
    playSound('hover')
  }, [playSound])

  const playSuccess = useCallback(() => {
    playSound('success', { haptic: 'medium' })
  }, [playSound])

  const playError = useCallback(() => {
    playSound('error', { haptic: 'heavy' })
  }, [playSound])

  const playNotification = useCallback(() => {
    playSound('notification', { haptic: 'medium' })
  }, [playSound])

  const playAchievement = useCallback(() => {
    playSound('achievement', { haptic: 'heavy' })
  }, [playSound])

  return {
    playSound,
    playClick,
    playHover,
    playSuccess,
    playError,
    playNotification,
    playAchievement
  }
}

/**
 * Hook for managing ambient soundscapes
 */
export function useAmbientSound() {
  const currentAmbient = useRef<AmbientType | null>(null)

  const startAmbient = useCallback((type: AmbientType) => {
    soundSystem.startAmbient(type)
    currentAmbient.current = type
  }, [])

  const stopAmbient = useCallback(() => {
    soundSystem.stopAmbient()
    currentAmbient.current = null
  }, [])

  const toggleAmbient = useCallback((type: AmbientType) => {
    if (currentAmbient.current === type) {
      stopAmbient()
    } else {
      startAmbient(type)
    }
  }, [startAmbient, stopAmbient])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentAmbient.current) {
        soundSystem.stopAmbient()
      }
    }
  }, [])

  return {
    startAmbient,
    stopAmbient,
    toggleAmbient,
    currentAmbient: currentAmbient.current
  }
}

/**
 * Hook for managing sound preferences
 */
export function useSoundPreferences() {
  const updatePreferences = useCallback((prefs: Partial<SoundPreferences>) => {
    soundSystem.updatePreferences(prefs)
  }, [])

  const getPreferences = useCallback(() => {
    return soundSystem.getPreferences()
  }, [])

  const toggleSound = useCallback(() => {
    const current = soundSystem.getPreferences()
    soundSystem.updatePreferences({ enabled: !current.enabled })
  }, [])

  const setVolume = useCallback((volume: number) => {
    soundSystem.updatePreferences({ volume: Math.max(0, Math.min(1, volume)) })
  }, [])

  return {
    updatePreferences,
    getPreferences,
    toggleSound,
    setVolume
  }
}

/**
 * Hook for typing sounds with rhythm
 */
export function useTypingSound() {
  const charCount = useRef(0)
  const lastTypeTime = useRef(0)

  const playTypingSound = useCallback(() => {
    const now = Date.now()
    
    // Reset counter if there's been a pause
    if (now - lastTypeTime.current > 1000) {
      charCount.current = 0
    }
    
    charCount.current++
    lastTypeTime.current = now
    
    soundSystem.playTypingSound(charCount.current)
  }, [])

  const resetTypingRhythm = useCallback(() => {
    charCount.current = 0
  }, [])

  return {
    playTypingSound,
    resetTypingRhythm
  }
}

/**
 * Hook for spatial audio navigation sounds
 */
export function useNavigationSound() {
  const playNavigationSound = useCallback((direction: 'left' | 'right' | 'center' | 'up' | 'down') => {
    const panMap = {
      left: -0.8,
      right: 0.8,
      center: 0,
      up: 0,
      down: 0
    }
    
    const pitchMap = {
      left: 1,
      right: 1,
      center: 1,
      up: 1.2,
      down: 0.8
    }
    
    soundSystem.playSound('navigation', {
      pan: panMap[direction],
      pitch: pitchMap[direction]
    })
  }, [])

  return { playNavigationSound }
}

/**
 * Hook for interactive button with sound and haptic feedback
 */
export function useSoundButton() {
  const { playClick, playHover } = useSound()
  
  const buttonProps = {
    onMouseEnter: playHover,
    onMouseDown: playClick,
    onTouchStart: () => {
      playClick()
      soundSystem.triggerHaptic('light')
    }
  }
  
  return buttonProps
}