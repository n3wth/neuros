/**
 * Centralized logger for Vercel deployments
 * Provides structured logging with proper context for debugging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  action?: string
  metadata?: Record<string, unknown>
  error?: Error | unknown
  duration?: number
  requestId?: string
  // Allow any additional properties
  [key: string]: string | number | boolean | unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Formats log message with timestamp and structure for Vercel
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      env: process.env.NODE_ENV,
      ...context,
      // Convert error to serializable format
      ...(context?.error ? {
        error: context.error instanceof Error
          ? {
              name: context.error.name,
              message: context.error.message,
              stack: context.error.stack,
              cause: context.error.cause
            }
          : context.error
      } : {})
    }

    // In production, use structured JSON logging for better Vercel parsing
    if (this.isProduction) {
      switch (level) {
        case 'error':
          console.error(JSON.stringify(logData))
          break
        case 'warn':
          console.warn(JSON.stringify(logData))
          break
        case 'info':
          console.info(JSON.stringify(logData))
          break
        case 'debug':
          // Only log debug in development
          if (this.isDevelopment) {
            console.log(JSON.stringify(logData))
          }
          break
      }
    } else {
      // In development, use human-readable format
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`
      const formattedMessage = `${prefix} ${message}`
      
      switch (level) {
        case 'error':
          console.error(formattedMessage, context || '')
          if (context?.error instanceof Error) {
            console.error(context.error.stack)
          }
          break
        case 'warn':
          console.warn(formattedMessage, context || '')
          break
        case 'info':
          console.info(formattedMessage, context || '')
          break
        case 'debug':
          console.log(formattedMessage, context || '')
          break
      }
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.formatMessage('debug', message, context)
    }
  }

  /**
   * Log general information
   */
  info(message: string, context?: LogContext): void {
    this.formatMessage('info', message, context)
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext): void {
    this.formatMessage('warn', message, context)
  }

  /**
   * Log errors with full context
   */
  error(message: string, context?: LogContext): void {
    this.formatMessage('error', message, context)
  }

  /**
   * Log Server Action execution with timing
   */
  async action<T>(
    actionName: string,
    userId: string | undefined,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    this.info(`Server Action started: ${actionName}`, {
      action: actionName,
      userId,
      requestId
    })

    try {
      const result = await fn()
      const duration = Date.now() - startTime

      this.info(`Server Action completed: ${actionName}`, {
        action: actionName,
        userId,
        requestId,
        duration
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      this.error(`Server Action failed: ${actionName}`, {
        action: actionName,
        userId,
        requestId,
        duration,
        error
      })

      throw error
    }
  }

  /**
   * Log API calls with timing
   */
  async api<T>(
    service: string,
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now()

    this.debug(`API call started: ${service}.${operation}`, {
      metadata: { service, operation }
    })

    try {
      const result = await fn()
      const duration = Date.now() - startTime

      this.info(`API call succeeded: ${service}.${operation}`, {
        metadata: { service, operation },
        duration
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      this.error(`API call failed: ${service}.${operation}`, {
        metadata: { service, operation },
        duration,
        error
      })

      throw error
    }
  }

  /**
   * Log rate limit events
   */
  rateLimit(userId: string, limitType: string, retryAfter?: number): void {
    this.warn('Rate limit exceeded', {
      userId,
      metadata: {
        limitType,
        retryAfter
      }
    })
  }

  /**
   * Log authentication events
   */
  auth(event: 'signin' | 'signup' | 'signout' | 'error', userId?: string, error?: Error): void {
    const level = event === 'error' ? 'error' : 'info'
    const message = `Auth event: ${event}`

    if (level === 'error') {
      this.error(message, { userId, error })
    } else {
      this.info(message, { userId })
    }
  }

  /**
   * Log database operations
   */
  db(operation: string, table: string, context?: LogContext): void {
    this.debug(`Database operation: ${operation} on ${table}`, {
      ...context,
      metadata: {
        ...context?.metadata,
        operation,
        table
      }
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export type for use in other files
export type { LogContext }