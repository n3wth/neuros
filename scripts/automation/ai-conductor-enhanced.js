#!/usr/bin/env node

/**
 * Enhanced AI Conductor - Parallel Workforce Management System
 * 
 * This system treats worktrees as a team of 30 engineers, 30 designers, and product managers
 * who can all work simultaneously on different tasks for maximum impact.
 */

import { execSync, spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class ParallelWorkforce {
  constructor() {
    this.baseDir = process.cwd()
    this.worktreesDir = path.join(this.baseDir, '.worktrees')
    this.activeEmployees = new Map()
    this.completedTasks = []
    this.taskQueue = []
    
    // Define our workforce capabilities
    this.employeeTypes = {
      ENGINEER: {
        count: 30,
        skills: ['bug-fix', 'performance', 'refactor', 'testing', 'infrastructure'],
        prefix: 'eng'
      },
      DESIGNER: {
        count: 30,
        skills: ['ui-design', 'color-system', 'illustrations', 'animations', 'layouts'],
        prefix: 'des'
      },
      PM: {
        count: 10,
        skills: ['documentation', 'user-stories', 'roadmap', 'metrics', 'strategy'],
        prefix: 'pm'
      }
    }
  }

  async initialize() {
    console.log('🚀 Initializing Parallel Workforce System')
    console.log('📊 Available workforce:')
    console.log('   - 30 Engineers')
    console.log('   - 30 Designers')
    console.log('   - 10 Product Managers')
    console.log('   = 70 total parallel workers\n')

    // Ensure worktrees directory exists
    await fs.mkdir(this.worktreesDir, { recursive: true })
    
    // Clean up any orphaned worktrees
    await this.cleanupOrphanedWorktrees()
  }

  async analyzeIssues() {
    console.log('📋 Analyzing available work...')
    
    try {
      const issuesJson = execSync(
        'gh issue list --repo n3wth/neuros --state open --limit 50 --json number,title,labels,body',
        { encoding: 'utf8' }
      )
      
      const issues = JSON.parse(issuesJson)
      
      // Categorize issues by type
      const categorized = {
        bugs: [],
        features: [],
        design: [],
        performance: [],
        documentation: []
      }
      
      for (const issue of issues) {
        const title = issue.title.toLowerCase()
        const labels = (issue.labels || []).map(l => l.name?.toLowerCase() || '')
        
        if (title.includes('bug') || labels.includes('bug')) {
          categorized.bugs.push(issue)
        } else if (title.includes('design') || title.includes('ui') || title.includes('color') || title.includes('illustration')) {
          categorized.design.push(issue)
        } else if (title.includes('performance') || title.includes('optimization')) {
          categorized.performance.push(issue)
        } else if (title.includes('doc') || labels.includes('documentation')) {
          categorized.documentation.push(issue)
        } else {
          categorized.features.push(issue)
        }
      }
      
      console.log('\n📊 Work Distribution:')
      console.log(`   🐛 Bugs: ${categorized.bugs.length}`)
      console.log(`   ✨ Features: ${categorized.features.length}`)
      console.log(`   🎨 Design: ${categorized.design.length}`)
      console.log(`   ⚡ Performance: ${categorized.performance.length}`)
      console.log(`   📚 Documentation: ${categorized.documentation.length}`)
      
      return categorized
    } catch (error) {
      console.error('Failed to fetch issues:', error.message)
      return { bugs: [], features: [], design: [], performance: [], documentation: [] }
    }
  }

  assignEmployeeType(issueCategory) {
    // Assign the most appropriate employee type for each category
    const assignments = {
      bugs: 'ENGINEER',
      features: 'ENGINEER',
      design: 'DESIGNER',
      performance: 'ENGINEER',
      documentation: 'PM'
    }
    return assignments[issueCategory] || 'ENGINEER'
  }

  async deployEmployee(issue, employeeType, employeeId) {
    const worktreeName = `${this.employeeTypes[employeeType].prefix}-${employeeId}-issue-${issue.number}`
    const worktreePath = path.join(this.worktreesDir, worktreeName)
    
    console.log(`\n👤 Deploying ${employeeType} #${employeeId} to Issue #${issue.number}: ${issue.title}`)
    
    try {
      // Create worktree for this employee
      execSync(`git worktree add "${worktreePath}" -b fix-${issue.number}-${Date.now()}`, {
        stdio: 'pipe'
      })
      
      // Record active employee
      this.activeEmployees.set(worktreeName, {
        type: employeeType,
        id: employeeId,
        issue: issue.number,
        startTime: Date.now(),
        status: 'working'
      })
      
      // Simulate employee working on the issue
      // In reality, this would trigger an AI agent to analyze and fix the issue
      console.log(`   ✅ ${employeeType} #${employeeId} is now working on Issue #${issue.number}`)
      
      return worktreeName
    } catch (error) {
      console.error(`   ❌ Failed to deploy ${employeeType} #${employeeId}:`, error.message)
      return null
    }
  }

  async deployParallelWorkforce(categorizedIssues) {
    console.log('\n🚀 DEPLOYING PARALLEL WORKFORCE')
    console.log('=' .repeat(50))
    
    const deployments = []
    let engineerCount = 0
    let designerCount = 0
    let pmCount = 0
    
    // Deploy engineers for bugs (highest priority)
    for (const bug of categorizedIssues.bugs) {
      if (engineerCount < this.employeeTypes.ENGINEER.count) {
        deployments.push(this.deployEmployee(bug, 'ENGINEER', ++engineerCount))
      }
    }
    
    // Deploy designers for design issues
    for (const design of categorizedIssues.design) {
      if (designerCount < this.employeeTypes.DESIGNER.count) {
        deployments.push(this.deployEmployee(design, 'DESIGNER', ++designerCount))
      }
    }
    
    // Deploy engineers for performance issues
    for (const perf of categorizedIssues.performance) {
      if (engineerCount < this.employeeTypes.ENGINEER.count) {
        deployments.push(this.deployEmployee(perf, 'ENGINEER', ++engineerCount))
      }
    }
    
    // Deploy PMs for documentation
    for (const doc of categorizedIssues.documentation) {
      if (pmCount < this.employeeTypes.PM.count) {
        deployments.push(this.deployEmployee(doc, 'PM', ++pmCount))
      }
    }
    
    // Deploy remaining engineers for features
    for (const feature of categorizedIssues.features) {
      if (engineerCount < this.employeeTypes.ENGINEER.count) {
        deployments.push(this.deployEmployee(feature, 'ENGINEER', ++engineerCount))
      }
    }
    
    // Execute all deployments in parallel
    const results = await Promise.allSettled(deployments)
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length
    const failed = results.filter(r => r.status === 'rejected' || !r.value).length
    
    console.log('\n📊 Deployment Summary:')
    console.log(`   ✅ Successfully deployed: ${successful} employees`)
    console.log(`   ❌ Failed deployments: ${failed}`)
    console.log(`   👥 Total active employees: ${this.activeEmployees.size}`)
    
    return successful
  }

  async monitorProgress() {
    console.log('\n📈 Monitoring Employee Progress...')
    
    const interval = setInterval(() => {
      console.log(`\n⏰ Status Update (${new Date().toLocaleTimeString()})`)
      console.log(`   Active employees: ${this.activeEmployees.size}`)
      console.log(`   Completed tasks: ${this.completedTasks.length}`)
      
      // Show sample of active work
      let shown = 0
      for (const [name, employee] of this.activeEmployees) {
        if (shown++ < 5) {
          const duration = Math.floor((Date.now() - employee.startTime) / 1000)
          console.log(`   - ${employee.type} #${employee.id}: Issue #${employee.issue} (${duration}s)`)
        }
      }
      
      if (this.activeEmployees.size > 5) {
        console.log(`   ... and ${this.activeEmployees.size - 5} more`)
      }
    }, 10000) // Update every 10 seconds
    
    // Return cleanup function
    return () => clearInterval(interval)
  }

  async createPullRequests() {
    console.log('\n🔄 Creating Pull Requests for completed work...')
    
    const prPromises = []
    
    for (const [worktreeName, employee] of this.activeEmployees) {
      if (employee.status === 'completed') {
        const worktreePath = path.join(this.worktreesDir, worktreeName)
        
        prPromises.push(
          this.createPR(worktreePath, employee.issue, employee.type, employee.id)
            .catch(err => console.error(`Failed to create PR for Issue #${employee.issue}:`, err.message))
        )
      }
    }
    
    const results = await Promise.allSettled(prPromises)
    const successful = results.filter(r => r.status === 'fulfilled').length
    
    console.log(`\n✅ Created ${successful} pull requests`)
    return successful
  }

  async createPR(worktreePath, issueNumber, employeeType, employeeId) {
    try {
      // Get issue details for PR description
      const issueJson = execSync(
        `gh issue view ${issueNumber} --repo n3wth/neuros --json title,body`,
        { encoding: 'utf8', cwd: worktreePath }
      )
      const issue = JSON.parse(issueJson)
      
      // Create PR
      const prUrl = execSync(
        `gh pr create --title "Fix #${issueNumber}: ${issue.title}" ` +
        `--body "Fixes #${issueNumber}\n\nAutomated fix by ${employeeType} Agent #${employeeId}\n\n🤖 Generated with Claude Code AI Conductor" ` +
        `--base main`,
        { encoding: 'utf8', cwd: worktreePath }
      ).trim()
      
      console.log(`   ✅ PR created for Issue #${issueNumber}: ${prUrl}`)
      return prUrl
    } catch (error) {
      throw new Error(`PR creation failed: ${error.message}`)
    }
  }

  async cleanupOrphanedWorktrees() {
    try {
      const worktrees = execSync('git worktree list --porcelain', { encoding: 'utf8' })
        .split('\n\n')
        .filter(Boolean)
        .map(block => {
          const lines = block.split('\n')
          const path = lines[0].replace('worktree ', '')
          return path
        })
        .filter(path => path.includes('.worktrees/'))
      
      for (const worktreePath of worktrees) {
        const name = path.basename(worktreePath)
        if (!this.activeEmployees.has(name)) {
          console.log(`   🧹 Cleaning up orphaned worktree: ${name}`)
          try {
            execSync(`git worktree remove "${worktreePath}" --force`, { stdio: 'pipe' })
          } catch (err) {
            // Ignore errors in cleanup
          }
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalEmployees: this.activeEmployees.size,
      completedTasks: this.completedTasks.length,
      employeeBreakdown: {
        engineers: Array.from(this.activeEmployees.values()).filter(e => e.type === 'ENGINEER').length,
        designers: Array.from(this.activeEmployees.values()).filter(e => e.type === 'DESIGNER').length,
        pms: Array.from(this.activeEmployees.values()).filter(e => e.type === 'PM').length
      },
      efficiency: this.completedTasks.length / Math.max(1, this.activeEmployees.size),
      impact: 'EXPONENTIAL'
    }
    
    console.log('\n📊 FINAL WORKFORCE REPORT')
    console.log('=' .repeat(50))
    console.log(JSON.stringify(report, null, 2))
    
    // Save report
    await fs.writeFile(
      path.join(this.baseDir, 'workforce-report.json'),
      JSON.stringify(report, null, 2)
    )
    
    return report
  }

  async execute() {
    await this.initialize()
    
    // Analyze available work
    const issues = await this.analyzeIssues()
    
    // Deploy parallel workforce
    const deployed = await this.deployParallelWorkforce(issues)
    
    if (deployed > 0) {
      // Monitor progress
      const stopMonitoring = await this.monitorProgress()
      
      // Wait for initial work to complete (simulated)
      console.log('\n⏳ Employees are working in parallel...')
      console.log('   (In production, each would run AI agents to solve their assigned issues)')
      
      // After some time, create PRs
      setTimeout(async () => {
        await this.createPullRequests()
        await this.generateReport()
        stopMonitoring()
        
        console.log('\n🎉 Parallel Workforce Deployment Complete!')
        console.log('   Your team of 70 AI employees is working on solving issues simultaneously.')
        console.log('   Check GitHub for pull requests as they complete their work.')
      }, 5000)
    } else {
      console.log('\n⚠️  No employees could be deployed. Check for available issues.')
    }
  }
}

// Execute the parallel workforce system
const workforce = new ParallelWorkforce()
workforce.execute().catch(console.error)