#!/usr/bin/env node

/**
 * Generate Test Manifest for Claude Code
 * 
 * This script automatically discovers all routes, pages, and components
 * that need testing in a Next.js application. It generates a manifest
 * that Claude Code can use to understand the complete testing scope.
 */

const fs = require('fs');
const path = require('path');

class TestManifestGenerator {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.manifest = {
      generated: new Date().toISOString(),
      project: {
        name: path.basename(projectRoot),
        type: 'next-app',
        framework: 'Next.js',
        router: 'app-router'
      },
      routes: [],
      components: [],
      apiRoutes: [],
      serverActions: [],
      coverage: {
        tested: [],
        untested: [],
        priority: []
      },
      testingStrategy: {}
    };
  }

  // Helper function to walk directory recursively
  walkDir(dir, pattern, ignore = []) {
    const files = [];
    
    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const relativePath = path.relative(dir, fullPath);
        
        // Skip ignored patterns
        if (ignore.some(ig => relativePath.includes(ig))) continue;
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (pattern.test(item)) {
          files.push(relativePath);
        }
      }
    };
    
    if (fs.existsSync(dir)) {
      walk(dir);
    }
    
    return files;
  }

  // Discover all app routes
  discoverAppRoutes() {
    const appDir = path.join(this.projectRoot, 'app');
    if (!fs.existsSync(appDir)) return;

    const pageFiles = this.walkDir(appDir, /^page\.(js|jsx|ts|tsx)$/, ['node_modules']);

    this.manifest.routes = pageFiles.map(file => {
      const routePath = this.fileToRoute(file);
      const fullPath = path.join(appDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      return {
        path: routePath,
        file: `app/${file}`,
        dynamic: routePath.includes('['),
        parallel: routePath.includes('@'),
        intercepted: routePath.includes('(.)'),
        needsAuth: content.includes('auth') || content.includes('session'),
        hasServerComponents: !content.includes("'use client'"),
        priority: this.calculatePriority(routePath, content),
        testFile: this.getTestFile(fullPath),
        tested: false
      };
    });
  }

  // Convert file path to route path
  fileToRoute(filePath) {
    const dir = path.dirname(filePath);
    if (dir === '.') return '/';
    
    return '/' + dir
      .replace(/\(.*?\)/g, '') // Remove route groups
      .replace(/\\/g, '/');    // Windows path support
  }

  // Discover all components
  discoverComponents() {
    const componentDirs = [
      'components',
      'src/components',
      'app/components'
    ];

    const components = [];
    for (const dir of componentDirs) {
      const fullDir = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullDir)) continue;

      const files = this.walkDir(fullDir, /\.(jsx|tsx)$/, ['node_modules', '.test.', '.spec.']);

      files.forEach(file => {
        const fullPath = path.join(fullDir, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const componentName = this.extractComponentName(content, file);

        components.push({
          name: componentName,
          file: path.join(dir, file),
          type: this.getComponentType(content),
          isClientComponent: content.includes("'use client'"),
          hasProps: content.includes('Props') || content.includes('interface'),
          hasState: content.includes('useState') || content.includes('useReducer'),
          hasEffects: content.includes('useEffect'),
          testFile: this.getTestFile(fullPath),
          tested: false,
          priority: this.calculateComponentPriority(content, file)
        });
      });
    }

    this.manifest.components = components;
  }

  // Discover API routes
  discoverAPIRoutes() {
    const appDir = path.join(this.projectRoot, 'app');
    if (!fs.existsSync(appDir)) return;

    const routeFiles = this.walkDir(appDir, /^route\.(js|ts)$/, ['node_modules']);

    this.manifest.apiRoutes = routeFiles.map(file => {
      const fullPath = path.join(appDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const methods = this.extractHTTPMethods(content);
      
      return {
        path: this.fileToRoute(file).replace('/route', ''),
        file: `app/${file}`,
        methods,
        hasAuth: content.includes('auth') || content.includes('session'),
        hasValidation: content.includes('zod') || content.includes('validate'),
        testFile: this.getTestFile(fullPath),
        tested: false,
        priority: 'high' // API routes should always be tested
      };
    });
  }

  // Discover server actions
  discoverServerActions() {
    const actionsDir = path.join(this.projectRoot, 'server/actions');
    const actionFiles = fs.existsSync(actionsDir) 
      ? this.walkDir(actionsDir, /\.(js|ts)$/, ['node_modules'])
      : [];

    this.manifest.serverActions = actionFiles.map(file => {
      const fullPath = path.join(actionsDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const actions = this.extractServerActions(content);
      
      return {
        file,
        actions,
        hasValidation: content.includes('zod') || content.includes('validate'),
        hasDatabase: content.includes('supabase') || content.includes('prisma'),
        testFile: this.getTestFile(fullPath),
        tested: false,
        priority: 'high'
      };
    });
  }

  // Extract component name from content
  extractComponentName(content, filePath) {
    const match = content.match(/export\s+(?:default\s+)?function\s+(\w+)/);
    if (match) return match[1];
    
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
  }

  // Get component type
  getComponentType(content) {
    if (content.includes('use client')) return 'client';
    if (content.includes('async function')) return 'server';
    if (content.includes('forwardRef')) return 'ref';
    if (content.match(/function.*children/)) return 'layout';
    return 'pure';
  }

  // Extract HTTP methods from route file
  extractHTTPMethods(content) {
    const methods = [];
    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    httpMethods.forEach(method => {
      if (content.includes(`export async function ${method}`)) {
        methods.push(method);
      }
    });
    
    return methods;
  }

  // Extract server actions from file
  extractServerActions(content) {
    const actions = [];
    const matches = content.matchAll(/'use server'[\s\S]*?export\s+async\s+function\s+(\w+)/g);
    
    for (const match of matches) {
      actions.push(match[1]);
    }
    
    return actions;
  }

  // Calculate route priority
  calculatePriority(routePath, content) {
    if (routePath === '/') return 'critical';
    if (routePath.includes('auth') || routePath.includes('signin')) return 'critical';
    if (routePath.includes('dashboard')) return 'high';
    if (routePath.includes('admin')) return 'high';
    if (content.includes('payment') || content.includes('stripe')) return 'critical';
    if (content.includes('form') || content.includes('submit')) return 'high';
    return 'medium';
  }

  // Calculate component priority
  calculateComponentPriority(content, file) {
    if (file.includes('form') || file.includes('auth')) return 'high';
    if (content.includes('payment') || content.includes('stripe')) return 'critical';
    if (content.includes('useState') && content.includes('useEffect')) return 'high';
    if (file.includes('ui/')) return 'low';
    return 'medium';
  }

  // Check if test file exists
  getTestFile(filePath) {
    const dir = path.dirname(filePath);
    const base = path.basename(filePath, path.extname(filePath));
    const testPatterns = [
      `${base}.test.ts`,
      `${base}.test.tsx`,
      `${base}.spec.ts`,
      `${base}.spec.tsx`,
      `__tests__/${base}.test.ts`,
      `__tests__/${base}.test.tsx`
    ];

    for (const pattern of testPatterns) {
      const testPath = path.join(dir, pattern);
      if (fs.existsSync(testPath)) {
        return path.relative(this.projectRoot, testPath);
      }
    }

    return null;
  }

  // Analyze test coverage
  analyzeTestCoverage() {
    const allItems = [
      ...this.manifest.routes,
      ...this.manifest.components,
      ...this.manifest.apiRoutes,
      ...this.manifest.serverActions
    ];

    allItems.forEach(item => {
      item.tested = !!item.testFile;
      
      if (item.tested) {
        this.manifest.coverage.tested.push(item.file);
      } else {
        this.manifest.coverage.untested.push(item.file);
        
        if (item.priority === 'critical' || item.priority === 'high') {
          this.manifest.coverage.priority.push({
            file: item.file,
            type: item.path ? 'route' : item.name ? 'component' : 'action',
            priority: item.priority,
            reason: this.getPriorityReason(item)
          });
        }
      }
    });

    // Calculate coverage percentage
    const total = allItems.length;
    const tested = this.manifest.coverage.tested.length;
    this.manifest.coverage.percentage = total > 0 ? (tested / total * 100).toFixed(2) : 0;
  }

  // Get priority reason
  getPriorityReason(item) {
    if (item.path === '/') return 'Homepage - critical user entry point';
    if (item.hasAuth || item.needsAuth) return 'Authentication required - security critical';
    if (item.path?.includes('payment')) return 'Payment flow - business critical';
    if (item.methods?.includes('POST')) return 'API mutation - data integrity';
    if (item.hasDatabase) return 'Database operations - data critical';
    return 'High user impact area';
  }

  // Generate testing strategy
  generateTestingStrategy() {
    this.manifest.testingStrategy = {
      unit: {
        scope: 'Individual components and functions',
        tools: ['Vitest', 'Jest'],
        priority: ['Pure functions', 'Utility functions', 'Custom hooks']
      },
      integration: {
        scope: 'Component interactions and API routes',
        tools: ['React Testing Library', 'MSW'],
        priority: ['Form submissions', 'API endpoints', 'Data flows']
      },
      e2e: {
        scope: 'User journeys and critical paths',
        tools: ['Playwright', 'Cypress'],
        priority: this.manifest.coverage.priority.map(p => p.file).slice(0, 10)
      },
      accessibility: {
        scope: 'WCAG compliance and keyboard navigation',
        tools: ['axe-core', 'Playwright accessibility'],
        priority: ['Forms', 'Navigation', 'Interactive components']
      }
    };
  }

  // Generate the complete manifest
  async generate() {
    console.log('🔍 Discovering routes...');
    this.discoverAppRoutes();
    
    console.log('🔍 Discovering components...');
    this.discoverComponents();
    
    console.log('🔍 Discovering API routes...');
    this.discoverAPIRoutes();
    
    console.log('🔍 Discovering server actions...');
    this.discoverServerActions();
    
    console.log('📊 Analyzing test coverage...');
    this.analyzeTestCoverage();
    
    console.log('📝 Generating testing strategy...');
    this.generateTestingStrategy();
    
    // Save manifest
    const outputPath = path.join(this.projectRoot, 'test-manifest.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.manifest, null, 2));
    
    // Generate markdown report
    const report = this.generateMarkdownReport();
    const reportPath = path.join(this.projectRoot, 'TEST_COVERAGE.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`✅ Test manifest generated: ${outputPath}`);
    console.log(`📄 Coverage report generated: ${reportPath}`);
    
    return this.manifest;
  }

  // Generate markdown report
  generateMarkdownReport() {
    const { manifest } = this;
    
    return `# Test Coverage Report

Generated: ${manifest.generated}

## Coverage Summary
- **Total Coverage**: ${manifest.coverage.percentage}%
- **Tested**: ${manifest.coverage.tested.length} files
- **Untested**: ${manifest.coverage.untested.length} files

## Priority Testing Targets

${manifest.coverage.priority.map(item => 
  `- **${item.file}** (${item.priority})\n  - Reason: ${item.reason}`
).join('\n')}

## Routes (${manifest.routes.length} total)

| Path | File | Priority | Tested |
|------|------|----------|--------|
${manifest.routes.map(r => 
  `| ${r.path} | ${r.file} | ${r.priority} | ${r.tested ? '✅' : '❌'} |`
).join('\n')}

## Components (${manifest.components.length} total)

| Name | File | Type | Priority | Tested |
|------|------|------|----------|--------|
${manifest.components.slice(0, 20).map(c => 
  `| ${c.name} | ${c.file} | ${c.type} | ${c.priority} | ${c.tested ? '✅' : '❌'} |`
).join('\n')}

## API Routes (${manifest.apiRoutes.length} total)

| Path | Methods | Auth | Tested |
|------|---------|------|--------|
${manifest.apiRoutes.map(r => 
  `| ${r.path} | ${r.methods.join(', ')} | ${r.hasAuth ? 'Yes' : 'No'} | ${r.tested ? '✅' : '❌'} |`
).join('\n')}

## Testing Strategy

### E2E Testing Priority
${manifest.testingStrategy.e2e.priority.map((file, i) => 
  `${i + 1}. ${file}`
).join('\n')}

### Recommended Next Steps
1. Focus on critical and high-priority untested files
2. Implement E2E tests for user authentication flows
3. Add integration tests for API routes
4. Ensure accessibility testing for all forms

## Commands

\`\`\`bash
# Run this script to update the manifest
node scripts/generate-test-manifest.js

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Check coverage
npm run test:coverage
\`\`\`
`;
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new TestManifestGenerator();
  generator.generate().catch(console.error);
}

module.exports = TestManifestGenerator;