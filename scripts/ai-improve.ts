#!/usr/bin/env node

import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const execAsync = promisify(exec);

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ImprovementTask {
  type: 'bug' | 'feature' | 'refactor' | 'test' | 'docs';
  priority: 'high' | 'medium' | 'low';
  description: string;
  files: string[];
}

class AutonomousImprover {
  private tasks: ImprovementTask[] = [];

  async analyze(): Promise<void> {
    console.log('🔍 Analyzing codebase...');
    
    // Get recent test failures
    const testResults = await this.getTestResults();
    
    // Get TypeScript errors
    const tsErrors = await this.getTypeScriptErrors();
    
    // Get ESLint issues
    const lintIssues = await this.getLintIssues();
    
    // Get code coverage gaps
    const coverageGaps = await this.getCoverageGaps();
    
    // Use AI to prioritize issues
    const analysis = await this.aiAnalyze({
      testResults,
      tsErrors,
      lintIssues,
      coverageGaps,
    });
    
    this.tasks = analysis.tasks;
  }

  async improve(): Promise<void> {
    console.log(`📋 Found ${this.tasks.length} improvement tasks`);
    
    // Work on top 3 high-priority tasks
    const highPriorityTasks = this.tasks
      .filter(t => t.priority === 'high')
      .slice(0, 3);
    
    for (const task of highPriorityTasks) {
      console.log(`🔧 Working on: ${task.description}`);
      await this.implementTask(task);
    }
  }

  private async getTestResults(): Promise<string> {
    try {
      const { stdout } = await execAsync('npm test -- --reporter=json');
      return stdout;
    } catch (error: any) {
      return error.stdout || '';
    }
  }

  private async getTypeScriptErrors(): Promise<string> {
    try {
      const { stdout } = await execAsync('npx tsc --noEmit --pretty false');
      return stdout;
    } catch (error: any) {
      return error.stdout || '';
    }
  }

  private async getLintIssues(): Promise<string> {
    try {
      const { stdout } = await execAsync('npm run lint -- --format json');
      return stdout;
    } catch (error: any) {
      return error.stdout || '';
    }
  }

  private async getCoverageGaps(): Promise<string> {
    try {
      const { stdout } = await execAsync('npm run test:coverage -- --reporter=json');
      return stdout;
    } catch (error: any) {
      return error.stdout || '';
    }
  }

  private async aiAnalyze(data: any): Promise<{ tasks: ImprovementTask[] }> {
    const prompt = `
    Analyze this codebase data and identify the most important improvements:
    
    Test Results: ${data.testResults.slice(0, 1000)}
    TypeScript Errors: ${data.tsErrors.slice(0, 1000)}
    Lint Issues: ${data.lintIssues.slice(0, 1000)}
    Coverage Gaps: ${data.coverageGaps.slice(0, 1000)}
    
    Return a JSON array of tasks with this structure:
    {
      "tasks": [
        {
          "type": "bug|feature|refactor|test|docs",
          "priority": "high|medium|low",
          "description": "Clear description",
          "files": ["file1.ts", "file2.tsx"]
        }
      ]
    }
    
    Focus on:
    1. Fixing failing tests
    2. Resolving TypeScript errors
    3. Adding missing tests for critical paths
    4. Improving code quality
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        return parsed;
      } catch {
        return { tasks: [] };
      }
    }
    
    return { tasks: [] };
  }

  private async implementTask(task: ImprovementTask): Promise<void> {
    for (const file of task.files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        const prompt = `
        Task: ${task.description}
        Type: ${task.type}
        File: ${file}
        
        Current content:
        ${content}
        
        Provide the improved version of this file. Return ONLY the complete file content, no explanations.
        `;

        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 8000,
          messages: [{ role: 'user', content: prompt }],
        });

        const improvedContent = response.content[0];
        if (improvedContent.type === 'text') {
          await fs.writeFile(file, improvedContent.text);
          console.log(`✅ Improved ${file}`);
        }
      } catch (error) {
        console.error(`❌ Failed to improve ${file}:`, error);
      }
    }
  }

  async run(mode: string): Promise<void> {
    if (mode === 'auto') {
      await this.analyze();
      await this.improve();
    } else {
      // Handle specific task mode
      console.log(`Running specific task: ${mode}`);
      this.tasks = [{
        type: 'feature',
        priority: 'high',
        description: mode,
        files: [], // Will be determined by AI
      }];
      await this.improve();
    }

    // Run tests and build to verify improvements
    console.log('🧪 Verifying improvements...');
    try {
      await execAsync('npm run build');
      await execAsync('npm test');
      console.log('✅ All checks passed!');
    } catch (error) {
      console.error('⚠️ Some checks failed, review changes');
    }
  }
}

// Main execution
async function main() {
  const mode = process.argv[2] || 'auto';
  const improver = new AutonomousImprover();
  await improver.run(mode);
}

main().catch(console.error);