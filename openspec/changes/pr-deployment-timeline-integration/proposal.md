# PR and Deployment Timeline with OpenSpec Integration

## Why

While we've built infrastructure to create OpenSpec Changes from conversations and display our work on the landing page, there's a missing link between our planning artifacts and actual code delivery. Teams need to see how their OpenSpec Changes translate into real pull requests and deployments to close the feedback loop and understand the impact of their spec-driven development process.

Currently, when engineers create Features and Changes through OpenSpec, they lose visibility into how these initiatives progress through the development pipeline. There's no way to:

1. See which pull requests were created to implement a specific OpenSpec Change
2. Track deployment timeline and connect it back to original planning decisions
3. Understand the relationship between multiple PRs that contribute to a single Feature
4. Visualize the flow from conversation → OpenSpec Change → code → deployment

This creates a disconnect between planning and execution that undermines the value of spec-driven development. Engineers can't easily answer "what happened to that feature we discussed?" or "which changes are actually deployed?"

## What Changes

### PR and Deployment Timeline Page
- Create a new timeline view that chronologically displays PRs and deployments
- Visual indicators show connections between PRs and their originating OpenSpec Changes/Features
- Expandable sections reveal detailed relationships between multiple PRs contributing to a single Feature
- Integration with GitHub API to automatically pull PR metadata and deployment status

### Landing Page Integration
- Add timeline preview or summary section to main landing page
- Link from Changes/Features to their related PRs in the timeline
- Show deployment status indicators on Change cards

### Cross-Reference System
- Automatic detection of OpenSpec Change references in PR descriptions or commits
- Manual tagging system for associating PRs with Changes when auto-detection fails
- Bidirectional linking between timeline entries and OpenSpec artifacts

This creates a complete loop: conversations generate Changes, Changes link to code via PRs, and the timeline shows the full journey from idea to deployment.