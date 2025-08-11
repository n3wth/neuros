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
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background gradient orb */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/30 via-pink-100/30 to-blue-100/30 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
            <p className="text-xs font-medium text-gray-700 tracking-wide uppercase">Trusted by 50,000+ learners</p>
          </motion.div>
          
          <div className="relative">
            {/* Scrolling logos container */}
            <div className="flex items-center justify-center gap-x-16 gap-y-8 flex-wrap">
              {companies.map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative"
                >
                  <motion.span
                    className="relative text-2xl font-light text-gray-400 hover:text-gray-900 transition-all duration-300 cursor-default"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {company}
                    <motion.span 
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-400 to-pink-400 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                  {/* Decorative dot */}
                  {index % 3 === 0 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-purple-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-16 rounded-2xl bg-gradient-to-br from-gray-50/50 to-white border border-gray-100/50 backdrop-blur-sm"
        >
          {security.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div 
                key={index} 
                className="text-center group cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className="relative inline-block"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <Icon className="relative w-10 h-10 mx-auto mb-3 text-black/50 group-hover:text-black/70 stroke-[1.5] transition-colors duration-300" />
                </motion.div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">{item.description}</p>
              </motion.div>
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