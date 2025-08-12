export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class RateLimitError extends Error {
  retryAfter: number
  limit: number
  window: string

  constructor(retryAfter: number, limit: number, window: string) {
    super(`Rate limit exceeded. Try again in ${retryAfter} seconds.`)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
    this.limit = limit
    this.window = window
  }
}

export const throwError = {
  database: (message: string, error: unknown): never => {
    console.error('Database error:', error)
    throw new Error(message)
  },
  validation: (message: string): never => {
    throw new ValidationError(message)
  },
  rateLimit: (retryAfter: number, limit: number, window: string): never => {
    throw new RateLimitError(retryAfter, limit, window)
  }
}