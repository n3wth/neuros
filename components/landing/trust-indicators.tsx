'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Award, Globe, Lock } from 'lucide-react'
import Link from 'next/link'

export default function TrustIndicators() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const companies = [
    'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 
    'Stanford', 'MIT', 'Harvard', 'Berkeley', 'Oxford'
  ]

  const security = [
    { icon: Shield, title: 'SOC 2 Type II', description: 'Certified security controls' },
    { icon: Lock, title: 'End-to-end encryption', description: 'Your data stays private' },
    { icon: Globe, title: 'GDPR compliant', description: 'Global privacy standards' },
    { icon: Award, title: 'ISO 27001', description: 'Information security certified' }
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
                <Icon className="w-8 h-8 mx-auto mb-3 text-gray-400" />
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
              <li><Link href="/features" className="text-sm text-gray-600 hover:text-black transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-black transition-colors">Pricing</Link></li>
              <li><Link href="/enterprise" className="text-sm text-gray-600 hover:text-black transition-colors">Enterprise</Link></li>
              <li><Link href="/changelog" className="text-sm text-gray-600 hover:text-black transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/docs" className="text-sm text-gray-600 hover:text-black transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="text-sm text-gray-600 hover:text-black transition-colors">API</Link></li>
              <li><Link href="/research" className="text-sm text-gray-600 hover:text-black transition-colors">Research</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-600 hover:text-black transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">About</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-600 hover:text-black transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-sm text-gray-600 hover:text-black transition-colors">Press</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-black transition-colors">Terms</Link></li>
              <li><Link href="/security" className="text-sm text-gray-600 hover:text-black transition-colors">Security</Link></li>
              <li><Link href="/compliance" className="text-sm text-gray-600 hover:text-black transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-sm text-gray-600">© 2025 Neuros. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/twitter" className="text-sm text-gray-600 hover:text-black transition-colors">Twitter</Link>
            <Link href="/github" className="text-sm text-gray-600 hover:text-black transition-colors">GitHub</Link>
            <Link href="/discord" className="text-sm text-gray-600 hover:text-black transition-colors">Discord</Link>
            <Link href="/linkedin" className="text-sm text-gray-600 hover:text-black transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}