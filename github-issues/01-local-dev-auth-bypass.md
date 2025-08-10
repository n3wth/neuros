# Add local development authentication bypass for quick testing

## Problem
During local development, having to create accounts and sign in every time slows down development and testing workflows. We need a way to quickly access the dashboard without authentication friction.

## Proposed Solution
Add a development-only bypass that allows instant access to a test account:
- Add environment variable check for `NODE_ENV=development`
- Create a "Quick Test Login" button or automatic bypass on signin page
- Use a predefined test user account with sample data
- Ensure this only works in development mode for security

## Acceptance Criteria
- [ ] Local dev can bypass authentication with one click or automatically
- [ ] Test account has realistic sample data (cards, stats, etc.)
- [ ] Feature is completely disabled in production
- [ ] Clear visual indication when using test mode
- [ ] Preserves ability to test actual auth flows when needed

## Technical Notes
- Could be implemented as middleware or auth provider modification
- Should populate test account with meaningful sample learning data
- Consider adding environment indicator in UI when in test mode

**Priority**: Medium  
**Type**: Developer Experience