-- Add additional foreign key indexes for improved query performance
-- This migration adds more indexes on foreign key columns for common query patterns

-- Add index on reviews.user_id for user-specific review queries
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Add index on reviews.card_id for card-specific review queries
CREATE INDEX IF NOT EXISTS idx_reviews_card_id ON reviews(card_id);

-- Add index on ai_generations.user_id for user-specific AI generation queries
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);

-- Add index on user_stats.favorite_topic_id for topic popularity analysis
CREATE INDEX IF NOT EXISTS idx_user_stats_favorite_topic ON user_stats(favorite_topic_id);