# PR and Deployment Timeline Design

## Architecture Overview

The PR Timeline integrates with the existing OpenSpec landing page architecture, adding a new timeline component that connects to both our OpenSpec data and GitHub APIs.

```
Landing Page
├── Changes Table (existing)
├── Archive Explorer (planned)
└── Development Timeline (new)
    ├── PR Timeline View
    ├── Deployment Status
    └── OpenSpec Connections
```

## GitHub Integration

### Data Sources
- GitHub API for PR data, deployment status
- Repository webhooks for real-time updates
- OpenSpec metadata to establish connections

### PR-to-Change Matching
1. **Branch naming convention**: `feature/change-name` or `openspec/change-name`
2. **PR description parsing**: Look for OpenSpec change references
3. **Manual linking**: UI to associate PRs with changes

## Timeline Components

### Timeline Entry Structure
```
┌─ [Date] ─────────────────────────────┐
│ PR #123: Implement TDD Explorer      │
│ ├── OpenSpec Change: tdd-explorer    │
│ ├── Status: Merged → Deployed        │
│ └── [Expand] for full details        │
└─────────────────────────────────────┘
```

### Expanding View Details
- Related OpenSpec artifacts (proposal, design, tasks)
- PR conversation highlights
- Deployment timeline and status
- Connected issues and changes

## Visual Design

### Timeline Layout
- Chronological view (newest first)
- Visual indicators for PR status (draft, review, merged, deployed)
- Color coding that matches OpenSpec change themes
- Expandable cards for detailed information

### Integration Points
- Click from Changes table → filter timeline to related PRs
- Click from timeline → jump to OpenSpec change details
- Cross-reference with archived changes

## Technical Implementation

### Frontend Components
- `<PRTimeline>` - Main timeline container
- `<TimelineEntry>` - Individual PR/deployment entry
- `<OpenSpecConnection>` - Visual link to related changes
- `<DeploymentStatus>` - Real-time deployment indicators

### Data Flow
1. GitHub webhook triggers data refresh
2. Match PRs to OpenSpec changes via naming/metadata
3. Update timeline view with new entries
4. Real-time deployment status updates

### API Integration
```javascript
// Fetch PR data with OpenSpec connections
const timelineData = await fetchPRTimeline({
  includeDrafts: false,
  matchOpenSpecChanges: true,
  timeRange: '30days'
});
```