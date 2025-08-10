# Fix forgot password 404 error

## Problem
The "Forgot your password?" link on the sign-in page currently leads to a 404 error. Users cannot reset their passwords, which creates a poor user experience and potential support burden.

## Current Behavior
- Link points to `/forgot-password` route
- Route returns 404 Not Found error
- No password reset functionality available

## Expected Behavior
- Forgot password page should load properly
- User can enter email address
- System sends password reset email via Supabase Auth
- User receives email with reset link
- Reset link leads to functional password reset form

## Acceptance Criteria
- [ ] Create `/forgot-password` route and page component
- [ ] Implement email input form with validation
- [ ] Integrate with Supabase Auth password reset
- [ ] Show success message after email sent
- [ ] Handle error cases (invalid email, network issues)
- [ ] Create password reset confirmation page
- [ ] Test full password reset flow end-to-end
- [ ] Ensure reset emails work in both development and production

## Technical Notes
- Use Supabase `auth.resetPasswordForEmail()`
- Need to configure Supabase email templates
- Ensure proper redirect URLs are set in Supabase dashboard
- Consider rate limiting for security

**Priority**: High  
**Type**: Bug Fix