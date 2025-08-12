'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Star, Filter, Search } from 'lucide-react'
import { ZapIcon, CodeIcon, BeakerIcon, ChartIcon, PaletteIcon, GlobeIcon } from '@/components/icons/line-icons'

interface CategoryPageProps {
  category: string
}

const categoryData: Record<string, {
  name: string
  icon: React.ElementType
  color: string
  description: string
  stats: {
    cards: string
    learners: string
    avgTime: string
  }
  topics: Array<{
    name: string
    cards: number
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    time: string
    rating: number
    learners: string
  }>
}> = {
  'ai-ml': {
    name: 'Artificial Intelligence',
    icon: ZapIcon,
    color: '#FF6B6B',
    description: 'Master neural networks, transformers, and the future of computing',
    stats: {
      cards: '2,340',
      learners: '45.2k',
      avgTime: '15 min/day'
    },
    topics: [
      { name: 'Introduction to Neural Networks', cards: 120, difficulty: 'Beginner', time: '2 weeks', rating: 4.8, learners: '12.3k' },
      { name: 'Transformers & Attention', cards: 180, difficulty: 'Advanced', time: '4 weeks', rating: 4.9, learners: '8.1k' },
      { name: 'Computer Vision Fundamentals', cards: 150, difficulty: 'Intermediate', time: '3 weeks', rating: 4.7, learners: '10.5k' },
      { name: 'Natural Language Processing', cards: 200, difficulty: 'Intermediate', time: '3 weeks', rating: 4.8, learners: '15.2k' },
      { name: 'Reinforcement Learning', cards: 160, difficulty: 'Advanced', time: '4 weeks', rating: 4.6, learners: '5.3k' },
      { name: 'Deep Learning with PyTorch', cards: 240, difficulty: 'Intermediate', time: '5 weeks', rating: 4.9, learners: '18.7k' }
    ]
  },
  'programming': {
    name: 'Programming',
    icon: CodeIcon,
    color: '#4ECDC4',
    description: 'From systems to web, master every paradigm',
    stats: {
      cards: '5,120',
      learners: '68.4k',
      avgTime: '20 min/day'
    },
    topics: [
      { name: 'TypeScript Mastery', cards: 280, difficulty: 'Intermediate', time: '4 weeks', rating: 4.9, learners: '25.6k' },
      { name: 'Rust for Systems Programming', cards: 320, difficulty: 'Advanced', time: '6 weeks', rating: 4.8, learners: '12.3k' },
      { name: 'System Design Patterns', cards: 200, difficulty: 'Advanced', time: '5 weeks', rating: 4.9, learners: '19.8k' },
      { name: 'Data Structures & Algorithms', cards: 450, difficulty: 'Intermediate', time: '8 weeks', rating: 4.7, learners: '31.2k' },
      { name: 'Modern Web Development', cards: 350, difficulty: 'Beginner', time: '6 weeks', rating: 4.8, learners: '28.9k' },
      { name: 'Functional Programming', cards: 180, difficulty: 'Intermediate', time: '3 weeks', rating: 4.6, learners: '8.7k' }
    ]
  },
  'science': {
    name: 'Sciences',
    icon: BeakerIcon,
    color: '#95E77E',
    description: 'The fundamentals that shape our understanding',
    stats: {
      cards: '1,890',
      learners: '23.7k',
      avgTime: '18 min/day'
    },
    topics: [
      { name: 'Quantum Physics Fundamentals', cards: 140, difficulty: 'Advanced', time: '4 weeks', rating: 4.7, learners: '6.2k' },
      { name: 'Neuroscience & Brain', cards: 160, difficulty: 'Intermediate', time: '3 weeks', rating: 4.8, learners: '8.9k' },
      { name: 'Molecular Biology', cards: 190, difficulty: 'Intermediate', time: '4 weeks', rating: 4.6, learners: '7.3k' },
      { name: 'Climate Science', cards: 120, difficulty: 'Beginner', time: '2 weeks', rating: 4.8, learners: '11.2k' },
      { name: 'Organic Chemistry', cards: 220, difficulty: 'Advanced', time: '5 weeks', rating: 4.5, learners: '5.8k' },
      { name: 'Astrophysics', cards: 130, difficulty: 'Intermediate', time: '3 weeks', rating: 4.9, learners: '9.4k' }
    ]
  },
  'business': {
    name: 'Business',
    icon: ChartIcon,
    color: '#A78BFA',
    description: 'Strategy, finance, and the art of growth',
    stats: {
      cards: '3,450',
      learners: '52.1k',
      avgTime: '12 min/day'
    },
    topics: [
      { name: 'Product Management Essentials', cards: 180, difficulty: 'Intermediate', time: '3 weeks', rating: 4.8, learners: '18.3k' },
      { name: 'Venture Capital & Startups', cards: 150, difficulty: 'Advanced', time: '4 weeks', rating: 4.7, learners: '9.8k' },
      { name: 'Digital Marketing Strategy', cards: 200, difficulty: 'Beginner', time: '3 weeks', rating: 4.6, learners: '21.5k' },
      { name: 'Financial Analysis', cards: 240, difficulty: 'Intermediate', time: '5 weeks', rating: 4.7, learners: '14.2k' },
      { name: 'Business Strategy', cards: 160, difficulty: 'Advanced', time: '4 weeks', rating: 4.9, learners: '11.7k' },
      { name: 'Leadership & Management', cards: 140, difficulty: 'Beginner', time: '2 weeks', rating: 4.8, learners: '16.9k' }
    ]
  },
  'design': {
    name: 'Design',
    icon: PaletteIcon,
    color: '#FFD700',
    description: 'Where creativity meets problem-solving',
    stats: {
      cards: '2,780',
      learners: '34.6k',
      avgTime: '16 min/day'
    },
    topics: [
      { name: 'Design Systems', cards: 190, difficulty: 'Intermediate', time: '4 weeks', rating: 4.8, learners: '12.4k' },
      { name: '3D & WebGL', cards: 220, difficulty: 'Advanced', time: '5 weeks', rating: 4.7, learners: '7.2k' },
      { name: 'Motion Design', cards: 160, difficulty: 'Intermediate', time: '3 weeks', rating: 4.9, learners: '9.8k' },
      { name: 'UI/UX Fundamentals', cards: 180, difficulty: 'Beginner', time: '3 weeks', rating: 4.8, learners: '15.7k' },
      { name: 'Typography & Layout', cards: 140, difficulty: 'Beginner', time: '2 weeks', rating: 4.6, learners: '11.3k' },
      { name: 'Brand Identity', cards: 120, difficulty: 'Intermediate', time: '2 weeks', rating: 4.7, learners: '8.9k' }
    ]
  },
  'languages': {
    name: 'Languages',
    icon: GlobeIcon,
    color: '#4169E1',
    description: 'Connect with the world, one word at a time',
    stats: {
      cards: '4,230',
      learners: '41.3k',
      avgTime: '25 min/day'
    },
    topics: [
      { name: 'Mandarin HSK 1-3', cards: 380, difficulty: 'Beginner', time: '8 weeks', rating: 4.8, learners: '14.2k' },
      { name: 'Spanish Conversation', cards: 320, difficulty: 'Intermediate', time: '6 weeks', rating: 4.7, learners: '18.6k' },
      { name: 'Japanese N5-N3', cards: 420, difficulty: 'Beginner', time: '10 weeks', rating: 4.9, learners: '11.8k' },
      { name: 'French Business', cards: 280, difficulty: 'Advanced', time: '5 weeks', rating: 4.6, learners: '6.4k' },
      { name: 'German Grammar', cards: 260, difficulty: 'Intermediate', time: '6 weeks', rating: 4.5, learners: '8.3k' },
      { name: 'Korean Essentials', cards: 340, difficulty: 'Beginner', time: '7 weeks', rating: 4.8, learners: '9.7k' }
    ]
  }
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const data = categoryData[category]
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  
  if (!data) return null

  const filteredTopics = data.topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || topic.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <div className="pt-32 pb-16 relative">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${data.color}20 0%, transparent 50%)`
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <Link 
            href="/explore" 
            className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${data.color}20` }}
                >
                  <data.icon className="w-8 h-8" style={{ color: data.color }} />
                </div>
                <div className="h-px flex-1 bg-black/10" />
              </div>
              
              <h1 className="text-[clamp(3rem,5vw,4rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-6">
                {data.name}
              </h1>
              
              <p className="text-xl text-black/60 font-light leading-relaxed mb-8">
                {data.description}
              </p>

              <Link 
                href="/signup"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition-colors"
              >
                Start Learning
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            {/* Right Column - Stats */}
            <div className="lg:pl-12">
              <div className="bg-white rounded-3xl p-8 border border-black/5">
                <h3 className="text-sm font-mono text-black/60 uppercase tracking-wider mb-6">
                  Community Stats
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-serif font-light mb-1">{data.stats.cards}</div>
                    <div className="text-sm text-black/60">Total cards</div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-serif font-light mb-1">{data.stats.learners}</div>
                    <div className="text-sm text-black/60">Active learners</div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-serif font-light mb-1">{data.stats.avgTime}</div>
                    <div className="text-sm text-black/60">Average study time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#FAFAF9] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-[#FAFAF9] rounded-xl hover:bg-black/5 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              
              <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(
                      selectedDifficulty === level ? null : level
                    )}
                    className={`px-4 py-3 rounded-xl text-sm transition-colors ${
                      selectedDifficulty === level 
                        ? 'bg-black text-white' 
                        : 'bg-[#FAFAF9] hover:bg-black/5'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white border border-black/5 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {topic.difficulty}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{topic.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-serif mb-4 group-hover:text-black/80 transition-colors">
                  {topic.name}
                </h3>
                
                <div className="space-y-2 text-sm text-black/60">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                    {topic.cards} cards
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {topic.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    {topic.learners} learners
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-black/5">
                  <button className="w-full py-2 text-sm text-center text-black/60 hover:text-black transition-colors">
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}