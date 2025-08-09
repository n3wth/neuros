import { Metadata } from 'next'
import ExplorePage from '@/components/explore/explore-page'

export const metadata: Metadata = {
  title: 'Explore Topics - Neuros Learning',
  description: 'Discover curated learning paths across technology, science, business, and more.',
}

export default function Explore() {
  return <ExplorePage />
}