#!/usr/bin/env node

/**
 * AI-Powered Quality Monitor
 * Continuously analyzes code quality and suggests improvements
 */

import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

class QualityMonitor {
  constructor() {
    this.metrics = {
      complexity: new Map(),
      testCoverage: new Map(),
      performance: new Map(),
      security: new Map(),
      accessibility: new Map()
    }
    this.improvements = []
  }

  async analyzeCodebase() {
    console.log('🔍 Analyzing codebase quality...')
    
    // Analyze TypeScript/JavaScript files
    const files = await this.findFiles(['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'])
    
    for (const file of files) {
      await this.analyzeFile(file)
    }
    
    // Generate improvement suggestions
    await this.generateImprovements()
    
    // Create quality report
    await this.createReport()
    
    return this.improvements
  }

  async findFiles(patterns) {
    const { stdout } = await this.execCommand(
      `find . -type f \\( ${patterns.map(p => `-name "${p}"`).join(' -o ')} \\) | grep -v node_modules | grep -v .next`
    )
    return stdout.trim().split('\n').filter(Boolean)
  }

  async analyzeFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Calculate cyclomatic complexity
    const complexity = this.calculateComplexity(content)
    this.metrics.complexity.set(filePath, complexity)
    
    // Check test coverage
    const hasTests = await this.hasTests(filePath)
    this.metrics.testCoverage.set(filePath, hasTests)
    
    // Analyze performance patterns
    const perfIssues = this.analyzePerformance(content)
    if (perfIssues.length > 0) {
      this.metrics.performance.set(filePath, perfIssues)
    }
    
    // Security analysis
    const securityIssues = this.analyzeSecurity(content)
    if (securityIssues.length > 0) {
      this.metrics.security.set(filePath, securityIssues)
    }
    
    // Accessibility analysis for components
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      const a11yIssues = this.analyzeAccessibility(content)
      if (a11yIssues.length > 0) {
        this.metrics.accessibility.set(filePath, a11yIssues)
      }
    }
  }

  calculateComplexity(content) {
    // Simple cyclomatic complexity calculation
    const conditionals = (content.match(/\b(if|else|switch|case|for|while|do|catch)\b/g) || []).length
    const logicalOperators = (content.match(/(\|\||&&|\?:)/g) || []).length
    return conditionals + logicalOperators + 1
  }

  async hasTests(filePath) {
    const testPatterns = [
      filePath.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1'),
      filePath.replace(/\.(ts|tsx|js|jsx)$/, '.spec.$1'),
      filePath.replace(/\/([^/]+)\.(ts|tsx|js|jsx)$/, '/__tests__/$1.test.$2')
    ]
    
    for (const pattern of testPatterns) {
      try {
        await fs.access(pattern)
        return true
      } catch {}
    }
    return false
  }

  analyzePerformance(content) {
    const issues = []
    
    // Check for performance anti-patterns
    if (content.includes('useEffect') && !content.includes('useCallback')) {
      issues.push('Consider using useCallback for functions passed to useEffect')
    }
    
    if (content.match(/map.*map/s)) {
      issues.push('Nested map operations detected - consider optimization')
    }
    
    if (content.includes('JSON.parse') && content.includes('JSON.stringify')) {
      issues.push('Multiple JSON operations - consider caching')
    }
    
    return issues
  }

  analyzeSecurity(content) {
    const issues = []
    
    // Check for security issues
    if (content.includes('dangerouslySetInnerHTML')) {
      issues.push('dangerouslySetInnerHTML usage - ensure content is sanitized')
    }
    
    if (content.match(/eval\s*\(/)) {
      issues.push('eval() usage detected - security risk')
    }
    
    if (content.match(/innerHTML\s*=/)) {
      issues.push('Direct innerHTML assignment - potential XSS risk')
    }
    
    return issues
  }

  analyzeAccessibility(content) {
    const issues = []
    
    // Check for accessibility issues
    if (content.includes('<img') && !content.includes('alt=')) {
      issues.push('Images without alt text')
    }
    
    if (content.includes('onClick') && !content.includes('onKeyDown')) {
      issues.push('Click handlers without keyboard support')
    }
    
    if (!content.includes('aria-') && content.includes('role=')) {
      issues.push('Custom roles without ARIA attributes')
    }
    
    return issues
  }

  async generateImprovements() {
    // Find files with high complexity
    const complexFiles = Array.from(this.metrics.complexity.entries())
      .filter(([_, complexity]) => complexity > 10)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    if (complexFiles.length > 0) {
      this.improvements.push({
        type: 'complexity',
        priority: 'high',
        files: complexFiles.map(([file, complexity]) => ({ file, complexity })),
        suggestion: 'Refactor these complex files to improve maintainability'
      })
    }
    
    // Find untested files
    const untestedFiles = Array.from(this.metrics.testCoverage.entries())
      .filter(([_, hasTests]) => !hasTests)
      .map(([file]) => file)
    
    if (untestedFiles.length > 0) {
      this.improvements.push({
        type: 'testing',
        priority: 'high',
        files: untestedFiles.slice(0, 10),
        suggestion: 'Add tests for these files to improve coverage'
      })
    }
    
    // Performance improvements
    const perfFiles = Array.from(this.metrics.performance.entries())
    if (perfFiles.length > 0) {
      this.improvements.push({
        type: 'performance',
        priority: 'medium',
        files: perfFiles.map(([file, issues]) => ({ file, issues })),
        suggestion: 'Optimize these performance bottlenecks'
      })
    }
    
    // Security improvements
    const securityFiles = Array.from(this.metrics.security.entries())
    if (securityFiles.length > 0) {
      this.improvements.push({
        type: 'security',
        priority: 'critical',
        files: securityFiles.map(([file, issues]) => ({ file, issues })),
        suggestion: 'Fix these security vulnerabilities immediately'
      })
    }
    
    // Accessibility improvements
    const a11yFiles = Array.from(this.metrics.accessibility.entries())
    if (a11yFiles.length > 0) {
      this.improvements.push({
        type: 'accessibility',
        priority: 'medium',
        files: a11yFiles.map(([file, issues]) => ({ file, issues })),
        suggestion: 'Improve accessibility in these components'
      })
    }
  }

  async createReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.metrics.complexity.size,
        averageComplexity: this.calculateAverageComplexity(),
        testCoverage: this.calculateTestCoverage(),
        securityIssues: this.metrics.security.size,
        performanceIssues: this.metrics.performance.size,
        accessibilityIssues: this.metrics.accessibility.size
      },
      improvements: this.improvements,
      trends: await this.analyzeTrends()
    }
    
    await fs.writeFile(
      'quality-report.json',
      JSON.stringify(report, null, 2)
    )
    
    // Generate AI insights
    if (process.env.OPENAI_API_KEY) {
      await this.generateAIInsights(report)
    }
    
    return report
  }

  calculateAverageComplexity() {
    const values = Array.from(this.metrics.complexity.values())
    return values.length > 0 
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
      : 0
  }

  calculateTestCoverage() {
    const tested = Array.from(this.metrics.testCoverage.values()).filter(Boolean).length
    const total = this.metrics.testCoverage.size
    return total > 0 ? ((tested / total) * 100).toFixed(2) + '%' : '0%'
  }

  async analyzeTrends() {
    try {
      // Load previous report
      const previousReport = JSON.parse(
        await fs.readFile('quality-report.json', 'utf-8')
      )
      
      return {
        complexityTrend: this.calculateTrend(
          previousReport.summary.averageComplexity,
          this.calculateAverageComplexity()
        ),
        coverageTrend: this.calculateTrend(
          parseFloat(previousReport.summary.testCoverage),
          parseFloat(this.calculateTestCoverage())
        )
      }
    } catch {
      return { complexityTrend: 'baseline', coverageTrend: 'baseline' }
    }
  }

  calculateTrend(previous, current) {
    const diff = current - previous
    if (Math.abs(diff) < 0.01) return 'stable'
    return diff > 0 ? 'improving' : 'declining'
  }

  async generateAIInsights(report) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a senior software architect analyzing code quality metrics. Provide actionable insights and specific recommendations.'
          },
          {
            role: 'user',
            content: `Analyze this quality report and provide 3 specific improvements:\n${JSON.stringify(report, null, 2)}`
          }
        ],
        temperature: 0.7
      })
      
      const insights = completion.choices[0].message.content
      await fs.writeFile('quality-insights.md', insights)
      console.log('✨ AI insights generated in quality-insights.md')
    } catch (error) {
      console.error('Failed to generate AI insights:', error.message)
    }
  }

  async execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error)
        else resolve({ stdout, stderr })
      })
    })
  }

  async autoFix() {
    console.log('🔧 Attempting automatic fixes...')
    
    for (const improvement of this.improvements) {
      if (improvement.type === 'accessibility') {
        await this.fixAccessibility(improvement.files)
      } else if (improvement.type === 'performance') {
        await this.fixPerformance(improvement.files)
      }
    }
  }

  async fixAccessibility(files) {
    for (const { file, issues } of files) {
      let content = await fs.readFile(file, 'utf-8')
      let modified = false
      
      for (const issue of issues) {
        if (issue.includes('Images without alt text')) {
          content = content.replace(/<img([^>]+)>/g, (match, attrs) => {
            if (!attrs.includes('alt=')) {
              modified = true
              return `<img${attrs} alt="">`
            }
            return match
          })
        }
      }
      
      if (modified) {
        await fs.writeFile(file, content)
        console.log(`  Fixed accessibility issues in ${file}`)
      }
    }
  }

  async fixPerformance(files) {
    // Implement performance auto-fixes
    console.log('  Performance fixes require manual review')
  }
}

// Run monitor
const monitor = new QualityMonitor()
monitor.analyzeCodebase()
  .then(improvements => {
    console.log('\n📊 Quality Analysis Complete')
    console.log(`Found ${improvements.length} areas for improvement`)
    
    // Auto-fix if requested
    if (process.argv.includes('--fix')) {
      return monitor.autoFix()
    }
  })
  .catch(console.error)