# PR and Deployment Timeline with OpenSpec Integration

## Why

Our team is building features using OpenSpec Changes as the core unit of work, but there's currently no visual connection between the Features/Changes we plan on the landing page and the actual PRs/deployments that implement them. This creates a gap between our planning artifacts and our delivery artifacts.

A PR and Deployment timeline would close this loop by:

1. **Connecting Planning to Delivery**: Show how OpenSpec Changes flow through to actual code changes
2. **Visualizing Feature Progress**: Track which Features have active development vs which are still in planning
3. **Knowledge Continuity**: Link conversations → OpenSpec artifacts → PRs → deployments in one view
4. **Team Awareness**: Help team members see what's being actively worked on and recently shipped

This supports our broader theory that knowledge is derived from OpenSpec changes by making the full lifecycle visible - from initial conversation to deployed feature.

## What Changes

### PR Timeline Integration
- Add a "Development Timeline" section to show recent PRs and deployments
- Visual connections between PRs and the OpenSpec Changes/Features they implement
- Expanding view to show detailed relationships between planning artifacts and code changes

### GitHub Integration
- Connect to GitHub API to fetch PR data
- Match PRs to OpenSpec Changes via branch naming, PR descriptions, or manual linking
- Show deployment status and timing

### Enhanced Landing Page
- Timeline view that complements the existing Changes table
- Filter timeline by Feature, Change status, or time period
- Integration with existing archived changes exploration

This change builds on the transcript-to-openspec-action by completing the full cycle: conversations → OpenSpec updates → PR creation → deployment tracking.