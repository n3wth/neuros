-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#000000',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_cards table (tracks individual user's progress on cards)
CREATE TABLE IF NOT EXISTS user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  ease_factor DECIMAL DEFAULT 2.5, -- SM-2 algorithm ease factor
  interval_days INTEGER DEFAULT 0, -- Days until next review
  repetitions INTEGER DEFAULT 0, -- Number of successful reviews
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  last_review_date TIMESTAMPTZ,
  total_reviews INTEGER DEFAULT 0,
  correct_reviews INTEGER DEFAULT 0,
  mastery_level DECIMAL DEFAULT 0, -- 0-100 percentage
  average_response_time INTEGER, -- milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Create reviews table (tracks each review session)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  user_card_id UUID REFERENCES user_cards(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 0 AND rating <= 5) NOT NULL, -- 0=forgot, 1-5=difficulty
  response_time INTEGER NOT NULL, -- milliseconds
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  cards_studied INTEGER DEFAULT 0,
  cards_correct INTEGER DEFAULT 0,
  total_time_seconds INTEGER,
  focus_score DECIMAL, -- 0-100 based on consistency
  metadata JSONB DEFAULT '{}'
);

-- Create user_stats table (aggregated statistics)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_cards INTEGER DEFAULT 0,
  cards_mastered INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_study_date DATE,
  average_accuracy DECIMAL DEFAULT 0,
  favorite_topic_id UUID REFERENCES topics(id),
  best_time_of_day INTEGER, -- hour 0-23
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_generations table (track AI-generated content)
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  response JSONB NOT NULL,
  generation_type TEXT CHECK (generation_type IN ('card', 'explanation', 'example', 'quiz')),
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_topic_id ON cards(topic_id);
CREATE INDEX idx_user_cards_next_review ON user_cards(user_id, next_review_date);
CREATE INDEX idx_user_cards_mastery ON user_cards(user_id, mastery_level DESC);
CREATE INDEX idx_reviews_user_card ON reviews(user_card_id, created_at DESC);
CREATE INDEX idx_reviews_session ON reviews(session_id);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id, started_at DESC);

-- Enable Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Topics: Everyone can read
CREATE POLICY "Topics are viewable by everyone" ON topics
  FOR SELECT USING (true);

-- Cards: Users can manage their own cards, read public cards
CREATE POLICY "Users can create their own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);

-- User Cards: Users can only access their own progress
CREATE POLICY "Users can manage their own card progress" ON user_cards
  FOR ALL USING (auth.uid() = user_id);

-- Reviews: Users can only access their own reviews
CREATE POLICY "Users can manage their own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- Study Sessions: Users can only access their own sessions
CREATE POLICY "Users can manage their own study sessions" ON study_sessions
  FOR ALL USING (auth.uid() = user_id);

-- User Stats: Users can only access their own stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);

-- AI Generations: Users can only access their own generations
CREATE POLICY "Users can manage their own AI generations" ON ai_generations
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_cards_updated_at BEFORE UPDATE ON user_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate next review date using SM-2 algorithm
CREATE OR REPLACE FUNCTION calculate_next_review(
  current_ease DECIMAL,
  current_interval INTEGER,
  current_reps INTEGER,
  rating INTEGER
) RETURNS JSONB AS $$
DECLARE
  new_ease DECIMAL;
  new_interval INTEGER;
  new_reps INTEGER;
BEGIN
  -- Reset if rating is 0 (forgot)
  IF rating = 0 THEN
    RETURN jsonb_build_object(
      'ease_factor', 2.5,
      'interval_days', 0,
      'repetitions', 0
    );
  END IF;

  -- Calculate new ease factor
  new_ease := current_ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  new_ease := GREATEST(1.3, new_ease);

  -- Calculate new interval
  IF current_reps = 0 THEN
    new_interval := 1;
  ELSIF current_reps = 1 THEN
    new_interval := 6;
  ELSE
    new_interval := ROUND(current_interval * new_ease);
  END IF;

  -- Update repetitions
  IF rating >= 3 THEN
    new_reps := current_reps + 1;
  ELSE
    new_reps := 0;
  END IF;

  RETURN jsonb_build_object(
    'ease_factor', new_ease,
    'interval_days', new_interval,
    'repetitions', new_reps
  );
END;
$$ LANGUAGE plpgsql;

-- Insert default topics
INSERT INTO topics (name, description, color, icon) VALUES
  ('Machine Learning', 'AI and ML concepts', '#3B82F6', 'brain'),
  ('Product Strategy', 'Product management and strategy', '#8B5CF6', 'target'),
  ('Frontend Development', 'React, TypeScript, and web development', '#10B981', 'code'),
  ('System Design', 'Architecture and design patterns', '#F59E0B', 'layers'),
  ('Creative Coding', 'Generative art and creative programming', '#EC4899', 'sparkles'),
  ('Wellness', 'Mindfulness and mental health', '#06B6D4', 'heart')
ON CONFLICT (name) DO NOTHING;