'use client'

import AIFeaturesSettings, { AIFeaturesSettingsWithIcons } from '@/components/learning/ai-features-settings'

export default function TestAIFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light mb-2">AI Features Settings Test</h1>
        <p className="text-gray-600 mb-8">Testing the new AI features settings component</p>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-medium mb-4">Basic Version</h2>
            <AIFeaturesSettings 
              onFeatureClick={(feature) => {
                console.log('Feature clicked:', feature)
                alert(`Feature clicked: ${feature}`)
              }}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Version with Icon</h2>
            <AIFeaturesSettingsWithIcons 
              onFeatureClick={(feature) => {
                console.log('Feature clicked:', feature)
                alert(`Feature clicked: ${feature}`)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}