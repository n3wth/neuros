/**
 * Simple in-memory cache with TTL (Time To Live)
 * For production, consider using Redis or similar
 */
class MemoryCache {
  private cache: Map<string, { value: unknown; expires: number }> = new Map()
  
  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    // Check if expired
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.value as T
  }
  
  /**
   * Set a value in cache with TTL in seconds
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expires = Date.now() + (ttlSeconds * 1000)
    this.cache.set(key, { value, expires })
  }
  
  /**
   * Delete a value from cache
   */
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }
  
  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
  
  /**
   * Get cache stats
   */
  getStats(): { size: number; keys: string[] } {
    this.cleanup() // Clean up expired entries first
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Singleton instance
export const cache = new MemoryCache()

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 5 * 60 * 1000)
}

/**
 * Cache key generators for consistency
 */
export const cacheKeys = {
  aiSuggestions: (userId: string, level: string) => `ai_suggestions:${userId}:${level}`,
  trendingTopics: () => 'trending_topics:global',
  userCards: (userId: string) => `user_cards:${userId}`,
  cardStats: (userId: string) => `card_stats:${userId}`,
  studyStats: (userId: string) => `study_stats:${userId}`,
}

/**
 * Cache TTL values in seconds
 */
export const cacheTTL = {
  aiSuggestions: 600,      // 10 minutes
  trendingTopics: 3600,    // 1 hour
  userCards: 60,           // 1 minute
  cardStats: 300,          // 5 minutes
  studyStats: 300,         // 5 minutes
  shortLived: 30,          // 30 seconds
  medium: 300,             // 5 minutes
  long: 3600,              // 1 hour
}