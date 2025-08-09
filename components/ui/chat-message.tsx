'use client'

import { motion } from 'framer-motion'
import { Brain, User, Copy, ThumbsUp, ThumbsDown, RefreshCw, Share } from 'lucide-react'
import { useState } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isStreaming?: boolean
}

export default function ChatMessage({ 
  role, 
  content, 
  timestamp,
  isStreaming = false 
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 py-6 px-4 ${role === 'assistant' ? 'bg-gray-50' : 'bg-white'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {role === 'user' ? (
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {role === 'user' ? 'You' : 'Neuros'}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-500">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="prose prose-gray max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {paragraph}
              {isStreaming && index === content.split('\n').length - 1 && (
                <span className="inline-block w-2 h-4 ml-1 bg-gray-900 animate-pulse" />
              )}
            </p>
          ))}
        </div>

        {/* Actions for assistant messages */}
        {role === 'assistant' && !isStreaming && (
          <div className="flex items-center gap-1 mt-3">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Copy"
            >
              {copied ? (
                <span className="text-xs text-green-600">Copied!</span>
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            <button
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`p-1.5 hover:bg-gray-200 rounded transition-colors ${
                feedback === 'up' ? 'bg-gray-200' : ''
              }`}
              title="Good response"
            >
              <ThumbsUp className={`w-4 h-4 ${
                feedback === 'up' ? 'text-green-600' : 'text-gray-500'
              }`} />
            </button>
            
            <button
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`p-1.5 hover:bg-gray-200 rounded transition-colors ${
                feedback === 'down' ? 'bg-gray-200' : ''
              }`}
              title="Bad response"
            >
              <ThumbsDown className={`w-4 h-4 ${
                feedback === 'down' ? 'text-red-600' : 'text-gray-500'
              }`} />
            </button>
            
            <button
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
            
            <button
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Share"
            >
              <Share className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}