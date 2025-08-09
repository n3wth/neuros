-- Enable realtime for cards and user_cards tables
ALTER PUBLICATION supabase_realtime ADD TABLE cards;
ALTER PUBLICATION supabase_realtime ADD TABLE user_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE user_stats;

-- Create tables for storing images
CREATE TABLE IF NOT EXISTS card_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  style TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  concepts TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add image_url to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url to topics table
ALTER TABLE topics ADD COLUMN IF NOT EXISTS image_url TEXT;

-- RLS policies for image tables
ALTER TABLE card_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own card images" ON card_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own card images" ON card_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own topic images" ON topic_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topic images" ON topic_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_card_images_user_id ON card_images(user_id);
CREATE INDEX IF NOT EXISTS idx_card_images_card_id ON card_images(card_id);
CREATE INDEX IF NOT EXISTS idx_topic_images_user_id ON topic_images(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_images_topic_id ON topic_images(topic_id);