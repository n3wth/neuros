import { Metadata } from 'next'
import ResearchPage from '@/components/research/research-page'

export const metadata: Metadata = {
  title: 'Research & Science - Neuros Learning',
  description: 'The cognitive science and AI research behind our learning platform.',
}

export default function Research() {
  return <ResearchPage />
}