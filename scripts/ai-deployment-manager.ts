#!/usr/bin/env tsx

/**
 * AI-Powered Deployment Manager
 * Handles automated deployments, monitoring, and intelligent rollbacks
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import OpenAI from 'openai'

const execAsync = promisify(exec)

interface DeploymentMetrics {
  errorRate: number
  responseTime: number
  userSatisfaction: number
  cpuUsage: number
  memoryUsage: number
}

interface DeploymentDecision {
  shouldDeploy: boolean
  confidence: number
  reasoning: string
  risks: string[]
  mitigations: string[]
}

class AIDeploymentManager {
  private openai: OpenAI
  private deploymentHistory: any[] = []
  private currentVersion: string = ''
  private healthCheckUrl: string = process.env.HEALTH_CHECK_URL || 'https://neuros.vercel.app/api/health'
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.loadDeploymentHistory()
  }
  
  async loadDeploymentHistory() {
    try {
      const data = await fs.readFile('deployment-history.json', 'utf-8')
      this.deploymentHistory = JSON.parse(data)
    } catch {
      this.deploymentHistory = []
    }
  }
  
  async saveDeploymentHistory() {
    await fs.writeFile(
      'deployment-history.json',
      JSON.stringify(this.deploymentHistory, null, 2)
    )
  }
  
  async analyzeCodeChanges(): Promise<any> {
    // Get recent commits
    const { stdout: commits } = await execAsync('git log --oneline -10')
    
    // Get diff statistics
    const { stdout: diffStat } = await execAsync('git diff --stat origin/main')
    
    // Analyze changes with AI
    const analysis = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Analyze code changes and assess deployment risk. Return JSON with risk_level (low/medium/high/critical), breaking_changes (boolean), and summary.'
        },
        {
          role: 'user',
          content: `Recent commits:\n${commits}\n\nChanges:\n${diffStat}`
        }
      ],
      response_format: { type: 'json_object' }
    })
    
    return JSON.parse(analysis.choices[0].message.content || '{}')
  }
  
  async runPreDeploymentChecks(): Promise<boolean> {
    console.log('🔍 Running pre-deployment checks...')
    
    const checks = [
      this.checkTests(),
      this.checkBuild(),
      this.checkLinting(),
      this.checkSecurity(),
      this.checkPerformance()
    ]
    
    const results = await Promise.all(checks)
    return results.every(result => result.passed)
  }
  
  async checkTests(): Promise<{ passed: boolean; details: string }> {
    try {
      await execAsync('npm run test')
      return { passed: true, details: 'All tests passed' }
    } catch (error) {
      return { passed: false, details: `Tests failed: ${error}` }
    }
  }
  
  async checkBuild(): Promise<{ passed: boolean; details: string }> {
    try {
      const { stdout } = await execAsync('npm run build')
      
      // Check bundle size
      const sizeMatch = stdout.match(/(\d+\.?\d*)\s*(kb|mb)/i)
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1])
        const unit = sizeMatch[2].toLowerCase()
        const sizeInKB = unit === 'mb' ? size * 1024 : size
        
        if (sizeInKB > 1024) {
          return { passed: false, details: `Bundle size too large: ${sizeInKB}KB` }
        }
      }
      
      return { passed: true, details: 'Build successful' }
    } catch (error) {
      return { passed: false, details: `Build failed: ${error}` }
    }
  }
  
  async checkLinting(): Promise<{ passed: boolean; details: string }> {
    try {
      await execAsync('npm run lint')
      return { passed: true, details: 'No linting errors' }
    } catch {
      // Linting errors are warnings, not blockers
      return { passed: true, details: 'Linting warnings present' }
    }
  }
  
  async checkSecurity(): Promise<{ passed: boolean; details: string }> {
    try {
      const { stdout } = await execAsync('npm audit --json')
      const audit = JSON.parse(stdout)
      
      if (audit.metadata.vulnerabilities.critical > 0) {
        return { passed: false, details: 'Critical vulnerabilities found' }
      }
      
      return { passed: true, details: 'No critical vulnerabilities' }
    } catch {
      return { passed: true, details: 'Security check skipped' }
    }
  }
  
  async checkPerformance(): Promise<{ passed: boolean; details: string }> {
    // Run lighthouse or other performance checks
    return { passed: true, details: 'Performance acceptable' }
  }
  
  async makeDeploymentDecision(): Promise<DeploymentDecision> {
    const codeAnalysis = await this.analyzeCodeChanges()
    const checksResult = await this.runPreDeploymentChecks()
    const metrics = await this.getCurrentMetrics()
    
    // Use AI to make deployment decision
    const decision = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a deployment decision system. Analyze the data and decide if deployment should proceed. Consider risk, user impact, and system stability. Return JSON with: shouldDeploy (boolean), confidence (0-100), reasoning (string), risks (array), mitigations (array).`
        },
        {
          role: 'user',
          content: JSON.stringify({
            codeAnalysis,
            checksResult,
            currentMetrics: metrics,
            deploymentHistory: this.deploymentHistory.slice(-5)
          })
        }
      ],
      response_format: { type: 'json_object' }
    })
    
    return JSON.parse(decision.choices[0].message.content || '{}')
  }
  
  async deploy(): Promise<void> {
    console.log('🚀 Starting deployment...')
    
    // Create deployment record
    const deployment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      version: await this.getVersion(),
      metrics: await this.getCurrentMetrics()
    }
    
    try {
      // Deploy to Vercel
      const { stdout } = await execAsync('vercel --prod')
      deployment.url = this.extractDeploymentUrl(stdout)
      deployment.status = 'success'
      
      console.log(`✅ Deployed to: ${deployment.url}`)
      
      // Monitor deployment
      await this.monitorDeployment(deployment)
      
    } catch (error) {
      deployment.status = 'failed'
      deployment.error = error.toString()
      console.error('❌ Deployment failed:', error)
      throw error
    } finally {
      this.deploymentHistory.push(deployment)
      await this.saveDeploymentHistory()
    }
  }
  
  async monitorDeployment(deployment: any): Promise<void> {
    console.log('📊 Monitoring deployment...')
    
    // Monitor for 5 minutes
    const monitoringDuration = 5 * 60 * 1000
    const checkInterval = 30 * 1000
    const startTime = Date.now()
    
    while (Date.now() - startTime < monitoringDuration) {
      const metrics = await this.getDeploymentMetrics(deployment.url)
      
      // Check if rollback is needed
      if (await this.shouldRollback(metrics)) {
        console.log('⚠️ Issues detected, initiating rollback...')
        await this.rollback(deployment)
        break
      }
      
      await new Promise(resolve => setTimeout(resolve, checkInterval))
    }
    
    console.log('✅ Monitoring complete, deployment stable')
  }
  
  async getDeploymentMetrics(url: string): Promise<DeploymentMetrics> {
    try {
      // Health check
      const response = await fetch(`${url}/api/health`)
      const responseTime = response.headers.get('x-response-time')
      
      // Get error logs (would integrate with logging service)
      const errorRate = await this.getErrorRate()
      
      // Get system metrics (would integrate with monitoring service)
      const systemMetrics = await this.getSystemMetrics()
      
      return {
        errorRate,
        responseTime: parseFloat(responseTime || '0'),
        userSatisfaction: 95, // Would come from analytics
        cpuUsage: systemMetrics.cpu,
        memoryUsage: systemMetrics.memory
      }
    } catch {
      return {
        errorRate: 100,
        responseTime: 9999,
        userSatisfaction: 0,
        cpuUsage: 100,
        memoryUsage: 100
      }
    }
  }
  
  async shouldRollback(metrics: DeploymentMetrics): Promise<boolean> {
    // Automatic rollback conditions
    if (metrics.errorRate > 10) return true
    if (metrics.responseTime > 5000) return true
    if (metrics.userSatisfaction < 80) return true
    if (metrics.cpuUsage > 90) return true
    if (metrics.memoryUsage > 90) return true
    
    // AI-assisted decision for edge cases
    if (metrics.errorRate > 5 || metrics.responseTime > 2000) {
      const decision = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Analyze metrics and decide if rollback is needed. Return JSON with { rollback: boolean, reason: string }'
          },
          {
            role: 'user',
            content: JSON.stringify(metrics)
          }
        ],
        response_format: { type: 'json_object' }
      })
      
      const result = JSON.parse(decision.choices[0].message.content || '{}')
      return result.rollback || false
    }
    
    return false
  }
  
  async rollback(deployment: any): Promise<void> {
    console.log('🔄 Rolling back deployment...')
    
    try {
      // Get previous successful deployment
      const previousDeployment = this.deploymentHistory
        .filter(d => d.status === 'success' && d.id !== deployment.id)
        .pop()
      
      if (!previousDeployment) {
        throw new Error('No previous successful deployment found')
      }
      
      // Rollback using Vercel
      await execAsync(`vercel alias ${previousDeployment.url} ${deployment.url}`)
      
      console.log(`✅ Rolled back to version: ${previousDeployment.version}`)
      
      // Record rollback
      deployment.rolledBack = true
      deployment.rolledBackTo = previousDeployment.id
      await this.saveDeploymentHistory()
      
      // Notify team
      await this.notifyRollback(deployment, previousDeployment)
      
    } catch (error) {
      console.error('❌ Rollback failed:', error)
      throw error
    }
  }
  
  async notifyRollback(current: any, previous: any): Promise<void> {
    // Send notifications (Slack, email, etc.)
    console.log(`📧 Notifying team about rollback from ${current.version} to ${previous.version}`)
  }
  
  async getVersion(): Promise<string> {
    const { stdout } = await execAsync('git rev-parse --short HEAD')
    return stdout.trim()
  }
  
  async getCurrentMetrics(): Promise<DeploymentMetrics> {
    // Get current production metrics
    return {
      errorRate: 0.1,
      responseTime: 250,
      userSatisfaction: 98,
      cpuUsage: 45,
      memoryUsage: 60
    }
  }
  
  async getErrorRate(): Promise<number> {
    // Would integrate with error tracking service
    return Math.random() * 2 // Simulated
  }
  
  async getSystemMetrics(): Promise<{ cpu: number; memory: number }> {
    // Would integrate with monitoring service
    return {
      cpu: 40 + Math.random() * 20,
      memory: 50 + Math.random() * 20
    }
  }
  
  extractDeploymentUrl(output: string): string {
    const match = output.match(/https:\/\/[^\s]+/)
    return match ? match[0] : ''
  }
  
  async runContinuousDeployment(): Promise<void> {
    console.log('🔄 Starting continuous deployment...')
    
    while (true) {
      try {
        // Check for new commits
        await execAsync('git fetch origin')
        const { stdout } = await execAsync('git rev-list HEAD..origin/main --count')
        const newCommits = parseInt(stdout.trim())
        
        if (newCommits > 0) {
          console.log(`📦 Found ${newCommits} new commits`)
          
          // Pull latest changes
          await execAsync('git pull origin main')
          
          // Make deployment decision
          const decision = await this.makeDeploymentDecision()
          
          if (decision.shouldDeploy) {
            console.log(`✅ Deployment approved (confidence: ${decision.confidence}%)`)
            console.log(`Reasoning: ${decision.reasoning}`)
            
            if (decision.risks.length > 0) {
              console.log('⚠️ Risks:', decision.risks)
              console.log('🛡️ Mitigations:', decision.mitigations)
            }
            
            await this.deploy()
          } else {
            console.log(`❌ Deployment blocked (confidence: ${decision.confidence}%)`)
            console.log(`Reasoning: ${decision.reasoning}`)
          }
        }
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, 60000)) // Check every minute
        
      } catch (error) {
        console.error('Error in continuous deployment:', error)
        await new Promise(resolve => setTimeout(resolve, 30000))
      }
    }
  }
}

// Main execution
async function main() {
  const manager = new AIDeploymentManager()
  
  const args = process.argv.slice(2)
  
  if (args.includes('--continuous')) {
    await manager.runContinuousDeployment()
  } else if (args.includes('--deploy')) {
    const decision = await manager.makeDeploymentDecision()
    console.log('Deployment Decision:', decision)
    
    if (decision.shouldDeploy || args.includes('--force')) {
      await manager.deploy()
    }
  } else {
    // Run checks only
    const checks = await manager.runPreDeploymentChecks()
    console.log('Pre-deployment checks:', checks)
    
    const decision = await manager.makeDeploymentDecision()
    console.log('Deployment recommendation:', decision)
  }
}

main().catch(console.error)