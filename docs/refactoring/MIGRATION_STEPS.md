# Migration Steps for 2025 AI-Optimized Refactoring

## Overview
This guide provides step-by-step instructions to migrate the Neuros codebase to the 2025 AI-optimized architecture.

## Phase 1: Preparation (Day 1)

### 1.1 Create a Git Branch
```bash
git checkout -b refactor/ai-optimization-2025
```

### 1.2 Backup Current State
```bash
git add .
git commit -m "chore: checkpoint before 2025 refactoring"
```

### 1.3 Install Required Dependencies
```bash
npm install zod @sentry/nextjs webpack-bundle-analyzer --save-dev
```

## Phase 2: Documentation & Error Handling (Day 2)

### 2.1 Implement Error Handling System
- [x] Created `lib/errors/app-errors.ts` with typed error classes
- [x] Created `lib/errors/error-handler.ts` with centralized handling
- [ ] Update all Server Actions to use new error handling

### 2.2 Update Documentation
- [x] Enhanced `CLAUDE.md` with AI-optimized patterns
- [x] Created `REFACTORING_GUIDE_2025.md` with best practices
- [ ] Add JSDoc comments to all exported functions

## Phase 3: Feature Modularization (Days 3-5)

### 3.1 Create Feature Structure
```bash
# Run the refactoring script
chmod +x scripts/refactor-to-features.sh
./scripts/refactor-to-features.sh
```

### 3.2 Migrate Auth Feature
```bash
# Move auth components
mv components/features/auth/*.tsx features/auth/components/
mv server/actions/auth.ts features/auth/actions/auth.actions.ts

# Update imports
find app -name "*.tsx" -exec sed -i '' 's|@/components/features/auth|@/features/auth/components|g' {} \;
```

### 3.3 Migrate Cards Feature
```bash
# Move card components
mkdir -p features/cards/components
mv components/learning/learning-card.tsx features/cards/components/Card.tsx
mv components/learning/create-card-dialog.tsx features/cards/components/CreateCardDialog.tsx

# Move server actions
mv server/actions/cards.ts features/cards/actions/cards.actions.ts
```

### 3.4 Migrate Dashboard Feature
```bash
# Move dashboard components
mkdir -p features/dashboard/components
mv components/learning/dashboard/*.tsx features/dashboard/components/
mv components/learning/neuros-dashboard.tsx features/dashboard/components/Dashboard.tsx

# Create dashboard actions
cp server/actions/cards-refactored.ts features/dashboard/actions/dashboard.actions.ts
```

## Phase 4: Testing Infrastructure (Days 6-7)

### 4.1 Set Up Test Factories
- [x] Created `lib/test/factories.ts` with test data generators
- [ ] Create feature-specific test factories

### 4.2 Migrate Tests to BDD Style
```typescript
// Example migration for existing tests
// Before:
test('should create card', async () => {
  const card = await createCard(data)
  expect(card).toBeDefined()
})

// After:
describe('Card Management', () => {
  describe('Given a user with a deck', () => {
    describe('When creating a new card', () => {
      it('Then should add card to deck', async () => {
        // Arrange
        const testData = makeTestProfile()
        
        // Act
        const result = await createCard(input)
        
        // Assert
        expect(result.success).toBe(true)
      })
    })
  })
})
```

### 4.3 Create E2E Test Scenarios
```bash
# Create feature-specific E2E tests
touch features/auth/tests/auth.e2e.spec.ts
touch features/cards/tests/cards.e2e.spec.ts
touch features/dashboard/tests/dashboard.e2e.spec.ts
```

## Phase 5: Performance Optimization (Days 8-9)

### 5.1 Update Next.js Configuration
```bash
# Backup current config
cp next.config.ts next.config.backup.ts

# Apply optimized config
cp next.config.optimized.ts next.config.ts
```

### 5.2 Implement Dynamic Imports
```typescript
// Update heavy components to use dynamic imports
// Before:
import { KnowledgeGraph } from '@/components/visualizations/knowledge-graph'

// After:
const KnowledgeGraph = dynamic(
  () => import('@/components/visualizations/knowledge-graph'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-96" />
  }
)
```

### 5.3 Optimize Bundle Size
```bash
# Analyze current bundle
npm run analyze

# Remove unused dependencies
npm prune

# Update imports to use tree-shakeable versions
# Replace: import _ from 'lodash'
# With: import debounce from 'lodash/debounce'
```

## Phase 6: Server Components Optimization (Days 10-11)

### 6.1 Refactor Server Actions
- [x] Created example refactored Server Action in `server/actions/cards-refactored.ts`
- [ ] Apply pattern to all Server Actions
- [ ] Add Zod validation to all inputs
- [ ] Implement rate limiting consistently

### 6.2 Co-locate Data Fetching
```typescript
// Move data fetching into Server Components
// app/(dashboard)/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/signin')
  
  // Fetch data directly in component
  const [stats, cards, reviews] = await Promise.all([
    getDashboardStats(user.id),
    getRecentCards(user.id),
    getUpcomingReviews(user.id)
  ])
  
  return (
    <DashboardClient 
      initialStats={stats}
      initialCards={cards}
      initialReviews={reviews}
    />
  )
}
```

## Phase 7: AI Integration Enhancement (Days 12-13)

### 7.1 Add Comprehensive JSDoc
```bash
# Run JSDoc generation script
npx tsx scripts/add-jsdoc.ts
```

### 7.2 Create Code Templates
```bash
# Create template directory
mkdir -p .ai-templates

# Add Server Action template
cp server/actions/cards-refactored.ts .ai-templates/server-action.template.ts

# Add Component template
echo "// Component template for AI assistance" > .ai-templates/component.template.tsx
```

### 7.3 Update CLAUDE.md
- [ ] Add all new patterns
- [ ] Include example code snippets
- [ ] Document common tasks
- [ ] Add troubleshooting guide

## Phase 8: Testing & Validation (Days 14-15)

### 8.1 Run Comprehensive Tests
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Build test
npm run build
```

### 8.2 Performance Testing
```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --view

# Bundle analysis
npm run analyze

# Check Core Web Vitals
npx web-vitals http://localhost:3000
```

### 8.3 AI Assistant Testing
- [ ] Test with Claude Code for code generation
- [ ] Test with GitHub Copilot for completions
- [ ] Test with Cursor for refactoring suggestions
- [ ] Document any issues or improvements

## Phase 9: Deployment (Day 16)

### 9.1 Final Checks
```bash
# Ensure all tests pass
npm run test && npm run test:e2e

# Build production bundle
npm run build

# Test production build locally
npm run start
```

### 9.2 Deploy to Staging
```bash
# Deploy to Vercel preview
vercel --prod=false

# Test all critical paths
# - Authentication flow
# - Card creation and review
# - AI generation
# - Rate limiting
```

### 9.3 Production Deployment
```bash
# Merge to main branch
git checkout main
git merge refactor/ai-optimization-2025

# Deploy to production
vercel --prod
```

## Success Metrics

Track these metrics before and after migration:

### Development Velocity
- [ ] Time to implement new features
- [ ] AI suggestion acceptance rate
- [ ] Code review iterations

### Performance Metrics
- [ ] Bundle size reduction
- [ ] Lighthouse scores
- [ ] Core Web Vitals

### Code Quality
- [ ] Test coverage percentage
- [ ] TypeScript strict mode compliance
- [ ] ESLint error count

### AI Assistance Effectiveness
- [ ] Successful code generation rate
- [ ] Prompt iterations required
- [ ] Manual corrections needed

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**
```bash
git checkout main
vercel rollback
```

2. **Partial Rollback**
```bash
# Revert specific features
git revert <commit-hash>
```

3. **Hotfix Process**
```bash
git checkout -b hotfix/issue-name
# Fix issue
git push origin hotfix/issue-name
# Create PR for review
```

## Support & Resources

- **Documentation**: `/REFACTORING_GUIDE_2025.md`
- **Examples**: `/server/actions/cards-refactored.ts`
- **Test Utilities**: `/lib/test/factories.ts`
- **Error Handling**: `/lib/errors/`
- **Scripts**: `/scripts/refactor-to-features.sh`

## Checklist Summary

- [ ] Phase 1: Preparation
- [ ] Phase 2: Documentation & Error Handling
- [ ] Phase 3: Feature Modularization
- [ ] Phase 4: Testing Infrastructure
- [ ] Phase 5: Performance Optimization
- [ ] Phase 6: Server Components Optimization
- [ ] Phase 7: AI Integration Enhancement
- [ ] Phase 8: Testing & Validation
- [ ] Phase 9: Deployment

## Notes

- Keep the old structure during migration for easy rollback
- Test each phase thoroughly before proceeding
- Document any deviations from the plan
- Communicate progress with team regularly
- Monitor error rates and performance metrics closely