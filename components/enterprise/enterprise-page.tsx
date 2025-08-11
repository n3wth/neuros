'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { ArrowRight } from 'lucide-react'
import { TrophyIcon, CodeIcon, ChartIcon, GlobeIcon, RocketIcon, SparkleIcon, TrendingIcon } from '@/components/icons/line-icons'
import PlaceholderAvatar from '@/components/ui/placeholder-avatar'
import Link from 'next/link'

const features = [
  {
    icon: TrophyIcon,
    title: "Team Management",
    description: "Centralized dashboard for tracking team progress, assigning content, and managing licenses"
  },
  {
    icon: SparkleIcon,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified, SSO/SAML, role-based access control, and data encryption"
  },
  {
    icon: ChartIcon,
    title: "Advanced Analytics",
    description: "Real-time insights into learning patterns, skill gaps, and ROI metrics"
  },
  {
    icon: RocketIcon,
    title: "AI Customization",
    description: "Train the AI on your company's knowledge base and terminology"
  },
  {
    icon: GlobeIcon,
    title: "Global Deployment",
    description: "Multi-language support, regional data centers, and 99.9% uptime SLA"
  },
  {
    icon: CodeIcon,
    title: "API Integration",
    description: "Seamless integration with your LMS, HR systems, and productivity tools"
  }
]

const useCases = [
  {
    title: "Employee Onboarding",
    description: "Reduce onboarding time by 50% with personalized learning paths",
    icon: RocketIcon,
    metrics: ["2 weeks faster", "87% retention", "4.8/5 satisfaction"]
  },
  {
    title: "Skills Development",
    description: "Upskill your workforce with AI-powered recommendations",
    icon: ChartIcon,
    metrics: ["63% faster learning", "2.3x retention", "91% completion"]
  },
  {
    title: "Compliance Training",
    description: "Ensure 100% compliance with automated tracking and reporting",
    icon: SparkleIcon,
    metrics: ["100% compliance", "75% time saved", "0 violations"]
  },
  {
    title: "Leadership Development",
    description: "Build next-generation leaders with executive coaching paths",
    icon: TrendingIcon,
    metrics: ["42% promotion rate", "89% engagement", "3.2x ROI"]
  }
]

const testimonials = [
  {
    quote: "Neuros transformed our engineering onboarding. New hires are productive 3x faster.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    companyName: "Google"
  },
  {
    quote: "The AI customization feature lets us train on our proprietary codebase. Game-changing.",
    author: "Michael Rodriguez",
    role: "CTO",
    companyName: "Stripe"
  },
  {
    quote: "We've seen a 47% improvement in skill acquisition across our 50,000+ employees.",
    author: "Jennifer Park",
    role: "Chief Learning Officer",
    companyName: "Microsoft"
  }
]

const plans = [
  {
    name: "Team",
    minUsers: "10-50 users",
    price: "$29",
    features: [
      "All Pro features",
      "Team dashboard",
      "Basic analytics",
      "Priority support",
      "Custom branding"
    ]
  },
  {
    name: "Business",
    minUsers: "50-500 users",
    price: "$19",
    featured: true,
    features: [
      "All Team features",
      "Advanced analytics",
      "SSO/SAML",
      "API access",
      "Dedicated success manager",
      "Custom integrations"
    ]
  },
  {
    name: "Enterprise",
    minUsers: "500+ users",
    price: "Custom",
    features: [
      "All Business features",
      "AI customization",
      "On-premise deployment",
      "99.9% uptime SLA",
      "24/7 phone support",
      "Executive briefings"
    ]
  }
]

export default function EnterprisePage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.04) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.04) 0%, transparent 50%)`
          }}
        />

        <motion.div 
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-black/30" />
            <p className="text-xs font-mono text-black/50 tracking-[0.2em] uppercase">
              Enterprise
            </p>
          </div>

          <h1 className="text-[clamp(3rem,6vw,5rem)] font-serif font-light leading-[1.1] tracking-[-0.02em] mb-8">
            Scale learning.
            <span className="block text-black/60 mt-2">Transform performance.</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl text-black/60 font-light leading-relaxed mb-12">
              Empower your workforce with AI-driven personalized learning at scale. 
              Join 500+ organizations achieving measurable results through intelligent knowledge management.
            </p>

            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => window.location.href = 'mailto:hello@neuros.ai?subject=Enterprise Demo Request'}
                className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors">
                <span className="text-lg">Schedule a demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <Link href="#testimonials" className="group inline-flex items-center gap-3 px-6 py-3">
                <span className="text-lg text-black/70 hover:text-black transition-colors">
                  View testimonials
                </span>
              </Link>
            </div>
          </div>

          {/* Trust line */}
          <div className="mt-20 pt-12 border-t border-black/5">
            <p className="text-xs font-mono text-black/40 tracking-[0.2em] uppercase mb-6">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap gap-x-12 gap-y-4 items-center">
              {['Google', 'Microsoft', 'Meta', 'Amazon', 'Stripe', 'Netflix'].map(company => (
                <span key={company} className="text-lg font-light text-black/50">{company}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Enterprise Customers" },
                { value: "2.5M+", label: "Active Learners" },
                { value: "47%", label: "Skill Improvement" },
                { value: "3.2x", label: "Average ROI" }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-serif font-light mb-2">{metric.value}</div>
                  <div className="text-sm font-medium text-black/80 mb-2">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif font-light mb-16">Enterprise-grade features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-black/5 hover:shadow-lg transition-shadow"
                >
                  <feature.icon className="w-8 h-8 text-black/70 mb-6 stroke-[1.5]" />
                  <h3 className="text-xl font-serif font-light mb-3">{feature.title}</h3>
                  <p className="text-base text-black/60 font-light leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-light mb-16">Proven use cases</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#FAFAF9] rounded-3xl p-8"
              >
                <div className="flex items-start gap-4">
                  <useCase.icon className="w-8 h-8 text-black/70 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-light mb-2">{useCase.title}</h3>
                    <p className="text-black/60 mb-4">{useCase.description}</p>
                    <div className="flex gap-4">
                      {useCase.metrics.map(metric => (
                        <span key={metric} className="text-sm font-medium text-blue-600">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-light mb-16 text-center">
            Trusted by industry leaders
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-black/5"
              >
                <div className="flex-1">
                  <p className="text-black/70 italic mb-6 font-light leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PlaceholderAvatar name={testimonial.author} size={48} />
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-black/60">
                      {testimonial.role}, {testimonial.companyName}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light mb-4">Enterprise plans</h2>
            <p className="text-black/60">Flexible pricing that scales with your organization</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-3xl p-8 border ${
                  plan.featured ? 'ring-2 ring-blue-500 border-blue-200' : 'border-black/5'
                }`}
              >
                {plan.featured && (
                  <div className="text-center mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-light mb-2">{plan.name}</h3>
                  <div className="text-sm text-black/60 mb-4">{plan.minUsers}</div>
                  <div className="text-4xl font-serif font-light">
                    {plan.price === "Custom" ? (
                      plan.price
                    ) : (
                      <>
                        {plan.price}
                        <span className="text-lg font-sans font-normal text-black/60">/user/month</span>
                      </>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <div className="w-5 h-5 text-green-500 flex-shrink-0">✓</div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => {
                    if (plan.price === "Custom") {
                      window.location.href = 'mailto:hello@neuros.ai?subject=Enterprise Plan Inquiry';
                    } else {
                      window.location.href = '/signup';
                    }
                  }}
                  className={`w-full px-6 py-3 rounded-full font-medium transition-colors ${
                    plan.featured 
                      ? 'bg-black text-white hover:bg-black/90' 
                      : 'border border-black/20 hover:bg-black/5'
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <SparkleIcon className="w-12 h-12 mx-auto mb-4 text-black/70" />
            <h2 className="text-3xl font-serif font-light mb-4">Enterprise security & compliance</h2>
            <p className="text-black/60">Your data is protected with industry-leading security</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "SOC 2 Type II", "ISO 27001", "GDPR Compliant", "HIPAA Ready",
              "256-bit Encryption", "99.9% Uptime SLA", "24/7 Monitoring", "Regular Audits"
            ].map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-center p-4 bg-white rounded-2xl border border-black/5"
              >
                <span className="text-sm font-medium">{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
            Ready to transform your L&D?
          </h2>
          <p className="text-xl mb-8 text-white/60">
            Join 500+ companies achieving 3.2x ROI with AI-powered learning
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => window.location.href = 'mailto:hello@neuros.ai?subject=Enterprise Demo Request'}
              className="px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors">
              Schedule Demo
            </button>
            <button 
              onClick={() => window.location.href = 'mailto:hello@neuros.ai?subject=Enterprise Sales Inquiry'}
              className="px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
              <SparkleIcon className="w-4 h-4" />
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
      
      <TrustIndicators />
    </div>
  )
}