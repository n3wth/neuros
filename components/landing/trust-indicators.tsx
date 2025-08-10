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
                animate={isInView ? { opacity: 0.4 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="text-lg font-light text-gray-400 hover:text-gray-600 transition-colors"
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

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-sm font-medium mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/explore" className="text-sm text-gray-600 hover:text-black transition-colors">Explore</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-black transition-colors">Pricing</Link></li>
              <li><Link href="/enterprise" className="text-sm text-gray-600 hover:text-black transition-colors">Enterprise</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-600 hover:text-black transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Learn</h4>
            <ul className="space-y-3">
              <li><Link href="/research" className="text-sm text-gray-600 hover:text-black transition-colors">Research</Link></li>
              <li><Link href="/learn" className="text-sm text-gray-600 hover:text-black transition-colors">Start Learning</Link></li>
              <li><Link href="/ai-demo" className="text-sm text-gray-600 hover:text-black transition-colors">AI Demo</Link></li>
              <li><a href="https://github.com/neurosai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors" aria-label="Neuros on GitHub">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Connect</h4>
            <ul className="space-y-3">
              <li><a href="https://twitter.com/neurosai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors" aria-label="Neuros on Twitter">Twitter</a></li>
              <li><a href="https://linkedin.com/company/neurosai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors" aria-label="Neuros on LinkedIn">LinkedIn</a></li>
              <li><a href="https://discord.gg/neurosai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors" aria-label="Join Neuros Discord">Discord</a></li>
              <li><a href="mailto:hello@neuros.ai" className="text-sm text-gray-600 hover:text-black transition-colors" aria-label="Email Neuros">Email</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Account</h4>
            <ul className="space-y-3">
              <li><Link href="/signin" className="text-sm text-gray-600 hover:text-black transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="text-sm text-gray-600 hover:text-black transition-colors">Sign Up</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-600 hover:text-black transition-colors">Dashboard</Link></li>
              <li><a href="#" className="text-sm text-gray-400 cursor-not-allowed">Settings</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <SparkleIcon className="w-5 h-5 text-gray-400 stroke-[1.5]" />
              <span className="text-sm text-gray-400">© 2025 Neuros</span>
            </div>
            
            {/* Cute detail: animated dots that respond to hover */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1 group">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-black/10 group-hover:bg-blue-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-black/10 group-hover:bg-green-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  transition={{ delay: 0.1 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-black/10 group-hover:bg-purple-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  transition={{ delay: 0.2 }}
                />
              </div>
              <a 
                href="https://newth.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-400 font-light hover:text-gray-600 transition-colors"
              >
                Made with curiosity by Oliver Newth
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}