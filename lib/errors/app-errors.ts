/**
 * Base error class for application-specific errors
 * Extends native Error with additional context for better AI understanding
 */
export class AppError extends Error {
  public readonly timestamp: Date
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.timestamp = new Date()
    this.context = context
    
    // Maintains proper stack trace for V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Converts error to JSON-serializable format for API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      ...(this.context && { context: this.context })
    }
  }
}

/**
 * Validation error for invalid user input
 * @example
 * throw new ValidationError('Email is required', { field: 'email' })
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context)
    this.name = 'ValidationError'
  }
}

/**
 * Authentication error for unauthorized access attempts
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization error for insufficient permissions
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

/**
 * Rate limit error with retry information
 * @property retryAfter - Seconds until the rate limit resets
 */
export class RateLimitError extends AppError {
  constructor(
    public readonly retryAfter: number,
    public readonly limit: number,
    public readonly window: string
  ) {
    super(
      `Rate limit exceeded. Try again in ${retryAfter} seconds`,
      'RATE_LIMIT_ERROR',
      429,
      { retryAfter, limit, window }
    )
    this.name = 'RateLimitError'
  }
}

/**
 * Database operation error
 */
export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(
      message,
      'DATABASE_ERROR',
      500,
      { originalError: originalError instanceof Error ? originalError.message : String(originalError) }
    )
    this.name = 'DatabaseError'
  }
}

/**
 * External API error (OpenAI, Supabase, etc.)
 */
export class ExternalAPIError extends AppError {
  constructor(
    service: string,
    message: string,
    originalError?: unknown
  ) {
    super(
      `${service} API error: ${message}`,
      'EXTERNAL_API_ERROR',
      502,
      { 
        service,
        originalError: originalError instanceof Error ? originalError.message : String(originalError)
      }
    )
    this.name = 'ExternalAPIError'
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      `${resource}${identifier ? ` with id ${identifier}` : ''} not found`,
      'NOT_FOUND',
      404,
      { resource, identifier }
    )
    this.name = 'NotFoundError'
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Type guard to check if an error has a retry-after value
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError
}