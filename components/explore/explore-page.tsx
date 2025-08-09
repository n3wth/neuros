'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { 
  IconBrain, IconCode, IconMicroscope, IconTrendingUp, IconPalette, IconWorld,
  IconHeart, IconBuilding, IconCpu, IconBook, IconMusic, IconCamera,
  IconChevronRight, IconSearch, IconSparkles, IconUsers, IconClock, IconAward
} from '@tabler/icons-react'
import Link from 'next/link'
import { AppleCard } from '@/components/ui/apple-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  GoogleIcon, MicrosoftIcon, MetaIcon, OpenAIIcon,
  StanfordIcon, MITIcon, HarvardIcon
} from '@/components/icons/company-logos'
import { getMultipleAvatars } from '@/lib/avatars'

const categories = [
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: IconBrain,
    className: 'bg-orange-200',
    count: '2,340',
    trending: true,
    description: 'Neural networks, transformers, computer vision, NLP',
    topics: ['Deep Learning', 'GPT & LLMs', 'Computer Vision', 'Reinforcement Learning']
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: IconCode,
    className: 'bg-blue-200',
    count: '5,120',
    description: 'Full-stack development, systems programming, web3',
    topics: ['React & Next.js', 'Rust', 'TypeScript', 'System Design']
  },
  {
    id: 'science',
    name: 'Science',
    icon: IconMicroscope,
    className: 'bg-green-200',
    count: '1,890',
    description: 'Physics, chemistry, biology, neuroscience',
    topics: ['Quantum Physics', 'Molecular Biology', 'Neuroscience', 'Climate Science']
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: IconTrendingUp,
    className: 'bg-red-200',
    count: '3,450',
    description: 'Strategy, finance, entrepreneurship, crypto',
    topics: ['Product Management', 'Venture Capital', 'DeFi', 'Growth Marketing']
  },
  {
    id: 'design',
    name: 'Design & Creative',
    icon: IconPalette,
    className: 'bg-orange-300',
    count: '2,780',
    description: 'UX/UI, 3D modeling, generative art, motion design',
    topics: ['Design Systems', '3D & WebGL', 'Generative AI Art', 'Motion Graphics']
  },
  {
    id: 'languages',
    name: 'Languages',
    icon: IconWorld,
    className: 'bg-green-300',
    count: '4,230',
    description: 'Natural languages, linguistics, translation',
    topics: ['Mandarin', 'Spanish', 'Japanese', 'Arabic']
  }
]

const trendingPaths = [
  {
    title: 'Become an AI Engineer',
    duration: '12 weeks',
    level: 'Intermediate',
    students: '45.2k',
    rating: 4.9,
    partner: GoogleIcon,
    modules: 8
  },
  {
    title: 'Full-Stack with Next.js 15',
    duration: '8 weeks',
    level: 'Beginner',
    students: '32.1k',
    rating: 4.8,
    partner: MetaIcon,
    modules: 6
  },
  {
    title: 'Quantum Computing Fundamentals',
    duration: '10 weeks',
    level: 'Advanced',
    students: '12.4k',
    rating: 4.7,
    partner: MITIcon,
    modules: 10
  },
  {
    title: 'Product Management Masterclass',
    duration: '6 weeks',
    level: 'Intermediate',
    students: '28.3k',
    rating: 4.9,
    partner: MicrosoftIcon,
    modules: 5
  }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            Explore <span className="font-medium">Knowledge</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover curated learning paths designed by experts from leading institutions and companies
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for topics, skills, or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-xl border-gray-200"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2">
              Search
            </Button>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="flex items-center justify-center gap-8 mb-16">
          <GoogleIcon className="w-8 h-8" />
          <MicrosoftIcon className="w-8 h-8" />
          <MetaIcon className="w-8 h-8" />
          <OpenAIIcon className="w-8 h-8" />
          <StanfordIcon className="w-8 h-8" />
          <MITIcon className="w-8 h-8" />
          <HarvardIcon className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-light">Browse by Category</h2>
          <Button variant="ghost" className="text-gray-600">
            View All <IconChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AppleCard 
                glassy 
                interactive 
                className="p-6 h-full cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.className}`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  {category.trending && (
                    <span className="px-2 py-1 text-xs font-medium rounded flex items-center gap-1 bg-green-100 text-green-700">
                      <IconSparkles className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                      {topic}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{category.count} cards</span>
                  <IconChevronRight className="w-4 h-4" />
                </div>
              </AppleCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Learning Paths */}
      <div className="py-16 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Trending Learning Paths
            </h2>
            <p className="text-gray-300">
              Complete, structured programs designed by industry experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {trendingPaths.map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6 rounded-lg cursor-pointer bg-gray-800/20 transition-all duration-300 hover:bg-gray-800/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <path.partner className="w-8 h-8" />
                      <div>
                        <h3 className="text-xl font-medium">{path.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <IconClock className="w-3 h-3" />
                            {path.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconBook className="w-3 h-3" />
                            {path.modules} modules
                          </span>
                          <span className="flex items-center gap-1">
                            <IconUsers className="w-3 h-3" />
                            {path.students}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <IconAward className="w-4 h-4 fill-current" />
                        <span className="text-white">{path.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{path.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {getMultipleAvatars(4, `path-${index}`).map((avatarSrc, i) => (
                        <img 
                          key={i} 
                          src={avatarSrc} 
                          alt={`Student ${i + 1}`}
                          className="w-8 h-8 rounded object-cover border-2" 
style={{ borderColor: 'white' }}
                        />
                      ))}
                      <div className="w-8 h-8 rounded flex items-center justify-center text-xs border-2 bg-gray-600 border-white">
                        +{parseInt(path.students) > 10 ? Math.floor(parseInt(path.students) / 1000) : 5}k
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Start Path <IconChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div 
          className="rounded-lg p-12 text-center bg-primary text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Our AI can create a personalized learning path just for you
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Custom Path <IconSparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Footer */}
      <TrustIndicators />
    </div>
  )
}