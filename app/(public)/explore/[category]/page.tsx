import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPage from '@/components/explore/category-page'

export const dynamic = 'force-dynamic'

const validCategories = [
  'ai-ml',
  'programming', 
  'science',
  'business',
  'design',
  'languages'
]

export async function generateMetadata({
  params
}: {
  params: { category: string }
}): Promise<Metadata> {
  const categoryNames: Record<string, string> = {
    'ai-ml': 'Artificial Intelligence',
    'programming': 'Programming',
    'science': 'Sciences',
    'business': 'Business',
    'design': 'Design',
    'languages': 'Languages'
  }
  
  const name = categoryNames[params.category] || 'Category'
  
  return {
    title: `${name} - Neuros Learning`,
    description: `Master ${name.toLowerCase()} with expertly curated flashcards and spaced repetition.`
  }
}

export default function CategoryDetailPage({
  params
}: {
  params: { category: string }
}) {
  if (!validCategories.includes(params.category)) {
    notFound()
  }
  
  return <CategoryPage category={params.category} />
}