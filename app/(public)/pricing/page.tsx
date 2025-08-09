import { Metadata } from 'next'
import PricingPage from '@/components/pricing/pricing-page'

export const metadata: Metadata = {
  title: 'Pricing - Neuros Learning',
  description: 'Choose the perfect plan for your learning journey.',
}

export default function Pricing() {
  return <PricingPage />
}