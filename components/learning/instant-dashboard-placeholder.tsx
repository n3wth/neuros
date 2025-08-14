'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BookIcon, 
  SparkleIcon, 
  ChartIcon, 
  HeartIcon,
  ClockIcon,
  PlusIcon,
  LogOutIcon
} from '@/components/icons/line-icons'
import { Card } from '@/components/ui/card'

interface User {
  id: string
  email?: string
}

interface InstantDashboardPlaceholderProps {
  user: User
  viewMode: string
  onCreateCard: () => void
  onSignOut: () => void
}

export default function InstantDashboardPlaceholder({ 
  user, 
  viewMode,
  onCreateCard, 
  onSignOut
}: InstantDashboardPlaceholderProps) {
  const formatGreeting = () => {
    const hour = new Date().getHours()
    const name = user.email?.split('@')[0] || 'there'
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    if (hour < 12) return `Good morning, ${capitalizedName}`
    if (hour < 18) return `Good afternoon, ${capitalizedName}`
    return `Good evening, ${capitalizedName}`
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Layout */}
            <div className="flex items-center flex-1">
              <Link href="/" className="group mr-12">
                <span className="text-[32px] font-serif font-light tracking-tight leading-none hover:scale-[1.02] transition-transform">Neuros</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/dashboard"
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'overview' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Overview
                  {viewMode === 'overview' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link
                  href="/dashboard/discover"
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'discover' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Discover
                  {viewMode === 'discover' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link
                  href="/dashboard/browse"
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'browse' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Library
                  {viewMode === 'browse' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link
                  href="/dashboard/stats"
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'stats' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Analytics
                  {viewMode === 'stats' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`relative py-5 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'settings' 
                      ? 'text-black' 
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  Settings
                  {viewMode === 'settings' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={onCreateCard}
                className="flex items-center justify-center h-9 w-9 bg-black text-white rounded-full hover:bg-black/80 transition-colors duration-200"
                title="Create Cards"
              >
                <PlusIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onSignOut}
                className="hidden md:block p-2 hover:bg-black/5 transition-colors duration-200"
                title="Sign out"
              >
                <LogOutIcon className="w-4 h-4 text-black/60 hover:text-black stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Greeting */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-black/30" />
              <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <h1 className="text-[clamp(3rem,5vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-4 text-black">
              {formatGreeting()}
            </h1>
            <p className="text-xl sm:text-2xl text-black/60 font-light leading-relaxed max-w-3xl">
              Welcome back! Let&apos;s continue your learning journey
            </p>
          </motion.div>

          {/* Stats Cards with loading states */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
                <div className="mb-4">
                  <BookIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                </div>
                <p className="text-3xl font-serif font-light text-black mb-1 animate-pulse">...</p>
                <p className="text-sm text-black/50">total cards</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
                <div className="mb-4">
                  <SparkleIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                </div>
                <p className="text-3xl font-serif font-light text-black mb-1 animate-pulse">...</p>
                <p className="text-sm text-black/50">mastered</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
                <div className="mb-4">
                  <ClockIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                </div>
                <p className="text-3xl font-serif font-light text-black mb-1 animate-pulse">...</p>
                <p className="text-sm text-black/50">due today</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
                <div className="mb-4">
                  <ChartIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                </div>
                <p className="text-3xl font-serif font-light text-black mb-1 animate-pulse">...</p>
                <p className="text-sm text-black/50">accuracy</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
                <div className="mb-4">
                  <HeartIcon className="w-5 h-5 text-black/40 stroke-[1.5]" />
                </div>
                <p className="text-3xl font-serif font-light text-black mb-1 animate-pulse">...</p>
                <p className="text-sm text-black/50">day streak</p>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
              <div className="mb-6">
                <SparkleIcon className="w-8 h-8 text-black/40 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-serif font-light mb-3">Create New Cards</h3>
              <p className="text-black/60 mb-6 font-light">
                Generate AI-powered flashcards or create your own to expand your knowledge base.
              </p>
              <button
                onClick={onCreateCard}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-black/90 transition-colors duration-200"
              >
                Start Creating
              </button>
            </Card>

            <Card className="p-6 bg-white rounded-xl border border-black/5 hover:shadow-md transition-all duration-300 shadow-sm">
              <div className="mb-6">
                <BookIcon className="w-8 h-8 text-black/40 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-serif font-light mb-3">Continue Learning</h3>
              <p className="text-black/60 mb-6 font-light">
                Review your cards using spaced repetition to build long-term memory.
              </p>
              <button
                className="border border-black/20 text-black px-8 py-3 rounded-full hover:bg-black/5 transition-colors duration-200"
                disabled
              >
                Loading Reviews...
              </button>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}