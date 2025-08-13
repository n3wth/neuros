import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

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

// Create rate limiters
const rateLimiters: Record<RateLimitKey, Ratelimit> = {
  CARD_GENERATION: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.CARD_GENERATION.requests,
      RATE_LIMITS.CARD_GENERATION.window
    ),
    analytics: true,
    prefix: 'rl:card_gen',
  }),
  
  IMAGE_GENERATION: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.IMAGE_GENERATION.requests,
      RATE_LIMITS.IMAGE_GENERATION.window
    ),
    analytics: true,
    prefix: 'rl:img_gen',
  }),
  
  GLOBAL_AI: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.GLOBAL_AI.requests,
      RATE_LIMITS.GLOBAL_AI.window
    ),
    analytics: true,
    prefix: 'rl:global_ai',
  }),
  
  REVIEW_SUBMISSION: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.REVIEW_SUBMISSION.requests,
      RATE_LIMITS.REVIEW_SUBMISSION.window
    ),
    analytics: true,
    prefix: 'rl:review',
  }),
  
  LOGIN_ATTEMPT: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.LOGIN_ATTEMPT.requests,
      RATE_LIMITS.LOGIN_ATTEMPT.window
    ),
    analytics: true,
    prefix: 'rl:login',
  }),
  
  SIGNUP_ATTEMPT: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.SIGNUP_ATTEMPT.requests,
      RATE_LIMITS.SIGNUP_ATTEMPT.window
    ),
    analytics: true,
    prefix: 'rl:signup',
  }),
  
  PASSWORD_RESET: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.PASSWORD_RESET.requests,
      RATE_LIMITS.PASSWORD_RESET.window
    ),
    analytics: true,
    prefix: 'rl:reset',
  }),
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