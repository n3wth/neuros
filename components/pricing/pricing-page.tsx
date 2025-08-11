'use client'

import { motion, useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import React from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { ArrowRight } from 'lucide-react'
import { SparkleIcon, BrainIcon, RocketIcon, GlobeIcon } from '@/components/icons/line-icons'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for trying out our platform',
    features: [
      { name: 'Up to 50 cards', included: true },
      { name: 'Basic spaced repetition', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Community support', included: true },
      { name: 'AI card generation (5/month)', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom AI training', included: false },
      { name: 'Priority support', included: false },
      { name: 'Team collaboration', included: false },
      { name: 'API access', included: false }
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Pro',
    price: { monthly: 19, annual: 15 },
    description: 'For serious learners and professionals',
    features: [
      { name: 'Unlimited cards', included: true },
      { name: 'Advanced spaced repetition', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Unlimited AI generation', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom learning paths', included: true },
      { name: 'Export & backup', included: true },
      { name: 'Team collaboration', included: false },
      { name: 'API access', included: false }
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
    badge: 'MOST POPULAR'
  },
  {
    name: 'Team',
    price: { monthly: 29, annual: 24 },
    description: 'For teams and organizations',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Team dashboard', included: true },
      { name: 'User management', included: true },
      { name: 'Priority phone support', included: true },
      { name: 'Custom AI training', included: true },
      { name: 'Advanced security (SSO)', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'API access', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated success manager', included: true }
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
]

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for enterprise accounts."
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "Yes, we offer a 14-day free trial for Pro plans. No credit card required to start your trial."
  },
  {
    question: "How does AI card generation work?",
    answer: "Our AI uses GPT-4 to automatically generate flashcards from your notes, documents, or topics. Free users get 5 generations per month, while Pro users get unlimited."
  },
  {
    question: "Can I export my data?",
    answer: "Pro and Team users can export all their data in multiple formats (JSON, CSV, Anki-compatible). We believe your data belongs to you."
  },
  {
    question: "What's included in priority support?",
    answer: "Pro users get 24-hour email response time. Team users get phone support and a dedicated success manager for onboarding."
  }
]

const comparisonFeatures = [
  { category: 'Core Features', features: [
    { name: 'Spaced repetition algorithm', free: 'Basic', pro: 'Advanced', team: 'Advanced + Custom' },
    { name: 'Number of cards', free: '50', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'Learning statistics', free: 'Basic', pro: 'Advanced', team: 'Enterprise' },
    { name: 'Mobile apps', free: '✓', pro: '✓', team: '✓' }
  ]},
  { category: 'AI Features', features: [
    { name: 'AI card generation', free: '5/month', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'AI explanations', free: '✗', pro: '✓', team: '✓' },
    { name: 'Custom AI training', free: '✗', pro: '✗', team: '✓' },
    { name: 'AI insights', free: '✗', pro: '✓', team: '✓' }
  ]},
  { category: 'Collaboration', features: [
    { name: 'Share decks', free: '✗', pro: '✓', team: '✓' },
    { name: 'Team workspace', free: '✗', pro: '✗', team: '✓' },
    { name: 'User roles', free: '✗', pro: '✗', team: '✓' },
    { name: 'Admin dashboard', free: '✗', pro: '✗', team: '✓' }
  ]},
  { category: 'Support & Security', features: [
    { name: 'Support', free: 'Community', pro: '24hr email', team: 'Phone + Dedicated' },
    { name: 'Data encryption', free: '✓', pro: '✓', team: '✓' },
    { name: 'SSO/SAML', free: '✗', pro: '✗', team: '✓' },
    { name: 'SLA', free: '✗', pro: '✗', team: '99.9%' }
  ]}
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] to-[#F8FAFC]">
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)`
          }}
        />

        <motion.div 
          className="max-w-[1400px] mx-auto px-8 lg:px-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Pricing
            </p>
          </div>

          <h1 className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-8">
            Simple pricing.
            <span className="block text-black/60 mt-2">Powerful results.</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl text-black/60 font-light leading-relaxed mb-12">
              Choose the perfect plan for your learning journey. 
              Start free, upgrade when you&apos;re ready.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-2 p-1 bg-white border border-black/10 rounded-full">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full transition-all ${
                  !isAnnual 
                    ? 'bg-black text-white' 
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                  isAnnual 
                    ? 'bg-black text-white' 
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Annual
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  isAnnual ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700'
                }`}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <section ref={ref} className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div 
                    className={`bg-white rounded-3xl p-8 h-full flex flex-col border ${
                      plan.highlighted ? 'ring-2 ring-blue-500 border-blue-200 shadow-xl' : 'border-black/5 hover:shadow-lg transition-shadow'
                    }`}
                  >
                    {plan.badge && (
                      <div className="text-center mb-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-serif font-light mb-3">{plan.name}</h3>
                      <p className="text-black/60 mb-6">{plan.description}</p>
                      <div className="text-5xl font-serif font-light mb-2">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                        {plan.price.monthly > 0 && (
                          <span className="text-lg font-sans font-normal text-black/40">/month</span>
                        )}
                      </div>
                      {plan.price.monthly > 0 && isAnnual && (
                        <p className="text-sm text-black/40">
                          Billed ${plan.price.annual * 12} annually
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-start gap-3">
                          <div className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.included ? 'text-green-600' : 'text-black/20'}`}>
                            {feature.included ? '✓' : '−'}
                          </div>
                          <span className={feature.included ? 'text-black/80' : 'text-black/30'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.name === 'Team' ? '/enterprise' : '/signup'} className="w-full">
                      <button 
                        className={`w-full px-6 py-3 rounded-full font-medium transition-colors ${
                          plan.highlighted 
                            ? 'bg-black text-white hover:bg-black/90' 
                            : 'border border-black/20 text-black hover:bg-black/5'
                        }`}
                      >
                        {plan.cta}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-[#FAFAF9]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <h2 className="text-3xl font-serif font-light mb-16 text-center">
            Detailed feature comparison
          </h2>

          <div className="bg-white rounded-3xl overflow-hidden border border-black/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="text-left p-6 font-medium">Features</th>
                    <th className="text-center p-6 font-medium">Free</th>
                    <th className="text-center p-6 font-medium">Pro</th>
                    <th className="text-center p-6 font-medium">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category) => (
                    <React.Fragment key={category.category}>
                      <tr className="border-b border-black/5 bg-[#FAFAF9]">
                        <td colSpan={4} className="p-6 font-medium text-sm text-black/50">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr key={feature.name} className="border-b border-black/5 hover:bg-[#FAFAF9] transition-colors">
                          <td className="p-6">{feature.name}</td>
                          <td className="text-center p-6 text-black/60">{feature.free}</td>
                          <td className="text-center p-6">{feature.pro}</td>
                          <td className="text-center p-6 font-medium">{feature.team}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <h2 className="text-3xl font-serif font-light mb-16 text-center">
            Frequently asked questions
          </h2>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  className="w-full text-left p-6 hover:bg-[#FAFAF9] rounded-2xl transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <ArrowRight 
                      className={`w-5 h-5 text-black/30 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  {expandedFaq === index && (
                    <p className="text-black/60 mt-4 font-light">{faq.answer}</p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light mb-4">
              Trusted by learners worldwide
            </h2>
            <p className="text-white/60">
              Join millions improving their knowledge with AI-powered learning
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BrainIcon, value: '2.5M+', label: 'Active Learners' },
              { icon: GlobeIcon, value: '180+', label: 'Countries' },
              { icon: SparkleIcon, value: '4.9/5', label: 'Average Rating' },
              { icon: RocketIcon, value: '47M+', label: 'Cards Reviewed' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/70" />
                <div className="text-2xl font-serif font-light mb-1">{stat.value}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FAFAF9]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="rounded-3xl p-16 text-center bg-gradient-to-br from-blue-50 to-purple-50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Start learning smarter today
            </h2>
            <p className="text-xl mb-8 text-black/60">
              No credit card required. Start with our free plan and upgrade anytime.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signup">
                <button className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors inline-flex items-center gap-2">
                  Start Free
                  <SparkleIcon className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/enterprise">
                <button className="px-8 py-3 border border-black/20 rounded-full hover:bg-white transition-colors inline-flex items-center gap-2">
                  <RocketIcon className="w-4 h-4" />
                  Learn about Teams
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <TrustIndicators />
    </div>
  )
}