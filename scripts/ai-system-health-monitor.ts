#!/usr/bin/env tsx

/**
 * AI System Health Monitor
 * Monitors and heals all AI systems with telemetry and auto-recovery
 */

import * as fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

interface SystemHealth {
  system: string
  status: 'healthy' | 'degraded' | 'failed'
  lastCheck: Date
  metrics: {
    uptime: number
    errorRate: number
    responseTime: number
    memoryUsage: number
    cpuUsage: number
  }
  errors: string[]
  recoveryAttempts: number
}

interface TelemetryData {
  timestamp: Date
  systems: SystemHealth[]
  overallHealth: 'healthy' | 'degraded' | 'critical'
  alerts: string[]
  recommendations: string[]
}

class AISystemHealthMonitor {
  private systems: Map<string, SystemHealth> = new Map()
  private telemetryHistory: TelemetryData[] = []
  private isMonitoring: boolean = false
  private checkInterval: number = 30000 // 30 seconds
  private maxRecoveryAttempts: number = 3
  
  constructor() {
    this.initializeSystems()
  }
  
  private initializeSystems() {
    const systemNames = [
      'ai-quality-monitor',
      'self-learning-optimizer',
      'ai-deployment-manager'
    ]
    
    systemNames.forEach(name => {
      this.systems.set(name, {
        system: name,
        status: 'healthy',
        lastCheck: new Date(),
        metrics: {
          uptime: 0,
          errorRate: 0,
          responseTime: 0,
          memoryUsage: 0,
          cpuUsage: 0
        },
        errors: [],
        recoveryAttempts: 0
      })
    })
  }
  
  async startMonitoring() {
    console.log('🏥 Starting AI System Health Monitor...')
    this.isMonitoring = true
    
    while (this.isMonitoring) {
      await this.performHealthCheck()
      await this.analyzeTelemetry()
      await this.performSelfHealing()
      await this.saveTelemetry()
      
      await new Promise(resolve => setTimeout(resolve, this.checkInterval))
    }
  }
  
  private async performHealthCheck() {
    for (const [name, health] of this.systems) {
      try {
        // Check if process is running
        const isRunning = await this.checkProcessRunning(name)
        
        // Check system-specific health
        const metrics = await this.getSystemMetrics(name)
        
        // Update health status
        health.metrics = metrics
        health.lastCheck = new Date()
        health.status = this.determineHealthStatus(metrics, isRunning)
        
        // Clear errors if healthy
        if (health.status === 'healthy') {
          health.errors = []
          health.recoveryAttempts = 0
        }
        
      } catch (error) {
        health.status = 'failed'
        health.errors.push(error.toString())
        console.error(`❌ Health check failed for ${name}:`, error)
      }
    }
  }
  
  private async checkProcessRunning(systemName: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`pgrep -f "${systemName}"`)
      return stdout.trim().length > 0
    } catch {
      return false
    }
  }
  
  private async getSystemMetrics(systemName: string): Promise<SystemHealth['metrics']> {
    try {
      // Get process metrics
      const { stdout: psOutput } = await execAsync(
        `ps aux | grep "${systemName}" | grep -v grep | awk '{print $3","$4}'`
      )
      
      const [cpu = '0', memory = '0'] = psOutput.trim().split(',')
      
      // Get response time (simulated for now)
      const responseTime = await this.measureResponseTime(systemName)
      
      // Get error rate from logs
      const errorRate = await this.calculateErrorRate(systemName)
      
      // Calculate uptime
      const uptime = await this.calculateUptime(systemName)
      
      return {
        uptime,
        errorRate,
        responseTime,
        memoryUsage: parseFloat(memory),
        cpuUsage: parseFloat(cpu)
      }
    } catch {
      return {
        uptime: 0,
        errorRate: 100,
        responseTime: 9999,
        memoryUsage: 0,
        cpuUsage: 0
      }
    }
  }
  
  private async measureResponseTime(systemName: string): Promise<number> {
    // Measure how quickly the system responds to a health check
    const start = Date.now()
    
    try {
      if (systemName === 'ai-quality-monitor') {
        await fs.access('quality-report.json')
      } else if (systemName === 'self-learning-optimizer') {
        await fs.access('optimization-report.json')
      } else if (systemName === 'ai-deployment-manager') {
        await fs.access('deployment-history.json')
      }
      
      return Date.now() - start
    } catch {
      return 9999
    }
  }
  
  private async calculateErrorRate(systemName: string): Promise<number> {
    try {
      // Check logs for errors in the last hour
      const logFile = `${systemName}.log`
      
      try {
        const logs = await fs.readFile(logFile, 'utf-8')
        const lines = logs.split('\n')
        const recentLines = lines.slice(-1000) // Last 1000 lines
        
        const errorCount = recentLines.filter(line => 
          line.includes('ERROR') || line.includes('FAIL')
        ).length
        
        return (errorCount / recentLines.length) * 100
      } catch {
        return 0 // No log file means no errors recorded
      }
    } catch {
      return 0
    }
  }
  
  private async calculateUptime(systemName: string): Promise<number> {
    try {
      const { stdout } = await execAsync(
        `ps -eo pid,etime,cmd | grep "${systemName}" | grep -v grep | awk '{print $2}'`
      )
      
      // Parse elapsed time format (DD-HH:MM:SS or HH:MM:SS or MM:SS)
      const time = stdout.trim()
      if (!time) return 0
      
      const parts = time.split(/[-:]/)
      let seconds = 0
      
      if (parts.length === 4) {
        // DD-HH:MM:SS
        seconds = parseInt(parts[0]) * 86400 + parseInt(parts[1]) * 3600 + 
                 parseInt(parts[2]) * 60 + parseInt(parts[3])
      } else if (parts.length === 3) {
        // HH:MM:SS
        seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
      } else if (parts.length === 2) {
        // MM:SS
        seconds = parseInt(parts[0]) * 60 + parseInt(parts[1])
      }
      
      return seconds
    } catch {
      return 0
    }
  }
  
  private determineHealthStatus(
    metrics: SystemHealth['metrics'],
    isRunning: boolean
  ): SystemHealth['status'] {
    if (!isRunning) return 'failed'
    
    // Determine health based on metrics
    if (metrics.errorRate > 10) return 'failed'
    if (metrics.responseTime > 5000) return 'failed'
    if (metrics.cpuUsage > 90) return 'failed'
    if (metrics.memoryUsage > 90) return 'failed'
    
    if (metrics.errorRate > 5) return 'degraded'
    if (metrics.responseTime > 1000) return 'degraded'
    if (metrics.cpuUsage > 70) return 'degraded'
    if (metrics.memoryUsage > 70) return 'degraded'
    
    return 'healthy'
  }
  
  private async analyzeTelemetry() {
    const systems = Array.from(this.systems.values())
    
    // Determine overall health
    const failedCount = systems.filter(s => s.status === 'failed').length
    const degradedCount = systems.filter(s => s.status === 'degraded').length
    
    let overallHealth: TelemetryData['overallHealth'] = 'healthy'
    if (failedCount > 0) overallHealth = 'critical'
    else if (degradedCount > 0) overallHealth = 'degraded'
    
    // Generate alerts
    const alerts: string[] = []
    
    systems.forEach(system => {
      if (system.status === 'failed') {
        alerts.push(`🚨 ${system.system} is DOWN`)
      } else if (system.status === 'degraded') {
        alerts.push(`⚠️ ${system.system} is experiencing issues`)
      }
      
      if (system.metrics.errorRate > 5) {
        alerts.push(`📊 High error rate (${system.metrics.errorRate.toFixed(1)}%) in ${system.system}`)
      }
    })
    
    // Generate recommendations
    const recommendations: string[] = []
    
    if (failedCount > 0) {
      recommendations.push('Immediate attention required - systems are failing')
    }
    
    const highMemorySystems = systems.filter(s => s.metrics.memoryUsage > 60)
    if (highMemorySystems.length > 0) {
      recommendations.push('Consider optimizing memory usage or increasing resources')
    }
    
    const slowSystems = systems.filter(s => s.metrics.responseTime > 500)
    if (slowSystems.length > 0) {
      recommendations.push('Performance optimization needed for slow systems')
    }
    
    // Store telemetry
    this.telemetryHistory.push({
      timestamp: new Date(),
      systems: systems,
      overallHealth,
      alerts,
      recommendations
    })
    
    // Keep only last 24 hours of telemetry
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    this.telemetryHistory = this.telemetryHistory.filter(
      t => t.timestamp > oneDayAgo
    )
    
    // Log status
    if (alerts.length > 0) {
      console.log('\n🚨 Alerts:')
      alerts.forEach(alert => console.log(`  ${alert}`))
    }
    
    if (recommendations.length > 0) {
      console.log('\n💡 Recommendations:')
      recommendations.forEach(rec => console.log(`  ${rec}`))
    }
  }
  
  private async performSelfHealing() {
    for (const [name, health] of this.systems) {
      if (health.status === 'failed' && health.recoveryAttempts < this.maxRecoveryAttempts) {
        console.log(`🔧 Attempting to heal ${name}...`)
        
        try {
          await this.healSystem(name)
          health.recoveryAttempts++
          
          // Wait a bit for system to start
          await new Promise(resolve => setTimeout(resolve, 5000))
          
          // Re-check health
          const isRunning = await this.checkProcessRunning(name)
          if (isRunning) {
            console.log(`✅ Successfully healed ${name}`)
            health.status = 'healthy'
            health.errors = []
            health.recoveryAttempts = 0
          } else {
            console.log(`❌ Failed to heal ${name} (attempt ${health.recoveryAttempts}/${this.maxRecoveryAttempts})`)
          }
        } catch (error) {
          console.error(`❌ Error healing ${name}:`, error)
          health.errors.push(`Healing failed: ${error}`)
        }
      }
    }
  }
  
  private async healSystem(systemName: string) {
    // Stop the system first
    try {
      await execAsync(`pkill -f "${systemName}"`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch {
      // Process might not be running
    }
    
    // Clear any corrupted state
    try {
      if (systemName === 'ai-quality-monitor') {
        await fs.unlink('quality-report.json').catch(() => {})
      } else if (systemName === 'self-learning-optimizer') {
        await fs.unlink('optimization-report.json').catch(() => {})
      }
    } catch {
      // Files might not exist
    }
    
    // Restart the system
    if (systemName === 'ai-quality-monitor') {
      execAsync('node scripts/ai-quality-monitor.js &').catch(() => {})
    } else if (systemName === 'self-learning-optimizer') {
      execAsync('python3 scripts/self-learning-optimizer.py --continuous &').catch(() => {})
    } else if (systemName === 'ai-deployment-manager') {
      execAsync('npx tsx scripts/ai-deployment-manager.ts --continuous &').catch(() => {})
    }
  }
  
  private async saveTelemetry() {
    try {
      const telemetryFile = 'ai-system-telemetry.json'
      
      // Create summary
      const summary = {
        timestamp: new Date().toISOString(),
        overallHealth: this.telemetryHistory[this.telemetryHistory.length - 1]?.overallHealth || 'unknown',
        systems: Array.from(this.systems.values()).map(s => ({
          name: s.system,
          status: s.status,
          uptime: s.metrics.uptime,
          errorRate: s.metrics.errorRate,
          lastCheck: s.lastCheck
        })),
        recentAlerts: this.telemetryHistory.slice(-10).flatMap(t => t.alerts),
        statistics: this.calculateStatistics()
      }
      
      await fs.writeFile(telemetryFile, JSON.stringify(summary, null, 2))
    } catch (error) {
      console.error('Failed to save telemetry:', error)
    }
  }
  
  private calculateStatistics() {
    const last24Hours = this.telemetryHistory
    
    if (last24Hours.length === 0) {
      return {
        averageUptime: 0,
        totalErrors: 0,
        healingAttempts: 0,
        systemAvailability: {}
      }
    }
    
    // Calculate average uptime
    const uptimes = last24Hours.flatMap(t => 
      t.systems.map(s => s.metrics.uptime)
    )
    const averageUptime = uptimes.reduce((a, b) => a + b, 0) / uptimes.length
    
    // Count total errors
    const totalErrors = last24Hours.reduce((acc, t) => 
      acc + t.systems.reduce((sum, s) => sum + s.errors.length, 0), 0
    )
    
    // Count healing attempts
    const healingAttempts = Array.from(this.systems.values()).reduce(
      (sum, s) => sum + s.recoveryAttempts, 0
    )
    
    // Calculate system availability
    const systemAvailability: Record<string, number> = {}
    
    this.systems.forEach((health, name) => {
      const healthyCount = last24Hours.filter(t => 
        t.systems.find(s => s.system === name && s.status === 'healthy')
      ).length
      
      systemAvailability[name] = (healthyCount / last24Hours.length) * 100
    })
    
    return {
      averageUptime,
      totalErrors,
      healingAttempts,
      systemAvailability
    }
  }
  
  async generateHealthReport(): Promise<string> {
    const stats = this.calculateStatistics()
    const systems = Array.from(this.systems.values())
    
    let report = '# AI System Health Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`
    
    report += '## Overall Status\n'
    const overallHealth = this.telemetryHistory[this.telemetryHistory.length - 1]?.overallHealth || 'unknown'
    report += `- **Overall Health**: ${overallHealth}\n`
    report += `- **Active Systems**: ${systems.filter(s => s.status !== 'failed').length}/${systems.length}\n`
    report += `- **Average Uptime**: ${(stats.averageUptime / 3600).toFixed(2)} hours\n\n`
    
    report += '## System Details\n'
    systems.forEach(system => {
      report += `\n### ${system.system}\n`
      report += `- Status: ${system.status}\n`
      report += `- Uptime: ${(system.metrics.uptime / 3600).toFixed(2)} hours\n`
      report += `- Error Rate: ${system.metrics.errorRate.toFixed(2)}%\n`
      report += `- Response Time: ${system.metrics.responseTime}ms\n`
      report += `- CPU Usage: ${system.metrics.cpuUsage.toFixed(2)}%\n`
      report += `- Memory Usage: ${system.metrics.memoryUsage.toFixed(2)}%\n`
      
      if (system.errors.length > 0) {
        report += `- Recent Errors:\n`
        system.errors.slice(-3).forEach(err => {
          report += `  - ${err}\n`
        })
      }
    })
    
    report += '\n## System Availability (Last 24 Hours)\n'
    Object.entries(stats.systemAvailability).forEach(([name, availability]) => {
      report += `- ${name}: ${availability.toFixed(2)}%\n`
    })
    
    report += '\n## Statistics\n'
    report += `- Total Errors: ${stats.totalErrors}\n`
    report += `- Healing Attempts: ${stats.healingAttempts}\n`
    
    await fs.writeFile('ai-health-report.md', report)
    return report
  }
  
  stop() {
    console.log('🛑 Stopping AI System Health Monitor...')
    this.isMonitoring = false
  }
}

// Main execution
async function main() {
  const monitor = new AISystemHealthMonitor()
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    monitor.stop()
    process.exit(0)
  })
  
  process.on('SIGTERM', () => {
    monitor.stop()
    process.exit(0)
  })
  
  // Start monitoring
  await monitor.startMonitoring()
}

if (require.main === module) {
  main().catch(console.error)
}

export { AISystemHealthMonitor }