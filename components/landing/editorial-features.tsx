'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowUpRight, TrendingUp, Clock } from 'lucide-react'
import PlaceholderAvatar from '@/components/ui/placeholder-avatar'

export default function EditorialFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)

  const articles = [
    {
      id: 1,
      category: 'Neuroscience',
      categoryColor: '#FF6B6B',
      title: 'The Forgetting Curve Is Dead',
      subtitle: 'How AI rewrote 150 years of memory science',
      excerpt: 'Hermann Ebbinghaus discovered the forgetting curve in 1885. Modern spaced repetition algorithms help combat this natural forgetting process.',
      author: 'The Neuros Team',
      authorTitle: 'Learning Science',
      readTime: '12',
      featured: true,
      stats: { views: '48.2K', shares: '2.1K' }
    },
    {
      id: 2,
      category: 'Profile',
      categoryColor: '#4ECDC4',
      title: 'Zero to Staff Engineer',
      subtitle: "One developer's 12-month transformation",
      excerpt: 'Alex Rivera went from debugging React components to designing distributed systems at Google—using just 15 minutes a day.',
      author: 'Maya Patel',
      authorTitle: 'Senior Editor',
      readTime: '8',
      stats: { views: '31.5K', shares: '890' }
    },
    {
      id: 3,
      category: 'Deep Dive',
      categoryColor: '#95E77E',
      title: 'Inside Our Algorithm',
      subtitle: 'The math behind perfect memory',
      excerpt: 'We open-sourced our core algorithm. Here\'s exactly how we predict when you\'ll forget, and why it works.',
      author: 'The Neuros Team',
      authorTitle: 'Chief Science Officer',
      readTime: '15',
      stats: { views: '22.8K', shares: '1.4K' }
    },
    {
      id: 4,
      category: 'Future',
      categoryColor: '#A78BFA',
      title: 'The Post-Knowledge Economy',
      subtitle: 'When everyone remembers everything',
      excerpt: 'What happens to expertise when perfect recall becomes universal? A philosophical exploration of learning\'s next chapter.',
      author: 'Rebecca Torres',
      authorTitle: 'Contributing Writer',
      readTime: '10',
      stats: { views: '19.3K', shares: '560' }
    }
  ]

  return (
    <section ref={ref} className="py-32 bg-[#FAFAF9] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 80px),
                           repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 80px)`
        }}
      />

      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Editorial
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-8">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif font-light leading-[1.1] tracking-[-0.02em]">
                Ideas worth
                <span className="block text-black/60 mt-2">remembering.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-lg text-black/50 font-light mb-6">
                Deep dives into the science, philosophy, and future of human learning.
              </p>
              <button className="group inline-flex items-center gap-2 text-sm font-medium">
                <span className="border-b border-black/30 group-hover:border-black transition-colors">
                  Browse all articles
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Featured Articles Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Hero Article */}
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 group cursor-pointer"
              onMouseEnter={() => setHoveredArticle(1)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <div className="relative h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden mb-8">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-black/5" />
                
                {/* Category badge */}
                <div className="absolute top-8 left-8">
                  <span 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur rounded-full"
                    style={{ borderLeft: `3px solid ${articles[0].categoryColor}` }}
                  >
                    <span className="text-xs font-mono uppercase tracking-wider">
                      {articles[0].category}
                    </span>
                  </span>
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div className="flex gap-6 text-white/90">
                    <span className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      {articles[0].stats.views} views
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      {articles[0].readTime} min
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-4xl font-serif font-light mb-3 leading-tight group-hover:text-black/70 transition-colors">
                {articles[0].title}
              </h3>
              <p className="text-xl text-black/60 font-light mb-6">
                {articles[0].subtitle}
              </p>
              <p className="text-lg leading-relaxed text-black/70 font-light mb-8">
                {articles[0].excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <PlaceholderAvatar name={articles[0].author} size={48} />
                  <div>
                    <p className="text-sm font-medium">{articles[0].author}</p>
                    <p className="text-xs text-black/50">{articles[0].authorTitle}</p>
                  </div>
                </div>
                <motion.div
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center"
                  animate={hoveredArticle === 1 ? { scale: 1.1 } : { scale: 1 }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.article>

            {/* Side Articles */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5 space-y-8"
            >
              {articles.slice(1).map((article) => (
                <article 
                  key={article.id} 
                  className="group cursor-pointer pb-8 border-b border-black/5 last:border-0"
                  onMouseEnter={() => setHoveredArticle(article.id)}
                  onMouseLeave={() => setHoveredArticle(null)}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span 
                      className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${article.categoryColor}15`,
                        color: article.categoryColor 
                      }}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs text-black/40">
                      {article.readTime} min read
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-light mb-2 leading-tight group-hover:text-black/70 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-base text-black/50 font-light mb-4">
                    {article.subtitle}
                  </p>
                  <p className="text-sm leading-relaxed text-black/60 font-light mb-6">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-black/40">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.stats.views} views</span>
                    </div>
                    <motion.div
                      animate={hoveredArticle === article.id ? { x: 2, y: -2 } : { x: 0, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-black/30" />
                    </motion.div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl" />
          <div className="relative p-16">
            <div className="max-w-2xl">
              <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase mb-4">
                Weekly Digest
              </p>
              <h3 className="text-3xl font-serif font-light mb-4 leading-tight">
                The future of learning,<br />delivered to your inbox.
              </h3>
              <p className="text-lg text-black/60 font-light mb-8">
                Research breakthroughs, product updates, and stories from our community.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-3 bg-white border border-black/10 rounded-full focus:outline-none focus:border-black/30 transition-colors text-base"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-black/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="mt-6 text-xs text-black/40">
                Join 25,000+ curious minds. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}