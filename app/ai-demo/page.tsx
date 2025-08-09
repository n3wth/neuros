'use client'

import AIFeaturesSettings, { AIFeaturesSettingsWithIcons } from '@/components/learning/ai-features-settings'
import { useState } from 'react'

export default function AIDemoPage() {
  const [clickedFeature, setClickedFeature] = useState<string>('')
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light mb-2">AI Features Settings Demo</h1>
        <p className="text-gray-600 mb-8">Testing the new AI features settings component</p>
        
        {clickedFeature && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">You clicked on: <strong>{clickedFeature}</strong></p>
          </div>
        )}
        
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-medium mb-4">Basic Version</h2>
            <AIFeaturesSettings 
              onFeatureClick={(feature) => {
                setClickedFeature(feature)
                console.log('Feature clicked:', feature)
              }}
            />
          </div>
          
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">Version with Icon</h2>
            <AIFeaturesSettingsWithIcons 
              onFeatureClick={(feature) => {
                setClickedFeature(feature)
                console.log('Feature clicked:', feature)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}