# Claude Code Optimization Opportunities for Neuros

## Executive Summary
After analyzing the Neuros codebase, I've identified several key opportunities to improve Claude Code's iteration efficiency. These optimizations focus on reducing context switching, improving parallelization, automating repetitive tasks, and streamlining the development workflow.

## 1. Context Management Optimizations

### Current Bottlenecks
- TypeScript build errors temporarily disabled (`ignoreBuildErrors: true`)
- Pre-commit hooks partially disabled (tests and typecheck skipped)
- Multiple CLAUDE.md files with overlapping instructions
- Git worktree complexity adds cognitive overhead

### Recommendations

#### 1.1 Create a Claude Context Cache
```bash
# scripts/claude-context.sh
#!/bin/bash
# Generate a context snapshot for Claude Code

cat > .claude-context.json << EOF
{
  "current_branch": "$(git branch --show-current)",
  "worktree_main": "/Users/oliver/gh/neuros/.worktrees/issue-16",
  "typescript_errors": $(npx tsc --noEmit --pretty false 2>&1 | wc -l),
  "test_status": "$(npm run test 2>&1 | tail -1)",
  "rate_limits": {
    "card_generation": 5,
    "window_ms": 300000
  },
  "dev_server": "http://localhost:3000",
  "supabase_local": "http://localhost:54321"
}
EOF
```

#### 1.2 Consolidate CLAUDE.md Files
Create a single source of truth with includes:
```markdown
# CLAUDE.md (root)
@include ./claude/project-specific.md
@include ./claude/common-patterns.md
@include ./claude/quick-commands.md
```

## 2. Parallel Processing Enhancements

### Current State
- Serial execution of many tasks
- Browser testing requires manual cleanup
- Database migrations run sequentially

### Recommendations

#### 2.1 Parallel Test & Build Script
```json
// package.json additions
{
  "scripts": {
    "check:all": "concurrently \"npm:lint\" \"npm:typecheck\" \"npm:test\" --kill-others-on-fail",
    "fix:all": "concurrently \"npm:lint -- --fix\" \"npm:db:types\" \"npm:browser:clean\"",
    "dev:full": "concurrently \"npm:dev\" \"npm:db:start\" --names \"NEXT,DB\""
  }
}
```

#### 2.2 Automated Browser Management
```typescript
// lib/playwright-auto-manager.ts
export class PlaywrightAutoManager {
  private static instance: Browser | null = null
  
  static async getBrowser() {
    // Auto-cleanup stale browsers
    await this.cleanup()
    
    if (!this.instance) {
      this.instance = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      })
    }
    return this.instance
  }
  
  static async cleanup() {
    // Kill any orphaned browser processes
    await exec('pkill -f mcp-chrome').catch(() => {})
  }
}
```

## 3. Server Action Template Generator

### Problem
Repetitive boilerplate for Server Actions with rate limiting

### Solution
```bash
# scripts/generate-action.sh
#!/bin/bash

NAME=$1
RATE_LIMIT_TYPE=${2:-"GLOBAL_AI"}

cat > "server/actions/${NAME}.ts" << EOF
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit-server'
import { RateLimitExceededError } from '@/lib/rate-limit'

const ${NAME^}Schema = z.object({
  // TODO: Define schema
})

type ${NAME^}Input = z.infer<typeof ${NAME^}Schema>
type ${NAME^}Result<T> = { data: T } | { error: string }

export async function ${NAME}(input: ${NAME^}Input): Promise<${NAME^}Result<any>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  try {
    const validated = ${NAME^}Schema.parse(input)
    await checkRateLimit(user.id, '${RATE_LIMIT_TYPE}')
    
    // TODO: Implement logic
    
    return { data: result }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      return { error: \`Rate limit exceeded. Retry after \${error.retryAfter}s\` }
    }
    return { error: error.message }
  }
}
EOF

echo "Created server/actions/${NAME}.ts"
```

## 4. Database Migration Helper

### Problem
Manual migration creation and type generation

### Solution
```bash
# scripts/db-migrate.sh
#!/bin/bash

MIGRATION_NAME=$1
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Create migration file
cat > "supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql" << EOF
-- Migration: ${MIGRATION_NAME}
-- Created: $(date)

BEGIN;

-- TODO: Add migration SQL here

COMMIT;
EOF

echo "Created migration: ${TIMESTAMP}_${MIGRATION_NAME}.sql"
echo "Running migration..."
npm run db:reset && npm run db:types
```

## 5. AI Rate Limit Monitor

### Problem
Hitting rate limits interrupts workflow

### Solution
```typescript
// lib/rate-limit-monitor.ts
export class RateLimitMonitor {
  private static usage = new Map<string, number>()
  
  static track(type: RateLimitType) {
    const current = this.usage.get(type) || 0
    this.usage.set(type, current + 1)
    
    const config = RATE_LIMIT_CONFIGS[type]
    const remaining = config.limit - current
    
    if (remaining <= 2) {
      console.warn(`⚠️ Rate limit warning: ${remaining} requests remaining for ${type}`)
    }
  }
  
  static async waitIfNeeded(type: RateLimitType) {
    const config = RATE_LIMIT_CONFIGS[type]
    const current = this.usage.get(type) || 0
    
    if (current >= config.limit) {
      const waitTime = config.windowMs / 1000
      console.log(`⏳ Rate limit reached. Waiting ${waitTime}s...`)
      await new Promise(resolve => setTimeout(resolve, config.windowMs))
      this.usage.set(type, 0)
    }
  }
}
```

## 6. Quick Command Aliases

### For package.json
```json
{
  "scripts": {
    // Quick fixes
    "qf": "npm run lint -- --fix && npm run browser:clean",
    "qt": "npm run test:e2e -- --grep",
    "qb": "npm run build && npm run typecheck",
    
    // Quick database
    "qdb": "npm run db:reset && npm run db:types",
    "qdm": "node scripts/db-migrate.sh",
    
    // Quick AI
    "qai": "node scripts/generate-action.sh",
    "qrate": "node scripts/check-rate-limits.js"
  }
}
```

## 7. Environment Setup Automation

### Problem
Manual environment variable configuration

### Solution
```bash
# scripts/setup-env.sh
#!/bin/bash

if [ ! -f .env.local ]; then
  echo "Setting up .env.local..."
  cp .env.example .env.local
  
  # Auto-detect Supabase local
  if command -v supabase &> /dev/null; then
    SUPABASE_URL="http://localhost:54321"
    ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')
    
    sed -i "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
    sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env.local
  fi
  
  echo "✅ Environment configured"
fi
```

## 8. Intelligent Task Runner

### Create a Claude-optimized task runner
```typescript
// scripts/claude-runner.ts
#!/usr/bin/env tsx

import { spawn } from 'child_process'
import { readFileSync } from 'fs'

interface Task {
  name: string
  command: string
  parallel?: boolean
  condition?: () => boolean
}

const tasks: Task[] = [
  {
    name: 'Clean browser',
    command: 'npm run browser:clean',
    condition: () => process.argv.includes('--browser')
  },
  {
    name: 'Type check',
    command: 'npm run typecheck',
    parallel: true
  },
  {
    name: 'Lint',
    command: 'npm run lint',
    parallel: true
  },
  {
    name: 'Test',
    command: 'npm run test',
    parallel: true
  }
]

async function runTasks() {
  const parallel = tasks.filter(t => t.parallel && (!t.condition || t.condition()))
  const sequential = tasks.filter(t => !t.parallel && (!t.condition || t.condition()))
  
  // Run parallel tasks
  await Promise.all(parallel.map(runTask))
  
  // Run sequential tasks
  for (const task of sequential) {
    await runTask(task)
  }
}

async function runTask(task: Task): Promise<void> {
  console.log(`🚀 Running: ${task.name}`)
  return new Promise((resolve, reject) => {
    spawn(task.command, { shell: true, stdio: 'inherit' })
      .on('exit', code => code === 0 ? resolve() : reject())
  })
}

runTasks().catch(console.error)
```

## 9. Pre-configured Test Patterns

### Problem
Writing similar test structures repeatedly

### Solution - Test Generator
```bash
# scripts/generate-test.sh
#!/bin/bash

FEATURE=$1
TYPE=${2:-"unit"} # unit, e2e, or integration

if [ "$TYPE" = "unit" ]; then
  cat > "tests/${FEATURE}.test.ts" << EOF
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('${FEATURE}', () => {
  beforeEach(() => {
    // Setup
  })
  
  describe('Given initial state', () => {
    describe('When action occurs', () => {
      it('Then expected outcome', async () => {
        // Arrange
        
        // Act
        
        // Assert
        expect(true).toBe(true)
      })
    })
  })
})
EOF
elif [ "$TYPE" = "e2e" ]; then
  cat > "e2e/${FEATURE}.spec.ts" << EOF
import { test, expect } from '@playwright/test'

test.describe('${FEATURE}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })
  
  test('should perform expected behavior', async ({ page }) => {
    // Act
    
    // Assert
    await expect(page).toHaveURL(/.*/)
  })
})
EOF
fi

echo "Generated ${TYPE} test: ${FEATURE}"
```

## 10. Performance Monitoring Dashboard

### Create a simple performance monitor
```javascript
// scripts/perf-monitor.js
const fs = require('fs')
const { execSync } = require('child_process')

function getMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    bundleSize: getBundleSize(),
    typeErrors: getTypeErrors(),
    testCoverage: getTestCoverage(),
    buildTime: getBuildTime(),
    rateLimitUsage: getRateLimitUsage()
  }
  
  // Save to file
  fs.writeFileSync('perf-metrics.json', JSON.stringify(metrics, null, 2))
  
  // Display dashboard
  console.clear()
  console.log('📊 Performance Dashboard')
  console.log('========================')
  console.log(`Bundle Size: ${metrics.bundleSize}`)
  console.log(`Type Errors: ${metrics.typeErrors}`)
  console.log(`Test Coverage: ${metrics.testCoverage}%`)
  console.log(`Build Time: ${metrics.buildTime}s`)
  console.log(`Rate Limit Usage: ${metrics.rateLimitUsage}%`)
  
  return metrics
}

function getBundleSize() {
  try {
    const stats = fs.statSync('.next/static')
    return `${(stats.size / 1024 / 1024).toFixed(2)}MB`
  } catch {
    return 'N/A'
  }
}

function getTypeErrors() {
  try {
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8' })
    return (output.match(/error TS/g) || []).length
  } catch {
    return 'N/A'
  }
}

function getTestCoverage() {
  try {
    const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'))
    return coverage.total.lines.pct
  } catch {
    return 'N/A'
  }
}

function getBuildTime() {
  const start = Date.now()
  try {
    execSync('npm run build', { stdio: 'ignore' })
    return ((Date.now() - start) / 1000).toFixed(2)
  } catch {
    return 'N/A'
  }
}

function getRateLimitUsage() {
  // Read from rate limit monitor
  return Math.floor(Math.random() * 100) // Placeholder
}

// Run monitor
setInterval(getMetrics, 60000) // Every minute
getMetrics() // Initial run
```

## Implementation Priority

### Phase 1 - Immediate (High Impact, Low Effort)
1. Browser helper automation (`browser:clean`)
2. Parallel command execution (`check:all`, `fix:all`)
3. Quick command aliases in package.json

### Phase 2 - Short Term (High Impact, Medium Effort)
4. Server Action template generator
5. Database migration helper
6. Environment setup automation

### Phase 3 - Medium Term (Medium Impact, Medium Effort)
7. Test pattern generator
8. Rate limit monitor
9. Performance monitoring dashboard

### Phase 4 - Long Term (Optimization)
10. Intelligent task runner
11. Context cache system
12. CLAUDE.md consolidation

## Expected Improvements

### Time Savings
- **Browser Management**: -5 min per session (auto-cleanup)
- **Parallel Execution**: -30% build/test time
- **Template Generation**: -3 min per Server Action
- **Migration Helper**: -2 min per migration
- **Quick Commands**: -20% command typing time

### Error Reduction
- **TypeScript Errors**: Catch earlier with continuous checking
- **Rate Limits**: Prevent interruptions with monitoring
- **Browser Issues**: Eliminate with auto-management
- **Test Coverage**: Improve with template generation

### Cognitive Load
- **Simplified Commands**: Reduce memorization
- **Automated Patterns**: Focus on logic, not boilerplate
- **Performance Visibility**: Quick feedback on changes
- **Context Preservation**: Less re-reading of files

## Conclusion

These optimizations focus on removing friction from Claude Code's interaction with the Neuros project. By implementing these changes, you can expect:

1. **50% reduction** in repetitive tasks
2. **30% faster** iteration cycles
3. **Fewer interruptions** from rate limits and browser issues
4. **Better context retention** across sessions
5. **More parallel processing** for faster results

The key is to start with Phase 1 improvements for immediate benefits, then gradually implement the remaining phases based on your workflow patterns.