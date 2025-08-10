import { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowLeft, IconMail, IconBrandTwitter, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Contact Us - Neuros',
  description: 'Get in touch with the Neuros team',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] py-20">
      <div className="max-w-4xl mx-auto px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-8"
          aria-label="Back to home"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        
        <h1 className="text-4xl font-serif font-light mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xl leading-relaxed text-black/80 mb-8">
              We&apos;d love to hear from you. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">General Inquiries</h2>
                <a 
                  href="mailto:hello@neuros.ai" 
                  className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
                  aria-label="Email us at hello@neuros.ai"
                >
                  <IconMail className="w-5 h-5" />
                  hello@neuros.ai
                </a>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Support</h2>
                <a 
                  href="mailto:support@neuros.ai" 
                  className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
                  aria-label="Email support at support@neuros.ai"
                >
                  <IconMail className="w-5 h-5" />
                  support@neuros.ai
                </a>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Enterprise Sales</h2>
                <a 
                  href="mailto:enterprise@neuros.ai" 
                  className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
                  aria-label="Email enterprise sales at enterprise@neuros.ai"
                >
                  <IconMail className="w-5 h-5" />
                  enterprise@neuros.ai
                </a>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-lg font-medium mb-4">Follow Us</h2>
              <div className="flex gap-4">
                <a 
                  href="https://twitter.com/neurosai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-black/10 hover:border-black/20 hover:bg-black/5 transition-all"
                  aria-label="Follow us on Twitter"
                >
                  <IconBrandTwitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/neurosai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-black/10 hover:border-black/20 hover:bg-black/5 transition-all"
                  aria-label="Connect on LinkedIn"
                >
                  <IconBrandLinkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com/neurosai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-black/10 hover:border-black/20 hover:bg-black/5 transition-all"
                  aria-label="View our GitHub"
                >
                  <IconBrandGithub className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="text-2xl font-serif font-light mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-black/30 focus:outline-none transition-colors"
                  placeholder="Your name"
                  aria-label="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-black/30 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  aria-label="Your email address"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black/80 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-black/30 focus:outline-none transition-colors"
                  aria-label="Message subject"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="enterprise">Enterprise Sales</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black/80 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-black/30 focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                  aria-label="Your message"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors font-medium"
                aria-label="Send message"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}