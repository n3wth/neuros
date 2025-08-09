'use server'

import { 
  RATE_LIMIT_CONFIGS, 
  RateLimitType, 
  RateLimitResult
} from './rate-limit'

interface RequestInfo {
  count: number
  resetTime: number
  firstRequestTime: number
}

// In-memory store for rate limiting
// In production, consider using Redis for distributed systems
const requestStore = new Map<string, RequestInfo>()

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually user ID)
 * @param type - Type of rate limit to apply
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIGS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()
  
  // Clean up expired entries periodically (simple cleanup strategy)
  if (Math.random() < 0.01) { // 1% chance to trigger cleanup
    cleanupExpiredEntries()
  }
  
  let requestInfo = requestStore.get(key)
  
  // If no previous requests or window has expired, start fresh
  if (!requestInfo || now >= requestInfo.resetTime) {
    requestInfo = {
      count: 1,
      resetTime: now + config.windowMs,
      firstRequestTime: now
    }
    requestStore.set(key, requestInfo)
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: requestInfo.resetTime
    }
  }
  
  // Check if limit exceeded
  if (requestInfo.count >= config.maxRequests) {
    const retryAfter = Math.ceil((requestInfo.resetTime - now) / 1000) // seconds
    
    // Log rate limit exceeded for monitoring
    console.warn('Rate limit exceeded', {
      identifier,
      type,
      count: requestInfo.count,
      maxRequests: config.maxRequests,
      retryAfter,
      timestamp: new Date().toISOString()
    })
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: requestInfo.resetTime,
      retryAfter,
      message: config.message
    }
  }
  
  // Increment counter
  requestInfo.count++
  requestStore.set(key, requestInfo)
  
  return {
    allowed: true,
    remaining: config.maxRequests - requestInfo.count,
    resetTime: requestInfo.resetTime
  }
}

/**
 * Check multiple rate limits (e.g., specific + global)
 * @param identifier - Unique identifier
 * @param types - Array of rate limit types to check
 * @returns Rate limit result (fails if any limit exceeded)
 */
export async function checkMultipleRateLimits(
  identifier: string,
  types: RateLimitType[]
): Promise<RateLimitResult> {
  for (const type of types) {
    const result = await checkRateLimit(identifier, type)
    if (!result.allowed) {
      return result
    }
  }
  
  // All checks passed
  return {
    allowed: true,
    remaining: Math.min(...types.map(type => {
      const key = `${type}:${identifier}`
      const info = requestStore.get(key)
      const config = RATE_LIMIT_CONFIGS[type]
      return info ? config.maxRequests - info.count : config.maxRequests
    })),
    resetTime: Math.max(...types.map(type => {
      const key = `${type}:${identifier}`
      const info = requestStore.get(key)
      return info?.resetTime || Date.now()
    }))
  }
}

/**
 * Get current rate limit status without incrementing
 * @param identifier - Unique identifier
 * @param type - Rate limit type
 * @returns Current status
 */
export async function getRateLimitStatus(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIGS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()
  
  const requestInfo = requestStore.get(key)
  
  if (!requestInfo || now >= requestInfo.resetTime) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs
    }
  }
  
  const remaining = Math.max(0, config.maxRequests - requestInfo.count)
  const allowed = remaining > 0
  
  return {
    allowed,
    remaining,
    resetTime: requestInfo.resetTime,
    retryAfter: allowed ? undefined : Math.ceil((requestInfo.resetTime - now) / 1000),
    message: allowed ? undefined : config.message
  }
}

/**
 * Clean up expired entries from memory store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  let cleanedCount = 0
  
  for (const [key, info] of requestStore.entries()) {
    if (now >= info.resetTime) {
      requestStore.delete(key)
      cleanedCount++
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired rate limit entries`)
  }
}

/**
 * Reset rate limit for a specific identifier and type
 * Useful for testing or admin overrides
 * @param identifier - Unique identifier
 * @param type - Rate limit type
 */
export async function resetRateLimit(
  identifier: string,
  type: RateLimitType
): Promise<void> {
  const key = `${type}:${identifier}`
  requestStore.delete(key)
  
  console.log('Rate limit reset', {
    identifier,
    type,
    timestamp: new Date().toISOString()
  })
}

/**
 * Clear all rate limit data (for testing)
 * WARNING: Only use in test environments
 */
export async function clearAllRateLimits(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('clearAllRateLimits() should only be used in test environment')
    return
  }
  
  requestStore.clear()
  console.log('Cleared all rate limit data')
}

/**
 * Get statistics about current rate limiting state
 * Useful for monitoring and debugging
 */
export async function getRateLimitStats(): Promise<{
  totalEntries: number
  entriesByType: Record<string, number>
  oldestEntry: number | null
  newestEntry: number | null
}> {
  const entriesByType: Record<string, number> = {}
  let oldestEntry: number | null = null
  let newestEntry: number | null = null
  
  for (const [key, info] of requestStore.entries()) {
    const type = key.split(':')[0]
    entriesByType[type] = (entriesByType[type] || 0) + 1
    
    if (oldestEntry === null || info.firstRequestTime < oldestEntry) {
      oldestEntry = info.firstRequestTime
    }
    if (newestEntry === null || info.firstRequestTime > newestEntry) {
      newestEntry = info.firstRequestTime
    }
  }
  
  return {
    totalEntries: requestStore.size,
    entriesByType,
    oldestEntry,
    newestEntry
  }
}