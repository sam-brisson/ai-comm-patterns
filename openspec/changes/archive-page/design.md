# Archive Page — Design

## Overview

This document describes the technical design for the `/archive` page, which surfaces all archived OpenSpec changes in a browsable, navigable UI. The design also anticipates a future change where the archive process becomes a foundational building block for the broader OpenSpec documentation site — so architectural decisions are made with that extensibility in mind.

---

## Architecture Decisions

### 1. Static Data Source (File-System Driven)

OpenSpec changes live as directories in the repository (e.g. `changes/<change-name>/`). Archived changes are those that have reached the `archived` state, signaled by the presence of an `archived-at` field in a metadata file (e.g. `changes/<change-name>/meta.json` or the front-matter of `proposal.md`).

**Decision:** The archive page is powered by reading the file system at build time (static generation). This keeps the architecture simple, avoids the need for a database, and ensures the archive is always consistent with the repository state.

**Future-proofing:** When the archive becomes the foundation of a documentation site, this same file-system data model can be extended to generate full per-change documentation pages, changelogs, and navigation — without changing the underlying data contract.

### 2. Metadata Contract

Each change directory must include a `meta.json` (or equivalent front-matter) file that provides the structured data the archive page needs. This formalizes a data contract that future documentation site work can build on.

Minimum required fields for the archive page:
```json
{
  "name": "archive-page",
  "title": "Archive Page",
  "status": "archived",
  "archivedAt": "2024-06-01"
}
```

Artifact presence is inferred by checking for the existence of `proposal.md`, `design.md`, and `tasks.md` within the change directory.

**Future-proofing:** Additional fields (e.g. `summary`, `tags`, `authors`, `relatedChanges`) can be added to `meta.json` incrementally without breaking the archive page.

### 3. Route: `/archive`

A dedicated top-level route. The page is statically generated at build time from the file-system data. No client-side data fetching is required for the initial list view.

### 4. Per-Change Artifact Links

Each archived change entry links to its artifacts. Initially these are rendered as direct links to the raw files or to a routed viewer page (e.g. `/archive/<change-name>/proposal`). The routing structure is designed to be extended in the future documentation site change.

**Routing structure (current):**
- `/archive` — list of all archived changes
- `/archive/<change-name>` — detail/artifact index for a single archived change *(stub for now, extensible later)*

---

## Component Breakdown

### `ArchivePage` (Route Component)
- Fetches/receives the list of archived changes at build time
- Renders the `ArchiveList` component
- Handles empty state (no archived changes yet)

### `ArchiveList`
- Receives an array of archived change entries
- Renders a sorted list (most recently archived first)
- Renders one `ArchiveEntry` per change

### `ArchiveEntry`
- Props: `title`, `archivedAt`, `changeName`, `artifacts` (which artifact files are present)
- Displays: change title, formatted archive date, artifact links
- Links to `/archive/<change-name>` for the detail view (stub), or directly to artifact files

### `ArtifactLinks`
- Sub-component of `ArchiveEntry`
- Renders a set of pill/badge links for each available artifact (Proposal, Design, Tasks)
- Only renders links for artifacts that actually exist

### `ArchiveDetailPage` (Stub Route Component — `/archive/<change-name>`)
- Minimal implementation now: displays the change title and lists artifacts with links
- Designed to be expanded in the documentation site change into a full rendered artifact viewer

---

## Data Flow

```
Build Time:
  File System
    └── changes/<change-name>/meta.json   ──┐
    └── changes/<change-name>/proposal.md ──┤
    └── changes/<change-name>/design.md   ──┤──► getArchivedChanges() ──► ArchivePage props
    └── changes/<change-name>/tasks.md    ──┘

Render Time:
  ArchivePage
    └── ArchiveList
          └── ArchiveEntry (× N)
                └── ArtifactLinks
```

### `getArchivedChanges()` — Data Loading Function

```typescript
interface ArchivedChange {
  name: string;          // directory/slug name
  title: string;         // human-readable title
  archivedAt: string;    // ISO date string
  artifacts: {
    proposal: boolean;
    design: boolean;
    tasks: boolean;
  };
}

function getArchivedChanges(): ArchivedChange[]
```

- Reads all directories under `changes/`
- Filters to those with `status: "archived"` in `meta.json`
- For each, checks existence of `proposal.md`, `design.md`, `tasks.md`
- Returns sorted array (descending by `archivedAt`)

---

## API Contracts

No external API is required. All data is resolved at build time from the file system. The internal data contract is the `ArchivedChange` interface defined above.

---

## Dependencies & Integration Points

| Dependency | Purpose |
|---|---|
| File system (`fs`, `path`) | Reading change directories and metadata |
| Existing routing framework | Adding `/archive` and `/archive/[name]` routes |
| Existing UI design system | Ensuring visual consistency with the rest of the app |
| `meta.json` convention | New convention introduced for all changes |

**Integration with future documentation site change:**
- The `/archive/<change-name>` route stub and `ArchivedChange` data model are explicitly designed as extension points
- `getArchivedChanges()` can be re-used or extended by the documentation site change
- No breaking changes to the data model are expected when that change lands

---

## Error Handling Strategy

| Scenario | Handling |
|---|---|
| `changes/` directory is empty | Archive page renders empty state: "No archived changes yet." |
| A change directory is missing `meta.json` | Skip that change with a build-time warning; do not fail the build |
| `meta.json` is malformed | Skip with build-time warning; log the offending file path |
| Artifact file is missing | `ArtifactLinks` simply omits the link for that artifact (no error) |
| `/archive/<change-name>` visited for non-existent change | Render a 404 page using the app's standard not-found handling |

---

## Testing Approach

### Unit Tests
- `getArchivedChanges()`: test with mock file system — correct filtering by status, correct artifact detection, correct sort order, graceful handling of missing/malformed `meta.json`
- `ArchiveEntry`: renders title, date, and correct artifact links given various artifact combinations
- `ArtifactLinks`: only renders links for present artifacts

### Integration / Page Tests
- `ArchivePage`: renders correctly with a list of mock archived changes
- `ArchivePage`: renders empty state when no archived changes exist
- `ArchiveDetailPage` stub: renders correctly for a known change name; returns 404 for unknown

### Visual / Consistency Tests
- Spot-check that the archive page uses the same layout, typography, and navigation as existing pages (can be a manual review step or a snapshot test)

---

## Future Considerations

- **Documentation site change:** The `/archive/<change-name>` stub becomes a full rendered artifact viewer (markdown rendering, navigation between proposal/design/tasks, search)
- **Metadata enrichment:** `meta.json` gains `summary`, `tags`, `authors` fields to power richer archive browsing and documentation site index pages
- **RSS / changelog feed:** `getArchivedChanges()` output can trivially power a changelog or feed once the documentation site change lands
