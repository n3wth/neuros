'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plus, 
  Sparkles, 
  Book, 
  ChevronDown,
  Loader2,
  FileText,
  Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createCard } from '@/server/actions/cards'
import { generateCardsFromText } from '@/server/actions/ai'

interface CreateCardDialogProps {
  isOpen: boolean
  onClose: () => void
  onCardCreated: () => void
}

export default function CreateCardDialog({ isOpen, onClose, onCardCreated }: CreateCardDialogProps) {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [explanation, setExplanation] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [aiInput, setAiInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [generatedCards, setGeneratedCards] = useState<any[]>([])

  const handleManualCreate = async () => {
    if (!front || !back) return

    setIsCreating(true)
    try {
      await createCard({
        front,
        back,
        explanation,
        difficulty
      })
      
      // Reset form
      setFront('')
      setBack('')
      setExplanation('')
      onCardCreated()
      onClose()
    } catch (error) {
      console.error('Failed to create card:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiInput) return

    setIsCreating(true)
    try {
      const result = await generateCardsFromText(aiInput, {
        difficulty,
        count: 5
      })
      
      setGeneratedCards(result.cards || [])
      setAiInput('')
      onCardCreated()
    } catch (error) {
      console.error('Failed to generate cards:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium">Create Learning Card</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('manual')}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    mode === 'manual'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Book className="w-4 h-4" />
                    <span>Manual Entry</span>
                  </div>
                </button>
                <button
                  onClick={() => setMode('ai')}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    mode === 'ai'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Generate</span>
                  </div>
                </button>
              </div>

              {/* Difficulty Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-2 rounded-lg border capitalize transition-all ${
                        difficulty === level
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Mode */}
              {mode === 'manual' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question / Front
                    </label>
                    <textarea
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      placeholder="What is the question or prompt?"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer / Back
                    </label>
                    <textarea
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      placeholder="What is the answer?"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Additional context or explanation..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      rows={2}
                    />
                  </div>

                  <Button
                    onClick={handleManualCreate}
                    disabled={!front || !back || isCreating}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Card
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* AI Mode */}
              {mode === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste your content or describe what you want to learn
                    </label>
                    <textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Example: 'React hooks explained' or paste an article..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      rows={6}
                    />
                  </div>

                  <Button
                    onClick={handleAIGenerate}
                    disabled={!aiInput || isCreating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate 5 Cards with AI
                      </>
                    )}
                  </Button>

                  {/* Generated Cards Preview */}
                  {generatedCards.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Generated Cards ({generatedCards.length})
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {generatedCards.map((card, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {card.front}
                            </p>
                            <p className="text-xs text-gray-600">
                              {card.back}
                            </p>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={onClose}
                        className="w-full mt-3"
                        variant="outline"
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Templates */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Quick Templates</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Definition
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Code Snippet
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Formula
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Concept
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Date/Event
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}