/**
 * Advanced Sound System with Web Audio API
 * Provides micro-sounds, ambient soundscapes, spatial audio, and haptic feedback
 */

export type SoundType = 
  | 'click'
  | 'hover'
  | 'success'
  | 'error'
  | 'notification'
  | 'navigation'
  | 'typing'
  | 'achievement'
  | 'focus-start'
  | 'focus-end'

export type AmbientType = 
  | 'rain'
  | 'waves'
  | 'forest'
  | 'whitenoise'
  | 'cafe'
  | 'library'

export interface SoundPreferences {
  enabled: boolean
  volume: number // 0-1
  uiSounds: boolean
  ambientSounds: boolean
  hapticFeedback: boolean
  spatialAudio: boolean
  typingRhythm: boolean
  achievementSounds: boolean
}

class SoundSystem {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private oscillators: Map<string, OscillatorNode> = new Map()
  private ambientNodes: Map<string, AudioBufferSourceNode> = new Map()
  private buffers: Map<string, AudioBuffer> = new Map()
  private preferences: SoundPreferences = {
    enabled: true,
    volume: 0.5,
    uiSounds: true,
    ambientSounds: false,
    hapticFeedback: true,
    spatialAudio: true,
    typingRhythm: true,
    achievementSounds: true
  }
  private initialized = false

  /**
   * Initialize the audio context and load sounds
   */
  async initialize(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return
    
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      this.gainNode.gain.value = this.preferences.volume
      
      // Load preferences from localStorage
      const savedPrefs = localStorage.getItem('soundPreferences')
      if (savedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) }
      }
      
      this.initialized = true
      
      // Preload essential sounds
      await this.preloadSounds()
    } catch (error) {
      console.error('Failed to initialize sound system:', error)
    }
  }

  /**
   * Preload sound buffers for instant playback
   */
  private async preloadSounds(): Promise<void> {
    // In a real implementation, these would be actual audio files
    // For now, we'll generate synthetic sounds
    this.generateSyntheticSounds()
  }

  /**
   * Generate synthetic sounds using Web Audio API
   */
  private generateSyntheticSounds(): void {
    if (!this.audioContext) return
    
    // Create simple synthetic sounds
    
    // Click sound - short chirp
    this.createSyntheticBuffer('click', 0.05, (t) => 
      Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20)
    )
    
    // Hover sound - soft sweep
    this.createSyntheticBuffer('hover', 0.1, (t) => 
      Math.sin(2 * Math.PI * (400 + 200 * t) * t) * Math.exp(-t * 10) * 0.3
    )
    
    // Success sound - ascending tones
    this.createSyntheticBuffer('success', 0.3, (t) => {
      const freq = 400 + 400 * t
      return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3)
    })
    
    // Error sound - descending buzz
    this.createSyntheticBuffer('error', 0.2, (t) => {
      const freq = 300 - 100 * t
      return (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 2 * t) * 0.5) * Math.exp(-t * 5)
    })
    
    // Notification - pleasant chime
    this.createSyntheticBuffer('notification', 0.4, (t) => {
      const env = Math.exp(-t * 2)
      return (
        Math.sin(2 * Math.PI * 523 * t) * 0.5 + // C5
        Math.sin(2 * Math.PI * 659 * t) * 0.3 + // E5
        Math.sin(2 * Math.PI * 784 * t) * 0.2   // G5
      ) * env
    })
    
    // Achievement - triumphant fanfare
    this.createSyntheticBuffer('achievement', 0.6, (t) => {
      const env = t < 0.3 ? 1 : Math.exp(-(t - 0.3) * 3)
      const freq = t < 0.2 ? 523 : t < 0.4 ? 659 : 784
      return Math.sin(2 * Math.PI * freq * t) * env
    })
  }

  /**
   * Create a synthetic audio buffer
   */
  private createSyntheticBuffer(
    name: string, 
    duration: number, 
    generator: (t: number) => number
  ): void {
    if (!this.audioContext) return
    
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const channelData = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      channelData[i] = generator(t) * 0.2 // Keep volume low
    }
    
    this.buffers.set(name, buffer)
  }

  /**
   * Play a UI sound
   */
  async playSound(type: SoundType, options?: { 
    volume?: number, 
    pitch?: number,
    pan?: number // -1 (left) to 1 (right) for spatial audio
  }): Promise<void> {
    if (!this.preferences.enabled || !this.preferences.uiSounds) return
    if (!this.initialized) await this.initialize()
    if (!this.audioContext || !this.gainNode) return
    
    const buffer = this.buffers.get(type)
    if (!buffer) {
      // Fallback to simple beep if sound not found
      this.playBeep(type === 'error' ? 200 : 400, 0.05)
      return
    }
    
    try {
      const source = this.audioContext.createBufferSource()
      source.buffer = buffer
      
      // Create gain node for this specific sound
      const soundGain = this.audioContext.createGain()
      soundGain.gain.value = (options?.volume ?? 1) * this.preferences.volume
      
      // Add spatial audio if enabled
      if (this.preferences.spatialAudio && options?.pan !== undefined) {
        const panner = this.audioContext.createStereoPanner()
        panner.pan.value = options.pan
        source.connect(panner)
        panner.connect(soundGain)
      } else {
        source.connect(soundGain)
      }
      
      soundGain.connect(this.gainNode)
      
      // Adjust playback rate for pitch
      if (options?.pitch) {
        source.playbackRate.value = options.pitch
      }
      
      source.start()
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }

  /**
   * Play a simple beep sound (fallback)
   */
  private playBeep(frequency: number, duration: number): void {
    if (!this.audioContext || !this.gainNode) return
    
    const oscillator = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    
    gain.gain.setValueAtTime(0.1 * this.preferences.volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    oscillator.connect(gain)
    gain.connect(this.gainNode)
    
    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * Start an ambient soundscape
   */
  async startAmbient(type: AmbientType): Promise<void> {
    if (!this.preferences.enabled || !this.preferences.ambientSounds) return
    if (!this.initialized) await this.initialize()
    if (!this.audioContext || !this.gainNode) return
    
    // Stop any existing ambient sound
    this.stopAmbient()
    
    // Create a simple ambient sound generator
    const oscillator = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    // Configure based on ambient type
    switch (type) {
      case 'rain':
        // White noise through filter for rain effect
        oscillator.type = 'square'
        oscillator.frequency.value = 0.5
        filter.type = 'lowpass'
        filter.frequency.value = 400
        break
      case 'waves':
        // Slow sine wave for ocean waves
        oscillator.type = 'sine'
        oscillator.frequency.value = 0.1
        filter.type = 'lowpass'
        filter.frequency.value = 800
        break
      case 'forest':
        // Multiple frequencies for forest ambiance
        oscillator.type = 'triangle'
        oscillator.frequency.value = 0.2
        filter.type = 'bandpass'
        filter.frequency.value = 1000
        break
      default:
        // Generic white noise
        oscillator.type = 'square'
        oscillator.frequency.value = 1
        filter.type = 'lowpass'
        filter.frequency.value = 1000
    }
    
    // Very low volume for ambient
    gain.gain.value = 0.05 * this.preferences.volume
    
    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(this.gainNode)
    
    oscillator.start()
    this.oscillators.set('ambient', oscillator)
  }

  /**
   * Stop ambient soundscape
   */
  stopAmbient(): void {
    const ambient = this.oscillators.get('ambient')
    if (ambient) {
      ambient.stop()
      this.oscillators.delete('ambient')
    }
  }

  /**
   * Trigger haptic feedback (mobile)
   */
  triggerHaptic(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (!this.preferences.enabled || !this.preferences.hapticFeedback) return
    
    // Check if running in a browser environment
    if (typeof window === 'undefined') return
    
    // Check if Vibration API is available
    if ('vibrate' in navigator) {
      const duration = intensity === 'light' ? 10 : intensity === 'medium' ? 20 : 30
      navigator.vibrate(duration)
    }
    
    // iOS-specific haptic feedback (if available)
    const webkit = (window as unknown as { webkit?: { messageHandlers?: { haptic?: { postMessage: (msg: string) => void } } } }).webkit
    if (webkit?.messageHandlers?.haptic) {
      webkit.messageHandlers.haptic.postMessage(intensity)
    }
  }

  /**
   * Play typing rhythm feedback
   */
  playTypingSound(charCount: number): void {
    if (!this.preferences.enabled || !this.preferences.typingRhythm) return
    
    // Vary frequency based on character position for musicality
    this.playBeep(600 + (charCount % 5) * 50, 0.02)
  }

  /**
   * Update sound preferences
   */
  updatePreferences(prefs: Partial<SoundPreferences>): void {
    this.preferences = { ...this.preferences, ...prefs }
    
    // Update master volume
    if (this.gainNode && prefs.volume !== undefined) {
      this.gainNode.gain.value = prefs.volume
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundPreferences', JSON.stringify(this.preferences))
    }
    
    // Stop ambient if disabled
    if (prefs.enabled === false || prefs.ambientSounds === false) {
      this.stopAmbient()
    }
  }

  /**
   * Get current preferences
   */
  getPreferences(): SoundPreferences {
    return { ...this.preferences }
  }

  /**
   * Resume audio context (needed after user interaction on some browsers)
   */
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopAmbient()
    this.oscillators.forEach(osc => osc.stop())
    this.oscillators.clear()
    this.ambientNodes.forEach(node => node.stop())
    this.ambientNodes.clear()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.initialized = false
  }
}

// Export singleton instance
export const soundSystem = new SoundSystem()

// Auto-initialize on first user interaction
if (typeof window !== 'undefined') {
  const initOnInteraction = () => {
    soundSystem.initialize()
    document.removeEventListener('click', initOnInteraction)
    document.removeEventListener('keydown', initOnInteraction)
  }
  document.addEventListener('click', initOnInteraction, { once: true })
  document.addEventListener('keydown', initOnInteraction, { once: true })
}