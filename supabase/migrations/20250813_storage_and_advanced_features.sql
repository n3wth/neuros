-- 1. STORAGE BUCKETS FOR CARD ATTACHMENTS
-- =========================================

-- Create storage bucket for card attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-attachments', 
  'card-attachments', 
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

-- Add storage reference to cards table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cards') THEN
    ALTER TABLE cards 
    ADD COLUMN IF NOT EXISTS attachment_urls TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS has_attachments BOOLEAN DEFAULT FALSE;
    
    -- Create index for cards with attachments
    CREATE INDEX IF NOT EXISTS idx_cards_has_attachments ON cards(has_attachments) WHERE has_attachments = true;
  END IF;
END $$;

-- 2. FULL-TEXT SEARCH
-- =========================================

-- Add search vector column for full-text search if cards table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cards') THEN
    ALTER TABLE cards 
    ADD COLUMN IF NOT EXISTS search_vector tsvector 
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(front, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(back, '')), 'B')
    ) STORED;
    
    -- Create GIN index for fast full-text search
    CREATE INDEX IF NOT EXISTS cards_search_idx ON cards USING GIN(search_vector);
  END IF;
END $$;

-- 3. PGVECTOR FOR SEMANTIC SEARCH
-- =========================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns for semantic search if cards table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cards') THEN
    ALTER TABLE cards
    ADD COLUMN IF NOT EXISTS front_embedding vector(1536),
    ADD COLUMN IF NOT EXISTS back_embedding vector(1536);
    
    -- Create indexes for vector similarity search
    CREATE INDEX IF NOT EXISTS cards_front_embedding_idx ON cards 
    USING ivfflat (front_embedding vector_cosine_ops)
    WITH (lists = 100);
    
    CREATE INDEX IF NOT EXISTS cards_back_embedding_idx ON cards 
    USING ivfflat (back_embedding vector_cosine_ops)
    WITH (lists = 100);
  END IF;
END $$;

-- 4. TOPIC SHARING AND COLLABORATION (using topics instead of decks)
-- =========================================

-- Create topic sharing table
CREATE TABLE topic_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL CHECK (share_type IN ('public', 'private', 'link')),
  permission TEXT NOT NULL DEFAULT 'view' CHECK (permission IN ('view', 'study', 'edit')),
  share_code TEXT UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(topic_id, shared_with_id)
);

-- Create indexes
CREATE INDEX idx_topic_shares_topic_id ON topic_shares(topic_id);
CREATE INDEX idx_topic_shares_shared_with ON topic_shares(shared_with_id);
CREATE INDEX idx_topic_shares_share_code ON topic_shares(share_code) WHERE share_code IS NOT NULL;

-- 5. COLLABORATIVE STUDY SESSIONS AND REALTIME
-- =========================================

-- Create collaborative study sessions table for realtime collaboration
CREATE TABLE IF NOT EXISTS collaborative_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 6),
  is_active BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 10,
  settings JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collaborative session participants
CREATE TABLE IF NOT EXISTS collaborative_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  score INTEGER DEFAULT 0,
  cards_reviewed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_collab_sessions_active ON collaborative_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_collab_sessions_code ON collaborative_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_collab_participants_session ON collaborative_participants(session_id);

-- 6. ACHIEVEMENTS AND GAMIFICATION
-- =========================================

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 10,
  category TEXT NOT NULL CHECK (category IN ('streak', 'mastery', 'social', 'milestone', 'special')),
  criteria JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Study streaks table
CREATE TABLE IF NOT EXISTS study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  streak_start_date DATE,
  total_study_days INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_study_streaks_user ON study_streaks(user_id);

-- 7. DATABASE FUNCTIONS AND RPC
-- =========================================

-- Function to calculate next review date using SM-2 algorithm
CREATE OR REPLACE FUNCTION calculate_next_review(
  p_quality INTEGER,
  p_repetitions INTEGER,
  p_ease_factor NUMERIC,
  p_interval INTEGER
) RETURNS TABLE(
  next_interval INTEGER,
  next_ease_factor NUMERIC,
  next_repetitions INTEGER
) AS $$
BEGIN
  -- SM-2 Algorithm implementation
  DECLARE
    new_ease_factor NUMERIC;
    new_interval INTEGER;
    new_repetitions INTEGER;
  BEGIN
    -- Calculate new ease factor
    new_ease_factor := GREATEST(1.3, p_ease_factor + 0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02));
    
    -- Determine repetitions and interval
    IF p_quality < 3 THEN
      new_repetitions := 0;
      new_interval := 1;
    ELSE
      new_repetitions := p_repetitions + 1;
      
      CASE new_repetitions
        WHEN 1 THEN new_interval := 1;
        WHEN 2 THEN new_interval := 6;
        ELSE new_interval := ROUND(p_interval * new_ease_factor);
      END CASE;
    END IF;
    
    RETURN QUERY SELECT new_interval, new_ease_factor, new_repetitions;
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to get cards due for review
CREATE OR REPLACE FUNCTION get_cards_due_for_review(p_user_id UUID, p_topic_id UUID DEFAULT NULL)
RETURNS TABLE(
  card_id UUID,
  front TEXT,
  back TEXT,
  ease_factor NUMERIC,
  interval_days INTEGER,
  repetitions INTEGER,
  last_reviewed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (c.id)
    c.id,
    c.front,
    c.back,
    uc.ease_factor::NUMERIC,
    COALESCE(uc.interval_days, 0) as interval_days,
    COALESCE(uc.repetitions, 0) as repetitions,
    uc.last_review_date as last_reviewed_at
  FROM cards c
  LEFT JOIN user_cards uc ON c.id = uc.card_id AND uc.user_id = p_user_id
  WHERE c.user_id = p_user_id
    AND (p_topic_id IS NULL OR c.topic_id = p_topic_id)
    AND (uc.next_review_date IS NULL OR uc.next_review_date <= now())
  ORDER BY c.id;
END;
$$ LANGUAGE plpgsql;

-- Function to search similar cards using embeddings
CREATE OR REPLACE FUNCTION search_similar_cards(
  p_embedding vector(1536),
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
  card_id UUID,
  front TEXT,
  back TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.front,
    c.back,
    1 - (c.front_embedding <=> p_embedding) as similarity
  FROM cards c
  WHERE c.user_id = p_user_id
    AND c.front_embedding IS NOT NULL
  ORDER BY c.front_embedding <=> p_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 8. TRIGGERS FOR AUTOMATION
-- =========================================

-- Trigger to update study streak
CREATE OR REPLACE FUNCTION update_study_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_current_date DATE;
  v_streak RECORD;
BEGIN
  v_current_date := CURRENT_DATE;
  
  -- Get or create streak record
  SELECT * INTO v_streak
  FROM study_streaks
  WHERE user_id = NEW.user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO study_streaks (user_id, current_streak, longest_streak, last_study_date, streak_start_date, total_study_days)
    VALUES (NEW.user_id, 1, 1, v_current_date, v_current_date, 1);
  ELSE
    -- Update streak based on last study date
    IF v_streak.last_study_date = v_current_date THEN
      -- Already studied today, no update needed
      NULL;
    ELSIF v_streak.last_study_date = v_current_date - INTERVAL '1 day' THEN
      -- Consecutive day, increment streak
      UPDATE study_streaks
      SET current_streak = current_streak + 1,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          last_study_date = v_current_date,
          total_study_days = total_study_days + 1,
          updated_at = now()
      WHERE user_id = NEW.user_id;
    ELSE
      -- Streak broken, reset
      UPDATE study_streaks
      SET current_streak = 1,
          last_study_date = v_current_date,
          streak_start_date = v_current_date,
          total_study_days = total_study_days + 1,
          updated_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_streak_on_review ON reviews;
CREATE TRIGGER update_streak_on_review
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_study_streak();

-- Trigger to check achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
DECLARE
  v_achievement RECORD;
  v_user_stats RECORD;
BEGIN
  -- Get user statistics
  SELECT 
    COUNT(DISTINCT DATE(reviewed_at)) as study_days,
    COUNT(*) as total_reviews,
    AVG(quality) as avg_quality
  INTO v_user_stats
  FROM reviews
  WHERE user_id = NEW.user_id;
  
  -- Check each achievement
  FOR v_achievement IN 
    SELECT * FROM achievements 
    WHERE id NOT IN (
      SELECT achievement_id 
      FROM user_achievements 
      WHERE user_id = NEW.user_id
    )
  LOOP
    -- Check if criteria is met (simplified example)
    IF v_achievement.category = 'milestone' THEN
      IF (v_achievement.criteria->>'total_reviews')::INTEGER <= v_user_stats.total_reviews THEN
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (NEW.user_id, v_achievement.id)
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_achievements_on_review ON reviews;
CREATE TRIGGER check_achievements_on_review
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION check_achievements();

-- 9. ROW LEVEL SECURITY POLICIES
-- =========================================

-- Enable RLS on all new tables
ALTER TABLE topic_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;

-- Topic shares policies
CREATE POLICY "Users can view their own shares" ON topic_shares
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = shared_with_id);

CREATE POLICY "Users can create shares for their topics" ON topic_shares
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM topics WHERE id = topic_id)
  );

CREATE POLICY "Users can update their own shares" ON topic_shares
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own shares" ON topic_shares
  FOR DELETE USING (auth.uid() = owner_id);

-- Public topic shares
CREATE POLICY "Anyone can view public shares" ON topic_shares
  FOR SELECT USING (share_type = 'public');

-- Collaborative sessions policies
CREATE POLICY "Users can view active sessions" ON collaborative_sessions
  FOR SELECT USING (is_active = true OR host_id = auth.uid());

CREATE POLICY "Users can create sessions" ON collaborative_sessions
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their sessions" ON collaborative_sessions
  FOR UPDATE USING (auth.uid() = host_id);

-- Participants policies
CREATE POLICY "Users can view session participants" ON collaborative_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collaborative_sessions 
      WHERE id = session_id AND (is_active = true OR host_id = auth.uid())
    )
  );

CREATE POLICY "Users can join sessions" ON collaborative_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" ON collaborative_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "Users can view their achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can grant achievements" ON user_achievements
  FOR INSERT WITH CHECK (true); -- Will be restricted by trigger

-- Study streaks policies
CREATE POLICY "Users can view their streaks" ON study_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update streaks" ON study_streaks
  FOR ALL USING (true); -- Managed by triggers

-- 10. SEED INITIAL ACHIEVEMENTS (skip if table has different schema)
-- =========================================

DO $$
BEGIN
  -- Only insert if the achievements table has the expected columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' 
    AND column_name = 'name'
  ) THEN
    INSERT INTO achievements (name, description, category, points, criteria) VALUES
      ('First Steps', 'Complete your first review', 'milestone', 10, '{"total_reviews": 1}'),
      ('Dedicated Learner', 'Complete 100 reviews', 'milestone', 50, '{"total_reviews": 100}'),
      ('Master Reviewer', 'Complete 1000 reviews', 'milestone', 100, '{"total_reviews": 1000}'),
      ('Week Warrior', 'Maintain a 7-day streak', 'streak', 25, '{"streak_days": 7}'),
      ('Month Master', 'Maintain a 30-day streak', 'streak', 100, '{"streak_days": 30}'),
      ('Social Learner', 'Join your first study session', 'social', 15, '{"sessions_joined": 1}'),
      ('Perfect Score', 'Get 10 cards correct in a row', 'mastery', 20, '{"perfect_streak": 10}'),
      ('Topic Creator', 'Create 5 topics', 'milestone', 30, '{"topics_created": 5}'),
      ('Memory Master', 'Achieve 90% accuracy over 50 reviews', 'mastery', 75, '{"accuracy": 0.9, "min_reviews": 50}'),
      ('Early Bird', 'Study before 6 AM', 'special', 15, '{"time_condition": "before_6am"}')
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;