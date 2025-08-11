# Parallel Development Setup

This guide explains how to run multiple instances of the Neuros project in parallel for concurrent development.

## Git Worktrees Setup

Git worktrees allow multiple working directories from the same repository. Your current worktrees:

```bash
# Main repository
/Users/oliver/gh/neuros (main development)

# Feature worktrees
/Users/oliver/gh/neuros-worktrees/feature-1
/Users/oliver/gh/neuros-worktrees/feature-2

# Issue-specific worktrees
/Users/oliver/gh/neuros-worktrees/issue-*
```

## Quick Start

### 1. Navigate to a worktree
```bash
cd /Users/oliver/gh/neuros-worktrees/feature-1
```

### 2. Run development server on different port
```bash
# From main repo (port 3001)
./scripts/parallel-dev.sh 1

# From worktree feature-1 (port 3002)
cd ../neuros-worktrees/feature-1
cp ../../neuros/scripts/parallel-dev.sh ./scripts/
./scripts/parallel-dev.sh 2

# From worktree feature-2 (port 3003)  
cd ../neuros-worktrees/feature-2
cp ../../neuros/scripts/parallel-dev.sh ./scripts/
./scripts/parallel-dev.sh 3
```

## Manual Setup (Alternative)

### Run instances on different ports manually:
```bash
# Terminal 1 - Main repo (port 3000)
cd /Users/oliver/gh/neuros
npm run dev

# Terminal 2 - Worktree 1 (port 3001)
cd /Users/oliver/gh/neuros-worktrees/feature-1
PORT=3001 npm run dev

# Terminal 3 - Worktree 2 (port 3002)
cd /Users/oliver/gh/neuros-worktrees/feature-2
PORT=3002 npm run dev
```

## Managing Worktrees

### Create new worktree
```bash
git worktree add ../neuros-worktrees/new-feature -b feature/new-feature
```

### List all worktrees
```bash
git worktree list
```

### Remove worktree
```bash
git worktree remove ../neuros-worktrees/feature-name
```

### Prune stale worktrees
```bash
git worktree prune
```

## Working with Supabase

Each instance can connect to the same local Supabase instance (port 54321) or different ones:

### Single Supabase instance (recommended)
All worktrees use the same `.env.local` pointing to `http://127.0.0.1:54321`

### Multiple Supabase instances (advanced)
```bash
# Instance 1
cd /Users/oliver/gh/neuros
npx supabase start

# Instance 2 (different project)
cd /Users/oliver/gh/neuros-worktrees/feature-1
npx supabase start --port 54331
# Update .env.local: NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
```

## Workflow Best Practices

1. **Main branch**: Keep clean, only merge completed features
2. **Feature branches**: Use worktrees for parallel feature development
3. **Issue branches**: One worktree per GitHub issue
4. **Testing**: Run tests in each worktree before merging

## Syncing Changes

### Pull latest changes to all worktrees
```bash
# From main repo
git fetch --all
git worktree list | while read -r path _; do
  echo "Updating $path"
  git -C "$path" pull origin main
done
```

### Push changes from worktree
```bash
cd /Users/oliver/gh/neuros-worktrees/feature-1
git add .
git commit -m "feat: new feature"
git push origin feature/parallel-work-1
```

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Worktree locked
```bash
git worktree unlock <path>
```

### Clean up all worktrees
```bash
git worktree prune
git worktree list
```

## VS Code Integration

Open multiple VS Code windows for parallel development:
```bash
# Open main repo
code /Users/oliver/gh/neuros

# Open worktrees in new windows
code /Users/oliver/gh/neuros-worktrees/feature-1
code /Users/oliver/gh/neuros-worktrees/feature-2
```

## Benefits

- Work on multiple features simultaneously
- Test different approaches without switching branches
- Review PRs while continuing development
- Run multiple dev servers for testing interactions
- Keep main branch stable while experimenting