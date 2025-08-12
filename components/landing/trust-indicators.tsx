'use client'

import { Shield, Lock, Globe, CheckCircle } from 'lucide-react'

export default function TrustIndicators() {
  const companies = [
    'Google',
    'Microsoft',
    'Meta',
    'Amazon',
    'Apple',
    'Stanford',
    'MIT',
    'Harvard',
    'Berkeley',
    'Oxford'
  ]

  const security = [
    { icon: Shield, title: 'SOC 2 Type II', description: 'Certified security' },
    { icon: Lock, title: 'End-to-end encryption', description: 'Data privacy' },
    { icon: Globe, title: 'GDPR compliant', description: 'Global standards' },
    { icon: CheckCircle, title: 'ISO 27001', description: 'Info security' }
  ]

  return (
    <footer className="bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-black/60 tracking-widest uppercase mb-8">
            Trusted by 50,000+ learners
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {companies.map((company) => (
              <div
                key={company}
                className="text-sm font-light text-black/40"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {security.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="text-center">
                <Icon className="w-6 h-6 mx-auto mb-3 text-black/30" />
                <h3 className="text-sm font-medium text-black/80 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-black/50">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-20 pt-8 border-t border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-black/40">
              © 2024 Neuros. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-xs text-black/40 hover:text-black/60">
                Privacy
              </a>
              <a href="/terms" className="text-xs text-black/40 hover:text-black/60">
                Terms
              </a>
              <a
                href="/security"
                className="text-xs text-black/40 hover:text-black/60"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

