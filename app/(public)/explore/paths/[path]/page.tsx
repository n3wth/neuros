import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PathDetailPage from '@/components/explore/path-detail-page'

export const dynamic = 'force-dynamic'

const validPaths = [
  'ai-engineer-path',
  'modern-full-stack',
  'quantum-fundamentals'
]

export async function generateMetadata({
  params
}: {
  params: Promise<{ path: string }>
}): Promise<Metadata> {
  const { path } = await params
  const pathNames: Record<string, string> = {
    'ai-engineer-path': 'The AI Engineer Path',
    'modern-full-stack': 'Modern Full-Stack',
    'quantum-fundamentals': 'Quantum Fundamentals'
  }
  
  const name = pathNames[path] || 'Learning Path'
  
  return {
    title: `${name} - Neuros Learning`,
    description: `Master ${name} with this expertly curated learning path.`
  }
}

export default async function PathPage({
  params
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params
  if (!validPaths.includes(path)) {
    notFound()
  }
  
  return <PathDetailPage pathId={path} />
}