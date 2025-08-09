'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparkleIcon, 
  ImageIcon, 
  LoaderIcon, 
  DownloadIcon, 
  RefreshIcon, 
  PaletteIcon, 
  GridIcon, 
  WandIcon, 
  SaveIcon,
  CloseIcon
} from '@/components/icons/line-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
      icon: SparkleIcon,
      description: 'Flowing shapes and vibrant colors'
    },
    { 
      value: 'minimal', 
      label: 'Minimal', 
      icon: GridIcon,
      description: 'Clean lines and simple geometry'
    },
    { 
      value: 'geometric', 
      label: 'Geometric', 
      icon: PaletteIcon,
      description: 'Mathematical patterns and precision'
    },
    { 
      value: 'gradient', 
      label: 'Gradient', 
      icon: WandIcon,
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
    <div className="space-y-8">
      {/* Generation Form */}
      <div className="bg-white rounded-3xl p-8 border border-black/5 hover:shadow-lg transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-black/70 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-light text-black/90">AI Image Generator</h3>
            <p className="text-base font-light text-black/60">Create beautiful visuals for your learning cards</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium mb-3 text-black/80">
              What would you like to visualize?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Neural networks connecting and processing information' or 'The concept of quantum entanglement'"
              className="min-h-[100px] rounded-2xl border-black/10 font-light focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200"
            />
          </div>

          {/* Topic-specific fields */}
          {topic && (
            <div>
              <label className="block text-sm font-medium mb-3 text-black/80">
                Key concepts (comma-separated)
              </label>
              <Input
                value={concepts}
                onChange={(e) => setConcepts(e.target.value)}
                placeholder="E.g., machine learning, deep learning, transformers"
                className="rounded-2xl border-black/10 font-light focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200"
              />
            </div>
          )}

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium mb-4 text-black/80">
              Choose a style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((style) => (
                <motion.button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    selectedStyle === style.value
                      ? 'border-black/20 bg-black/5 shadow-md'
                      : 'border-black/10 hover:border-black/15 hover:bg-black/2'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <style.icon className="w-7 h-7 mx-auto mb-3 text-black/70 stroke-[1.5]" />
                  <div className="text-sm font-medium text-black/90">{style.label}</div>
                  <div className="text-xs text-black/50 mt-2 font-light leading-relaxed">{style.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-black hover:bg-black/90 text-white rounded-full py-6 text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <LoaderIcon className="w-5 h-5 mr-2 animate-spin stroke-[1.5]" />
                  <span className="font-light">Generating...</span>
                </>
              ) : (
                <>
                  <SparkleIcon className="w-5 h-5 mr-2 stroke-[1.5]" />
                  <span className="font-light">Generate Image</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-black/5 hover:shadow-lg transition-all duration-500">
          <h3 className="text-2xl font-serif font-light text-black/90 mb-6">Generated Images</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {generatedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-black/5 ring-1 ring-black/10">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center gap-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveImage(image)
                      }}
                    >
                      <DownloadIcon className="w-4 h-4 stroke-[1.5]" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPrompt(image.prompt)
                        setSelectedStyle(image.style as ImageStyle)
                      }}
                    >
                      <RefreshIcon className="w-4 h-4 stroke-[1.5]" />
                    </Button>
                  </motion.div>
                </div>

                {/* Style badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1.5 bg-white/95 backdrop-blur text-xs font-medium text-black/70 rounded-full border border-black/10">
                    {image.style}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="absolute top-6 right-6 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImage(null)}
                  className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-black/70 hover:bg-white/30 transition-all duration-200"
                >
                  <CloseIcon className="w-5 h-5 stroke-[1.5]" />
                </motion.button>
              </div>
              
              <div className="aspect-square relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  width={1024}
                  height={1024}
                  className="w-full h-full object-contain bg-black/2"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-light text-black/90 mb-3">Image Details</h3>
                    <p className="text-base font-light text-black/70 leading-relaxed mb-4">{selectedImage.prompt}</p>
                    <div className="flex items-center gap-6 text-sm text-black/50 font-light">
                      <span>Style: <span className="text-black/70">{selectedImage.style}</span></span>
                      <span>Generated: <span className="text-black/70">{selectedImage.timestamp.toLocaleString()}</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => handleSaveImage(selectedImage)}
                      className="bg-black hover:bg-black/90 text-white rounded-full px-6 py-3 font-light"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2 stroke-[1.5]" />
                      Download
                    </Button>
                  </motion.div>
                  {cardId && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="border-black/20 text-black/80 hover:bg-black/5 rounded-full px-6 py-3 font-light"
                      >
                        <SaveIcon className="w-4 h-4 mr-2 stroke-[1.5]" />
                        Use for Card
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="ghost"
                      onClick={() => setSelectedImage(null)}
                      className="text-black/60 hover:text-black/80 hover:bg-black/5 rounded-full px-6 py-3 font-light"
                    >
                      Close
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}