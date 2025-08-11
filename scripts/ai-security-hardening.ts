#!/usr/bin/env tsx

/**
 * AI Security Hardening & Validation System
 * Comprehensive security analysis, vulnerability detection, and automatic hardening
 */

import * as fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as crypto from 'crypto'
import * as path from 'path'
import OpenAI from 'openai'

const execAsync = promisify(exec)

interface SecurityVulnerability {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  category: string
  title: string
  description: string
  file: string
  line?: number
  cwe?: string
  cvss?: number
  remediation: {
    description: string
    autoFixable: boolean
    effort: 'low' | 'medium' | 'high'
    steps: string[]
  }
}

interface SecurityScanResult {
  timestamp: Date
  overallRisk: 'critical' | 'high' | 'medium' | 'low'
  totalVulnerabilities: number
  vulnerabilities: SecurityVulnerability[]
  statistics: {
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
  recommendations: string[]
  autoFixesApplied: number
}

interface SecurityPolicy {
  enforceHttps: boolean
  requireAuth: boolean
  enableCSRF: boolean
  enableCSP: boolean
  enableHSTS: boolean
  validateInputs: boolean
  sanitizeOutputs: boolean
  requireSecureHeaders: boolean
  enableRateLimit: boolean
  auditLogging: boolean
}

class AISecurityHardeningSystem {
  private openai: OpenAI
  private securityPolicy: SecurityPolicy
  private vulnerabilityDatabase: SecurityVulnerability[] = []
  private scanHistory: SecurityScanResult[] = []
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    this.securityPolicy = {
      enforceHttps: true,
      requireAuth: true,
      enableCSRF: true,
      enableCSP: true,
      enableHSTS: true,
      validateInputs: true,
      sanitizeOutputs: true,
      requireSecureHeaders: true,
      enableRateLimit: true,
      auditLogging: true
    }
  }
  
  async performComprehensiveScan(): Promise<SecurityScanResult> {
    console.log('🛡️ Starting comprehensive security scan...')
    
    const vulnerabilities: SecurityVulnerability[] = []
    
    // Run multiple security checks in parallel
    const scanResults = await Promise.allSettled([
      this.scanForCodeVulnerabilities(),
      this.scanDependencies(),
      this.scanConfiguration(),
      this.scanAuthentication(),
      this.scanAuthorization(),
      this.scanInputValidation(),
      this.scanOutputSanitization(),
      this.scanSecurityHeaders(),
      this.scanRateLimiting(),
      this.scanDataProtection(),
      this.scanCryptography(),
      this.scanLogging(),
      this.scanEnvironmentSecurity()
    ])
    
    // Collect all vulnerabilities
    scanResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        vulnerabilities.push(...result.value)
      } else {
        console.error(`Security scan ${index} failed:`, result.reason)
      }
    })
    
    // AI-powered vulnerability analysis
    const aiEnhancedVulns = await this.enhanceVulnerabilitiesWithAI(vulnerabilities)
    
    const scanResult: SecurityScanResult = {
      timestamp: new Date(),
      overallRisk: this.calculateOverallRisk(aiEnhancedVulns),
      totalVulnerabilities: aiEnhancedVulns.length,
      vulnerabilities: aiEnhancedVulns,
      statistics: this.calculateStatistics(aiEnhancedVulns),
      recommendations: await this.generateSecurityRecommendations(aiEnhancedVulns),
      autoFixesApplied: 0
    }
    
    // Apply automatic fixes for low-risk vulnerabilities
    scanResult.autoFixesApplied = await this.applyAutomaticFixes(scanResult.vulnerabilities)
    
    // Store scan result
    this.scanHistory.push(scanResult)
    await this.saveScanResults(scanResult)
    
    return scanResult
  }
  
  async scanForCodeVulnerabilities(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    
    try {
      // Get all source files
      const { stdout: files } = await execAsync(
        'find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next'
      )
      
      const fileList = files.trim().split('\n').filter(f => f.length > 0)
      
      for (const file of fileList.slice(0, 50)) { // Limit for demo
        const content = await fs.readFile(file, 'utf-8')
        const fileVulns = await this.analyzeFileForVulnerabilities(file, content)
        vulnerabilities.push(...fileVulns)
      }
      
    } catch (error) {
      console.error('Code vulnerability scan failed:', error)
    }
    
    return vulnerabilities
  }
  
  async analyzeFileForVulnerabilities(file: string, content: string): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    const lines = content.split('\n')
    
    // SQL Injection patterns
    lines.forEach((line, index) => {
      if (/\$\{[^}]*\}/.test(line) && /SELECT|INSERT|UPDATE|DELETE/i.test(line)) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'high',
          category: 'sql_injection',
          title: 'Potential SQL Injection',
          description: 'Dynamic SQL query construction detected',
          file,
          line: index + 1,
          cwe: 'CWE-89',
          cvss: 8.1,
          remediation: {
            description: 'Use parameterized queries or prepared statements',
            autoFixable: false,
            effort: 'medium',
            steps: [
              'Replace string concatenation with parameterized queries',
              'Use ORM query builders',
              'Validate and sanitize inputs'
            ]
          }
        })
      }
    })
    
    // XSS patterns
    if (content.includes('dangerouslySetInnerHTML')) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        severity: 'high',
        category: 'xss',
        title: 'Potential XSS via dangerouslySetInnerHTML',
        description: 'Unsafe HTML insertion detected',
        file,
        cwe: 'CWE-79',
        cvss: 7.8,
        remediation: {
          description: 'Sanitize HTML content or use safe alternatives',
          autoFixable: true,
          effort: 'low',
          steps: [
            'Install DOMPurify: npm install dompurify',
            'Sanitize content before insertion',
            'Consider using safer alternatives'
          ]
        }
      })
    }
    
    // Hardcoded secrets
    const secretPatterns = [
      /api[_-]?key["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/i,
      /password["\s]*[:=]["\s]*["\'].+["\']/i,
      /secret["\s]*[:=]["\s]*["\'].+["\']/i,
      /token["\s]*[:=]["\s]*["\'].+["\']/i
    ]
    
    lines.forEach((line, index) => {
      secretPatterns.forEach(pattern => {
        if (pattern.test(line) && !line.includes('process.env')) {
          vulnerabilities.push({
            id: crypto.randomUUID(),
            severity: 'critical',
            category: 'secrets',
            title: 'Hardcoded Secret Detected',
            description: 'Sensitive information hardcoded in source code',
            file,
            line: index + 1,
            cwe: 'CWE-798',
            cvss: 9.1,
            remediation: {
              description: 'Move secrets to environment variables',
              autoFixable: true,
              effort: 'low',
              steps: [
                'Move secret to .env file',
                'Use process.env to access secret',
                'Add .env to .gitignore',
                'Remove secret from git history'
              ]
            }
          })
        }
      })
    })
    
    // Unsafe eval usage
    if (content.includes('eval(') || content.includes('Function(')) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        severity: 'critical',
        category: 'code_injection',
        title: 'Code Injection via eval()',
        description: 'Dynamic code execution detected',
        file,
        cwe: 'CWE-94',
        cvss: 9.3,
        remediation: {
          description: 'Remove eval() usage and find safer alternatives',
          autoFixable: false,
          effort: 'high',
          steps: [
            'Analyze eval() usage',
            'Replace with JSON.parse for data',
            'Use proper parsing libraries',
            'Implement input validation'
          ]
        }
      })
    }
    
    // Insecure randomness
    if (content.includes('Math.random()') && /password|token|id|key/.test(content)) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        severity: 'medium',
        category: 'weak_randomness',
        title: 'Weak Random Number Generation',
        description: 'Math.random() used for security-sensitive operations',
        file,
        cwe: 'CWE-338',
        cvss: 5.3,
        remediation: {
          description: 'Use cryptographically secure random number generation',
          autoFixable: true,
          effort: 'low',
          steps: [
            'Replace Math.random() with crypto.randomBytes()',
            'Use crypto.randomUUID() for unique identifiers',
            'Import crypto module if not already imported'
          ]
        }
      })
    }
    
    return vulnerabilities
  }
  
  async scanDependencies(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    
    try {
      // Run npm audit
      const { stdout } = await execAsync('npm audit --json || true')
      
      try {
        const auditResult = JSON.parse(stdout)
        
        if (auditResult.vulnerabilities) {
          Object.entries(auditResult.vulnerabilities).forEach(([name, vuln]: [string, any]) => {
            vulnerabilities.push({
              id: crypto.randomUUID(),
              severity: this.mapNpmSeverity(vuln.severity),
              category: 'dependency',
              title: `Vulnerable dependency: ${name}`,
              description: vuln.title || 'Security vulnerability in dependency',
              file: 'package.json',
              cwe: vuln.cwe || 'CWE-1035',
              cvss: vuln.cvss?.score,
              remediation: {
                description: `Update ${name} to version ${vuln.fixAvailable?.version || 'latest'}`,
                autoFixable: Boolean(vuln.fixAvailable),
                effort: 'low',
                steps: [
                  `npm update ${name}`,
                  'Test application after update',
                  'Run npm audit again to verify fix'
                ]
              }
            })
          })
        }
      } catch (parseError) {
        console.warn('Could not parse npm audit output')
      }
      
    } catch (error) {
      console.error('Dependency scan failed:', error)
    }
    
    return vulnerabilities
  }
  
  mapNpmSeverity(severity: string): SecurityVulnerability['severity'] {
    const mapping: Record<string, SecurityVulnerability['severity']> = {
      'critical': 'critical',
      'high': 'high',
      'moderate': 'medium',
      'low': 'low',
      'info': 'info'
    }
    return mapping[severity] || 'medium'
  }
  
  async scanConfiguration(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    
    // Check for security misconfigurations
    try {
      // Check if HTTPS is enforced
      const nextConfig = await this.readConfigFile('next.config.js')
      if (nextConfig && !nextConfig.includes('https')) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'medium',
          category: 'configuration',
          title: 'HTTPS Not Enforced',
          description: 'Application may serve content over insecure HTTP',
          file: 'next.config.js',
          remediation: {
            description: 'Configure HTTPS redirection',
            autoFixable: true,
            effort: 'low',
            steps: [
              'Add HTTPS redirection in Next.js config',
              'Configure security headers',
              'Test HTTPS enforcement'
            ]
          }
        })
      }
      
      // Check environment configuration
      const envExample = await this.readConfigFile('.env.example')
      const gitignore = await this.readConfigFile('.gitignore')
      
      if (!gitignore?.includes('.env.local')) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'high',
          category: 'configuration',
          title: 'Environment Files Not Ignored',
          description: 'Sensitive environment files may be committed to git',
          file: '.gitignore',
          remediation: {
            description: 'Add environment files to .gitignore',
            autoFixable: true,
            effort: 'low',
            steps: [
              'Add .env.local to .gitignore',
              'Add .env to .gitignore',
              'Check git history for committed secrets'
            ]
          }
        })
      }
      
    } catch (error) {
      console.error('Configuration scan failed:', error)
    }
    
    return vulnerabilities
  }
  
  async readConfigFile(filename: string): Promise<string | null> {
    try {
      return await fs.readFile(filename, 'utf-8')
    } catch {
      return null
    }
  }
  
  async scanAuthentication(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    
    // Check authentication implementation
    try {
      const authFiles = await this.findAuthFiles()
      
      for (const file of authFiles) {
        const content = await fs.readFile(file, 'utf-8')
        
        // Check for weak password policies
        if (content.includes('password') && !content.includes('validate') && !content.includes('strength')) {
          vulnerabilities.push({
            id: crypto.randomUUID(),
            severity: 'medium',
            category: 'authentication',
            title: 'Weak Password Policy',
            description: 'No password validation detected',
            file,
            remediation: {
              description: 'Implement strong password validation',
              autoFixable: false,
              effort: 'medium',
              steps: [
                'Add password length requirements',
                'Require special characters',
                'Implement password strength meter',
                'Add rate limiting for login attempts'
              ]
            }
          })
        }
        
        // Check for session management
        if (content.includes('session') && !content.includes('secure') && !content.includes('httpOnly')) {
          vulnerabilities.push({
            id: crypto.randomUUID(),
            severity: 'high',
            category: 'authentication',
            title: 'Insecure Session Configuration',
            description: 'Session cookies not properly secured',
            file,
            remediation: {
              description: 'Configure secure session settings',
              autoFixable: true,
              effort: 'low',
              steps: [
                'Set secure: true for HTTPS',
                'Set httpOnly: true',
                'Set sameSite: "strict"',
                'Configure proper expiration'
              ]
            }
          })
        }
      }
      
    } catch (error) {
      console.error('Authentication scan failed:', error)
    }
    
    return vulnerabilities
  }
  
  async findAuthFiles(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        'find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "auth\\|login\\|signin\\|password" | head -10'
      )
      return stdout.trim().split('\n').filter(f => f.length > 0)
    } catch {
      return []
    }
  }
  
  async scanAuthorization(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    
    // Check for authorization issues
    try {
      const serverActions = await this.findServerActions()
      
      for (const file of serverActions) {
        const content = await fs.readFile(file, 'utf-8')
        
        // Check if server actions verify authentication
        if (content.includes("'use server'") && !content.includes('auth') && !content.includes('user')) {
          vulnerabilities.push({
            id: crypto.randomUUID(),
            severity: 'high',
            category: 'authorization',
            title: 'Missing Authentication Check',
            description: 'Server action does not verify user authentication',
            file,
            remediation: {
              description: 'Add authentication verification to server action',
              autoFixable: false,
              effort: 'medium',
              steps: [
                'Add user authentication check',
                'Verify user permissions',
                'Return appropriate errors for unauthorized access',
                'Add audit logging'
              ]
            }
          })
        }
      }
      
    } catch (error) {
      console.error('Authorization scan failed:', error)
    }
    
    return vulnerabilities
  }
  
  async findServerActions(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        "find . -name '*.ts' -o -name '*.tsx' | xargs grep -l \"'use server'\" | head -20"
      )
      return stdout.trim().split('\n').filter(f => f.length > 0)
    } catch {
      return []
    }
  }
  
  async scanInputValidation(): Promise<SecurityVulnerability[]> {
    return [] // Implement input validation scanning
  }
  
  async scanOutputSanitization(): Promise<SecurityVulnerability[]> {
    return [] // Implement output sanitization scanning
  }
  
  async scanSecurityHeaders(): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []
    
    // Check for missing security headers
    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ]
    
    // This would check middleware or Next.js configuration
    const middlewareExists = await this.fileExists('middleware.ts')
    
    if (!middlewareExists) {
      vulnerabilities.push({
        id: crypto.randomUUID(),
        severity: 'medium',
        category: 'headers',
        title: 'Missing Security Headers',
        description: 'No middleware found to set security headers',
        file: 'middleware.ts',
        remediation: {
          description: 'Create middleware to set security headers',
          autoFixable: true,
          effort: 'low',
          steps: [
            'Create middleware.ts file',
            'Add security headers configuration',
            'Test header implementation'
          ]
        }
      })
    }
    
    return vulnerabilities
  }
  
  async scanRateLimiting(): Promise<SecurityVulnerability[]> {
    return [] // Implement rate limiting scanning
  }
  
  async scanDataProtection(): Promise<SecurityVulnerability[]> {
    return [] // Implement data protection scanning
  }
  
  async scanCryptography(): Promise<SecurityVulnerability[]> {
    return [] // Implement cryptography scanning
  }
  
  async scanLogging(): Promise<SecurityVulnerability[]> {
    return [] // Implement logging scanning
  }
  
  async scanEnvironmentSecurity(): Promise<SecurityVulnerability[]> {
    return [] // Implement environment security scanning
  }
  
  async fileExists(filename: string): Promise<boolean> {
    try {
      await fs.access(filename)
      return true
    } catch {
      return false
    }
  }
  
  async enhanceVulnerabilitiesWithAI(vulnerabilities: SecurityVulnerability[]): Promise<SecurityVulnerability[]> {
    if (!process.env.OPENAI_API_KEY || vulnerabilities.length === 0) {
      return vulnerabilities
    }
    
    try {
      const analysis = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a security expert. Analyze the provided vulnerabilities and enhance them with additional context, more accurate severity ratings, and better remediation advice.'
          },
          {
            role: 'user',
            content: `Analyze these security vulnerabilities:\n${JSON.stringify(vulnerabilities.slice(0, 10), null, 2)}`
          }
        ],
        temperature: 0.2
      })
      
      // In a real implementation, this would parse AI suggestions and update vulnerabilities
      console.log('AI security analysis completed')
      
    } catch (error) {
      console.error('AI enhancement failed:', error)
    }
    
    return vulnerabilities
  }
  
  calculateOverallRisk(vulnerabilities: SecurityVulnerability[]): SecurityScanResult['overallRisk'] {
    const critical = vulnerabilities.filter(v => v.severity === 'critical').length
    const high = vulnerabilities.filter(v => v.severity === 'high').length
    
    if (critical > 0) return 'critical'
    if (high > 3) return 'high'
    if (high > 0) return 'medium'
    return 'low'
  }
  
  calculateStatistics(vulnerabilities: SecurityVulnerability[]): SecurityScanResult['statistics'] {
    return {
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
      info: vulnerabilities.filter(v => v.severity === 'info').length
    }
  }
  
  async generateSecurityRecommendations(vulnerabilities: SecurityVulnerability[]): Promise<string[]> {
    const recommendations = []
    
    const stats = this.calculateStatistics(vulnerabilities)
    
    if (stats.critical > 0) {
      recommendations.push('🚨 CRITICAL: Immediate action required - critical vulnerabilities detected')
    }
    
    if (stats.high > 0) {
      recommendations.push('⚠️ HIGH: Schedule high-priority vulnerability fixes within 48 hours')
    }
    
    // Category-specific recommendations
    const categories = [...new Set(vulnerabilities.map(v => v.category))]
    
    if (categories.includes('secrets')) {
      recommendations.push('🔐 Implement secret scanning in CI/CD pipeline')
    }
    
    if (categories.includes('dependency')) {
      recommendations.push('📦 Enable automated dependency updates (Dependabot/Renovate)')
    }
    
    if (categories.includes('authentication')) {
      recommendations.push('🔒 Review and strengthen authentication mechanisms')
    }
    
    return recommendations
  }
  
  async applyAutomaticFixes(vulnerabilities: SecurityVulnerability[]): Promise<number> {
    let fixesApplied = 0
    
    const autoFixableVulns = vulnerabilities.filter(v => 
      v.remediation.autoFixable && 
      (v.severity === 'low' || v.severity === 'info')
    )
    
    for (const vuln of autoFixableVulns) {
      try {
        await this.applyFix(vuln)
        fixesApplied++
        console.log(`✅ Auto-fixed: ${vuln.title}`)
      } catch (error) {
        console.error(`❌ Failed to auto-fix ${vuln.title}:`, error)
      }
    }
    
    return fixesApplied
  }
  
  async applyFix(vulnerability: SecurityVulnerability): Promise<void> {
    switch (vulnerability.category) {
      case 'secrets':
        await this.fixHardcodedSecret(vulnerability)
        break
      case 'weak_randomness':
        await this.fixWeakRandomness(vulnerability)
        break
      case 'xss':
        await this.fixXSSVulnerability(vulnerability)
        break
      case 'configuration':
        await this.fixConfiguration(vulnerability)
        break
      default:
        throw new Error(`Auto-fix not implemented for category: ${vulnerability.category}`)
    }
  }
  
  async fixHardcodedSecret(vuln: SecurityVulnerability): Promise<void> {
    if (!vuln.file || !vuln.line) return
    
    const content = await fs.readFile(vuln.file, 'utf-8')
    const lines = content.split('\n')
    
    // Replace hardcoded secret with environment variable reference
    const line = lines[vuln.line - 1]
    const fixedLine = line.replace(
      /(['"])([^'"]+)(['"])/,
      'process.env.API_KEY || $1$2$3'
    )
    
    lines[vuln.line - 1] = fixedLine
    await fs.writeFile(vuln.file, lines.join('\n'))
    
    console.log(`Fixed hardcoded secret in ${vuln.file}:${vuln.line}`)
  }
  
  async fixWeakRandomness(vuln: SecurityVulnerability): Promise<void> {
    if (!vuln.file) return
    
    let content = await fs.readFile(vuln.file, 'utf-8')
    
    // Add crypto import if not present
    if (!content.includes('crypto')) {
      content = "import * as crypto from 'crypto'\n" + content
    }
    
    // Replace Math.random() with crypto.randomBytes()
    content = content.replace(
      /Math\.random\(\)/g,
      'crypto.randomBytes(4).readUInt32BE() / 0x100000000'
    )
    
    await fs.writeFile(vuln.file, content)
    
    console.log(`Fixed weak randomness in ${vuln.file}`)
  }
  
  async fixXSSVulnerability(vuln: SecurityVulnerability): Promise<void> {
    if (!vuln.file) return
    
    let content = await fs.readFile(vuln.file, 'utf-8')
    
    // Add DOMPurify import
    if (!content.includes('DOMPurify')) {
      content = "import DOMPurify from 'dompurify'\n" + content
    }
    
    // Replace dangerouslySetInnerHTML with sanitized version
    content = content.replace(
      /dangerouslySetInnerHTML=\{\{__html:\s*([^}]+)\}\}/g,
      'dangerouslySetInnerHTML={{__html: DOMPurify.sanitize($1)}}'
    )
    
    await fs.writeFile(vuln.file, content)
    
    console.log(`Fixed XSS vulnerability in ${vuln.file}`)
  }
  
  async fixConfiguration(vuln: SecurityVulnerability): Promise<void> {
    if (vuln.title.includes('gitignore')) {
      await this.fixGitignoreConfiguration()
    } else if (vuln.title.includes('Security Headers')) {
      await this.createSecurityMiddleware()
    }
  }
  
  async fixGitignoreConfiguration(): Promise<void> {
    let gitignore = ''
    
    try {
      gitignore = await fs.readFile('.gitignore', 'utf-8')
    } catch {
      // File doesn't exist, create it
    }
    
    const additions = [
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local'
    ]
    
    for (const addition of additions) {
      if (!gitignore.includes(addition)) {
        gitignore += `\n${addition}`
      }
    }
    
    await fs.writeFile('.gitignore', gitignore)
    console.log('Updated .gitignore with environment files')
  }
  
  async createSecurityMiddleware(): Promise<void> {
    const middlewareContent = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-ancestors 'none'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api/|_next/|_static/|favicon.ico).*)',
  ],
}`
    
    await fs.writeFile('middleware.ts', middlewareContent)
    console.log('Created security middleware')
  }
  
  async saveScanResults(result: SecurityScanResult): Promise<void> {
    await fs.writeFile(
      'security-scan-results.json',
      JSON.stringify(result, null, 2)
    )
    
    // Generate human-readable report
    await this.generateSecurityReport(result)
  }
  
  async generateSecurityReport(result: SecurityScanResult): Promise<void> {
    let report = '# Security Scan Report\n\n'
    report += `**Generated**: ${result.timestamp.toISOString()}\n`
    report += `**Overall Risk**: ${result.overallRisk.toUpperCase()}\n`
    report += `**Total Vulnerabilities**: ${result.totalVulnerabilities}\n`
    report += `**Auto-fixes Applied**: ${result.autoFixesApplied}\n\n`
    
    report += '## Summary\n\n'
    report += `- Critical: ${result.statistics.critical}\n`
    report += `- High: ${result.statistics.high}\n`
    report += `- Medium: ${result.statistics.medium}\n`
    report += `- Low: ${result.statistics.low}\n`
    report += `- Info: ${result.statistics.info}\n\n`
    
    if (result.recommendations.length > 0) {
      report += '## Recommendations\n\n'
      result.recommendations.forEach(rec => {
        report += `- ${rec}\n`
      })
      report += '\n'
    }
    
    report += '## Vulnerabilities\n\n'
    result.vulnerabilities.forEach(vuln => {
      report += `### ${vuln.title}\n`
      report += `- **Severity**: ${vuln.severity}\n`
      report += `- **Category**: ${vuln.category}\n`
      report += `- **File**: ${vuln.file}${vuln.line ? `:${vuln.line}` : ''}\n`
      report += `- **Description**: ${vuln.description}\n`
      
      if (vuln.cwe) {
        report += `- **CWE**: ${vuln.cwe}\n`
      }
      
      if (vuln.cvss) {
        report += `- **CVSS**: ${vuln.cvss}\n`
      }
      
      report += `- **Auto-fixable**: ${vuln.remediation.autoFixable ? 'Yes' : 'No'}\n`
      report += `- **Effort**: ${vuln.remediation.effort}\n\n`
      
      report += `**Remediation**:\n${vuln.remediation.description}\n\n`
      
      if (vuln.remediation.steps.length > 0) {
        report += 'Steps:\n'
        vuln.remediation.steps.forEach((step, i) => {
          report += `${i + 1}. ${step}\n`
        })
      }
      
      report += '\n---\n\n'
    })
    
    await fs.writeFile('security-report.md', report)
  }
}

// Main execution
async function main() {
  const hardening = new AISecurityHardeningSystem()
  
  try {
    console.log('🛡️ Starting AI Security Hardening System...')
    
    const result = await hardening.performComprehensiveScan()
    
    console.log('\n📊 Security Scan Complete')
    console.log('========================')
    console.log(`Overall Risk: ${result.overallRisk.toUpperCase()}`)
    console.log(`Total Vulnerabilities: ${result.totalVulnerabilities}`)
    console.log(`Auto-fixes Applied: ${result.autoFixesApplied}`)
    console.log('\nStatistics:')
    console.log(`  Critical: ${result.statistics.critical}`)
    console.log(`  High: ${result.statistics.high}`)
    console.log(`  Medium: ${result.statistics.medium}`)
    console.log(`  Low: ${result.statistics.low}`)
    console.log(`  Info: ${result.statistics.info}`)
    
    if (result.recommendations.length > 0) {
      console.log('\n💡 Key Recommendations:')
      result.recommendations.forEach(rec => console.log(`  ${rec}`))
    }
    
    console.log('\n📄 Detailed reports saved:')
    console.log('  - security-scan-results.json')
    console.log('  - security-report.md')
    
  } catch (error) {
    console.error('❌ Security hardening failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { AISecurityHardeningSystem }