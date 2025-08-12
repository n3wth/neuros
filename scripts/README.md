# Scripts Directory

This directory contains all automation, deployment, and utility scripts for the Neuros project.

## Directory Structure

### `/automation`
AI-powered automation and workflow scripts
- `ai-conductor.js` - AI task orchestration
- `ai-conductor-enhanced.js` - Enhanced AI orchestration with agents
- `ai-improve.ts` - Code improvement automation
- `ai-quality-monitor.js` - Quality monitoring system
- `self-learning-optimizer.py` - Self-learning optimization
- `start-ai-*.sh` - AI system startup scripts

### `/deployment`
Deployment and infrastructure scripts
- `deploy-autonomous.sh` - Autonomous deployment
- `deploy-to-docker-server.sh` - Docker deployment
- `deploy-workforce.sh` - Multi-instance deployment
- `ai-deployment-manager.ts` - AI-powered deployment management

### `/development`
Development environment and workflow scripts
- `dev-manager.sh` - Development environment manager
- `multi-dev.sh` - Multiple development instances
- `parallel-dev.sh` - Parallel development setup
- `persistent-dev.sh` - Persistent development server
- `proxy-80.js` - Port 80 proxy for local development

### `/setup`
Initial setup and configuration scripts
- `setup-continuous.sh` - Continuous deployment setup
- `setup-local-domain.sh` - Local domain configuration
- `setup-port-80.sh` - Port 80 setup for local dev
- `add-hosts-entry.sh` - Add local domain to hosts file
- `start-neuros-local.sh` - Start local Neuros instance

### `/testing`
Testing utilities and helpers
- `test-auth.js` - Authentication testing
- `test-neuros-local.sh` - Local environment testing
- `run-tests.sh` - Test runner
- `test-rate-limiting.ts` - Rate limiting tests
- `playwright-helper.js` - Playwright test utilities
- `browser-helper.sh` - Browser testing helpers
- `browser-test-helper.js` - Browser automation helpers

### Root Scripts (kept for npm scripts)
- `generate-test-manifest.js` - Generate test coverage manifest
- `fetch-company-logos.ts` - Fetch company logos for UI
- `refactor-to-features.sh` - Feature-based refactoring

## Usage

Most scripts can be run directly:
```bash
./scripts/setup/start-neuros-local.sh
./scripts/testing/run-tests.sh
```

Some are called via npm scripts in package.json:
```bash
npm run test:manifest  # Runs generate-test-manifest.js
```

## Important Notes

- Always check script permissions before running (`chmod +x script.sh`)
- Development scripts assume local environment setup
- Deployment scripts require appropriate credentials
- Testing scripts may modify local state