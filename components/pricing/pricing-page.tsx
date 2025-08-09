'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { 
  IconCheck, IconX, IconBrain, IconSparkles, IconBolt, IconUsers, IconShield,
  IconChevronRight, IconHelpCircle, IconCreditCard, IconBuilding, 
  IconAward, IconClock, IconChartBar, IconWorld, IconHeadphones
} from '@tabler/icons-react'
import Link from 'next/link'
import { AppleCard } from '@/components/ui/apple-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
// Using CSS variables from globals.css

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

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            Simple, Transparent <span className="font-medium">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your learning journey. 
            Start free, upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
              <span className="ml-2 px-2 py-1 text-sm font-medium rounded bg-secondary text-green-600">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AppleCard 
                glassy 
                elevated={plan.highlighted}
                className={`p-8 h-full flex flex-col ${
                  plan.highlighted ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.badge && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 text-xs font-medium rounded bg-secondary text-primary">
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-medium mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-5xl font-semibold mb-2">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                    {plan.price.monthly > 0 && (
                      <span className="text-lg font-normal text-gray-600">/month</span>
                    )}
                  </div>
                  {plan.price.monthly > 0 && isAnnual && (
                    <p className="text-sm text-gray-500">
                      Billed ${plan.price.annual * 12} annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <IconX className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.name === 'Team' ? '/enterprise' : '/signup'}>
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </AppleCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">
            Detailed Feature Comparison
          </h2>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-secondary">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="text-center p-4 font-medium">Free</th>
                    <th className="text-center p-4 font-medium">Pro</th>
                    <th className="text-center p-4 font-medium">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category) => (
                    <React.Fragment key={category.category}>
                      <tr className="border-b bg-secondary">
                        <td colSpan={4} className="p-4 font-medium text-sm text-gray-600">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr key={feature.name} className="border-b hover:bg-gray-50">
                          <td className="p-4">{feature.name}</td>
                          <td className="text-center p-4 text-gray-600">{feature.free}</td>
                          <td className="text-center p-4">{feature.pro}</td>
                          <td className="text-center p-4 font-medium">{feature.team}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-light text-center mb-12">
          Frequently Asked Questions
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
                className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <IconChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                {expandedFaq === index && (
                  <p className="text-gray-600 mt-3">{faq.answer}</p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-16 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">
              Trusted by Learners Worldwide
            </h2>
            <p className="text-gray-300">
              Join millions improving their knowledge with AI-powered learning
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: IconUsers, value: '2.5M+', label: 'Active Learners' },
              { icon: IconWorld, value: '180+', label: 'Countries' },
              { icon: IconAward, value: '4.9/5', label: 'Average Rating' },
              { icon: IconClock, value: '47M+', label: 'Cards Reviewed' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div 
          className="rounded-lg p-12 text-center bg-primary text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Start Learning Smarter Today
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            No credit card required. Start with our free plan and upgrade anytime.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Start Free <IconSparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/20 border-white/50 text-white hover:bg-white/30"
              >
                <IconBuilding className="w-4 h-4 mr-2" />
                Enterprise Solutions
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <TrustIndicators />
    </div>
  )
}

// Add React import for Fragment
import React from 'react'