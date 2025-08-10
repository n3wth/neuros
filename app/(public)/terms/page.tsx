import { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Terms of Service - Neuros',
  description: 'Terms of Service for Neuros learning platform',
}

export default function TermsPage() {
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
        
        <h1 className="text-4xl font-serif font-light mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-black/80">
          <p className="text-xl leading-relaxed mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Neuros, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">2. Use License</h2>
            <p className="leading-relaxed mb-4">
              Permission is granted to temporarily access Neuros for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on Neuros</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">3. Privacy Policy</h2>
            <p className="leading-relaxed">
              Your use of our service is also governed by our Privacy Policy. Please review our <Link href="/privacy" className="text-black underline hover:text-black/80">Privacy Policy</Link>, which also governs the site and informs users of our data collection practices.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">4. User Content</h2>
            <p className="leading-relaxed">
              You retain ownership of any content you create or upload to Neuros. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the service.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">5. Disclaimer</h2>
            <p className="leading-relaxed">
              The materials on Neuros are provided on an &apos;as is&apos; basis. Neuros makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">6. Limitations</h2>
            <p className="leading-relaxed">
              In no event shall Neuros or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Neuros, even if Neuros or a Neuros authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">7. Modifications</h2>
            <p className="leading-relaxed">
              Neuros may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-light mb-4">8. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at <Link href="/contact" className="text-black underline hover:text-black/80">our contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}