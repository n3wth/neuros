'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function TrustIndicators() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const companies = [
    'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 
    'Stanford', 'MIT', 'Harvard', 'Berkeley', 'Oxford'
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


        {/* Simple footer */}
        <div className="mt-20 pt-8 border-t border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-black/40">
              © 2024 Neuros. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}