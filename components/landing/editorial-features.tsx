'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight, BookOpen, Users, Lightbulb, BarChart3 } from 'lucide-react'

export default function EditorialFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const articles = [
    {
      category: 'Research',
      title: 'The Science Behind Spaced Repetition',
      excerpt: 'How cognitive science and AI combine to create the optimal learning experience. Based on decades of memory research.',
      author: 'Dr. Sarah Chen',
      role: 'Cognitive Scientist',
      readTime: '8 min read',
      image: '/api/placeholder/600/400',
      featured: true
    },
    {
      category: 'Case Study',
      title: 'From Junior to Senior Engineer in 12 Months',
      excerpt: 'How Alex used Neuros to master system design and land a senior role at a FAANG company.',
      author: 'Alex Rivera',
      role: 'Software Engineer',
      readTime: '5 min read',
      image: '/api/placeholder/400/300'
    },
    {
      category: 'Product',
      title: 'Introducing Voice-First Learning',
      excerpt: 'Learn while commuting with our new conversational AI mode. Perfect for busy professionals.',
      author: 'Neuros Team',
      role: 'Product Update',
      readTime: '3 min read',
      image: '/api/placeholder/400/300'
    }
  ]

  const stats = [
    { icon: BookOpen, value: '3M+', label: 'Cards mastered daily' },
    { icon: Users, value: '50K+', label: 'Active learners' },
    { icon: Lightbulb, value: '500+', label: 'Expert-curated topics' },
    { icon: BarChart3, value: '92%', label: 'Average retention rate' }
  ]

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                Stories from the community
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover how professionals, students, and lifelong learners are transforming 
                their knowledge acquisition with AI-powered learning.
              </p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-sm font-medium hover:text-gray-600 transition-colors">
              <span>View all stories</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured Article Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Featured Article */}
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 bg-gray-100 rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="absolute bottom-6 left-6">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded-full mb-3">
                    {articles[0].category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-3 group-hover:text-gray-600 transition-colors">
                {articles[0].title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {articles[0].excerpt}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{articles[0].author}</p>
                    <p className="text-xs text-gray-500">{articles[0].role}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{articles[0].readTime}</span>
              </div>
            </motion.article>

            {/* Secondary Articles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {articles.slice(1).map((article, index) => (
                <article key={index} className="group cursor-pointer">
                  <div className="flex space-x-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-xl flex-shrink-0" />
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded mb-2">
                        {article.category}
                      </span>
                      <h3 className="font-medium mb-2 group-hover:text-gray-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>·</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 pt-16 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <div className="text-3xl font-light mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 p-12 bg-gray-50 rounded-2xl"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-light mb-4">
              Stay ahead with weekly insights
            </h3>
            <p className="text-gray-600 mb-8">
              Get the latest in AI-powered learning, cognitive science research, and product updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-gray-500">
              Join 25,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}