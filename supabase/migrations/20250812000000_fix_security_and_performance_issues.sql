-- Fix security and performance issues identified by Supabase linter

-- ============================================================
-- 1. Fix function search paths (SECURITY)
-- ============================================================

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix calculate_next_review function
CREATE OR REPLACE FUNCTION public.calculate_next_review(
  current_ease DECIMAL,
  current_interval INTEGER,
  current_reps INTEGER,
  rating INTEGER
) 
RETURNS JSONB 
SET search_path = public
AS $$
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

-- ============================================================
-- 2. Fix RLS policies performance (PERFORMANCE)
-- ============================================================

-- Drop and recreate profiles policies with optimized auth checks
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- Drop and recreate cards policies with optimized auth checks
DROP POLICY IF EXISTS "Users can create their own cards" ON public.cards;
CREATE POLICY "Users can create their own cards" ON public.cards
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own cards" ON public.cards;
CREATE POLICY "Users can view their own cards" ON public.cards
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own cards" ON public.cards;
CREATE POLICY "Users can update their own cards" ON public.cards
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own cards" ON public.cards;
CREATE POLICY "Users can delete their own cards" ON public.cards
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate user_cards policies with optimized auth checks
DROP POLICY IF EXISTS "Users can manage their own card progress" ON public.user_cards;
CREATE POLICY "Users can manage their own card progress" ON public.user_cards
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate reviews policies with optimized auth checks
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.reviews;
CREATE POLICY "Users can manage their own reviews" ON public.reviews
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate study_sessions policies with optimized auth checks
DROP POLICY IF EXISTS "Users can manage their own study sessions" ON public.study_sessions;
CREATE POLICY "Users can manage their own study sessions" ON public.study_sessions
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate user_stats policies with optimized auth checks
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate ai_generations policies with optimized auth checks
DROP POLICY IF EXISTS "Users can manage their own AI generations" ON public.ai_generations;
CREATE POLICY "Users can manage their own AI generations" ON public.ai_generations
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate card_images policies with optimized auth checks (if they exist)
DROP POLICY IF EXISTS "Users can view their own card images" ON public.card_images;
CREATE POLICY "Users can view their own card images" ON public.card_images
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own card images" ON public.card_images;
CREATE POLICY "Users can create their own card images" ON public.card_images
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Drop and recreate topic_images policies with optimized auth checks (if they exist)
DROP POLICY IF EXISTS "Users can view their own topic images" ON public.topic_images;
CREATE POLICY "Users can view their own topic images" ON public.topic_images
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own topic images" ON public.topic_images;
CREATE POLICY "Users can create their own topic images" ON public.topic_images
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- ============================================================
-- 3. Add missing foreign key indexes (PERFORMANCE)
-- ============================================================

-- These were already added in previous migrations, but let's ensure they exist
-- The IF NOT EXISTS clause will prevent errors if they already exist

-- Ensure all foreign key indexes exist
CREATE INDEX IF NOT EXISTS idx_ai_generations_card_id ON public.ai_generations(card_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_card_id ON public.reviews(card_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_card_id ON public.user_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_favorite_topic ON public.user_stats(favorite_topic_id);

-- ============================================================
-- 4. Review unused indexes (INFO level - optional cleanup)
-- ============================================================

-- These indexes are reported as unused. We'll keep them for now but add a comment
-- They may be useful for future queries or may not have been used yet due to low data volume

COMMENT ON INDEX idx_cards_topic_id IS 'Monitoring for usage - may be removed if consistently unused';
COMMENT ON INDEX idx_reviews_user_card IS 'Monitoring for usage - may be removed if consistently unused';
COMMENT ON INDEX idx_reviews_session IS 'Monitoring for usage - may be removed if consistently unused';
COMMENT ON INDEX idx_card_images_user_id IS 'Monitoring for usage - may be removed if consistently unused';
COMMENT ON INDEX idx_card_images_card_id IS 'Monitoring for usage - may be removed if consistently unused';
COMMENT ON INDEX idx_topic_images_user_id IS 'Monitoring for usage - may be removed if consistently unused';
COMMENT ON INDEX idx_topic_images_topic_id IS 'Monitoring for usage - may be removed if consistently unused';

-- ============================================================
-- 5. Note on Auth Configuration (SECURITY)
-- ============================================================

-- The following issues need to be addressed in the Supabase dashboard:
-- 
-- a) OTP Expiry: 
--    Navigate to Authentication > Providers > Email
--    Set "OTP expiry duration" to 3600 seconds (1 hour) or less
-- 
-- b) Leaked Password Protection:
--    Navigate to Authentication > Security
--    Enable "Leaked password protection"
-- 
-- These settings cannot be changed via SQL migrations and must be 
-- configured through the Supabase dashboard or via the Supabase CLI config.