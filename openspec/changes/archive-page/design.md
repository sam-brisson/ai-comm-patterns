# Archive Page — Design

## Overview

This document describes the technical design for the `/archive` page, a dedicated view within the OpenSpec application that surfaces all archived changes. The page must feel native to the OpenSpec UI and expose key metadata including title, archive timestamp, contributor GitHub IDs, and links to associated artifacts.

---

## Architecture Decisions

### 1. New Route: `/archive`
A dedicated top-level route is added to the application router. This keeps the concern isolated and makes the URL predictable and bookmarkable.

**Rationale:** Archive browsing is a distinct mode of use from active change management. A top-level route signals this clearly and avoids polluting existing views.

### 2. Server-Side Data Fetching
Archived change data is fetched server-side (e.g. via `getServerSideProps` or equivalent depending on the framework in use) rather than purely client-side.

**Rationale:** Archive contents are relatively stable (items don't un-archive) and SEO/shareability of archive records is desirable. Server-side rendering also avoids a loading flash on initial visit.

### 3. Existing Data Layer
The implementation reads from whatever data store already backs OpenSpec changes (filesystem, database, or API). No new storage mechanism is introduced — only a new query/filter for `status === 'archived'`.

**Rationale:** Keeps the change small and avoids data model drift.

### 4. Timestamp Precision
Archive date is stored and displayed as a full ISO 8601 timestamp (e.g. `2024-11-03T14:22:00Z`), rendered in the user's local timezone via the browser. A human-readable relative label (e.g. "3 months ago") is shown alongside the full timestamp in a `<time>` element's `title` attribute for accessibility.

---

## Component / Module Breakdown

```
src/
  pages/
    archive/
      index.tsx              # Route entry point — fetches data, renders ArchivePage
  components/
    archive/
      ArchivePage.tsx        # Top-level layout component for the archive view
      ArchiveList.tsx        # Renders the list of archived changes
      ArchiveListItem.tsx    # Single archived change row/card
      ContributorBadge.tsx   # Renders a GitHub ID as a linked badge/avatar chip
  lib/
    archive/
      getArchivedChanges.ts  # Data access: queries and returns archived changes
      types.ts               # ArchivedChange type definition
```

---

## Data Model

### `ArchivedChange`

```typescript
export interface ArchivedChange {
  /** Unique identifier / slug for the change */
  id: string;

  /** Human-readable title of the change */
  title: string;

  /** ISO 8601 timestamp of when the change was archived */
  archivedAt: string;

  /** GitHub usernames of contributors to the change */
  contributors: string[];

  /** Paths or URLs to available artifacts */
  artifacts: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}
```

---

## Data Flow

```
User visits /archive
       │
       ▼
archive/index.tsx (server-side)
       │
       ├─► getArchivedChanges()
       │       │
       │       └─► Reads change store, filters status === 'archived'
       │           Returns ArchivedChange[]
       │
       └─► Props passed to ArchivePage
               │
               └─► ArchiveList (iterates items)
                       │
                       └─► ArchiveListItem (per change)
                               ├─ Title
                               ├─ archivedAt timestamp
                               ├─ ContributorBadge[] (per GitHub ID)
                               └─ Artifact links
```

---

## API Contracts

### `getArchivedChanges(): Promise<ArchivedChange[]>`

- **Input:** None (reads from the configured data store)
- **Output:** Array of `ArchivedChange`, sorted by `archivedAt` descending (most recently archived first)
- **Errors:** Throws a typed `ArchiveFetchError` if the data store is unavailable; caller is responsible for catching and rendering an error state
- **Notes:** If zero archived changes exist, returns an empty array (not an error)

### Artifact Link Resolution
Artifact links are resolved to paths within the OpenSpec repo/site (e.g. `/changes/{id}/proposal`, `/changes/{id}/design`, `/changes/{id}/tasks`). Only artifacts that exist are linked — missing artifacts are omitted from the UI.

### Contributor GitHub ID Links
Each GitHub ID links to `https://github.com/{githubId}` and opens in a new tab with `rel="noopener noreferrer"`.

---

## Dependencies & Integration Points

| Dependency | Purpose |
|---|---|
| Existing change data store | Source of archived changes and their metadata |
| OpenSpec design system / component library | Ensures visual consistency per the proposal requirement |
| Application router | Registration of the `/archive` route |
| GitHub (external) | Contributor profile links (no API call required — links only) |

---

## Error Handling Strategy

| Scenario | Handling |
|---|---|
| Data store unavailable | Display an inline error message on the page; log the error server-side |
| Zero archived changes | Render a friendly empty state: "No archived changes yet." |
| Contributor list is empty | Render nothing for contributors section (no broken UI) |
| Artifact link target missing | Omit the link; do not render a broken anchor |

---

## Testing Approach

### Unit Tests
- `getArchivedChanges()` — mock the data store; assert correct filtering, sorting, and output shape
- `ArchiveListItem` — snapshot + prop-driven rendering tests covering: full data, missing contributors, missing artifacts, empty artifact set
- `ContributorBadge` — renders correct GitHub link and accessible label

### Integration Tests
- `/archive` route renders correctly with mocked data (happy path, empty state, error state)
- Artifact links resolve to correct paths for changes that have all / some / no artifacts

### Accessibility
- `<time>` element used for archive timestamp with `dateTime` attribute set to ISO string
- Contributor badges have descriptive `aria-label` (e.g. `"GitHub profile of octocat"`)
- Page has a clear `<h1>` landmark

### Manual / Visual QA
- Verify the page looks native within the OpenSpec UI (typography, spacing, navigation integration)
- Verify timestamps display in local timezone
- Verify GitHub ID links open correctly
