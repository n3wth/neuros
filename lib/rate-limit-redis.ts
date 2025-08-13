import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client only if credentials are available
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN 
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null

// Rate limit configurations
export const RATE_LIMITS = {
  // AI operations
  CARD_GENERATION: {
    requests: 10,
    window: '1m' as const,
  },
  IMAGE_GENERATION: {
    requests: 5,
    window: '1m' as const,
  },
  GLOBAL_AI: {
    requests: 50,
    window: '1h' as const,
  },
  
  // Review operations
  REVIEW_SUBMISSION: {
    requests: 100,
    window: '1m' as const,
  },
  
  // Auth operations
  LOGIN_ATTEMPT: {
    requests: 5,
    window: '15m' as const,
  },
  SIGNUP_ATTEMPT: {
    requests: 3,
    window: '1h' as const,
  },
  PASSWORD_RESET: {
    requests: 3,
    window: '1h' as const,
  },
} as const

export type RateLimitKey = keyof typeof RATE_LIMITS

// Helper function to create rate limiter with fallback
const createRateLimiter = (key: RateLimitKey, prefix: string) => new Ratelimit({
  redis: redis || undefined,
  limiter: Ratelimit.slidingWindow(
    RATE_LIMITS[key].requests,
    RATE_LIMITS[key].window
  ),
  analytics: !!redis,
  prefix,
})

// Create rate limiters (fallback to memory when Redis not available)
const rateLimiters: Record<RateLimitKey, Ratelimit> = {
  CARD_GENERATION: createRateLimiter('CARD_GENERATION', 'rl:card_gen'),
  IMAGE_GENERATION: createRateLimiter('IMAGE_GENERATION', 'rl:img_gen'),
  GLOBAL_AI: createRateLimiter('GLOBAL_AI', 'rl:global_ai'),
  REVIEW_SUBMISSION: createRateLimiter('REVIEW_SUBMISSION', 'rl:review'),
  LOGIN_ATTEMPT: createRateLimiter('LOGIN_ATTEMPT', 'rl:login'),
  SIGNUP_ATTEMPT: createRateLimiter('SIGNUP_ATTEMPT', 'rl:signup'),
  PASSWORD_RESET: createRateLimiter('PASSWORD_RESET', 'rl:password_reset'),
}

export class RateLimitExceededError extends Error {
  constructor(
    public readonly retryAfter: number,
    public readonly limit: number,
    public readonly remaining: number,
    public readonly reset: Date
  ) {
    super(`Rate limit exceeded. Try again in ${retryAfter} seconds.`)
    this.name = 'RateLimitExceededError'
  }
}

/**
 * Check rate limit for a specific operation
 * @param identifier - User ID, IP address, or other identifier
 * @param limitKey - The type of rate limit to check
 * @throws {RateLimitExceededError} When rate limit is exceeded
 */
export async function checkRateLimit(
  identifier: string,
  limitKey: RateLimitKey
): Promise<void> {
  const limiter = rateLimiters[limitKey]
  const { success, limit, remaining, reset } = await limiter.limit(identifier)
  
  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    throw new RateLimitExceededError(retryAfter, limit, remaining, new Date(reset))
  }
}

/**
 * Get remaining rate limit info without consuming a request
 * @param identifier - User ID, IP address, or other identifier
 * @param limitKey - The type of rate limit to check
 */
export async function getRateLimitInfo(
  identifier: string,
  limitKey: RateLimitKey
) {
  const limiter = rateLimiters[limitKey]
  // Use a non-consuming check by getting the current state
  const result = await limiter.limit(identifier, { rate: 0 })
  return {
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
  }
}

/**
 * Reset rate limit for a specific identifier (admin use)
 * @param identifier - User ID, IP address, or other identifier
 * @param limitKey - The type of rate limit to reset
 */
export async function resetRateLimit(
  identifier: string,
  limitKey: RateLimitKey
): Promise<void> {
  const prefix = `rl:${limitKey.toLowerCase()}:${identifier}`
  await redis.del(prefix)
}

// Export the redis client for other uses
export { redis }