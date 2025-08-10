import { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Neuros',
  description: 'Privacy Policy for Neuros learning platform',
}

export default function PrivacyPage() {
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
        
        <h1 className="text-4xl font-serif font-light mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-black/80">
          <p className="text-xl leading-relaxed mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Learning progress and activity data</li>
              <li>Content you create (flashcards, notes, study materials)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your learning experience</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">3. Information Sharing</h2>
            <p className="leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties. We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent or at your direction</li>
              <li>To comply with legal obligations</li>
              <li>To protect rights, privacy, safety, or property</li>
              <li>In connection with a business transaction (merger, acquisition)</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">4. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">5. Your Rights</h2>
            <p className="leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">6. Cookies</h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">7. Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">8. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">9. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at <Link href="/contact" className="text-black underline hover:text-black/80">our contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}