'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import TrustIndicators from '@/components/landing/trust-indicators'
import { ArrowRight, Shield, Users, BarChart3, Zap, Globe, Check, Building } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Users,
    title: "Team Management",
    description: "Centralized dashboard for tracking team progress, assigning content, and managing licenses"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified, SSO/SAML, role-based access control, and data encryption"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time insights into learning patterns, skill gaps, and ROI metrics"
  },
  {
    icon: Zap,
    title: "AI Customization",
    description: "Train the AI on your company's knowledge base and terminology"
  },
  {
    icon: Globe,
    title: "Global Deployment",
    description: "Multi-language support, regional data centers, and 99.9% uptime SLA"
  },
  {
    icon: Globe,
    title: "API Integration",
    description: "Seamless integration with your LMS, HR systems, and productivity tools"
  }
]

const useCases = [
  {
    title: "Employee Onboarding",
    description: "Reduce onboarding time by 50% with personalized learning paths",
    icon: ArrowRight,
    metrics: ["2 weeks faster", "87% retention", "4.8/5 satisfaction"]
  },
  {
    title: "Skills Development",
    description: "Upskill your workforce with AI-powered recommendations",
    icon: BarChart3,
    metrics: ["63% faster learning", "2.3x retention", "91% completion"]
  },
  {
    title: "Compliance Training",
    description: "Ensure 100% compliance with automated tracking and reporting",
    icon: Check,
    metrics: ["100% compliance", "75% time saved", "0 violations"]
  },
  {
    title: "Leadership Development",
    description: "Build next-generation leaders with executive coaching paths",
    icon: Users,
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
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`
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
              <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full hover:bg-black/90 transition-colors">
                <span className="text-lg">Schedule a demo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link href="/case-studies" className="group inline-flex items-center gap-3 px-8 py-4">
                <span className="text-lg text-black/70 hover:text-black transition-colors">
                  View case studies
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
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
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
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
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
      <div className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">
            Proven Use Cases
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AppleCard glassy elevated className="p-6">
                  <div className="flex items-start gap-4">
                    <useCase.icon className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 mb-4">{useCase.description}</p>
                      <div className="flex gap-4">
                        {useCase.metrics.map(metric => (
                          <span key={metric} className="text-sm font-medium text-blue-600">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AppleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-light text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AppleCard glassy className="p-6 h-full flex flex-col">
                <div className="flex-1">
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <testimonial.company className="w-8 h-8" />
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.companyName}
                    </div>
                  </div>
                </div>
              </AppleCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enterprise Plans */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Enterprise Plans</h2>
            <p className="text-gray-600">Flexible pricing that scales with your organization</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AppleCard 
                  glassy 
                  elevated={plan.featured}
                  className={`p-6 h-full ${plan.featured ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {plan.featured && (
                    <div className="text-center mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium mb-2">{plan.name}</h3>
                    <div className="text-sm text-gray-600 mb-4">{plan.minUsers}</div>
                    <div className="text-4xl font-semibold">
                      {plan.price === "Custom" ? (
                        plan.price
                      ) : (
                        <>
                          {plan.price}
                          <span className="text-lg font-normal text-gray-600">/user/month</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2">
                        <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.featured ? "default" : "outline"}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </AppleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Compliance */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <IconLock className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-3xl font-light mb-4">Enterprise Security & Compliance</h2>
          <p className="text-gray-600">Your data is protected with industry-leading security</p>
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
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm"
            >
              <span className="text-sm font-medium">{cert}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Ready to Transform Your L&D?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 500+ companies achieving 3.2x ROI with AI-powered learning
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white/30">
              <IconHeadphones className="w-4 h-4 mr-2" />
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <TrustIndicators />
    </div>
  )
}