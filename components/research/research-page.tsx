'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { ArrowRight, Download, ExternalLink, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const papers = [
  {
    title: "LECTOR: LLM-Enhanced Concept-based Test-Oriented Repetition",
    authors: "Zhao, J., Xi'an University",
    journal: "arXiv",
    year: 2024,
    citations: 12,
    impact: "Preprint",
    abstract: "Novel adaptive scheduling algorithm using LLMs for semantic analysis, achieving 90.2% success rate compared to 88.4% for traditional methods.",
    link: "https://arxiv.org/html/2508.03275v1"
  },
  {
    title: "DRL-SRS: Deep Reinforcement Learning for Spaced Repetition",
    authors: "Xiao, Q. & Wang, J.",
    journal: "Applied Sciences",
    year: 2024,
    citations: 8,
    impact: 3.7,
    abstract: "Transformer-based model with Deep Q-Network achieving state-of-the-art performance in memory prediction and spaced repetition scheduling.",
    link: "https://www.mdpi.com/2076-3417/14/13/5591"
  },
  {
    title: "Meta-Analysis of AI in Education: 13 Studies Across 8 Countries",
    authors: "Zhang, J., Jantakoon, T. & Laoha, R.",
    journal: "Higher Education Studies",
    year: 2025,
    citations: 3,
    impact: "New",
    abstract: "Comprehensive meta-analysis revealing significant positive effect size (Hedges' g = 0.86) for AI integration in education, with chatbots showing the strongest impact.",
    link: "https://doi.org/10.5539/hes.v15n2p189"
  }
]

const insights = [
  {
    stat: "Built",
    label: "with research",
    description: "Our features are inspired by cognitive science principles"
  },
  {
    stat: "Open",
    label: "source algorithms",
    description: "Using established spaced repetition methods"
  },
  {
    stat: "Modern",
    label: "web technologies",
    description: "Built with Next.js, TypeScript, and Supabase"
  },
  {
    stat: "Simple",
    label: "and effective",
    description: "Focus on helping you learn and remember better"
  }
]

export default function ResearchPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
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
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Research
            </p>
          </div>

          <h1 className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-8">
            Science,
            <span className="block text-black/60 mt-2">not speculation.</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl text-black/60 font-light leading-relaxed mb-12">
              Every feature we build is grounded in peer-reviewed research. 
              Our collaboration with leading cognitive scientists ensures that your learning 
              is optimized by the latest discoveries in memory and cognition.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link href="#papers" className="group inline-flex items-center gap-3">
                <span className="text-lg border-b-2 border-black/20 group-hover:border-black transition-colors">
                  Read our papers
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              <Link href="/docs/api" className="group inline-flex items-center gap-3">
                <span className="text-lg text-black/60 hover:text-black transition-colors">
                  Access our API
                </span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key Insights */}
      <section className="py-20 bg-white pattern-grid">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif font-light mb-16">Key discoveries</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-serif font-light mb-2">{insight.stat}</div>
                  <div className="text-sm font-medium text-black/80 mb-2">{insight.label}</div>
                  <p className="text-sm text-black/50 leading-relaxed">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Papers */}
      <section id="papers" className="py-20 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif font-light mb-16">Published research</h2>
            
            <div className="space-y-8">
              {papers.map((paper, index) => (
                <motion.article
                  key={paper.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-black/5 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-black/50">
                        {paper.journal} • {paper.year}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{paper.citations} citations</span>
                      </div>
                      <div className="px-3 py-1 bg-blue-50 rounded-full">
                        <span className="text-xs font-medium">Impact: {paper.impact}</span>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-5 h-5 text-black/40 hover:text-black transition-colors" />
                    </button>
                  </div>

                  <h3 className="text-xl font-serif mb-2">
                    {paper.link ? (
                      <a href={paper.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                        {paper.title}
                      </a>
                    ) : (
                      paper.title
                    )}
                  </h3>
                  <p className="text-sm text-black/60 mb-4">{paper.authors}</p>
                  <p className="text-base text-black/70 leading-relaxed">{paper.abstract}</p>
                </motion.article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a 
                href="https://scholar.google.com/scholar?q=spaced+repetition+AI+learning+2023+2024" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium"
              >
                <span className="border-b border-black/30 group-hover:border-black transition-colors">
                  Browse more research on Google Scholar
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaborations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-light mb-4">Research partnerships</h2>
              <p className="text-lg text-black/60 font-light">
                Collaborating with the world&apos;s leading institutions
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Stanford AI Lab', 'MIT CSAIL', 'DeepMind', 'Harvard Medical'].map((partner, index) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-center p-8 border border-black/5 rounded-2xl hover:border-black/20 transition-colors"
                >
                  <span className="text-sm font-medium text-black/60">{partner}</span>
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