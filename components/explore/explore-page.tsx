'use client'

import { motion, useInView } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { ArrowRight, Search, Users, Clock, X } from 'lucide-react'
import { ZapIcon, CodeIcon, BeakerIcon, ChartIcon, PaletteIcon, GlobeIcon } from '@/components/icons/line-icons'

const categories = [
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence',
    icon: ZapIcon,
    color: '#FF6B6B',
    count: '2,340 cards',
    trending: true,
    description: 'Neural networks, transformers, and the future of computing',
    featured: ['GPT & LLMs', 'Computer Vision', 'Deep Learning']
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: CodeIcon,
    color: '#4ECDC4',
    count: '5,120 cards',
    description: 'From systems to web, master every paradigm',
    featured: ['TypeScript', 'Rust', 'System Design']
  },
  {
    id: 'science',
    name: 'Sciences',
    icon: BeakerIcon,
    color: '#95E77E',
    count: '1,890 cards',
    description: 'The fundamentals that shape our understanding',
    featured: ['Quantum Physics', 'Neuroscience', 'Biology']
  },
  {
    id: 'business',
    name: 'Business',
    icon: ChartIcon,
    color: '#A78BFA',
    count: '3,450 cards',
    description: 'Strategy, finance, and the art of growth',
    featured: ['Product Management', 'Venture Capital', 'Marketing']
  },
  {
    id: 'design',
    name: 'Design',
    icon: PaletteIcon,
    color: '#FFD700',
    count: '2,780 cards',
    description: 'Where creativity meets problem-solving',
    featured: ['Design Systems', '3D & WebGL', 'Motion']
  },
  {
    id: 'languages',
    name: 'Languages',
    icon: GlobeIcon,
    color: '#4169E1',
    count: '4,230 cards',
    description: 'Connect with the world, one word at a time',
    featured: ['Mandarin', 'Spanish', 'Japanese']
  }
]

const curated = [
  {
    title: 'The AI Engineer Path',
    author: 'Sarah Chen',
    duration: '12 weeks',
    students: '45.2k',
    rating: 4.9,
    description: 'From ML basics to deploying production models'
  },
  {
    title: 'Modern Full-Stack',
    author: 'Alex Rivera',
    duration: '8 weeks',
    students: '32.1k',
    rating: 4.8,
    description: 'Next.js, TypeScript, and the modern web stack'
  },
  {
    title: 'Quantum Fundamentals',
    author: 'Dr. James Liu',
    duration: '10 weeks',
    students: '12.3k',
    rating: 4.9,
    description: 'Demystifying quantum computing for developers'
  }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredCategories, setFilteredCategories] = useState(categories)
  const [isSearching, setIsSearching] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(() => {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.featured.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredCategories(filtered)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Unified Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.04) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)`
          }}
        />

        <motion.div 
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Explore
            </p>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-8">
            Knowledge,{' '}
            <span className="block text-black/60 mt-2">curated by experts.</span>
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <p className="text-xl text-black/60 font-light mb-8">
              Thousands of cards across every domain. From quantum physics to poetry, 
              find exactly what you need to master.
            </p>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics, concepts, or skills..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim() && filteredCategories.length > 0) {
                    // Select first result on Enter
                    setSelectedCategory(filteredCategories[0].id)
                    // Scroll to categories section
                    ref.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  if (e.key === 'Escape') {
                    // Clear search on Escape
                    setSearchQuery('')
                    setFilteredCategories(categories)
                    setSelectedCategory(null)
                  }
                }}
                className="w-full px-6 py-4 pr-12 bg-white border border-black/10 rounded-2xl focus:outline-none focus:border-black/30 transition-colors text-base"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilteredCategories(categories)
                    setSelectedCategory(null)
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-lg transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 text-black/40 hover:text-black/60" />
                </button>
              ) : isSearching ? (
                <motion.div
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-5 h-5 text-black/40" />
                </motion.div>
              ) : (
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
              )}
            </div>
            
            {/* Search Results Indicator */}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-black/60"
              >
                {isSearching ? (
                  <span>Searching...</span>
                ) : filteredCategories.length > 0 ? (
                  <span>Found {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} matching &quot;{searchQuery}&quot;</span>
                ) : (
                  <span>No categories found for &quot;{searchQuery}&quot;. Try different keywords.</span>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <section ref={ref} className="py-20 bg-white pattern-dots">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif font-light mb-12">Browse by domain</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white border border-black/5 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                  onMouseEnter={() => setSelectedCategory(category.id)}
                  onMouseLeave={() => setSelectedCategory(null)}
                >
                  {/* Category Icon */}
                  <category.icon className="w-10 h-10 mb-4 text-black/70 stroke-[1.5]" />

                  {/* Category Info */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-serif font-light">{category.name}</h3>
                      {category.trending && (
                        <span className="px-2 py-1 bg-yellow-100 text-xs rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-black/50 mb-4">{category.count}</p>
                    <p className="text-base text-black/70 font-light leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Featured Topics */}
                  <div className="space-y-2">
                    {category.featured.map((topic) => (
                      <div key={topic} className="flex items-center gap-2 text-sm text-black/60">
                        <div className="w-1 h-1 rounded-full bg-black/30" />
                        {topic}
                      </div>
                    ))}
                  </div>

                  {/* Hover Indicator */}
                  <motion.div
                    className="absolute bottom-8 right-8 w-10 h-10 rounded-full border border-black/10 flex items-center justify-center"
                    animate={selectedCategory === category.id ? { scale: 1.1 } : { scale: 1 }}
                  >
                    <ArrowRight className="w-4 h-4 text-black/30" />
                  </motion.div>

                  {/* Color Accent */}
                  <motion.div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-3xl origin-top"
                    style={{ backgroundColor: category.color }}
                    initial={{ scaleY: 0 }}
                    animate={selectedCategory === category.id ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated Paths */}
      <section className="py-20 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-12">
              <div>
                <h2 className="text-3xl font-serif font-light mb-4">Curated learning paths</h2>
                <p className="text-lg text-black/60 font-light">
                  Structured journeys designed by experts in the field
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {curated.map((path, index) => (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-black/5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-black/40" />
                      <span className="text-sm text-black/60">{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{path.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif mb-2">{path.title}</h3>
                  <p className="text-sm text-black/60 mb-4">{path.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-black/60">by {path.author}</div>
                      <div className="flex items-center gap-1 text-sm text-black/40">
                        <Users className="w-3 h-3" />
                        {path.students}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <TrustIndicators />
    </div>
  )
}