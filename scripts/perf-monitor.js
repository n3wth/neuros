#!/usr/bin/env node

/**
 * Performance Monitoring Dashboard for Neuros
 * Tracks build size, type errors, test coverage, and more
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Performance metrics file
const METRICS_FILE = path.join(process.cwd(), 'perf-metrics.json')
const HISTORY_FILE = path.join(process.cwd(), '.perf-history.json')

// Metric collection functions
function getBundleSize() {
  try {
    // Check .next directory
    const nextDir = path.join(process.cwd(), '.next')
    if (!fs.existsSync(nextDir)) {
      return { size: 'N/A', details: 'Build not found' }
    }
    
    // Get size of static files
    const staticDir = path.join(nextDir, 'static')
    if (fs.existsSync(staticDir)) {
      const size = getDirSize(staticDir)
      return {
        size: formatBytes(size),
        details: {
          static: formatBytes(size),
          total: formatBytes(getDirSize(nextDir))
        }
      }
    }
    
    return { size: 'N/A', details: 'Static dir not found' }
  } catch (error) {
    return { size: 'Error', details: error.message }
  }
}

function getTypeErrors() {
  try {
    // Run TypeScript compiler in check mode
    execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' })
    return { count: 0, status: '✅ No errors' }
  } catch (error) {
    // Parse error output
    const output = error.stdout || error.message || ''
    const errors = (output.match(/error TS\d+:/g) || []).length
    const warnings = (output.match(/warning/gi) || []).length
    
    return {
      count: errors,
      warnings: warnings,
      status: errors > 0 ? `❌ ${errors} errors` : '✅ No errors',
      sample: output.split('\n').slice(0, 3).join('\n')
    }
  }
}

function getTestCoverage() {
  try {
    const coverageFile = path.join(process.cwd(), 'coverage', 'coverage-summary.json')
    
    if (!fs.existsSync(coverageFile)) {
      // Try to generate coverage
      console.log('   Generating test coverage...')
      execSync('npm run test:coverage', { stdio: 'ignore' })
    }
    
    if (fs.existsSync(coverageFile)) {
      const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
      return {
        lines: Math.round(coverage.total.lines.pct),
        statements: Math.round(coverage.total.statements.pct),
        functions: Math.round(coverage.total.functions.pct),
        branches: Math.round(coverage.total.branches.pct),
        status: getCoverageStatus(coverage.total.lines.pct)
      }
    }
    
    return { lines: 'N/A', status: 'No coverage data' }
  } catch (error) {
    return { lines: 'N/A', status: 'Coverage unavailable' }
  }
}

function getBuildTime() {
  try {
    console.log('   Measuring build time...')
    const start = Date.now()
    execSync('npm run build', { stdio: 'ignore' })
    const duration = (Date.now() - start) / 1000
    
    return {
      time: `${duration.toFixed(2)}s`,
      status: duration < 30 ? '✅ Fast' : duration < 60 ? '🟡 Normal' : '❌ Slow'
    }
  } catch (error) {
    return { time: 'Failed', status: '❌ Build failed' }
  }
}

function getLintErrors() {
  try {
    execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' })
    return { count: 0, status: '✅ No issues' }
  } catch (error) {
    const output = error.stdout || ''
    const errors = (output.match(/error/gi) || []).length
    const warnings = (output.match(/warning/gi) || []).length
    
    return {
      errors: errors,
      warnings: warnings,
      status: errors > 0 ? `❌ ${errors} errors` : warnings > 0 ? `⚠️ ${warnings} warnings` : '✅ Clean'
    }
  }
}

function getDependencyCount() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const deps = Object.keys(packageJson.dependencies || {}).length
    const devDeps = Object.keys(packageJson.devDependencies || {}).length
    
    return {
      production: deps,
      development: devDeps,
      total: deps + devDeps,
      status: `${deps} prod, ${devDeps} dev`
    }
  } catch {
    return { total: 'N/A', status: 'Unable to read package.json' }
  }
}

// Helper functions
function getDirSize(dirPath) {
  let size = 0
  
  if (!fs.existsSync(dirPath)) return 0
  
  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      size += getDirSize(filePath)
    } else {
      size += stat.size
    }
  }
  
  return size
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getCoverageStatus(percentage) {
  if (percentage >= 80) return '✅ Excellent'
  if (percentage >= 60) return '🟡 Good'
  if (percentage >= 40) return '⚠️ Needs improvement'
  return '❌ Poor'
}

function createProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width)
  const empty = width - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

// Collect all metrics
function collectMetrics() {
  console.log('📊 Collecting performance metrics...\n')
  
  const metrics = {
    timestamp: new Date().toISOString(),
    bundleSize: getBundleSize(),
    typeErrors: getTypeErrors(),
    testCoverage: getTestCoverage(),
    lintErrors: getLintErrors(),
    dependencies: getDependencyCount(),
    // buildTime: getBuildTime(), // Commented out as it's slow
  }
  
  // Save current metrics
  fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2))
  
  // Update history
  updateHistory(metrics)
  
  return metrics
}

// Update metrics history
function updateHistory(metrics) {
  let history = []
  
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
    } catch {
      history = []
    }
  }
  
  // Keep last 10 entries
  history.push({
    timestamp: metrics.timestamp,
    bundleSize: metrics.bundleSize.size,
    typeErrors: metrics.typeErrors.count,
    coverage: metrics.testCoverage.lines
  })
  
  if (history.length > 10) {
    history = history.slice(-10)
  }
  
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2))
}

// Display dashboard
function displayDashboard(metrics) {
  console.clear()
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║           🚀 Neuros Performance Dashboard                  ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  
  // Bundle Size
  console.log('📦 Bundle Size')
  console.log(`   Total: ${metrics.bundleSize.size}`)
  if (metrics.bundleSize.details && typeof metrics.bundleSize.details === 'object') {
    console.log(`   Static: ${metrics.bundleSize.details.static}`)
  }
  console.log('')
  
  // Type Safety
  console.log('🏷️  Type Safety')
  console.log(`   Status: ${metrics.typeErrors.status}`)
  if (metrics.typeErrors.warnings) {
    console.log(`   Warnings: ${metrics.typeErrors.warnings}`)
  }
  console.log('')
  
  // Test Coverage
  console.log('🧪 Test Coverage')
  if (typeof metrics.testCoverage.lines === 'number') {
    const coverage = metrics.testCoverage.lines
    console.log(`   Lines: ${coverage}% [${createProgressBar(coverage)}]`)
    console.log(`   Status: ${metrics.testCoverage.status}`)
    
    if (metrics.testCoverage.statements) {
      console.log(`   Details: Statements ${metrics.testCoverage.statements}% | Functions ${metrics.testCoverage.functions}% | Branches ${metrics.testCoverage.branches}%`)
    }
  } else {
    console.log(`   Status: ${metrics.testCoverage.status}`)
  }
  console.log('')
  
  // Code Quality
  console.log('✨ Code Quality')
  console.log(`   Lint: ${metrics.lintErrors.status}`)
  console.log('')
  
  // Dependencies
  console.log('📚 Dependencies')
  console.log(`   Total: ${metrics.dependencies.total}`)
  console.log(`   Breakdown: ${metrics.dependencies.status}`)
  console.log('')
  
  // History Trend (if available)
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
      if (history.length > 1) {
        console.log('📈 Recent Trend')
        const recent = history[history.length - 1]
        const previous = history[history.length - 2]
        
        // Compare metrics
        if (typeof recent.typeErrors === 'number' && typeof previous.typeErrors === 'number') {
          const diff = recent.typeErrors - previous.typeErrors
          if (diff > 0) {
            console.log(`   Type Errors: ⬆️ +${diff} (worse)`)
          } else if (diff < 0) {
            console.log(`   Type Errors: ⬇️ ${diff} (better)`)
          } else {
            console.log(`   Type Errors: ➡️ No change`)
          }
        }
        
        if (typeof recent.coverage === 'number' && typeof previous.coverage === 'number') {
          const diff = recent.coverage - previous.coverage
          if (diff > 0) {
            console.log(`   Coverage: ⬆️ +${diff}% (better)`)
          } else if (diff < 0) {
            console.log(`   Coverage: ⬇️ ${diff}% (worse)`)
          } else {
            console.log(`   Coverage: ➡️ No change`)
          }
        }
        console.log('')
      }
    } catch {
      // Ignore history errors
    }
  }
  
  // Recommendations
  console.log('💡 Recommendations')
  const recommendations = []
  
  if (metrics.typeErrors.count > 0) {
    recommendations.push('• Fix TypeScript errors with: npm run typecheck')
  }
  
  if (typeof metrics.testCoverage.lines === 'number' && metrics.testCoverage.lines < 60) {
    recommendations.push('• Improve test coverage with: npm run test:coverage')
  }
  
  if (metrics.lintErrors.errors > 0) {
    recommendations.push('• Fix lint errors with: npm run lint --fix')
  }
  
  if (recommendations.length === 0) {
    console.log('   ✅ All metrics look good!')
  } else {
    recommendations.forEach(rec => console.log(rec))
  }
  
  console.log('')
  console.log('─'.repeat(62))
  console.log(`Last updated: ${new Date(metrics.timestamp).toLocaleString()}`)
}

// Monitor mode
function startMonitor() {
  const updateInterval = 30000 // Update every 30 seconds
  
  function update() {
    const metrics = collectMetrics()
    displayDashboard(metrics)
    console.log('\n📡 Monitoring... (Press Ctrl+C to exit)')
  }
  
  update()
  setInterval(update, updateInterval)
}

// Main function
function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  switch (command) {
    case 'monitor':
    case '-m':
      startMonitor()
      break
      
    case 'history':
    case '-h':
      if (fs.existsSync(HISTORY_FILE)) {
        const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
        console.log('📊 Performance History')
        console.log('─'.repeat(60))
        history.forEach(entry => {
          console.log(`${new Date(entry.timestamp).toLocaleString()}`)
          console.log(`  Bundle: ${entry.bundleSize} | Errors: ${entry.typeErrors} | Coverage: ${entry.coverage}%`)
        })
      } else {
        console.log('No history available')
      }
      break
      
    case 'clean':
    case '-c':
      // Clean up metrics files
      if (fs.existsSync(METRICS_FILE)) fs.unlinkSync(METRICS_FILE)
      if (fs.existsSync(HISTORY_FILE)) fs.unlinkSync(HISTORY_FILE)
      console.log('✅ Metrics cleaned')
      break
      
    case 'help':
      console.log('Performance Monitor')
      console.log('')
      console.log('Usage: node scripts/perf-monitor.js [command]')
      console.log('')
      console.log('Commands:')
      console.log('  monitor, -m   Start continuous monitoring')
      console.log('  history, -h   Show metrics history')
      console.log('  clean, -c     Clean metrics files')
      console.log('  help          Show this help')
      console.log('')
      console.log('No command:     Collect and display metrics once')
      break
      
    default:
      // Default - collect and display once
      const metrics = collectMetrics()
      displayDashboard(metrics)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Performance monitor stopped')
  process.exit(0)
})

// Run if called directly
if (require.main === module) {
  main()
}