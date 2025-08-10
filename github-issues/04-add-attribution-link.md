# Add proper attribution link to newth.ai

## Problem
The footer currently shows generic attribution but doesn't link back to the creator's main website. This is a missed opportunity for proper attribution and brand connection.

## Proposed Solution
Update the footer attribution to:
- Link "Made with curiosity" or creator name to newth.ai
- Add text like "A pet project by" before the link
- Ensure link opens in new tab
- Style consistently with rest of footer

## Current Footer Text
```
Made with curiosity
```

## Proposed Footer Text Options
```
A pet project by Oliver Newth
```
or
```
Pet project by Oliver Newth
```
or 
```
Made with curiosity by Oliver Newth
```

## Acceptance Criteria
- [ ] Footer includes proper attribution to Oliver Newth
- [ ] Attribution links to newth.ai website
- [ ] Link opens in new tab (`target="_blank"`)
- [ ] Styling matches existing footer design
- [ ] Text is friendly and matches app's personality
- [ ] Works on both light and dark themes (if applicable)
- [ ] Maintains footer layout and spacing

## Technical Notes
- Update footer component (likely `trust-indicators.tsx` or similar)
- Ensure link has proper accessibility attributes
- Consider adding subtle hover effects to match other links

**Priority**: Low  
**Type**: Enhancement