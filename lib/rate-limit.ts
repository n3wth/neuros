/**
 * In-memory rate limiter for API requests
 * Production-ready with proper error handling and logging
 */

interface RateLimitConfig {
  /** Maximum requests allowed in the time window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Optional message for rate limit exceeded */
  message?: string
}

// Moved interfaces and store to rate-limit-server.ts to avoid unused variable warnings

// Default configurations for different operations
export const RATE_LIMIT_CONFIGS = {
  // Authentication rate limits
  LOGIN_ATTEMPT: {
    maxRequests: parseInt(process.env.AUTH_LOGIN_RATE_LIMIT || '5'),
    windowMs: parseInt(process.env.AUTH_LOGIN_WINDOW_MS || '900000'), // 15 minutes
    message: 'Too many login attempts. Please wait before trying again.'
  } as RateLimitConfig,
  
  SIGNUP_ATTEMPT: {
    maxRequests: parseInt(process.env.AUTH_SIGNUP_RATE_LIMIT || '3'),
    windowMs: parseInt(process.env.AUTH_SIGNUP_WINDOW_MS || '3600000'), // 1 hour
    message: 'Too many signup attempts. Please wait before trying again.'
  } as RateLimitConfig,
  
  PASSWORD_RESET: {
    maxRequests: parseInt(process.env.AUTH_PASSWORD_RESET_RATE_LIMIT || '3'),
    windowMs: parseInt(process.env.AUTH_PASSWORD_RESET_WINDOW_MS || '3600000'), // 1 hour
    message: 'Too many password reset attempts. Please wait before trying again.'
  } as RateLimitConfig,
  
  // Review submissions to prevent spam
  REVIEW_SUBMISSION: {
    maxRequests: parseInt(process.env.REVIEW_SUBMISSION_RATE_LIMIT || '60'),
    windowMs: parseInt(process.env.REVIEW_SUBMISSION_WINDOW_MS || '60000'), // 1 minute
    message: 'Too many review submissions. Please slow down.'
  } as RateLimitConfig,
  
  // AI operation rate limits
  // Card generation - more expensive operation
  CARD_GENERATION: {
    maxRequests: parseInt(process.env.AI_CARD_GENERATION_RATE_LIMIT || '5'),
    windowMs: parseInt(process.env.AI_CARD_GENERATION_WINDOW_MS || '300000'), // 5 minutes
    message: 'Card generation rate limit exceeded. Please wait before generating more cards.'
  } as RateLimitConfig,
  
  // Explanations - moderate cost
  EXPLANATION: {
    maxRequests: parseInt(process.env.AI_EXPLANATION_RATE_LIMIT || '10'),
    windowMs: parseInt(process.env.AI_EXPLANATION_WINDOW_MS || '300000'), // 5 minutes
    message: 'Explanation generation rate limit exceeded. Please wait before requesting more explanations.'
  } as RateLimitConfig,
  
  // Practice questions - moderate cost
  PRACTICE_QUESTIONS: {
    maxRequests: parseInt(process.env.AI_PRACTICE_RATE_LIMIT || '15'),
    windowMs: parseInt(process.env.AI_PRACTICE_WINDOW_MS || '300000'), // 5 minutes
    message: 'Practice question generation rate limit exceeded. Please wait before generating more questions.'
  } as RateLimitConfig,
  
  // Learning paths - expensive operation
  LEARNING_PATH: {
    maxRequests: parseInt(process.env.AI_LEARNING_PATH_RATE_LIMIT || '3'),
    windowMs: parseInt(process.env.AI_LEARNING_PATH_WINDOW_MS || '600000'), // 10 minutes
    message: 'Learning path generation rate limit exceeded. Please wait before generating more paths.'
  } as RateLimitConfig,
  
  // Insights - moderate cost
  INSIGHTS: {
    maxRequests: parseInt(process.env.AI_INSIGHTS_RATE_LIMIT || '8'),
    windowMs: parseInt(process.env.AI_INSIGHTS_WINDOW_MS || '300000'), // 5 minutes
    message: 'Learning insights generation rate limit exceeded. Please wait before requesting more insights.'
  } as RateLimitConfig,
  
  // Global rate limit for all AI operations combined
  GLOBAL_AI: {
    maxRequests: parseInt(process.env.AI_GLOBAL_RATE_LIMIT || '25'),
    windowMs: parseInt(process.env.AI_GLOBAL_WINDOW_MS || '300000'), // 5 minutes
    message: 'AI service rate limit exceeded. Please wait before making more AI requests.'
  } as RateLimitConfig
} as const

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
  message?: string
}

// Server functions are now in rate-limit-server.ts to avoid "use server" conflicts
// This file only exports types and constants that can be used client-side

/**
 * Custom error class for rate limit exceeded
 */
export class RateLimitExceededError extends Error {
  public readonly retryAfter: number
  public readonly resetTime: number
  public readonly type: RateLimitType
  
  constructor(
    message: string,
    retryAfter: number,
    resetTime: number,
    type: RateLimitType
  ) {
    super(message)
    this.name = 'RateLimitExceededError'
    this.retryAfter = retryAfter
    this.resetTime = resetTime
    this.type = type
  }
}