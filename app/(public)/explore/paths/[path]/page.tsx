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
  params: { path: string }
}): Promise<Metadata> {
  const pathNames: Record<string, string> = {
    'ai-engineer-path': 'The AI Engineer Path',
    'modern-full-stack': 'Modern Full-Stack',
    'quantum-fundamentals': 'Quantum Fundamentals'
  }
  
  const name = pathNames[params.path] || 'Learning Path'
  
  return {
    title: `${name} - Neuros Learning`,
    description: `Master ${name} with this expertly curated learning path.`
  }
}

export default function PathPage({
  params
}: {
  params: { path: string }
}) {
  if (!validPaths.includes(params.path)) {
    notFound()
  }
  
  return <PathDetailPage pathId={params.path} />
}