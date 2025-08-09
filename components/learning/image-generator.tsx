'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Image as ImageIcon, Loader2, Download, 
  RefreshCw, Palette, Grid3x3, Wand2, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AppleCard } from '@/components/ui/apple-card'
import { generateCardImage, generateTopicIllustration, batchGenerateCardImages } from '@/server/actions/images'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

type ImageStyle = 'abstract' | 'minimal' | 'geometric' | 'gradient'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
}

export default function ImageGenerator({ cardId, topic }: { cardId?: string; topic?: string }) {
  const [prompt, setPrompt] = useState('')
  const [concepts, setConcepts] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('abstract')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const { toast } = useToast()

  const styles: { value: ImageStyle; label: string; icon: any; description: string }[] = [
    { 
      value: 'abstract', 
      label: 'Abstract', 
      icon: Sparkles,
      description: 'Flowing shapes and vibrant colors'
    },
    { 
      value: 'minimal', 
      label: 'Minimal', 
      icon: Grid3x3,
      description: 'Clean lines and simple geometry'
    },
    { 
      value: 'geometric', 
      label: 'Geometric', 
      icon: Palette,
      description: 'Mathematical patterns and precision'
    },
    { 
      value: 'gradient', 
      label: 'Gradient', 
      icon: Wand2,
      description: 'Smooth transitions and depth'
    }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Please enter a prompt',
        description: 'Describe what you want to visualize',
        variant: 'destructive'
      })
      return
    }

    setIsGenerating(true)
    try {
      let result
      if (topic && concepts) {
        // Generate topic illustration
        const conceptList = concepts.split(',').map(c => c.trim())
        result = await generateTopicIllustration(topic, conceptList)
      } else {
        // Generate card image
        result = await generateCardImage(prompt, selectedStyle)
      }

      if (result.success && result.imageUrl) {
        const newImage: GeneratedImage = {
          id: result.imageId || Date.now().toString(),
          url: result.imageUrl,
          prompt,
          style: selectedStyle,
          timestamp: new Date()
        }
        setGeneratedImages(prev => [newImage, ...prev])
        setSelectedImage(newImage)
        
        toast({
          title: 'Image generated!',
          description: 'Your AI image has been created successfully'
        })
      }
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate image',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveImage = async (image: GeneratedImage) => {
    // Download the image
    const response = await fetch(image.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `neuros-${image.id}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Image saved!',
      description: 'The image has been downloaded to your device'
    })
  }

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <AppleCard glassy elevated className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-medium">AI Image Generator</h3>
            <p className="text-sm text-gray-600">Create beautiful visuals for your learning cards</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What would you like to visualize?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Neural networks connecting and processing information' or 'The concept of quantum entanglement'"
              className="min-h-[80px]"
            />
          </div>

          {/* Topic-specific fields */}
          {topic && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Key concepts (comma-separated)
              </label>
              <Input
                value={concepts}
                onChange={(e) => setConcepts(e.target.value)}
                placeholder="E.g., machine learning, deep learning, transformers"
              />
            </div>
          )}

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Choose a style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedStyle === style.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <style.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{style.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </AppleCard>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <AppleCard glassy className="p-6">
          <h3 className="text-lg font-medium mb-4">Generated Images</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {generatedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveImage(image)
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPrompt(image.prompt)
                      setSelectedStyle(image.style as ImageStyle)
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Style badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded-full">
                    {image.style}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </AppleCard>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  width={1024}
                  height={1024}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Image Details</h3>
                    <p className="text-gray-600">{selectedImage.prompt}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Style: {selectedImage.style}</span>
                      <span>Generated: {selectedImage.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button onClick={() => handleSaveImage(selectedImage)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {cardId && (
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Use for Card
                    </Button>
                  )}
                  <Button 
                    variant="ghost"
                    onClick={() => setSelectedImage(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}