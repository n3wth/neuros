#!/bin/bash

# Server Action Generator for Neuros
# Creates boilerplate for rate-limited server actions

NAME=$1
RATE_LIMIT_TYPE=${2:-"GLOBAL_AI"}

if [ -z "$NAME" ]; then
    echo "❌ Usage: ./scripts/generate-action.sh <action-name> [rate-limit-type]"
    echo ""
    echo "Rate limit types:"
    echo "  CARD_GENERATION  - For card generation (5 req/5min)"
    echo "  GLOBAL_AI        - For general AI operations (25 req/5min)"
    echo "  EXPLANATION      - For explanations (10 req/5min)"
    echo "  PRACTICE         - For practice questions (15 req/5min)"
    echo "  LEARNING_PATH    - For learning paths (3 req/10min)"
    echo "  INSIGHTS         - For learning insights (8 req/5min)"
    echo ""
    echo "Example: ./scripts/generate-action.sh generateFlashcard CARD_GENERATION"
    exit 1
fi

# Convert name to PascalCase for types
PASCAL_NAME=$(echo "$NAME" | sed -r 's/(^|_)([a-z])/\U\2/g')

# Create the server action file
cat > "server/actions/${NAME}.ts" << EOF
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit-server'
import { RateLimitExceededError } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

// Input validation schema
const ${PASCAL_NAME}Schema = z.object({
  // TODO: Define your input schema here
  // Example:
  // prompt: z.string().min(1).max(1000),
  // options: z.object({
  //   temperature: z.number().optional().default(0.7)
  // }).optional()
})

// Type definitions
type ${PASCAL_NAME}Input = z.infer<typeof ${PASCAL_NAME}Schema>
type ${PASCAL_NAME}Result<T> = { data: T } | { error: string }

// TODO: Define your return type
interface ${PASCAL_NAME}Data {
  // Add your return data structure here
  id: string
  // ... other fields
}

/**
 * ${PASCAL_NAME} Server Action
 * 
 * TODO: Add description of what this action does
 * 
 * @param input - The validated input for the action
 * @returns Promise with data or error
 */
export async function ${NAME}(input: ${PASCAL_NAME}Input): Promise<${PASCAL_NAME}Result<${PASCAL_NAME}Data>> {
  // Authenticate user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    logger.warn('Unauthorized ${NAME} attempt')
    return { error: 'Unauthorized' }
  }
  
  try {
    // Validate input
    const validated = ${PASCAL_NAME}Schema.parse(input)
    
    // Check rate limits
    try {
      await checkRateLimit(user.id, '${RATE_LIMIT_TYPE}')
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        logger.info('Rate limit exceeded for ${NAME}', {
          metadata: { userId: user.id, retryAfter: error.retryAfter }
        })
        return { error: \`Rate limit exceeded. Please wait \${error.retryAfter} seconds before trying again.\` }
      }
      throw error
    }
    
    // TODO: Implement your business logic here
    // Example database operation:
    // const { data, error } = await supabase
    //   .from('your_table')
    //   .insert({
    //     user_id: user.id,
    //     ...validated
    //   })
    //   .select()
    //   .single()
    
    // if (error) {
    //   logger.error('Database error in ${NAME}', { metadata: { error: error.message } })
    //   throw error
    // }
    
    // Placeholder implementation - replace with actual logic
    const result: ${PASCAL_NAME}Data = {
      id: crypto.randomUUID(),
      // Add your actual data here
    }
    
    logger.info('${NAME} completed successfully', {
      metadata: { userId: user.id }
    })
    
    return { data: result }
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      logger.error('Validation error in ${NAME}', {
        metadata: { errors: error.errors }
      })
      return { error: 'Invalid input: ' + error.errors.map(e => e.message).join(', ') }
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    logger.error('Error in ${NAME}', {
      metadata: { error: errorMessage, userId: user?.id }
    })
    
    return { error: errorMessage }
  }
}

// Optional: Export helper functions for this action
export async function can${PASCAL_NAME}(userId: string): Promise<boolean> {
  try {
    const result = await checkRateLimit(userId, '${RATE_LIMIT_TYPE}')
    return result.allowed
  } catch {
    return false
  }
}
EOF

echo "✅ Created server/actions/${NAME}.ts"
echo ""
echo "Next steps:"
echo "1. Define the input schema in ${PASCAL_NAME}Schema"
echo "2. Define the return type in ${PASCAL_NAME}Data interface"
echo "3. Implement the business logic"
echo "4. Update the JSDoc comment with proper description"
echo ""
echo "To use in a component:"
echo "  import { ${NAME} } from '@/server/actions/${NAME}'"
echo "  const result = await ${NAME}({ ... })"
echo "  if ('error' in result) { /* handle error */ }"
echo "  else { /* use result.data */ }"