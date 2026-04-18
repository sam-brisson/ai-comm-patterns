# PR and Deployment Timeline Design

## Page Layout

### Timeline View
```
[PR Timeline Header]
[Filter/Search Controls] [View Toggle: Timeline/List]

┌─ Timeline Axis ─┐
│ Today           │
│ ├─ 🚀 Deploy: v2.1.3
│ │  └─ Includes: transcript-to-openspec-action
│ │
│ ├─ 📝 PR #47: Add GitHub Action for transcript processing
│ │  └─ 🔗 Related: transcript-to-openspec-action
│ │  └─ Status: Merged, Deployed
│ │
│ ├─ 📝 PR #46: Update landing page archive section
│ │  └─ 🔗 Related: archived-changes-exploration
│ │  └─ Status: Merged, Pending Deploy
│ │
│ 3 days ago     │
│ ├─ 🚀 Deploy: v2.1.2
│ └─ etc...      │
└─────────────────┘
```

### Expandable Feature Grouping
When user clicks "Show Feature Details":
```
┌─ Feature: OpenSpec Workflow Automation ─┐
│ 📝 PR #47: Add GitHub Action           │
│ 📝 PR #45: Update conversation parsing │
│ 📝 PR #43: Enhance issue templates     │
│ 🚀 Deployed in: v2.1.3, v2.1.1, v2.0.9│
└─────────────────────────────────────────┘
```

## Data Integration

### GitHub API Integration
- Fetch PR data: title, description, merge date, author
- Deployment webhook integration for automatic timeline updates
- Release/tag information for deployment markers

### OpenSpec Cross-Referencing
1. **Automatic Detection**: Scan PR descriptions for Change IDs or Feature names
2. **Manual Tagging**: Allow developers to add `openspec: change-name` in PR descriptions
3. **Retroactive Linking**: Admin interface to manually associate existing PRs with Changes

## Visual Design

### Timeline Styling
- Vertical timeline with clear chronological flow
- Color coding: Green (deployed), Yellow (merged, pending deploy), Blue (open PR)
- Icons: 🚀 (deployment), 📝 (PR), 🔗 (OpenSpec link), 🔄 (in progress)

### Interactive Elements
- Hover states show PR preview with description snippet
- Click to expand full details including file changes and commit history
- Filter controls: by Feature, by Change, by date range, by status

### Mobile Responsiveness
- Collapsible timeline entries for mobile
- Horizontal scroll for dense timeline sections
- Touch-friendly expand/collapse interactions

## Integration Points

### Landing Page Integration
- "Recent Activity" widget showing last 5 timeline entries
- Status badges on Change cards: "2 PRs merged", "Deployed ✓"
- Click-through from Changes page to filtered timeline view

### Cross-Navigation
- Timeline entries link back to originating OpenSpec Changes
- Breadcrumb navigation: Timeline → Feature → Change → Artifacts
- "Related PRs" section added to Change detail pages