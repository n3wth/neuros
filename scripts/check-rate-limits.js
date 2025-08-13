#!/usr/bin/env node

/**
 * Rate Limit Monitor for Neuros
 * Tracks and displays current rate limit usage
 */

const fs = require('fs')
const path = require('path')

// Rate limit configurations (matching lib/rate-limit.ts)
const RATE_LIMITS = {
  CARD_GENERATION: {
    limit: parseInt(process.env.AI_CARD_GENERATION_RATE_LIMIT || '5'),
    windowMs: parseInt(process.env.AI_CARD_GENERATION_WINDOW_MS || '300000'),
    name: 'Card Generation'
  },
  GLOBAL_AI: {
    limit: parseInt(process.env.AI_GLOBAL_RATE_LIMIT || '25'),
    windowMs: parseInt(process.env.AI_GLOBAL_WINDOW_MS || '300000'),
    name: 'Global AI'
  },
  EXPLANATION: {
    limit: parseInt(process.env.AI_EXPLANATION_RATE_LIMIT || '10'),
    windowMs: parseInt(process.env.AI_EXPLANATION_WINDOW_MS || '300000'),
    name: 'Explanations'
  },
  PRACTICE: {
    limit: parseInt(process.env.AI_PRACTICE_RATE_LIMIT || '15'),
    windowMs: parseInt(process.env.AI_PRACTICE_WINDOW_MS || '300000'),
    name: 'Practice Questions'
  },
  LEARNING_PATH: {
    limit: parseInt(process.env.AI_LEARNING_PATH_RATE_LIMIT || '3'),
    windowMs: parseInt(process.env.AI_LEARNING_PATH_WINDOW_MS || '600000'),
    name: 'Learning Paths'
  },
  INSIGHTS: {
    limit: parseInt(process.env.AI_INSIGHTS_RATE_LIMIT || '8'),
    windowMs: parseInt(process.env.AI_INSIGHTS_WINDOW_MS || '300000'),
    name: 'Learning Insights'
  }
}

// Rate limit usage tracking file
const USAGE_FILE = path.join(process.cwd(), '.rate-limit-usage.json')

// Load or initialize usage data
function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = fs.readFileSync(USAGE_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading usage data:', error.message)
  }
  return {}
}

// Save usage data
function saveUsage(usage) {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2))
  } catch (error) {
    console.error('Error saving usage data:', error.message)
  }
}

// Simulate usage increment (for testing)
function incrementUsage(type, userId = 'test-user') {
  const usage = loadUsage()
  const key = `${type}:${userId}`
  const now = Date.now()
  
  if (!usage[key]) {
    usage[key] = {
      count: 0,
      resetTime: now + RATE_LIMITS[type].windowMs,
      firstRequestTime: now
    }
  }
  
  // Reset if window expired
  if (now >= usage[key].resetTime) {
    usage[key] = {
      count: 1,
      resetTime: now + RATE_LIMITS[type].windowMs,
      firstRequestTime: now
    }
  } else {
    usage[key].count++
  }
  
  saveUsage(usage)
  return usage[key]
}

// Display usage dashboard
function displayDashboard() {
  console.clear()
  console.log('📊 Rate Limit Monitor')
  console.log('=' .repeat(60))
  console.log('')
  
  const usage = loadUsage()
  const now = Date.now()
  
  // Display each rate limit type
  Object.entries(RATE_LIMITS).forEach(([type, config]) => {
    console.log(`📌 ${config.name}`)
    console.log(`   Limit: ${config.limit} requests per ${config.windowMs / 60000} minutes`)
    
    // Find all usage for this type
    const typeUsage = Object.entries(usage)
      .filter(([key]) => key.startsWith(type + ':'))
      .map(([key, data]) => ({ userId: key.split(':')[1], ...data }))
    
    if (typeUsage.length === 0) {
      console.log('   Status: ✅ No usage')
    } else {
      typeUsage.forEach(userUsage => {
        // Check if window expired
        if (now >= userUsage.resetTime) {
          console.log(`   User ${userUsage.userId}: ✅ Window expired (ready for new requests)`)
        } else {
          const remaining = config.limit - userUsage.count
          const resetIn = Math.ceil((userUsage.resetTime - now) / 1000)
          const percentage = Math.round((userUsage.count / config.limit) * 100)
          
          // Create visual progress bar
          const barLength = 20
          const filledLength = Math.round((percentage / 100) * barLength)
          const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)
          
          // Determine status emoji
          let status = '✅'
          if (percentage >= 100) status = '❌'
          else if (percentage >= 80) status = '⚠️'
          else if (percentage >= 60) status = '🟡'
          
          console.log(`   User ${userUsage.userId}: ${status} ${userUsage.count}/${config.limit} [${bar}] ${percentage}%`)
          
          if (remaining > 0) {
            console.log(`   ↳ ${remaining} requests remaining, resets in ${resetIn}s`)
          } else {
            console.log(`   ↳ Rate limit exceeded! Resets in ${resetIn}s`)
          }
        }
      })
    }
    console.log('')
  })
  
  // Display summary
  console.log('─'.repeat(60))
  console.log('📈 Summary')
  
  const totalUsage = Object.values(usage).reduce((sum, u) => {
    if (now < u.resetTime) return sum + u.count
    return sum
  }, 0)
  
  const totalLimit = Object.values(RATE_LIMITS).reduce((sum, config) => sum + config.limit, 0)
  const overallPercentage = Math.round((totalUsage / totalLimit) * 100)
  
  console.log(`   Overall usage: ${totalUsage}/${totalLimit} (${overallPercentage}%)`)
  console.log('')
  
  // Display tips
  if (overallPercentage >= 80) {
    console.log('💡 Tips:')
    console.log('   • Consider spacing out AI requests')
    console.log('   • Use caching for repeated queries')
    console.log('   • Batch operations when possible')
    console.log('')
  }
}

// Monitor mode - continuous update
function startMonitor() {
  const updateInterval = 5000 // Update every 5 seconds
  
  displayDashboard()
  
  console.log('📡 Monitoring... (Press Ctrl+C to exit)')
  console.log('─'.repeat(60))
  
  setInterval(() => {
    displayDashboard()
  }, updateInterval)
}

// Command line interface
function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  switch (command) {
    case 'monitor':
    case '-m':
      startMonitor()
      break
      
    case 'test':
    case '-t':
      // Test mode - simulate usage
      console.log('🧪 Test mode - simulating usage...')
      incrementUsage('CARD_GENERATION')
      incrementUsage('GLOBAL_AI')
      incrementUsage('GLOBAL_AI')
      console.log('✅ Test usage recorded')
      displayDashboard()
      break
      
    case 'reset':
    case '-r':
      // Reset all usage
      saveUsage({})
      console.log('🔄 Rate limit usage reset')
      break
      
    case 'help':
    case '-h':
      console.log('Rate Limit Monitor')
      console.log('')
      console.log('Usage: node scripts/check-rate-limits.js [command]')
      console.log('')
      console.log('Commands:')
      console.log('  monitor, -m   Start continuous monitoring')
      console.log('  test, -t      Simulate usage for testing')
      console.log('  reset, -r     Reset all usage data')
      console.log('  help, -h      Show this help message')
      console.log('')
      console.log('No command:     Show current usage and exit')
      break
      
    default:
      // Default - show dashboard once
      displayDashboard()
      
      // Show quick commands
      console.log('Quick commands:')
      console.log('  npm run qrate          - Show current usage')
      console.log('  npm run qrate monitor  - Start monitoring')
      console.log('  npm run qrate reset    - Reset usage')
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Rate limit monitor stopped')
  process.exit(0)
})

// Run main function
if (require.main === module) {
  main()
}