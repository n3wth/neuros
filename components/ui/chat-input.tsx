'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Square, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInputProps {
  onSubmit: (message: string) => void
  placeholder?: string
  isLoading?: boolean
  suggestions?: string[]
}

export default function ChatInput({ 
  onSubmit, 
  placeholder = "Message Neuros...",
  isLoading = false,
  suggestions = []
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSubmit(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative">
      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && !message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-4 left-0 right-0"
          >
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <div className={`
        relative flex items-end gap-2 p-3 bg-white rounded-2xl border transition-all
        ${isFocused ? 'border-gray-400 shadow-lg' : 'border-gray-200 shadow-sm'}
      `}>
        {/* Attachment Button */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 resize-none outline-none max-h-48 min-h-[24px] leading-6"
          rows={1}
        />

        {/* Submit/Stop Button */}
        {isLoading ? (
          <button 
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => onSubmit('')}
          >
            <Square className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className={`
              p-2 rounded-lg transition-all
              ${message.trim() 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Character count */}
      {message.length > 0 && (
        <div className="absolute -bottom-6 right-0 text-xs text-gray-400">
          {message.length} / 4000
        </div>
      )}
    </div>
  )
}