'use client'

import { useState } from 'react'
import SoundSettings from '@/components/sound-settings'
import { useSound, useTypingSound, useNavigationSound, useAmbientSound } from '@/hooks/use-sound'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import SoundEnhancedNav from '@/components/layout/sound-enhanced-nav'

export default function SoundDemoPage() {
  const { playClick, playHover, playSuccess, playError, playNotification, playAchievement } = useSound()
  const { playTypingSound } = useTypingSound()
  const { playNavigationSound } = useNavigationSound()
  const { toggleAmbient } = useAmbientSound()
  const [typingText, setTypingText] = useState('')

  const navItems = [
    { name: 'Home', href: '#', position: 'left' as const },
    { name: 'About', href: '#', position: 'center' as const },
    { name: 'Services', href: '#', position: 'center' as const },
    { name: 'Contact', href: '#', position: 'right' as const },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-orange-50/30 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-serif font-light">Sound System Demo</h1>
          <p className="text-black/60">Test the immersive audio experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Interactive Elements */}
          <div className="space-y-6">
            {/* UI Sound Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif font-light">UI Sounds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onMouseEnter={playHover}
                    onClick={playClick}
                    variant="outline"
                  >
                    Click Sound
                  </Button>
                  <Button 
                    onClick={playSuccess}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Success Sound
                  </Button>
                  <Button 
                    onClick={playError}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Error Sound
                  </Button>
                  <Button 
                    onClick={playNotification}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Notification
                  </Button>
                  <Button 
                    onClick={playAchievement}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 col-span-2"
                  >
                    🏆 Achievement Unlocked!
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Spatial Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif font-light">Spatial Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-black/60">Hover over navigation items to hear directional sounds</p>
                <SoundEnhancedNav items={navItems} className="justify-center" />
                
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <Button 
                    onClick={() => playNavigationSound('left')}
                    variant="outline"
                    size="sm"
                  >
                    ← Left
                  </Button>
                  <Button 
                    onClick={() => playNavigationSound('center')}
                    variant="outline"
                    size="sm"
                  >
                    Center
                  </Button>
                  <Button 
                    onClick={() => playNavigationSound('right')}
                    variant="outline"
                    size="sm"
                  >
                    Right →
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => playNavigationSound('up')}
                    variant="outline"
                    size="sm"
                  >
                    ↑ Up
                  </Button>
                  <Button 
                    onClick={() => playNavigationSound('down')}
                    variant="outline"
                    size="sm"
                  >
                    ↓ Down
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Typing Rhythm */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif font-light">Typing Rhythm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-black/60 mb-3">Type to hear musical feedback</p>
                <Input
                  placeholder="Start typing to hear rhythm sounds..."
                  value={typingText}
                  onChange={(e) => {
                    setTypingText(e.target.value)
                    if (e.target.value.length > typingText.length) {
                      playTypingSound()
                    }
                  }}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Ambient Sounds */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif font-light">Ambient Soundscapes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-black/60 mb-4">Click to toggle ambient backgrounds</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => toggleAmbient('rain')} variant="outline" size="sm">
                    🌧️ Rain
                  </Button>
                  <Button onClick={() => toggleAmbient('waves')} variant="outline" size="sm">
                    🌊 Ocean
                  </Button>
                  <Button onClick={() => toggleAmbient('forest')} variant="outline" size="sm">
                    🌲 Forest
                  </Button>
                  <Button onClick={() => toggleAmbient('whitenoise')} variant="outline" size="sm">
                    📻 White Noise
                  </Button>
                  <Button onClick={() => toggleAmbient('cafe')} variant="outline" size="sm">
                    ☕ Café
                  </Button>
                  <Button onClick={() => toggleAmbient('library')} variant="outline" size="sm">
                    📚 Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div>
            <SoundSettings />
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg mb-3">🎧 Testing Instructions</h3>
            <ul className="space-y-2 text-sm text-black/70">
              <li>• Make sure your volume is turned up (start at 50%)</li>
              <li>• Click &ldquo;Enable Sound System&rdquo; in the settings panel</li>
              <li>• Try the different UI sound buttons to hear micro-interactions</li>
              <li>• Test spatial audio with the navigation directions</li>
              <li>• Type in the input field to hear musical typing rhythm</li>
              <li>• Toggle ambient soundscapes for background atmosphere</li>
              <li>• On mobile devices, haptic feedback will accompany sounds</li>
              <li>• Adjust individual sound categories in the settings panel</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}