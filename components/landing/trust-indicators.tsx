'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Lock, Globe, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TrustIndicators() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const companies = [
    'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 
    'Stanford', 'MIT', 'Harvard', 'Berkeley', 'Oxford'
  ]

  const security = [
    { icon: Shield, title: 'SOC 2 Type II', description: 'Certified security' },
    { icon: Lock, title: 'End-to-end encryption', description: 'Data privacy' },
    { icon: Globe, title: 'GDPR compliant', description: 'Global standards' },
    { icon: CheckCircle, title: 'ISO 27001', description: 'Info security' }
  ]

  return (
    <footer ref={ref} className="bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-black/60 tracking-widest uppercase mb-8">
            Trusted by 50,000+ learners
          </p>
          
          {/* Simple company logos list */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {companies.map((company) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                className="text-sm font-light text-black/40 hover:text-black/60 transition-colors"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security badges - simplified grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {security.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Icon className="w-6 h-6 mx-auto mb-3 text-black/30" />
                <h3 className="text-sm font-medium text-black/80 mb-1">{item.title}</h3>
                <p className="text-xs text-black/50">{item.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Simple footer */}
        <div className="mt-20 pt-8 border-t border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-black/40">
              © 2024 Neuros. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-black/40 hover:text-black/60">Privacy</Link>
              <Link href="/terms" className="text-xs text-black/40 hover:text-black/60">Terms</Link>
              <Link href="/security" className="text-xs text-black/40 hover:text-black/60">Security</Link>
            </div>
            
            <div className="text-xs text-gray-400 font-light">
              A pet project by{' '}
              <a
                href="https://newth.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 font-light hover:text-gray-600 transition-colors"
              >
                Oliver Newth
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}