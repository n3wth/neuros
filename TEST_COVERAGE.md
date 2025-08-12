# Test Coverage Report

Generated: 2025-08-10T22:30:06.506Z

## Coverage Summary
- **Total Coverage**: 6.38%
- **Tested**: 6 files
- **Untested**: 88 files

## Priority Testing Targets

- **app/(auth)/forgot-password/page.tsx** (high)
  - Reason: Authentication required - security critical
- **app/(auth)/reset-password/page.tsx** (high)
  - Reason: Authentication required - security critical
- **app/(auth)/signin/page.tsx** (critical)
  - Reason: Authentication required - security critical
- **app/(auth)/signup/page.tsx** (high)
  - Reason: Authentication required - security critical
- **app/(dashboard)/dashboard/page.tsx** (high)
  - Reason: Authentication required - security critical
- **app/(public)/page.tsx** (critical)
  - Reason: Homepage - critical user entry point
- **app/(public)/research/page.tsx** (high)
  - Reason: High user impact area
- **app/loading-demo/page.tsx** (high)
  - Reason: High user impact area
- **components/features/auth/forgot-password-form.tsx** (high)
  - Reason: High user impact area
- **components/features/auth/reset-password-form.tsx** (high)
  - Reason: High user impact area
- **components/features/auth/sign-in-form.tsx** (high)
  - Reason: High user impact area
- **components/features/auth/sign-up-form.tsx** (high)
  - Reason: High user impact area
- **components/global/learning-network.tsx** (high)
  - Reason: High user impact area
- **components/landing/ai-showcase.tsx** (high)
  - Reason: High user impact area
- **components/landing/professional-hero.tsx** (high)
  - Reason: High user impact area
- **components/layout/site-header.tsx** (high)
  - Reason: High user impact area
- **components/learning/adaptive-learning-interface.tsx** (high)
  - Reason: High user impact area
- **components/learning/ai-assistant.tsx** (high)
  - Reason: High user impact area
- **components/learning/mobile-review-interface.tsx** (high)
  - Reason: High user impact area
- **components/learning/neuros-dashboard.tsx** (high)
  - Reason: High user impact area
- **components/learning/professional-dashboard.tsx** (high)
  - Reason: High user impact area
- **components/pricing/pricing-page.tsx** (critical)
  - Reason: High user impact area
- **components/sound-settings.tsx** (high)
  - Reason: High user impact area
- **components/ui/chat-input.tsx** (high)
  - Reason: High user impact area
- **components/ui/form.tsx** (high)
  - Reason: High user impact area
- **components/ui/install-prompt.tsx** (high)
  - Reason: High user impact area
- **components/ui/learning-companion.tsx** (high)
  - Reason: High user impact area
- **components/ui/page-loader.tsx** (high)
  - Reason: High user impact area
- **components/visualizations/knowledge-graph.tsx** (high)
  - Reason: High user impact area
- **app/api/debug-test/route.ts** (high)
  - Reason: High user impact area
- **app/auth/callback/route.ts** (high)
  - Reason: Authentication required - security critical
- **__tests__/ai-rate-limiting.test.ts** (high)
  - Reason: Database operations - data critical
- **__tests__/ai.test.ts** (high)
  - Reason: Database operations - data critical
- **__tests__/cards.test.ts** (high)
  - Reason: Database operations - data critical
- **auth.ts** (high)
  - Reason: Database operations - data critical
- **example.ts** (high)
  - Reason: Database operations - data critical
- **images.ts** (high)
  - Reason: Database operations - data critical
- **reviews.ts** (high)
  - Reason: Database operations - data critical

## Routes (16 total)

| Path | File | Priority | Tested |
|------|------|----------|--------|
| //forgot-password | app/(auth)/forgot-password/page.tsx | high | ❌ |
| //reset-password | app/(auth)/reset-password/page.tsx | high | ❌ |
| //signin | app/(auth)/signin/page.tsx | critical | ❌ |
| //signup | app/(auth)/signup/page.tsx | high | ❌ |
| //dashboard | app/(dashboard)/dashboard/page.tsx | high | ❌ |
| //enterprise | app/(public)/enterprise/page.tsx | medium | ❌ |
| //explore | app/(public)/explore/page.tsx | medium | ❌ |
| / | app/(public)/page.tsx | critical | ❌ |
| //pricing | app/(public)/pricing/page.tsx | medium | ❌ |
| //research | app/(public)/research/page.tsx | high | ❌ |
| /ai-demo | app/ai-demo/page.tsx | medium | ❌ |
| /learn | app/learn/page.tsx | medium | ❌ |
| /loading-demo | app/loading-demo/page.tsx | high | ❌ |
| /sound-demo | app/sound-demo/page.tsx | medium | ❌ |
| /test-ai-features | app/test-ai-features/page.tsx | medium | ❌ |
| /test-refactor | app/test-refactor/page.tsx | medium | ❌ |

## Components (67 total)

| Name | File | Type | Priority | Tested |
|------|------|------|----------|--------|
| EnterprisePage | components/enterprise/enterprise-page.tsx | client | medium | ❌ |
| ExplorePage | components/explore/explore-page.tsx | client | medium | ✅ |
| ForgotPasswordForm | components/features/auth/forgot-password-form.tsx | client | high | ❌ |
| ResetPasswordForm | components/features/auth/reset-password-form.tsx | client | high | ❌ |
| SignInForm | components/features/auth/sign-in-form.tsx | client | high | ❌ |
| SignUpForm | components/features/auth/sign-up-form.tsx | client | high | ❌ |
| GlobalLearningNetwork | components/global/learning-network.tsx | client | high | ❌ |
| Company-logos | components/icons/company-logos.tsx | pure | medium | ❌ |
| Line-icons | components/icons/line-icons.tsx | client | medium | ❌ |
| AIShowcase | components/landing/ai-showcase.tsx | client | high | ❌ |
| AnimatedFluffyDog | components/landing/animated-fluffy-dog.tsx | client | medium | ❌ |
| EditorialFeatures | components/landing/editorial-features.tsx | client | medium | ❌ |
| FeaturesGrid | components/landing/features-grid.tsx | client | medium | ❌ |
| InteractiveDashboard | components/landing/interactive-dashboard.tsx | client | medium | ❌ |
| MemoryTraces | components/landing/neural-network.tsx | client | medium | ❌ |
| ProfessionalHero | components/landing/professional-hero.tsx | client | high | ❌ |
| ResearchInsights | components/landing/research-insights.tsx | client | medium | ❌ |
| TrustIndicators | components/landing/trust-indicators.tsx | client | medium | ❌ |
| SiteHeader | components/layout/site-header.tsx | client | high | ❌ |

## API Routes (2 total)

| Path | Methods | Auth | Tested |
|------|---------|------|--------|
| /api/debug-test | GET | No | ❌ |
| /auth/callback | GET | Yes | ❌ |

## Testing Strategy

### E2E Testing Priority
1. app/(auth)/forgot-password/page.tsx
2. app/(auth)/reset-password/page.tsx
3. app/(auth)/signin/page.tsx
4. app/(auth)/signup/page.tsx
5. app/(dashboard)/dashboard/page.tsx
6. app/(public)/page.tsx
7. app/(public)/research/page.tsx
8. app/loading-demo/page.tsx
9. components/features/auth/forgot-password-form.tsx
10. components/features/auth/reset-password-form.tsx

### Recommended Next Steps
1. Focus on critical and high-priority untested files
2. Implement E2E tests for user authentication flows
3. Add integration tests for API routes
4. Ensure accessibility testing for all forms

## Commands

```bash
# Run this script to update the manifest
node scripts/generate-test-manifest.js

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Check coverage
npm run test:coverage
```
