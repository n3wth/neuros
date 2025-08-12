# Advanced Supabase Features Implementation

## Overview
This document details the comprehensive Supabase features implemented in the Neuros learning platform, including storage, realtime collaboration, vector search, achievements, and more.

## 1. Storage Buckets for Card Attachments

### Database Changes
- Created `card-attachments` storage bucket for images and PDFs
- Added `attachment_urls` and `has_attachments` columns to cards table
- Migrated from base64 storage in `card_images` table to Storage buckets

### Benefits
- CDN delivery for faster loading
- Image transformations on-the-fly
- Better performance and scalability
- Support for multiple file types (images, PDFs)

### Usage
```typescript
// Upload attachment
const { data, error } = await supabase.storage
  .from('card-attachments')
  .upload(`card-${cardId}-${Date.now()}.png`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('card-attachments')
  .getPublicUrl(fileName)
```

## 2. Realtime Collaborative Study Sessions

### Features
- Live study sessions with multiple participants
- Real-time score updates and leaderboards
- Session codes for easy joining
- Host controls for session management

### Database Tables
- `collaborative_sessions`: Main session data
- `collaborative_participants`: Participant tracking

### Component
- `CollaborativeSession`: Full-featured collaborative study interface

### Usage
```typescript
// Subscribe to realtime updates
const channel = supabase
  .channel(`session:${sessionId}`)
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'collaborative_participants' 
  }, handleUpdate)
  .subscribe()
```

## 3. Vector Search with pgvector

### Features
- Semantic similarity search using OpenAI embeddings
- Find related cards across all topics
- Smart card recommendations
- Duplicate detection

### Database Changes
- Added `vector` extension
- Created `front_embedding` and `back_embedding` columns
- Built IVFFlat indexes for fast similarity search

### Edge Function
- `generate-embeddings`: Generates embeddings using OpenAI API

### Usage
```typescript
// Search similar cards
const { data } = await supabase
  .rpc('search_similar_cards', {
    p_embedding: embedding,
    p_user_id: userId,
    p_limit: 10
  })
```

## 4. Full-Text Search

### Features
- Fast text search across all cards
- Weighted search (front text weighted higher than back)
- GIN indexed for performance

### Database Changes
- Added `search_vector` tsvector column
- Created GIN index for fast search
- RPC function `search_cards_fulltext`

### Usage
```typescript
const { data } = await supabase
  .rpc('search_cards_fulltext', {
    search_query: 'machine learning'
  })
```

## 5. Achievements & Gamification

### Features
- Achievement system with categories (streak, mastery, social, milestone, special)
- Study streak tracking
- Progress tracking
- Automatic achievement unlocking via triggers

### Database Tables
- `achievements`: Achievement definitions
- `user_achievements`: User's unlocked achievements
- `study_streaks`: Streak tracking

### Triggers
- `update_streak_on_review`: Updates streak on each review
- `check_achievements_on_review`: Checks for new achievements

### Component
- `AchievementsDisplay`: Shows achievements and streaks

## 6. Advanced AI Generation

### Features
- Multiple AI models (GPT-4, Claude)
- Batch card generation
- Image generation with DALL-E 3
- Customizable difficulty and explanations

### Edge Function
- `advanced-ai-generation`: Handles multi-model AI generation

### Usage
```typescript
const { data } = await supabase.functions.invoke('advanced-ai-generation', {
  body: {
    prompt: 'Create flashcards about quantum physics',
    model: 'gpt-4o',
    count: 5,
    difficulty: 'advanced',
    includeImages: true
  }
})
```

## 7. RPC Functions

### Spaced Repetition
```sql
calculate_next_review(quality, repetitions, ease_factor, interval)
-- Returns next review interval using SM-2 algorithm
```

### Card Retrieval
```sql
get_cards_due_for_review(user_id, topic_id)
-- Gets cards that need review
```

### Search Functions
```sql
search_cards_fulltext(search_query)
-- Full-text search

search_similar_cards(embedding, user_id, limit)
-- Vector similarity search
```

## 8. Row Level Security

### Topic Sharing
- Users can share topics publicly or privately
- Share codes for link-based sharing
- Permission levels: view, study, edit

### Collaborative Sessions
- Public sessions viewable by all
- Only hosts can modify sessions
- Participants control their own data

## 9. Smart Search Component

### Features
- Toggle between text and semantic search
- Real-time search results
- Generate similar cards from results
- Similarity scoring

### Component
- `SmartSearch`: Unified search interface

## 10. Performance Optimizations

### Indexes Created
- `idx_cards_has_attachments`: Filter cards with attachments
- `cards_search_idx`: GIN index for full-text search
- `cards_front_embedding_idx`: IVFFlat index for vector search
- `idx_collab_sessions_active`: Active sessions
- `idx_collab_sessions_code`: Session code lookup

## Migration Summary

All features are implemented in these migrations:
1. `20250813_storage_and_advanced_features.sql` - Main feature migration
2. `20250814_search_functions.sql` - Search RPC functions

## Testing the Features

### Access Advanced Features
Navigate to `/dashboard/advanced` to access:
- Collaborative study sessions
- Smart search with text/semantic modes
- Achievements and streaks display

### Edge Functions
Deploy edge functions with:
```bash
supabase functions deploy generate-embeddings
supabase functions deploy advanced-ai-generation
```

### Environment Variables Required
```env
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key  # Optional for Claude models
```

## Security Considerations

1. **RLS Policies**: All new tables have appropriate RLS policies
2. **API Keys**: Edge functions use service role key securely
3. **Rate Limiting**: Existing rate limits apply to new features
4. **Authentication**: All features require authenticated users

## Performance Impact

- Vector search indexes use IVFFlat for scalability
- GIN indexes for fast full-text search
- Partial indexes where appropriate
- Triggers are optimized for minimal overhead

## Future Enhancements

1. **WebRTC Integration**: Voice/video for collaborative sessions
2. **Advanced Analytics**: Learning pattern analysis
3. **Social Features**: Friend system, public profiles
4. **Mobile App**: React Native implementation
5. **Offline Support**: Local-first with sync