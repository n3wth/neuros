-- Add missing foreign key indexes for performance optimization
-- This migration adds indexes on foreign key columns that were not previously indexed

-- Add index on user_cards.card_id for foreign key lookups
CREATE INDEX IF NOT EXISTS idx_user_cards_card_id ON user_cards(card_id);

-- Add index on reviews.user_card_id for foreign key lookups  
-- Note: There's already an index idx_reviews_user_card on (user_card_id, created_at DESC)
-- but we need a simple index on just user_card_id for basic foreign key lookups
CREATE INDEX IF NOT EXISTS idx_reviews_user_card_id ON reviews(user_card_id);

-- Add index on ai_generations.card_id for foreign key lookups
CREATE INDEX IF NOT EXISTS idx_ai_generations_card_id ON ai_generations(card_id);