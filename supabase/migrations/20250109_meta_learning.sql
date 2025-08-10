-- Meta-learning patterns table
CREATE TABLE IF NOT EXISTS meta_learning_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patterns JSONB NOT NULL,
  meta_insights JSONB NOT NULL,
  predictions JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- System evolution tracking
CREATE TABLE IF NOT EXISTS system_evolution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  improvements TEXT NOT NULL,
  generation INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI tutors configuration
CREATE TABLE IF NOT EXISTS ai_tutors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  personality JSONB NOT NULL,
  context JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor interventions tracking
CREATE TABLE IF NOT EXISTS tutor_interventions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  intervention TEXT NOT NULL,
  context JSONB NOT NULL,
  tutor_personality JSONB NOT NULL,
  effectiveness_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaboration sessions
CREATE TABLE IF NOT EXISTS collaboration_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  compatibility_score FLOAT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge graph nodes
CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT CHECK (type IN ('concept', 'skill', 'topic', 'user')),
  mastery FLOAT CHECK (mastery >= 0 AND mastery <= 1),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge graph edges
CREATE TABLE IF NOT EXISTS knowledge_edges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  target_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  strength FLOAT CHECK (strength >= 0 AND strength <= 1),
  type TEXT CHECK (type IN ('prerequisite', 'related', 'builds-on', 'similar')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Viral achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  share_count INTEGER DEFAULT 0,
  viral_score FLOAT,
  metadata JSONB
);

-- Viral challenges
CREATE TABLE IF NOT EXISTS viral_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  reward TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge participants
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES viral_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress FLOAT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(challenge_id, user_id)
);

-- Referrals tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- Global learning presence (for real-time)
CREATE TABLE IF NOT EXISTS learning_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location JSONB NOT NULL,
  topic TEXT,
  status TEXT CHECK (status IN ('active', 'idle', 'offline')),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX idx_meta_learning_user ON meta_learning_patterns(user_id);
CREATE INDEX idx_tutor_interventions_user ON tutor_interventions(user_id);
CREATE INDEX idx_collaboration_users ON collaboration_sessions(user1_id, user2_id);
CREATE INDEX idx_knowledge_nodes_user ON knowledge_nodes(user_id);
CREATE INDEX idx_knowledge_edges_source ON knowledge_edges(source_id);
CREATE INDEX idx_knowledge_edges_target ON knowledge_edges(target_id);
CREATE INDEX idx_achievements_user ON achievements(user_id);
CREATE INDEX idx_challenge_participants ON challenge_participants(challenge_id, user_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_learning_presence_status ON learning_presence(status);

-- Enable Row Level Security
ALTER TABLE meta_learning_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own meta patterns"
  ON meta_learning_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own meta patterns"
  ON meta_learning_patterns FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tutors"
  ON ai_tutors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public challenges"
  ON viral_challenges FOR SELECT
  USING (true);

CREATE POLICY "Users can join challenges"
  ON challenge_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own challenge progress"
  ON challenge_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view active presence"
  ON learning_presence FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can update own presence"
  ON learning_presence FOR ALL
  USING (auth.uid() = user_id);