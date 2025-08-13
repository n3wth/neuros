# Logging System Documentation

## Overview

The application uses a centralized logging system designed for optimal debugging in Vercel deployments. The logger provides structured logging with proper context tracking for all server-side operations.

## Logger Location

- **File**: `/lib/logger.ts`
- **Import**: `import { logger } from '@/lib/logger'`

## Features

### Environment-Aware Formatting

- **Development**: Human-readable format with color-coded output
- **Production**: Structured JSON logging for Vercel log parsing

### Log Levels

```typescript
logger.debug('Debug message')    // Development only
logger.info('Info message')      // General information
logger.warn('Warning message')   // Warnings
logger.error('Error message')    // Errors with stack traces
```

### Contextual Logging

All log methods accept an optional context object:

```typescript
interface LogContext {
  userId?: string
  action?: string
  metadata?: Record<string, any>
  error?: Error | unknown
  duration?: number
  requestId?: string
}
```

## Usage Patterns

### Basic Logging

```typescript
// Simple message
logger.info('Card created successfully')

// With context
logger.info('Card created', {
  userId: user.id,
  metadata: { cardId: card.id, deckId: deck.id }
})

// Error logging
logger.error('Failed to create card', {
  userId: user.id,
  error: error,
  metadata: { input: cardData }
})
```

### Server Action Logging

Wrap Server Actions for automatic performance tracking:

```typescript
export async function myServerAction(input: Input) {
  const { user } = await auth()
  
  return logger.action('myServerAction', user?.id, async () => {
    // Your action logic here
    // Automatically logs start, completion, duration, and errors
    return result
  })
}
```

### API Call Logging

Track external API calls with timing:

```typescript
const result = await logger.api('openai', 'chat.completions', async () => {
  return openai.chat.completions.create({
    // API call parameters
  })
})
```

### Rate Limit Logging

```typescript
logger.rateLimit(userId, 'CARD_GENERATION', retryAfter)
```

### Authentication Events

```typescript
logger.auth('signin', userId)
logger.auth('signup', userId)
logger.auth('signout', userId)
logger.auth('error', userId, error)
```

### Database Operations

```typescript
logger.db('INSERT', 'cards', { userId, count: 5 })
logger.db('UPDATE', 'user_stats', { userId, fields: ['streak'] })
```

## Viewing Logs in Vercel

### Development (Local)

Logs appear in your terminal with clear formatting:
```
[2024-01-15T10:30:45.123Z] [INFO] Server Action started: generateCards
[2024-01-15T10:30:45.456Z] [INFO] API call succeeded: openai.chat.completions
[2024-01-15T10:30:45.789Z] [INFO] Server Action completed: generateCards
```

### Production (Vercel Dashboard)

1. Go to your Vercel project dashboard
2. Navigate to **Functions** tab
3. Select a function to view its logs
4. Use filters to search for specific:
   - User IDs: `"userId":"user_123"`
   - Actions: `"action":"generateCards"`
   - Errors: `"level":"error"`
   - Rate limits: `"limitType":"CARD_GENERATION"`

### Using Vercel CLI

```bash
# View real-time logs
vercel logs

# Filter by function
vercel logs --filter function=api/generate

# View recent logs
vercel logs --since 1h
```

## Best Practices

### 1. Always Include User Context

```typescript
logger.info('Operation performed', { userId: user.id })
```

### 2. Log Errors with Full Context

```typescript
try {
  // operation
} catch (error) {
  logger.error('Operation failed', {
    userId: user.id,
    error,
    metadata: {
      input: userInput,
      state: currentState
    }
  })
}
```

### 3. Use Structured Metadata

```typescript
// Good - structured and searchable
logger.info('Cards generated', {
  userId: user.id,
  metadata: {
    count: 10,
    difficulty: 'intermediate',
    topic: 'JavaScript'
  }
})

// Bad - unstructured string
logger.info(`Generated 10 intermediate JavaScript cards for ${user.id}`)
```

### 4. Track Performance-Critical Operations

```typescript
await logger.action('expensiveOperation', userId, async () => {
  // This will log duration automatically
  return performExpensiveOperation()
})
```

### 5. Use Appropriate Log Levels

- **Debug**: Detailed information for debugging (dev only)
- **Info**: General operational information
- **Warn**: Warning conditions that might need attention
- **Error**: Error conditions that need immediate attention

## Debugging Common Issues

### Finding Specific User Issues

```javascript
// In Vercel logs, search for:
"userId":"<user_id_here>"
```

### Tracking Rate Limit Issues

```javascript
// Search for rate limit events:
"level":"warn" AND "limitType"
```

### Performance Analysis

```javascript
// Find slow operations:
"duration" > 1000
```

### Error Patterns

```javascript
// Find all errors for a specific action:
"level":"error" AND "action":"generateCards"
```

## Environment Variables

The logger automatically detects the environment:
- `NODE_ENV=development` - Human-readable logs
- `NODE_ENV=production` - JSON structured logs

No additional configuration required.

## Migration from console.log

Replace direct console statements:

```typescript
// Before
console.log('Creating card...')
console.error('Error:', error)

// After
logger.info('Creating card', { userId, metadata: { cardData } })
logger.error('Failed to create card', { userId, error })
```

## Testing

The logger is automatically tested during builds. In development, you'll see formatted output in your terminal. In production, logs are sent to Vercel's logging infrastructure.

## Troubleshooting

### Logs Not Appearing in Vercel

1. Ensure you're using the logger, not console directly
2. Check that the function is actually being called
3. Verify NODE_ENV is set to 'production' in Vercel
4. Check Vercel's function logs, not build logs

### Too Many Logs

- Use `logger.debug()` for verbose logging (dev only)
- Add conditional logging based on environment variables
- Use structured metadata instead of multiple log statements

### Performance Impact

The logger is designed to be lightweight:
- Async operations don't block
- JSON serialization only in production
- Debug logs skipped in production