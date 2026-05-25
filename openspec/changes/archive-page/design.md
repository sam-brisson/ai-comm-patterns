# Archive Page — Design

## Overview

This document describes the technical design for the `/archive` page in the OpenSpec application. The page surfaces all archived changes in a browsable list, exposing key metadata (title, archive date, artifact links, and associated PRs/Issues) while maintaining visual and structural consistency with the rest of the application.

---

## Architecture Decisions

### 1. Route: `/archive`
A new top-level route is added to the application router. This keeps the URL clean, memorable, and consistent with other top-level OpenSpec views (e.g. `/changes`, `/review`).

### 2. Data Source: Filesystem + Git Metadata
Archived changes are already represented as directories within the repository (e.g. `changes/<change-name>/`) with a status marker (e.g. a `status: archived` field in a `meta.json` or front-matter of `proposal.md`). The archive page reads this data at build time (SSG) or request time (SSR), depending on the deployment model.

- **Preferred approach: SSG (Static Site Generation)** — archive data changes infrequently. A static build gives fast page loads with no runtime data-fetching overhead.
- If real-time accuracy is needed (e.g. changes are archived frequently without redeploys), SSR or ISR (Incremental Static Regeneration) can be used instead.

### 3. PR/Issue Metadata Storage
Each change directory will include a `meta.json` file (or extend an existing one) that stores associated PR and Issue references. This is the single source of truth for linked GitHub artifacts.

Example `meta.json`:
```json
{
  "title": "Archive Page",
  "status": "archived",
  "archivedAt": "2024-11-15",
  "links": {
    "prs": [
      { "number": 42, "title": "feat: add archive page", "url": "https://github.com/org/repo/pull/42" }
    ],
    "issues": [
      { "number": 7, "title": "Archive page missing from UI", "url": "https://github.com/org/repo/issues/7" }
    ]
  }
}
```

### 4. Component Architecture
The page is composed of small, focused components following existing OpenSpec conventions:

```
ArchivePage
└── ArchiveList
    └── ArchiveCard (one per archived change)
        ├── ChangeTitle
        ├── ArchiveDate
        ├── ArtifactLinks
        │   ├── Link → proposal.md
        │   ├── Link → design.md
        │   └── Link → tasks.md
        └── LinkedItemsControl
            ├── PRBadge (×N) — opens PR URL in new tab
            └── IssueBadge (×N) — opens Issue URL in new tab
```

### 5. Design Consistency
The archive page reuses existing layout primitives (page wrapper, header, navigation) and design tokens (colors, typography, spacing). No new design system additions are required beyond the `ArchiveCard` and `LinkedItemsControl` components, which follow the same patterns as existing cards/list items.

---

## Component Breakdown

### `ArchivePage` (page-level component)
- Fetches/receives the list of archived changes as props (from `getStaticProps` or equivalent).
- Renders the page shell (title, description) and delegates to `ArchiveList`.
- Handles the empty state (no archived changes yet).

### `ArchiveList`
- Accepts `changes: ArchivedChange[]`.
- Renders a sorted list of `ArchiveCard` components (sorted by `archivedAt` descending — most recent first).

### `ArchiveCard`
- Accepts a single `ArchivedChange` object.
- Displays title, archive date, artifact links, and the `LinkedItemsControl`.
- Uses a card/panel visual treatment consistent with other list items in the app.

### `ArtifactLinks`
- Renders navigable links to `proposal.md`, `design.md`, and `tasks.md` for the change.
- Links that do not exist (artifact not yet created) are rendered as disabled/muted.

### `LinkedItemsControl`
- Renders two collapsible/inline sections: **Pull Requests** and **Issues**.
- Each PR/Issue is rendered as a small badge or chip with its number and title (truncated if long).
- Clicking any badge opens the URL in a new tab (`target="_blank" rel="noopener noreferrer"`).
- If there are no PRs or Issues, the section is either hidden or shows a subtle "None" state.

---

## Data Flow

```
Build / Request Time
        │
        ▼
  Filesystem scan
  (changes/*/meta.json)
        │
        ▼
  Filter: status === 'archived'
        │
        ▼
  Map to ArchivedChange[]
        │
        ▼
  Sort by archivedAt DESC
        │
        ▼
  ArchivePage receives data as props
        │
        ▼
  ArchiveList → ArchiveCard[]
        │
        ▼
  User clicks PR/Issue badge
        │
        ▼
  window.open(url, '_blank') — no app-side state change
```

---

## Data Types

```typescript
interface ArchivedChange {
  slug: string;           // directory name, used to build artifact URLs
  title: string;
  archivedAt: string;     // ISO 8601 date string
  artifacts: {
    proposal: boolean;    // whether the file exists
    design: boolean;
    tasks: boolean;
  };
  links: {
    prs: LinkedItem[];
    issues: LinkedItem[];
  };
}

interface LinkedItem {
  number: number;
  title: string;
  url: string;
}
```

---

## API Contracts

No external API calls are made at runtime. All data is derived from the repository filesystem at build/request time. Future enhancement: optionally hydrate PR/Issue titles live from the GitHub API if `meta.json` entries are sparse.

---

## Dependencies & Integration Points

| Dependency | Purpose |
|---|---|
| Existing router | Register `/archive` route |
| Existing layout/shell | Wrap page in consistent nav/header |
| Existing design tokens | Colors, typography, spacing |
| `meta.json` per change | Source of archive metadata & PR/Issue links |
| `fs` / build pipeline | Read change directories at build time |

---

## Error Handling

| Scenario | Handling |
|---|---|
| `meta.json` missing for a change | Skip that change; log a warning at build time |
| `meta.json` malformed/invalid | Skip that change; log a warning at build time |
| No archived changes exist | Render a friendly empty state: "No archived changes yet." |
| Artifact file missing (proposal/design/tasks) | Render link as disabled/muted; do not 404 |
| PR/Issue URL missing or malformed | Do not render the badge; log a warning |

---

## Testing Approach

### Unit Tests
- `ArchiveCard` renders title, date, artifact links, PR badges, and Issue badges correctly given mock data.
- `LinkedItemsControl` opens URLs in new tab on click.
- `ArtifactLinks` renders disabled state when artifact `boolean` is `false`.
- Data loader correctly filters only `status === 'archived'` changes.
- Data loader correctly sorts by `archivedAt` descending.

### Integration Tests
- Full `ArchivePage` renders correctly with a mix of changes (some with PRs/Issues, some without).
- Empty state renders when no archived changes are present.
- Navigating to `/archive` returns a valid page (no runtime errors).

### Accessibility
- All links have descriptive `aria-label` attributes.
- PR/Issue badges include `title` attribute showing full PR/Issue title on hover.
- Page uses semantic HTML (`<main>`, `<ul>`, `<li>`, `<article>`).
- New-tab links include a screen-reader hint (e.g. "opens in new tab").

### Manual / Visual QA
- Page matches existing OpenSpec visual design.
- PR and Issue badges are visually distinct from artifact links.
- Long PR/Issue titles truncate gracefully.
- Responsive layout holds at mobile widths.
