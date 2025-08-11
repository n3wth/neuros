'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { SparkleIcon, ShieldIcon, GlobeIcon, LockIcon } from '@/components/icons/line-icons'

export default function TrustIndicators() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const companies = [
    'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 
    'Stanford', 'MIT', 'Harvard', 'Berkeley', 'Oxford'
  ]

  const security = [
    { icon: ShieldIcon, title: 'SOC 2 Type II', description: 'Certified security controls' },
    { icon: LockIcon, title: 'End-to-end encryption', description: 'Your data stays private' },
    { icon: GlobeIcon, title: 'GDPR compliant', description: 'Global privacy standards' },
    { icon: ShieldIcon, title: 'ISO 27001', description: 'Information security certified' }
  ]

  return (
    <footer ref={ref} className="bg-white border-t border-gray-200">
      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-gray-600 mb-8">Trusted by learners at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {companies.map((company, index) => (
              <motion.span
                key={company}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="text-lg font-light text-gray-600 hover:text-gray-900 transition-colors"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-b border-gray-100"
        >
          {security.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-3 text-black/40 stroke-[1.5]" />
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Footer Links - Simplified */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <Link href="/explore" className="text-gray-600 hover:text-black transition-colors">Explore</Link>
          <Link href="/research" className="text-gray-600 hover:text-black transition-colors">Research</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">Dashboard</Link>
          <span className="text-gray-300">|</span>
          <Link href="/signin" className="text-gray-600 hover:text-black transition-colors">Sign In</Link>
          <a href="https://twitter.com" className="text-gray-600 hover:text-black transition-colors">Twitter</a>
          <a href="mailto:hello@neuros.ai" className="text-gray-600 hover:text-black transition-colors">Contact</a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <SparkleIcon className="w-5 h-5 text-gray-400 stroke-[1.5]" />
              <span className="text-sm text-gray-400">Neuros © 2025</span>
            </div>
            
            <a 
              href="https://newth.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-400 font-light hover:text-gray-600 transition-colors group"
            >
              Made with{' '}
              <motion.span 
                className="inline-block italic font-serif text-gray-500"
                whileHover={{ 
                  rotate: [-2, 2, -1, 1, 0],
                  transition: { duration: 0.3 }
                }}
              >
                curiosity
              </motion.span>
              {' '}by Oliver Newth
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}