# Archive Page — Tasks

## Phase 1: Data Layer

- [ ] **Define `meta.json` schema**
  - Document the agreed schema for `meta.json` (title, status, archivedAt, links.prs, links.issues).
  - Acceptance: Schema is documented and agreed upon; existing `meta.json` files (if any) are confirmed compatible or flagged for migration.
  - Complexity: Low

- [ ] **Add `meta.json` to existing archived change directories**
  - For each existing archived change, create/update `meta.json` with correct metadata.
  - Acceptance: Every directory with `status: archived` has a valid, parseable `meta.json`.
  - Complexity: Low (data entry)

- [ ] **Implement filesystem data loader**
  - Write a function that scans `changes/*/meta.json`, filters for `status === 'archived'`, maps to `ArchivedChange[]`, and sorts by `archivedAt` descending.
  - Acceptance: Unit tests pass for filter, map, and sort logic. Missing/malformed `meta.json` files are skipped with a logged warning.
  - Complexity: Medium

- [ ] **Wire data loader into build pipeline (SSG / getStaticProps)**
  - Connect the loader to the page's data-fetching mechanism so `ArchivePage` receives `ArchivedChange[]` as props at build time.
  - Acceptance: Page receives correct data; build does not error when no archived changes exist.
  - Complexity: Low–Medium

---

## Phase 2: Core Components

- [ ] **Create `ArtifactLinks` component**
  - Renders links to `proposal.md`, `design.md`, and `tasks.md` for a given change slug.
  - Links to non-existent artifacts are rendered as disabled/muted (uses `artifacts` boolean flags from `ArchivedChange`).
  - Acceptance: Renders all three links; disabled state is visually distinct and not clickable; unit tests pass.
  - Complexity: Low

- [ ] **Create `LinkedItemsControl` component**
  - Accepts `prs: LinkedItem[]` and `issues: LinkedItem[]`.
  - Renders PR badges and Issue badges in separate labeled groups.
  - Each badge opens its URL in a new tab (`target="_blank" rel="noopener noreferrer"`) with a screen-reader "opens in new tab" hint.
  - Empty groups are hidden or show a subtle "None" state.
  - Acceptance: Unit tests confirm new-tab behavior; badges display number + truncated title; empty state renders correctly; no badges rendered for malformed URLs.
  - Complexity: Medium

- [ ] **Create `ArchiveCard` component**
  - Composes `ArtifactLinks` and `LinkedItemsControl` alongside change title and formatted archive date.
  - Uses card/panel styling consistent with existing list items.
  - Acceptance: Renders all required fields; matches existing design system visually; unit tests pass.
  - Complexity: Medium

- [ ] **Create `ArchiveList` component**
  - Accepts `changes: ArchivedChange[]` and renders a list of `ArchiveCard` components.
  - Uses semantic `<ul>` / `<li>` markup.
  - Acceptance: Renders correct number of cards in correct order; unit tests pass.
  - Complexity: Low

---

## Phase 3: Page Assembly

- [ ] **Create `ArchivePage` component**
  - Renders page title, optional description, and `ArchiveList`.
  - Renders a friendly empty state when `changes` is empty.
  - Wrapped in existing layout/shell for nav and header consistency.
  - Acceptance: Page renders correctly with data and in empty state; no layout regressions in existing pages.
  - Complexity: Low

- [ ] **Register `/archive` route**
  - Add the route to the application router pointing to `ArchivePage`.
  - Acceptance: Navigating to `/archive` loads the page without errors; route is accessible from the existing navigation (if a nav link is appropriate).
  - Complexity: Low

- [ ] **Add navigation entry (if applicable)**
  - Add an "Archive" link to the main navigation so users can discover the page.
  - Acceptance: Link appears in nav; active state is applied when on `/archive`.
  - Complexity: Low

---

## Phase 4: Accessibility & Polish

- [ ] **Accessibility audit of new components**
  - Verify semantic HTML (`<main>`, `<ul>`, `<li>`, `<article>`).
  - Add `aria-label` to links where the visible text is insufficient.
  - Add `title` attributes to PR/Issue badges for full title on hover.
  - Confirm keyboard navigation works for all interactive elements.
  - Acceptance: No critical a11y violations; screen reader can navigate all links meaningfully.
  - Complexity: Low–Medium

- [ ] **Responsive layout verification**
  - Test archive page and `ArchiveCard` at mobile, tablet, and desktop widths.
  - Fix any layout overflow or truncation issues.
  - Acceptance: Page is usable and visually correct at all breakpoints.
  - Complexity: Low

---

## Phase 5: Testing

- [ ] **Unit tests: data loader**
  - Cover: filter logic, sort order, missing file handling, malformed JSON handling.
  - Acceptance: All cases pass; CI green.
  - Complexity: Low

- [ ] **Unit tests: `ArtifactLinks`**
  - Cover: all three links rendered; disabled state for missing artifacts.
  - Acceptance: All cases pass.
  - Complexity: Low

- [ ] **Unit tests: `LinkedItemsControl`**
  - Cover: badges render with correct URLs; new-tab attributes present; empty state renders; malformed URLs excluded.
  - Acceptance: All cases pass.
  - Complexity: Low

- [ ] **Unit tests: `ArchiveCard`**
  - Cover: title, date, artifacts, PR/Issue sections all render from mock data.
  - Acceptance: All cases pass.
  - Complexity: Low

- [ ] **Integration test: `ArchivePage`**
  - Cover: page renders with mixed data (some changes with PRs/Issues, some without); empty state renders when list is empty.
  - Acceptance: All cases pass; no console errors.
  - Complexity: Medium

- [ ] **Manual QA sign-off**
  - Verify visual consistency with rest of OpenSpec app.
  - Verify PR and Issue links open in new tab.
  - Verify artifact links navigate correctly or show disabled state.
  - Verify empty state copy and styling.
  - Acceptance: All items confirmed by a second reviewer.
  - Complexity: Low
