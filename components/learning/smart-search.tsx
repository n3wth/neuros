'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Brain, FileText, Sparkles } from 'lucide-react'

interface SearchResult {
  id: string
  front: string
  back: string
  similarity?: number
  rank?: number
}

export function SmartSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'text' | 'semantic'>('text')
  const supabase = createClient()

  const performTextSearch = async () => {
    setLoading(true)
    
    // Use full-text search with the search vector
    const { data, error } = await supabase
      .rpc('search_cards_fulltext', {
        search_query: query
      })
      
    if (!error && data) {
      setResults(data)
    }
    
    setLoading(false)
  }

  const performSemanticSearch = async () => {
    setLoading(true)
    
    try {
      // First, generate embedding for the query
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Call edge function to generate embedding
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke(
        'generate-embeddings',
        {
          body: { text: query, type: 'query' }
        }
      )

      if (embeddingError || !embeddingData?.embedding) {
        console.error('Error generating embedding:', embeddingError)
        return
      }

      // Search for similar cards using the embedding
      const { data, error } = await supabase
        .rpc('search_similar_cards', {
          p_embedding: embeddingData?.embedding,
          p_user_id: user.id,
          p_limit: 20
        })

      if (!error && data) {
        setResults(data)
      }
    } catch (error) {
      console.error('Semantic search error:', error)
    }
    
    setLoading(false)
  }

  const handleSearch = () => {
    if (!query) return
    
    if (searchType === 'text') {
      performTextSearch()
    } else {
      performSemanticSearch()
    }
  }

  const generateSimilarCards = async (cardId: string) => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get the card
      const { data: card } = await supabase
        .from('cards')
        .select('front, back')
        .eq('id', cardId)
        .single()

      if (!card) return

      // Call advanced AI generation to create similar cards
      const { data, error } = await supabase.functions.invoke(
        'advanced-ai-generation',
        {
          body: {
            prompt: `Create 3 similar flashcards based on this example:\nFront: ${card.front}\nBack: ${card.back}\n\nCreate variations that test the same concept in different ways.`,
            userId: user.id,
            count: 3,
            difficulty: 'intermediate'
          }
        }
      )

      if (!error && data.cards) {
        // Refresh search results
        handleSearch()
      }
    } catch (error) {
      console.error('Error generating similar cards:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Card Search</CardTitle>
          <CardDescription>
            Search your cards using text or AI-powered semantic search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'text' | 'semantic')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <FileText className="mr-2 h-4 w-4" />
                Text Search
              </TabsTrigger>
              <TabsTrigger value="semantic">
                <Brain className="mr-2 h-4 w-4" />
                Semantic Search
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Search for exact words or phrases in your cards
              </p>
            </TabsContent>
            
            <TabsContent value="semantic" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Find cards with similar meaning using AI
              </p>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Input
              placeholder={searchType === 'text' ? 'Search cards...' : 'Describe what you want to find...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Results ({results.length})
          </h3>
          
          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={result.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Front:</span>
                      <p className="mt-1">{result.front}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Back:</span>
                      <p className="mt-1">{result.back}</p>
                    </div>
                    {result.similarity && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">
                          Similarity: {(result.similarity * 100).toFixed(1)}%
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateSimilarCards(result.id)}
                        >
                          <Sparkles className="mr-2 h-3 w-3" />
                          Generate Similar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}