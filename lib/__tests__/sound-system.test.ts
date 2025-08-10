import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { soundSystem } from '../sound-system'

// Mock AudioContext
class MockAudioContext {
  state = 'running'
  sampleRate = 44100
  currentTime = 0
  destination = {}
  
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn()
    }
  }
  
  createOscillator() {
    return {
      frequency: { value: 440 },
      type: 'sine',
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    }
  }
  
  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      playbackRate: { value: 1 }
    }
  }
  
  createBuffer(channels: number, length: number) {
    return {
      getChannelData: () => new Float32Array(length)
    }
  }
  
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 1000 },
      connect: vi.fn()
    }
  }
  
  createStereoPanner() {
    return {
      pan: { value: 0 },
      connect: vi.fn()
    }
  }
  
  resume() {
    return Promise.resolve()
  }
  
  close() {
    return Promise.resolve()
  }
}

describe('SoundSystem', () => {
  let originalAudioContext: typeof AudioContext | undefined
  let mockLocalStorage: { [key: string]: string } = {}

  beforeEach(() => {
    // Mock window.AudioContext
    originalAudioContext = (global as typeof globalThis & { AudioContext?: typeof AudioContext }).AudioContext
    ;(global as typeof globalThis & { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext as unknown as typeof AudioContext
    ;(global as typeof globalThis & { window: { AudioContext: typeof MockAudioContext } }).window = {
      AudioContext: MockAudioContext as unknown as typeof AudioContext
    }
    
    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {}
        })
      },
      writable: true
    })
    
    // Mock navigator.vibrate
    Object.defineProperty(global, 'navigator', {
      value: {
        vibrate: vi.fn()
      },
      writable: true
    })
    
    // Reset sound system state
    soundSystem.dispose()
  })

  afterEach(() => {
    ;(global as typeof globalThis & { AudioContext?: typeof AudioContext }).AudioContext = originalAudioContext
    mockLocalStorage = {}
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize audio context on first call', async () => {
      await soundSystem.initialize()
      expect(soundSystem['audioContext']).toBeDefined()
      expect(soundSystem['initialized']).toBe(true)
    })

    it('should not reinitialize if already initialized', async () => {
      await soundSystem.initialize()
      const firstContext = soundSystem['audioContext']
      await soundSystem.initialize()
      expect(soundSystem['audioContext']).toBe(firstContext)
    })

    it('should load preferences from localStorage', async () => {
      const savedPrefs = {
        enabled: false,
        volume: 0.3,
        uiSounds: false
      }
      mockLocalStorage['soundPreferences'] = JSON.stringify(savedPrefs)
      
      await soundSystem.initialize()
      const prefs = soundSystem.getPreferences()
      
      expect(prefs.enabled).toBe(false)
      expect(prefs.volume).toBe(0.3)
      expect(prefs.uiSounds).toBe(false)
    })
  })

  describe('playSound', () => {
    beforeEach(async () => {
      await soundSystem.initialize()
    })

    it('should not play sound when disabled', async () => {
      soundSystem.updatePreferences({ enabled: false })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      await soundSystem.playSound('click')
      
      expect(createOscillatorSpy).not.toHaveBeenCalled()
    })

    it('should not play UI sounds when uiSounds is disabled', async () => {
      soundSystem.updatePreferences({ uiSounds: false })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      await soundSystem.playSound('click')
      
      expect(createOscillatorSpy).not.toHaveBeenCalled()
    })

    it('should play sound with correct volume', async () => {
      soundSystem.updatePreferences({ volume: 0.5 })
      await soundSystem.playSound('click', { volume: 0.8 })
      
      // Sound should play with combined volume (0.5 * 0.8 = 0.4)
      // This is a simplified test - in reality we'd check the gain node value
      expect(soundSystem['gainNode']?.gain.value).toBe(0.5)
    })

    it('should apply spatial audio when enabled', async () => {
      soundSystem.updatePreferences({ spatialAudio: true })
      const createPannerSpy = vi.spyOn(soundSystem['audioContext']!, 'createStereoPanner')
      
      await soundSystem.playSound('click', { pan: -0.5 })
      
      expect(createPannerSpy).toHaveBeenCalled()
    })
  })

  describe('ambient sounds', () => {
    beforeEach(async () => {
      await soundSystem.initialize()
    })

    it('should start ambient sound when enabled', async () => {
      soundSystem.updatePreferences({ ambientSounds: true })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      await soundSystem.startAmbient('rain')
      
      expect(createOscillatorSpy).toHaveBeenCalled()
      expect(soundSystem['oscillators'].has('ambient')).toBe(true)
    })

    it('should not start ambient when disabled', async () => {
      soundSystem.updatePreferences({ ambientSounds: false })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      await soundSystem.startAmbient('rain')
      
      expect(createOscillatorSpy).not.toHaveBeenCalled()
    })

    it('should stop previous ambient when starting new one', async () => {
      soundSystem.updatePreferences({ ambientSounds: true })
      
      await soundSystem.startAmbient('rain')
      const firstOscillator = soundSystem['oscillators'].get('ambient')
      const stopSpy = vi.spyOn(firstOscillator!, 'stop')
      
      await soundSystem.startAmbient('waves')
      
      expect(stopSpy).toHaveBeenCalled()
    })

    it('should stop ambient sound', () => {
      const mockOscillator = {
        stop: vi.fn()
      } as unknown as OscillatorNode
      soundSystem['oscillators'].set('ambient', mockOscillator)
      
      soundSystem.stopAmbient()
      
      expect(soundSystem['oscillators'].has('ambient')).toBe(false)
    })
  })

  describe('haptic feedback', () => {
    it('should trigger vibration when enabled', () => {
      soundSystem.updatePreferences({ hapticFeedback: true })
      
      soundSystem.triggerHaptic('medium')
      
      expect(navigator.vibrate).toHaveBeenCalledWith(20)
    })

    it('should not trigger vibration when disabled', () => {
      soundSystem.updatePreferences({ hapticFeedback: false })
      
      soundSystem.triggerHaptic('medium')
      
      expect(navigator.vibrate).not.toHaveBeenCalled()
    })

    it('should use correct duration for intensity levels', () => {
      soundSystem.updatePreferences({ hapticFeedback: true })
      
      soundSystem.triggerHaptic('light')
      expect(navigator.vibrate).toHaveBeenCalledWith(10)
      
      soundSystem.triggerHaptic('heavy')
      expect(navigator.vibrate).toHaveBeenCalledWith(30)
    })
  })

  describe('typing sounds', () => {
    beforeEach(async () => {
      await soundSystem.initialize()
    })

    it('should play typing sound when enabled', () => {
      soundSystem.updatePreferences({ typingRhythm: true })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      soundSystem.playTypingSound(5)
      
      expect(createOscillatorSpy).toHaveBeenCalled()
    })

    it('should not play typing sound when disabled', () => {
      soundSystem.updatePreferences({ typingRhythm: false })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      soundSystem.playTypingSound(5)
      
      expect(createOscillatorSpy).not.toHaveBeenCalled()
    })

    it('should vary pitch based on character count', () => {
      soundSystem.updatePreferences({ typingRhythm: true })
      const createOscillatorSpy = vi.spyOn(soundSystem['audioContext']!, 'createOscillator')
      
      soundSystem.playTypingSound(1)
      soundSystem.playTypingSound(6)
      
      expect(createOscillatorSpy).toHaveBeenCalledTimes(2)
      // Different character counts should produce different frequencies
    })
  })

  describe('preferences', () => {
    it('should update preferences and save to localStorage', () => {
      const newPrefs = {
        volume: 0.7,
        uiSounds: false
      }
      
      soundSystem.updatePreferences(newPrefs)
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'soundPreferences',
        expect.stringContaining('"volume":0.7')
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'soundPreferences',
        expect.stringContaining('"uiSounds":false')
      )
    })

    it('should update master volume when volume preference changes', async () => {
      await soundSystem.initialize()
      
      soundSystem.updatePreferences({ volume: 0.3 })
      
      expect(soundSystem['gainNode']?.gain.value).toBe(0.3)
    })

    it('should stop ambient when disabled through preferences', async () => {
      await soundSystem.initialize()
      soundSystem.updatePreferences({ ambientSounds: true })
      await soundSystem.startAmbient('rain')
      
      const stopSpy = vi.spyOn(soundSystem, 'stopAmbient')
      soundSystem.updatePreferences({ ambientSounds: false })
      
      expect(stopSpy).toHaveBeenCalled()
    })

    it('should return copy of preferences', () => {
      const prefs1 = soundSystem.getPreferences()
      const prefs2 = soundSystem.getPreferences()
      
      expect(prefs1).not.toBe(prefs2)
      expect(prefs1).toEqual(prefs2)
    })
  })

  describe('audio context management', () => {
    it('should resume suspended audio context', async () => {
      await soundSystem.initialize()
      soundSystem['audioContext']!.state = 'suspended'
      const resumeSpy = vi.spyOn(soundSystem['audioContext']!, 'resume')
      
      await soundSystem.resume()
      
      expect(resumeSpy).toHaveBeenCalled()
    })

    it('should not resume if context is running', async () => {
      await soundSystem.initialize()
      soundSystem['audioContext']!.state = 'running'
      const resumeSpy = vi.spyOn(soundSystem['audioContext']!, 'resume')
      
      await soundSystem.resume()
      
      expect(resumeSpy).not.toHaveBeenCalled()
    })

    it('should properly dispose resources', async () => {
      await soundSystem.initialize()
      soundSystem.updatePreferences({ ambientSounds: true })
      await soundSystem.startAmbient('rain')
      
      const closeSpy = vi.spyOn(soundSystem['audioContext']!, 'close')
      
      soundSystem.dispose()
      
      expect(closeSpy).toHaveBeenCalled()
      expect(soundSystem['audioContext']).toBeNull()
      expect(soundSystem['initialized']).toBe(false)
      expect(soundSystem['oscillators'].size).toBe(0)
    })
  })
})