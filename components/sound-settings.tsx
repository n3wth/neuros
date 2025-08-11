'use client'

import { useState, useEffect, type ReactElement } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  VolumeIcon, 
  MusicIcon, 
  WaveIcon,
  VibrateIcon,
  HeadphonesIcon,
  KeyboardIcon,
  TrophyIcon
} from '@/components/icons/line-icons'
import { useSound, useAmbientSound, useSoundPreferences } from '@/hooks/use-sound'
import { AmbientType } from '@/lib/sound-system'
import { cn } from '@/lib/utils'

interface SoundSettingsProps {
  className?: string
}

export default function SoundSettings({ className }: SoundSettingsProps) {
  const { playClick, playSuccess, playNotification } = useSound()
  const { startAmbient, stopAmbient, currentAmbient } = useAmbientSound()
  const { getPreferences, updatePreferences, setVolume } = useSoundPreferences()
  
  const [preferences, setPreferences] = useState(() => getPreferences())
  
  useEffect(() => {
    // Update local state when preferences change
    const interval = setInterval(() => {
      setPreferences(getPreferences())
    }, 1000)
    return () => clearInterval(interval)
  }, [getPreferences])

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    playClick()
    const newPrefs = { [key]: value }
    updatePreferences(newPrefs)
    setPreferences(prev => ({ ...prev, ...newPrefs }))
  }

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0]
    setVolume(volume)
    setPreferences(prev => ({ ...prev, volume }))
  }

  const testSound = () => {
    playSuccess()
    setTimeout(() => playNotification(), 500)
  }

  const ambientOptions: { type: AmbientType; label: string; icon: ReactElement }[] = [
    { type: 'rain', label: 'Rain', icon: <WaveIcon className="h-4 w-4" /> },
    { type: 'waves', label: 'Ocean', icon: <WaveIcon className="h-4 w-4" /> },
    { type: 'forest', label: 'Forest', icon: <MusicIcon className="h-4 w-4" /> },
    { type: 'whitenoise', label: 'White Noise', icon: <WaveIcon className="h-4 w-4" /> },
    { type: 'cafe', label: 'Café', icon: <MusicIcon className="h-4 w-4" /> },
    { type: 'library', label: 'Library', icon: <MusicIcon className="h-4 w-4" /> }
  ]

  return (
    <Card className={cn("bg-white border-black/10 rounded-3xl", className)}>
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-serif font-light flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-stone-50 to-orange-50 rounded-2xl">
            <VolumeIcon className="h-6 w-6 text-black/70" />
          </div>
          Sound & Haptics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Master Controls */}
        <div className="space-y-4 p-6 bg-gradient-to-br from-stone-50/50 to-orange-50/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="text-base font-light">
              Enable Sound System
            </Label>
            <Switch
              id="sound-enabled"
              checked={preferences.enabled}
              onCheckedChange={(checked) => handleToggle('enabled', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="text-sm font-light text-black/70">
                Master Volume
              </Label>
              <span className="text-sm font-mono text-black/60">
                {Math.round(preferences.volume * 100)}%
              </span>
            </div>
            <Slider
              id="volume"
              value={[preferences.volume]}
              onValueChange={handleVolumeChange}
              max={1}
              min={0}
              step={0.05}
              disabled={!preferences.enabled}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={testSound}
            variant="outline"
            size="sm"
            disabled={!preferences.enabled}
            className="w-full rounded-xl"
          >
            Test Sound
          </Button>
        </div>

        {/* Sound Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-light text-black/50 uppercase tracking-wider">
            Sound Categories
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <VolumeIcon className="h-5 w-5 text-black/60" />
                <div>
                  <Label htmlFor="ui-sounds" className="text-sm font-light">
                    UI Sounds
                  </Label>
                  <p className="text-xs text-black/50 font-light">
                    Clicks, hovers, and interactions
                  </p>
                </div>
              </div>
              <Switch
                id="ui-sounds"
                checked={preferences.uiSounds}
                onCheckedChange={(checked) => handleToggle('uiSounds', checked)}
                disabled={!preferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <MusicIcon className="h-5 w-5 text-black/60" />
                <div>
                  <Label htmlFor="ambient-sounds" className="text-sm font-light">
                    Ambient Sounds
                  </Label>
                  <p className="text-xs text-black/50 font-light">
                    Background soundscapes
                  </p>
                </div>
              </div>
              <Switch
                id="ambient-sounds"
                checked={preferences.ambientSounds}
                onCheckedChange={(checked) => handleToggle('ambientSounds', checked)}
                disabled={!preferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <VibrateIcon className="h-5 w-5 text-black/60" />
                <div>
                  <Label htmlFor="haptic-feedback" className="text-sm font-light">
                    Haptic Feedback
                  </Label>
                  <p className="text-xs text-black/50 font-light">
                    Vibrations on mobile devices
                  </p>
                </div>
              </div>
              <Switch
                id="haptic-feedback"
                checked={preferences.hapticFeedback}
                onCheckedChange={(checked) => handleToggle('hapticFeedback', checked)}
                disabled={!preferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <HeadphonesIcon className="h-5 w-5 text-black/60" />
                <div>
                  <Label htmlFor="spatial-audio" className="text-sm font-light">
                    Spatial Audio
                  </Label>
                  <p className="text-xs text-black/50 font-light">
                    3D directional sounds
                  </p>
                </div>
              </div>
              <Switch
                id="spatial-audio"
                checked={preferences.spatialAudio}
                onCheckedChange={(checked) => handleToggle('spatialAudio', checked)}
                disabled={!preferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <KeyboardIcon className="h-5 w-5 text-black/60" />
                <div>
                  <Label htmlFor="typing-rhythm" className="text-sm font-light">
                    Typing Rhythm
                  </Label>
                  <p className="text-xs text-black/50 font-light">
                    Musical feedback while typing
                  </p>
                </div>
              </div>
              <Switch
                id="typing-rhythm"
                checked={preferences.typingRhythm}
                onCheckedChange={(checked) => handleToggle('typingRhythm', checked)}
                disabled={!preferences.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <TrophyIcon className="h-5 w-5 text-black/60" />
                <div>
                  <Label htmlFor="achievement-sounds" className="text-sm font-light">
                    Achievement Sounds
                  </Label>
                  <p className="text-xs text-black/50 font-light">
                    Celebration sounds for milestones
                  </p>
                </div>
              </div>
              <Switch
                id="achievement-sounds"
                checked={preferences.achievementSounds}
                onCheckedChange={(checked) => handleToggle('achievementSounds', checked)}
                disabled={!preferences.enabled}
              />
            </div>
          </div>
        </div>

        {/* Ambient Soundscapes */}
        {preferences.ambientSounds && (
          <div className="space-y-3">
            <h3 className="text-sm font-light text-black/50 uppercase tracking-wider">
              Ambient Soundscapes
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {ambientOptions.map(({ type, label, icon }) => (
                <Button
                  key={type}
                  variant={currentAmbient === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    playClick()
                    if (currentAmbient === type) {
                      stopAmbient()
                    } else {
                      startAmbient(type)
                    }
                  }}
                  disabled={!preferences.enabled || !preferences.ambientSounds}
                  className={cn(
                    "justify-start gap-2 rounded-xl",
                    currentAmbient === type && "bg-gradient-to-r from-stone-900 to-gray-800"
                  )}
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </div>
            
            {currentAmbient && (
              <div className="p-3 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl">
                <p className="text-xs text-blue-800/80 font-light">
                  Playing: {currentAmbient} ambient soundscape
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sound Visualization */}
        <div className="p-6 bg-gradient-to-br from-stone-100/50 to-orange-100/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <WaveIcon className="h-5 w-5 text-black/60" />
            <h3 className="text-sm font-light text-black/70">Sound Visualization</h3>
          </div>
          
          <div className="flex items-center justify-center gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 bg-gradient-to-t from-stone-400 to-orange-400 rounded-full transition-all duration-300",
                  preferences.enabled ? "opacity-60" : "opacity-20"
                )}
                style={{
                  height: preferences.enabled 
                    ? `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 10}%`
                    : '10%',
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
          
          <p className="text-xs text-black/50 font-light text-center mt-3">
            {preferences.enabled ? 'Audio system active' : 'Audio system inactive'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}