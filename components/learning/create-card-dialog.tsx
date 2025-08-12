'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CloseIcon, 
  PlusIcon, 
  SparkleIcon, 
  BookIcon, 
  WandIcon,
  CheckCircleIcon,
  CodeIcon,
  BeakerIcon,
  LightbulbIcon,
  ClockIcon
} from '@/components/icons/line-icons'
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
  const [mode, setMode] = useState<'manual' | 'ai'>('ai')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [explanation, setExplanation] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [aiInput, setAiInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [generatedCards, setGeneratedCards] = useState<Array<{ front: string; back: string }>>([])
  const [successMessage, setSuccessMessage] = useState('')
  const [showQuickStart, setShowQuickStart] = useState(true)

  // Check for suggested prompts from the dashboard
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const suggestedPrompt = window.localStorage.getItem('suggested-prompt')
      if (suggestedPrompt) {
        setAiInput(suggestedPrompt)
        setMode('ai')
        window.localStorage.removeItem('suggested-prompt')
        setShowQuickStart(false)
      }
    }
  }, [isOpen])

  const quickStartTemplates = [
    { icon: <BookIcon className="w-4 h-4" />, text: 'Spanish vocabulary: common greetings and phrases' },
    { icon: <CodeIcon className="w-4 h-4" />, text: 'JavaScript fundamentals: variables, functions, and arrays' },
    { icon: <BeakerIcon className="w-4 h-4" />, text: 'Human biology: major organ systems and their functions' },
    { icon: <LightbulbIcon className="w-4 h-4" />, text: 'World history: key events of the 20th century' },
    { icon: <ClockIcon className="w-4 h-4" />, text: 'Time management techniques for productivity' }
  ]

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
        count: 20
      })
      
      setGeneratedCards(result.cards || [])
      setSuccessMessage(`🎉 Successfully generated ${result.cards?.length || 20} cards! They've been added to your collection.`)
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            transition={{ duration: 0.3 }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-full max-w-2xl bg-white rounded-3xl p-8 max-h-[90vh] overflow-y-auto border-black/5 shadow-2xl shadow-black/10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-light text-black/90">Create Learning Card</h2>
                  <p className="text-black/60 font-light mt-2">Build knowledge with AI-powered or manual card creation</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-black/5 rounded-full transition-all duration-300 group"
                >
                  <CloseIcon className="w-6 h-6 text-black/60 group-hover:text-black/80 stroke-[2]" />
                </button>
              </div>

              {/* Mode Selector */}
              <motion.div 
                className="flex gap-3 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <button
                  onClick={() => setMode('ai')}
                  className={`flex-1 p-4 rounded-3xl border transition-all duration-300 ${
                    mode === 'ai'
                      ? 'bg-gradient-to-r from-[#F5F5FF] to-[#FFF5F5] text-black border-black/10 shadow-md'
                      : 'bg-white text-black/60 border-black/10 hover:border-black/20 hover:bg-black/3'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <SparkleIcon className="w-6 h-6 stroke-[2]" />
                    <span className="font-light">AI Generate</span>
                  </div>
                </button>
                <button
                  onClick={() => setMode('manual')}
                  className={`flex-1 p-4 rounded-3xl border transition-all duration-300 ${
                    mode === 'manual'
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-black/60 border-black/10 hover:border-black/20 hover:bg-black/3'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <BookIcon className="w-6 h-6 stroke-[2]" />
                    <span className="font-light">Manual Entry</span>
                  </div>
                </button>
              </motion.div>

              {/* Difficulty Selector */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label className="block text-lg font-serif font-light text-black/90 mb-4">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-4 rounded-3xl border capitalize transition-all duration-300 font-light ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 shadow-sm'
                          : 'bg-white border-black/10 text-black/60 hover:border-black/20 hover:bg-black/3'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Manual Mode */}
              {mode === 'manual' && (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div>
                    <label className="block text-lg font-serif font-light text-black/90 mb-3">
                      Question / Front
                    </label>
                    <textarea
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      placeholder="What is the question or prompt?"
                      className="w-full p-4 border border-black/10 rounded-3xl focus:outline-none focus:border-black/20 focus:shadow-sm bg-white/80 backdrop-blur-sm transition-all duration-300 font-light resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-serif font-light text-black/90 mb-3">
                      Answer / Back
                    </label>
                    <textarea
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      placeholder="What is the answer?"
                      className="w-full p-4 border border-black/10 rounded-3xl focus:outline-none focus:border-black/20 focus:shadow-sm bg-white/80 backdrop-blur-sm transition-all duration-300 font-light resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-serif font-light text-black/90 mb-3">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Additional context or explanation..."
                      className="w-full p-4 border border-black/10 rounded-3xl focus:outline-none focus:border-black/20 focus:shadow-sm bg-white/80 backdrop-blur-sm transition-all duration-300 font-light resize-none"
                      rows={2}
                    />
                  </div>

                  <Button
                    onClick={handleManualCreate}
                    disabled={!front || !back || isCreating}
                    className="w-full bg-black text-white hover:bg-black/90 rounded-full px-8 py-4 font-light shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <>
                        <SparkleIcon className="w-5 h-5 mr-3 animate-spin" />
                        Crafting your knowledge card...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-6 h-6 mr-3 stroke-[2]" />
                        Create Card
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* AI Mode */}
              {mode === 'ai' && (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {/* Quick Start Templates */}
                  {showQuickStart && !aiInput && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="mb-6"
                    >
                      <p className="text-sm text-black/60 font-light mb-3">Quick start templates:</p>
                      <div className="space-y-2">
                        {quickStartTemplates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setAiInput(template.text)
                              setShowQuickStart(false)
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-black/10 hover:border-black/20 hover:bg-black/3 transition-all duration-200 text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black/60">
                              {template.icon}
                            </div>
                            <span className="text-sm text-black/70 font-light">{template.text}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-lg font-serif font-light text-black/90 mb-3">
                      Paste your content or describe what you want to learn
                    </label>
                    <textarea
                      value={aiInput}
                      onChange={(e) => {
                        setAiInput(e.target.value)
                        if (e.target.value) setShowQuickStart(false)
                      }}
                      placeholder="Example: 'React hooks explained' or paste an article..."
                      className="w-full p-4 border border-black/10 rounded-3xl focus:outline-none focus:border-black/20 focus:shadow-sm bg-white/80 backdrop-blur-sm transition-all duration-300 font-light resize-none"
                      rows={6}
                    />
                  </div>

                  <Button
                    onClick={handleAIGenerate}
                    disabled={!aiInput || isCreating}
                    className="w-full bg-gradient-to-r from-[#F5F5FF] to-[#FFF5F5] text-black border border-black/10 hover:shadow-lg rounded-full px-8 py-4 font-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <>
                        <SparkleIcon className="w-5 h-5 mr-3 animate-spin" />
                        AI is crafting your cards...
                      </>
                    ) : (
                      <>
                        <WandIcon className="w-5 h-5 mr-3" />
                        Generate 20 Cards with AI
                      </>
                    )}
                  </Button>

                  {/* Success Message */}
                  {successMessage && (
                    <motion.div 
                      className="mt-8 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                      >
                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                      </motion.div>
                      <h3 className="text-2xl font-serif font-light text-black/90 mb-3">
                        Cards Created Successfully!
                      </h3>
                      <p className="text-black/60 font-light mb-8 max-w-md mx-auto leading-relaxed">
                        20 intelligent learning cards have been crafted and added to your collection. Ready to begin your learning journey?
                      </p>
                      <button
                        onClick={onClose}
                        className="bg-black text-white px-8 py-4 rounded-full font-light hover:bg-black/90 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View My Cards
                      </button>
                    </motion.div>
                  )}

                  {/* Generated Cards Preview */}
                  {generatedCards.length > 0 && !successMessage && (
                    <motion.div 
                      className="mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-xl font-serif font-light text-black/90 mb-4">
                        Generated Cards ({generatedCards.length})
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                        {generatedCards.map((card, index) => (
                          <motion.div
                            key={index}
                            className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-3xl border border-black/5"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <p className="text-black/90 font-light mb-2 leading-relaxed">
                              {card.front}
                            </p>
                            <p className="text-sm text-black/60 font-light leading-relaxed">
                              {card.back}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        onClick={onClose}
                        className="w-full mt-4 border-black/20 text-black hover:bg-black/5 rounded-full px-8 py-3 font-light transition-all duration-300"
                        variant="outline"
                      >
                        Done
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Templates */}
              <motion.div 
                className="mt-8 pt-8 border-t border-black/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <p className="text-lg font-serif font-light text-black/90 mb-4">Quick Templates</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Definition', icon: BookIcon },
                    { name: 'Code Snippet', icon: CodeIcon },
                    { name: 'Formula', icon: BeakerIcon },
                    { name: 'Concept', icon: LightbulbIcon },
                    { name: 'Date/Event', icon: ClockIcon }
                  ].map(({ name, icon: IconComponent }, index) => (
                    <motion.button 
                      key={name}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-black/3 text-black/70 rounded-full hover:bg-black/5 hover:text-black/90 transition-all duration-300 font-light border border-black/5 hover:border-black/10"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}