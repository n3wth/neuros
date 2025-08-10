# Improve dashboard messaging based on user state

## Problem
Currently, when users have no reviews today, the dashboard simply shows "You have 0 cards ready for review" which is not very helpful or engaging. The messaging should be contextual and guide users appropriately.

## Proposed Solution
Implement smart dashboard messaging that adapts to user state:

### New User (No cards created yet)
- Show onboarding flow with "Get Started" messaging
- Provide clear call-to-action to create first learning card
- Maybe include a brief tutorial or demo

### User with cards but no reviews today
- **Case 1**: User has completed all reviews for today
  - Celebrate completion: "🎉 Great job! You've completed all your reviews for today"
  - Show tomorrow's preview or suggest exploring new topics
- **Case 2**: User has cards but none are due yet
  - Show encouragement: "Your spaced repetition is working! Next review in [time]"
  - Suggest creating new cards or browsing topics

### User with reviews available
- Keep current behavior: "You have X cards ready for review"
- Add urgency/motivation if reviews are overdue

## Acceptance Criteria
- [ ] Dashboard detects user state accurately (new user vs existing user)
- [ ] Different messages for completed reviews vs no cards due
- [ ] Celebration animation/message when all reviews completed
- [ ] Clear onboarding flow for new users
- [ ] Smooth transitions between states
- [ ] Messages are encouraging and actionable

## Technical Notes
- Need to query user's card creation date and review history
- Consider adding celebration micro-interactions
- Messages should be consistent with overall app tone

**Priority**: High  
**Type**: UX Improvement