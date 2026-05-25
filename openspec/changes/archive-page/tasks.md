# Archive Page — Tasks

## Phase 1: Data Layer

- [ ] **Define `ArchivedChange` TypeScript type**
  - Fields: `id`, `title`, `archivedAt` (ISO 8601 string), `contributors` (string[]), `artifacts` ({ proposal?, design?, tasks? })
  - Place in `src/lib/archive/types.ts`
  - _Acceptance:_ Type is exported and importable; all fields documented with JSDoc

- [ ] **Implement `getArchivedChanges()` data accessor**
  - Reads from the existing change data store
  - Filters to changes with `status === 'archived'`
  - Returns results sorted by `archivedAt` descending
  - Throws a typed `ArchiveFetchError` on store failure
  - _Acceptance:_ Returns correct shape; empty array when no archived changes exist; error thrown (not swallowed) on store failure

- [ ] **Write unit tests for `getArchivedChanges()`**
  - Test: happy path with multiple archived changes (correct sort order)
  - Test: filters out non-archived changes
  - Test: returns empty array when no archived changes
  - Test: throws `ArchiveFetchError` when store is unavailable
  - _Acceptance:_ All tests pass; coverage includes all branches

---

## Phase 2: Core Components

- [ ] **Implement `ContributorBadge` component**
  - Props: `githubId: string`
  - Renders as a linked chip/badge pointing to `https://github.com/{githubId}`
  - Opens in new tab with `rel="noopener noreferrer"`
  - Includes `aria-label="GitHub profile of {githubId}"`
  - Styled consistently with the OpenSpec design system
  - _Acceptance:_ Renders correct link; accessible label present; visual review passes

- [ ] **Implement `ArchiveListItem` component**
  - Props: `change: ArchivedChange`
  - Displays: title, archive timestamp (human-readable + ISO `<time>` element), contributors (via `ContributorBadge`), artifact links
  - Artifact links only rendered when the artifact exists
  - Gracefully handles empty `contributors` array (renders nothing for that section)
  - _Acceptance:_ All required fields displayed; missing artifacts/contributors don't break rendering; snapshot test added

- [ ] **Implement `ArchiveList` component**
  - Props: `changes: ArchivedChange[]`
  - Renders a list of `ArchiveListItem` components
  - Renders a friendly empty state when `changes` is empty: _"No archived changes yet."_
  - _Acceptance:_ Renders correct number of items; empty state shown when array is empty

- [ ] **Implement `ArchivePage` layout component**
  - Contains a clear `<h1>` page heading (e.g. "Archive")
  - Renders `ArchiveList` with provided data
  - Renders an inline error message when an error prop is passed
  - Styled to feel native within the OpenSpec application
  - _Acceptance:_ Page has `<h1>` landmark; error state renders correctly; visual consistency review passes

---

## Phase 3: Route & Page Integration

- [ ] **Create `/archive` route and page entry point**
  - Add `src/pages/archive/index.tsx` (or framework equivalent)
  - Fetches data server-side using `getArchivedChanges()`
  - Passes `ArchivedChange[]` (or error state) as props to `ArchivePage`
  - _Acceptance:_ Navigating to `/archive` renders the page with real data; SSR confirmed (no client-side loading flash on first paint)

- [ ] **Register `/archive` in application navigation**
  - Add an "Archive" link to the appropriate nav component (sidebar, header, etc.)
  - Link is active/highlighted when on the `/archive` route
  - _Acceptance:_ Link is visible and navigates correctly; active state applied

---

## Phase 4: Timestamp Display

- [ ] **Implement timestamp rendering in `ArchiveListItem`**
  - Display a relative label (e.g. "3 months ago") as the visible text
  - Wrap in a `<time dateTime="{ISO string}">` element
  - Include the full formatted timestamp in the `title` attribute for tooltip/accessibility
  - Render in the user's local timezone (client-side locale formatting)
  - _Acceptance:_ `dateTime` attribute contains valid ISO 8601 string; relative label is human-readable; full timestamp visible on hover

---

## Phase 5: Testing & QA

- [ ] **Write unit tests for `ArchiveListItem`**
  - Test: renders all fields with full data
  - Test: omits artifact links when artifacts are missing
  - Test: renders no contributor section when `contributors` is empty
  - Test: `<time>` element has correct `dateTime` attribute
  - _Acceptance:_ All tests pass

- [ ] **Write unit tests for `ArchiveList`**
  - Test: renders correct number of `ArchiveListItem` components
  - Test: renders empty state when array is empty
  - _Acceptance:_ All tests pass

- [ ] **Write integration tests for `/archive` route**
  - Test: happy path — page renders list with mocked archived changes
  - Test: empty state — page renders empty state message
  - Test: error state — page renders error message when data fetch fails
  - _Acceptance:_ All tests pass against the rendered route

- [ ] **Accessibility review**
  - Verify `<h1>` landmark present
  - Verify all `<time>` elements have `dateTime` attributes
  - Verify `ContributorBadge` `aria-label` values are descriptive
  - Run automated a11y linter (e.g. axe) against the page
  - _Acceptance:_ No critical or serious a11y violations

- [ ] **Visual / manual QA**
  - Verify page styling is consistent with the rest of OpenSpec
  - Verify timestamps display in local timezone
  - Verify GitHub contributor links open correctly in a new tab
  - Verify artifact links navigate to correct destinations
  - Verify navigation link highlights correctly when on `/archive`
  - _Acceptance:_ All checks pass; sign-off from a second reviewer
