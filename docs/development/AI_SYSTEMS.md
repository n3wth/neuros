# Neuros AI Self-Improving Company

## Quick Start

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="your-key-here"

# Start all AI systems
./start-ai-company.sh
```

## What It Does

This system makes your codebase self-improving through three simple components:

### 1. Quality Monitor (`ai-quality-monitor.js`)
- Scans code every hour
- Finds complexity, missing tests, performance issues
- Auto-fixes simple problems
- Creates actionable reports

### 2. Performance Optimizer (`self-learning-optimizer.py`)
- Learns from user behavior
- Identifies slow components
- Applies optimizations automatically
- Tracks improvements over time

### 3. Deployment Manager (`ai-deployment-manager.ts`)
- Decides when to deploy
- Monitors production health
- Auto-rollbacks if issues detected
- Learns from deployment history

## KISS Principle

Each component:
- Does ONE thing well
- Works independently
- Communicates through simple JSON files
- Fails gracefully

## File Outputs

- `quality-report.json` - Code quality metrics
- `optimization-report.json` - Performance improvements
- `deployment-history.json` - Deployment tracking
- `quality-insights.md` - AI recommendations

## Manual Commands

```bash
# Run quality check once
node scripts/ai-quality-monitor.js

# Apply fixes
node scripts/ai-quality-monitor.js --fix

# Run optimizer once
python3 scripts/self-learning-optimizer.py

# Check deployment readiness
npx tsx scripts/ai-deployment-manager.ts
```

## GitHub Actions Integration

The system includes `.github/workflows/ai-powered-ci.yml` which:
- Runs on every push/PR
- Generates AI insights
- Creates optimization PRs
- Makes deployment decisions

## Architecture

```
User Code → AI Analysis → Improvements → Auto-Apply → Monitor → Learn → Repeat
```

Simple. Effective. Self-improving.