-- Full-text search function for cards
CREATE OR REPLACE FUNCTION search_cards_fulltext(search_query TEXT)
RETURNS TABLE(
  id UUID,
  front TEXT,
  back TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.front,
    c.back,
    ts_rank(c.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM cards c
  WHERE c.search_vector @@ websearch_to_tsquery('english', search_query)
    AND c.user_id = auth.uid()
  ORDER BY rank DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_cards_fulltext TO authenticated;