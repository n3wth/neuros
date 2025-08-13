import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cache, cacheKeys, cacheTTL } from '../cache'

describe('MemoryCache', () => {
  beforeEach(() => {
    cache.clear()
  })

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      const testData = { foo: 'bar', count: 42 }
      cache.set('test-key', testData, 60)
      
      const retrieved = cache.get<typeof testData>('test-key')
      expect(retrieved).toEqual(testData)
    })

    it('should return null for non-existent keys', () => {
      const result = cache.get('non-existent')
      expect(result).toBeNull()
    })

    it('should expire entries after TTL', () => {
      vi.useFakeTimers()
      
      cache.set('expiring-key', 'test-value', 1) // 1 second TTL
      
      // Should exist immediately
      expect(cache.get('expiring-key')).toBe('test-value')
      
      // Advance time by 2 seconds
      vi.advanceTimersByTime(2000)
      
      // Should be expired
      expect(cache.get('expiring-key')).toBeNull()
      
      vi.useRealTimers()
    })
  })

  describe('delete', () => {
    it('should remove entries', () => {
      cache.set('delete-me', 'value', 60)
      expect(cache.get('delete-me')).toBe('value')
      
      cache.delete('delete-me')
      expect(cache.get('delete-me')).toBeNull()
    })
  })

  describe('cleanup', () => {
    it('should remove expired entries', () => {
      vi.useFakeTimers()
      
      cache.set('keep-me', 'value1', 60) // 60 seconds
      cache.set('expire-me', 'value2', 1) // 1 second
      
      vi.advanceTimersByTime(2000) // Advance 2 seconds
      
      cache.cleanup()
      
      expect(cache.get('keep-me')).toBe('value1')
      expect(cache.get('expire-me')).toBeNull()
      
      vi.useRealTimers()
    })
  })

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'value1', 60)
      cache.set('key2', 'value2', 60)
      
      const stats = cache.getStats()
      expect(stats.size).toBe(2)
      expect(stats.keys).toContain('key1')
      expect(stats.keys).toContain('key2')
    })

    it('should cleanup expired entries before returning stats', () => {
      vi.useFakeTimers()
      
      cache.set('active', 'value1', 60)
      cache.set('expired', 'value2', 1)
      
      vi.advanceTimersByTime(2000)
      
      const stats = cache.getStats()
      expect(stats.size).toBe(1)
      expect(stats.keys).toEqual(['active'])
      
      vi.useRealTimers()
    })
  })
})

describe('cacheKeys', () => {
  it('should generate consistent cache keys', () => {
    const userId = 'user-123'
    const level = 'beginner'
    
    expect(cacheKeys.aiSuggestions(userId, level)).toBe('ai_suggestions:user-123:beginner')
    expect(cacheKeys.trendingTopics()).toBe('trending_topics:global')
    expect(cacheKeys.userCards(userId)).toBe('user_cards:user-123')
    expect(cacheKeys.cardStats(userId)).toBe('card_stats:user-123')
    expect(cacheKeys.studyStats(userId)).toBe('study_stats:user-123')
  })
})

describe('cacheTTL', () => {
  it('should have correct TTL values', () => {
    expect(cacheTTL.aiSuggestions).toBe(600) // 10 minutes
    expect(cacheTTL.trendingTopics).toBe(3600) // 1 hour
    expect(cacheTTL.shortLived).toBe(30) // 30 seconds
  })
})