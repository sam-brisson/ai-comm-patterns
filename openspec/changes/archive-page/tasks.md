# Archive Page — Tasks

## Phase 1: Data Foundation

### Metadata Convention

- [ ] **Define `meta.json` schema** — document the required and optional fields (`name`, `title`, `status`, `archivedAt`) and add a schema file or README note to the `changes/` directory
  - *Acceptance:* Schema is documented; required fields are clearly specified; future optional fields are noted as extension points
  - *Complexity: Low*

- [ ] **Audit existing change directories** — review all existing change directories and ensure each has a valid `meta.json` (or equivalent) with at minimum `name`, `title`, and `status`; add `archivedAt` to any that are already in archived state
  - *Acceptance:* Every change directory has a parseable `meta.json`; all archived changes have an `archivedAt` date
  - *Complexity: Low*

### Data Loading

- [ ] **Implement `getArchivedChanges()` function** — reads all directories under `changes/`, filters by `status: "archived"`, checks artifact file existence, returns sorted `ArchivedChange[]` (descending by `archivedAt`); skips and warns on missing/malformed `meta.json`
  - *Acceptance:* Function returns correct results against a set of mock change directories; handles missing/malformed metadata gracefully without throwing; sort order is correct
  - *Complexity: Medium*

- [ ] **Unit test `getArchivedChanges()`** — cover: happy path with multiple archived changes, filtering out non-archived changes, missing `meta.json`, malformed `meta.json`, missing artifact files, empty `changes/` directory
  - *Acceptance:* All test cases pass; edge cases are covered
  - *Complexity: Low*

---

## Phase 2: Components

- [ ] **Implement `ArtifactLinks` component** — renders pill/badge links for proposal, design, and tasks; only renders a link if the corresponding artifact is present; links point to `/archive/<change-name>/<artifact>`
  - *Acceptance:* Renders correct links for all combinations of artifact presence; renders nothing for absent artifacts; links are accessible (proper anchor text)
  - *Complexity: Low*

- [ ] **Implement `ArchiveEntry` component** — displays change title, formatted archive date, and `ArtifactLinks`; accepts `ArchivedChange` props
  - *Acceptance:* Renders all required fields; date is human-readable; integrates `ArtifactLinks`; matches app design system styling
  - *Complexity: Low*

- [ ] **Implement `ArchiveList` component** — accepts array of `ArchivedChange`, renders one `ArchiveEntry` per item
  - *Acceptance:* Renders correct number of entries; passes correct props to each `ArchiveEntry`
  - *Complexity: Low*

- [ ] **Unit test components** — test `ArtifactLinks` (various artifact presence combinations), `ArchiveEntry` (renders all fields correctly), `ArchiveList` (renders correct count)
  - *Acceptance:* All component unit tests pass
  - *Complexity: Low*

---

## Phase 3: Pages & Routing

- [ ] **Implement `/archive` route and `ArchivePage`** — statically generated page; calls `getArchivedChanges()` at build time; renders `ArchiveList`; handles empty state with a clear message
  - *Acceptance:* Page renders all archived changes sorted by date descending; empty state message shown when no archived changes exist; page uses app-consistent layout and navigation
  - *Complexity: Medium*

- [ ] **Implement `/archive/<change-name>` stub route and `ArchiveDetailPage`** — minimal implementation: displays change title and lists available artifacts with links; returns 404 for unknown change names; designed as an extension point for the future documentation site change
  - *Acceptance:* Page renders for valid change names; 404 for invalid names; artifact links are present and correct; stub nature is noted in code comments for future extensibility
  - *Complexity: Low*

- [ ] **Add archive link to app navigation** — add a link to `/archive` in the main navigation so it is discoverable from any page
  - *Acceptance:* Navigation link is present and functional; visually consistent with other nav items
  - *Complexity: Low*

---

## Phase 4: Integration & Quality

- [ ] **Integration test: `/archive` page** — test with mock data: correct entries rendered, correct empty state, correct sort order
  - *Acceptance:* Integration tests pass
  - *Complexity: Low*

- [ ] **Integration test: `/archive/<change-name>` stub** — test valid and invalid change name cases
  - *Acceptance:* Integration tests pass; 404 case is covered
  - *Complexity: Low*

- [ ] **Visual consistency review** — manually verify the archive page and entry detail stub use the same layout, typography, spacing, and navigation patterns as existing pages
  - *Acceptance:* No visual inconsistencies identified; page feels native to the app
  - *Complexity: Low*

- [ ] **Document the `meta.json` convention in the project README or CONTRIBUTING guide** — so future changes know to include a valid `meta.json`
  - *Acceptance:* Documentation is clear, accurate, and references the schema; future contributors know what is required when archiving a change
  - *Complexity: Low*
