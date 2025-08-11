'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote, ArrowRight } from 'lucide-react'

export default function SocialProof() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const testimonials = [
    {
      quote: "Neuros transformed how I learn. The AI actually understands when I'm struggling and adapts immediately. My retention went from 40% to 87% in just 3 months.",
      author: "Sarah Chen",
      role: "Medical Student",
      institution: "Stanford University",
      rating: 5
    },
    {
      quote: "As an executive, I need to learn fast. Neuros compressed my learning curve by 60%. The spaced repetition system is unlike anything I've tried.",
      author: "Marcus Rodriguez", 
      role: "VP of Engineering",
      institution: "Google",
      rating: 5
    },
    {
      quote: "The cognitive science behind Neuros is remarkable. It's not just another flashcard app—it's a complete learning architecture that mirrors how our brains work.",
      author: "Dr. Emily Watson",
      role: "Cognitive Scientist",
      institution: "MIT",
      rating: 5
    }
  ]

  const companies = [
    { name: "Google", users: "2,847" },
    { name: "Microsoft", users: "1,923" },
    { name: "Apple", users: "1,456" },
    { name: "Meta", users: "1,234" },
    { name: "Netflix", users: "892" },
    { name: "Tesla", users: "678" }
  ]

  const metrics = [
    { 
      value: "87%", 
      label: "Average retention rate",
      sublabel: "vs 23% traditional methods"
    },
    { 
      value: "2.3x", 
      label: "Faster skill acquisition",
      sublabel: "based on time-to-mastery"
    },
    { 
      value: "50,000+", 
      label: "Active learners worldwide",
      sublabel: "across 40+ countries"
    },
    { 
      value: "4.9", 
      label: "App Store rating",
      sublabel: "from 12,000+ reviews"
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 mb-6">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">Trusted by learners worldwide</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
            Join the learning
            <br />
            <span className="text-gray-600">revolution</span>
          </h2>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <motion.div 
                className="text-3xl lg:text-4xl font-light text-gray-900 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              >
                {metric.value}
              </motion.div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-600">
                {metric.sublabel}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 + (index * 0.1) }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Usage */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-600 mb-12">
            Trusted by professionals at the world&apos;s most innovative companies
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 + (index * 0.1) }}
              >
                <div className="text-2xl font-light text-gray-400 group-hover:text-gray-600 transition-colors mb-2">
                  {company.name}
                </div>
                <div className="text-xs text-gray-500">
                  {company.users} users
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
              Join 50,000+ learners
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}