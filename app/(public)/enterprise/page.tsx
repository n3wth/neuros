import { Metadata } from 'next'
import EnterprisePage from '@/components/enterprise/enterprise-page'

export const metadata: Metadata = {
  title: 'Enterprise Solutions - Neuros Learning',
  description: 'Scale your organization\'s learning with AI-powered training and analytics.',
}

export default function Enterprise() {
  return <EnterprisePage />
}