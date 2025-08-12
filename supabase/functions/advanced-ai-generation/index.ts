import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MODELS = {
  'gpt-4o': { name: 'gpt-4o', maxTokens: 4096 },
  'gpt-4-turbo': { name: 'gpt-4-turbo-preview', maxTokens: 4096 },
  'claude-3-opus': { name: 'claude-3-opus-20240229', maxTokens: 4096 },
  'claude-3-sonnet': { name: 'claude-3-sonnet-20240229', maxTokens: 4096 }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      prompt, 
      model = 'gpt-4o',
      count = 1,
      difficulty = 'intermediate',
      includeExplanations = true,
      includeImages = false,
      topicId,
      userId
    } = await req.json()

    if (!prompt || !userId) {
      return new Response(
        JSON.stringify({ error: 'prompt and userId are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const selectedModel = MODELS[model] || MODELS['gpt-4o']
    
    // Build the system prompt
    const systemPrompt = `You are an expert educational content creator specializing in creating flashcards for spaced repetition learning.
    Create ${count} flashcard(s) at ${difficulty} difficulty level.
    ${includeExplanations ? 'Include detailed explanations for each answer.' : ''}
    ${includeImages ? 'Suggest relevant images or diagrams where appropriate.' : ''}
    
    Format your response as a JSON array with this structure:
    [
      {
        "front": "Question or prompt",
        "back": "Answer",
        ${includeExplanations ? '"explanation": "Detailed explanation",' : ''}
        ${includeImages ? '"imagePrompt": "Description for image generation",' : ''}
        "tags": ["tag1", "tag2"],
        "difficulty": "${difficulty}"
      }
    ]`

    // Get API keys from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

    let cards = []

    if (model.startsWith('claude')) {
      // Use Anthropic API
      if (!anthropicApiKey) {
        throw new Error('Anthropic API key not configured')
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel.name,
          max_tokens: selectedModel.maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`)
      }

      const data = await response.json()
      cards = JSON.parse(data.content[0].text)
    } else {
      // Use OpenAI API
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured')
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel.name,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      cards = result.cards || [result]
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save cards to database
    const savedCards = []
    for (const card of cards) {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          user_id: userId,
          topic_id: topicId,
          front: card.front,
          back: card.back,
          explanation: card.explanation,
          difficulty: card.difficulty || difficulty,
          tags: card.tags || [],
          metadata: {
            model: selectedModel.name,
            imagePrompt: card.imagePrompt,
            generatedAt: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving card:', error)
      } else {
        savedCards.push(data)

        // Generate image if requested
        if (includeImages && card.imagePrompt) {
          // Queue image generation (async)
          generateImage(data.id, card.imagePrompt, openaiApiKey, supabase)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        cards: savedCards,
        count: savedCards.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function generateImage(cardId: string, prompt: string, apiKey: string, supabase: any) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Educational diagram or illustration: ${prompt}`,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      }),
    })

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    const imageUrl = data.data[0].url

    // Download image
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    const arrayBuffer = await imageBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload to storage
    const fileName = `card-${cardId}-${Date.now()}.png`
    const { error: uploadError } = await supabase.storage
      .from('card-attachments')
      .upload(fileName, uint8Array, {
        contentType: 'image/png'
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('card-attachments')
      .getPublicUrl(fileName)

    // Update card with image URL
    await supabase
      .from('cards')
      .update({ 
        attachment_urls: [publicUrl],
        has_attachments: true
      })
      .eq('id', cardId)

  } catch (error) {
    console.error('Image generation error:', error)
  }
}