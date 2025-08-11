'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import EnhancedLoader from '@/components/ui/page-loader'
import LoadingSkeleton from '@/components/ui/loading-skeleton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SparkleIcon, LightbulbIcon } from '@/components/icons/line-icons'

export default function LoadingDemo() {
  const [showLoader, setShowLoader] = useState(false)
  const [loaderContext, setLoaderContext] = useState<'dashboard' | 'review' | 'cards' | 'ai' | 'generic'>('dashboard')
  const [skeletonType, setSkeletonType] = useState<'card' | 'dashboard' | 'stats' | 'list' | 'review'>('card')

  const handleShowLoader = (context: typeof loaderContext) => {
    setLoaderContext(context)
    setShowLoader(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5FF] via-[#FAFAF9] to-[#FFF5F5] p-8">
      {/* Header */}
      <motion.div 
        className="max-w-4xl mx-auto mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-4">
          <SparkleIcon className="w-8 h-8 mr-3 text-purple-600" />
          <h1 className="text-4xl font-serif font-light text-black/90">Loading Experience Demo</h1>
        </div>
        <p className="text-lg text-black/60 font-light">
          Experience the new playful and engaging loading states for Neuros AI
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Enhanced Loader Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 bg-white rounded-3xl border border-black/5">
            <div className="flex items-center mb-6">
              <LightbulbIcon className="w-6 h-6 mr-3 text-blue-600" />
              <h2 className="text-2xl font-serif font-light text-black/90">Enhanced Loading Screens</h2>
            </div>
            <p className="text-black/60 font-light mb-8">
              Brain-themed animations with contextual messages that match your learning journey.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Button
                onClick={() => handleShowLoader('dashboard')}
                variant="outline"
                className="rounded-full p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => handleShowLoader('review')}
                variant="outline"
                className="rounded-full p-4 hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                Review
              </Button>
              <Button
                onClick={() => handleShowLoader('cards')}
                variant="outline"
                className="rounded-full p-4 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                Cards
              </Button>
              <Button
                onClick={() => handleShowLoader('ai')}
                variant="outline"
                className="rounded-full p-4 hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                AI Features
              </Button>
              <Button
                onClick={() => handleShowLoader('generic')}
                variant="outline"
                className="rounded-full p-4 hover:bg-gray-50 hover:border-gray-200 transition-colors"
              >
                Generic
              </Button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-serif font-light text-lg mb-4">Features:</h3>
              <ul className="space-y-2 text-sm text-black/70">
                <li>• Contextual loading messages that change during the experience</li>
                <li>• Brain-themed animations with firing neurons</li>
                <li>• Respect for reduced motion preferences</li>
                <li>• Progress indicators and engaging visual feedback</li>
                <li>• Consistent with brand personality and design system</li>
              </ul>
            </div>
          </Card>
        </motion.div>

        {/* Loading Skeleton Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8 bg-white rounded-3xl border border-black/5">
            <h2 className="text-2xl font-serif font-light text-black/90 mb-6">Loading Skeletons</h2>
            <p className="text-black/60 font-light mb-8">
              Subtle skeleton loading states for better perceived performance in specific contexts.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Button
                onClick={() => setSkeletonType('card')}
                variant={skeletonType === 'card' ? 'default' : 'outline'}
                className="rounded-full p-4 transition-colors"
              >
                Card
              </Button>
              <Button
                onClick={() => setSkeletonType('dashboard')}
                variant={skeletonType === 'dashboard' ? 'default' : 'outline'}
                className="rounded-full p-4 transition-colors"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setSkeletonType('stats')}
                variant={skeletonType === 'stats' ? 'default' : 'outline'}
                className="rounded-full p-4 transition-colors"
              >
                Stats
              </Button>
              <Button
                onClick={() => setSkeletonType('list')}
                variant={skeletonType === 'list' ? 'default' : 'outline'}
                className="rounded-full p-4 transition-colors"
              >
                List
              </Button>
              <Button
                onClick={() => setSkeletonType('review')}
                variant={skeletonType === 'review' ? 'default' : 'outline'}
                className="rounded-full p-4 transition-colors"
              >
                Review
              </Button>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 min-h-[300px]">
              <LoadingSkeleton 
                type={skeletonType} 
                message="Example skeleton loading state..." 
                className="h-full"
              />
            </div>
          </Card>
        </motion.div>

        {/* Implementation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-8 bg-white rounded-3xl border border-black/5">
            <h2 className="text-2xl font-serif font-light text-black/90 mb-6">Implementation</h2>
            <div className="prose prose-sm max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif font-light text-lg mb-3">Components Updated:</h3>
                  <ul className="space-y-1 text-sm text-black/70">
                    <li>• Dashboard loading states</li>
                    <li>• Review interface loading</li>
                    <li>• Form submission states</li>
                    <li>• Card creation dialogs</li>
                    <li>• Dynamic component loading</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif font-light text-lg mb-3">Technologies Used:</h3>
                  <ul className="space-y-1 text-sm text-black/70">
                    <li>• Framer Motion for animations</li>
                    <li>• Custom SVG brain animations</li>
                    <li>• CSS shimmer effects</li>
                    <li>• Accessibility-first design</li>
                    <li>• Responsive and performant</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Loader */}
      <EnhancedLoader
        isVisible={showLoader}
        context={loaderContext}
        onComplete={() => setShowLoader(false)}
        duration={3000}
      />
    </div>
  )
}