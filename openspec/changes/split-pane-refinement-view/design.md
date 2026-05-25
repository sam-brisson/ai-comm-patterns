# Split-Pane Refinement View — Design

## Overview

This document describes the technical design for implementing a split-pane layout within the change modal when it is in **refinement mode**. The goal is to allow users to read existing artifacts (proposal, design, tasks) in a scrollable left pane while keeping the refinement input always visible in a fixed right pane.

---

## Architecture Decisions

### 1. Conditional Layout Inside the Existing Modal

Rather than creating a new modal component, the split-pane layout is applied **conditionally inside the existing change modal** when the modal is in refinement mode. This keeps the change surface small and avoids duplicating modal chrome (header, close button, overlay).

**Rationale:** The modal already handles open/close state and change context. Swapping the inner layout based on mode is less risky than forking the entire modal.

### 2. CSS Flexbox Split with Independent Overflow Scroll

The two-pane layout is achieved with a flex row container where each pane has `overflow-y: auto` and a fixed height (inherited from the modal body). This gives each pane independent scroll behavior without JavaScript scroll management.

**Rationale:** Pure CSS solution is simpler, performant, and avoids scroll-position state management.

### 3. Refinement Mode Detection

The modal already receives a `mode` or `status` prop indicating what action the user is performing. A new `isRefinementMode` derived boolean gates the split-pane layout. If the modal is opened in any other mode (view, edit, etc.), the existing single-column layout is preserved.

---

## Component Breakdown

### `ChangeModal` (existing, modified)
- Detects refinement mode via prop/context.
- Renders either the existing layout or the new `RefinementSplitLayout` component.

### `RefinementSplitLayout` (new)
- Top-level flex row container.
- Accepts `change` object and `onSubmitRefinement` callback as props.
- Renders `ArtifactScrollPane` (left) and `RefinementInputPane` (right).

### `ArtifactScrollPane` (new)
- Left pane, `flex: 1`, `overflow-y: auto`.
- Renders the three artifact sections in order: Proposal, Design, Tasks.
- Each section uses the existing artifact display component (e.g., `ArtifactSection` / markdown renderer).
- Shows a placeholder/empty state if an artifact does not yet exist for the change.

### `RefinementInputPane` (new)
- Right pane, fixed width (e.g., `360px` or `40%`), `overflow-y: auto`.
- Contains:
  - A pane title: "Refinement Feedback"
  - A `<textarea>` for free-form feedback (auto-resizing up to a max height, then scrolls).
  - A submit button.
  - Optional: character count / validation message.
- Manages local state for the textarea value.
- Calls `onSubmitRefinement(feedback: string)` on submit.

---

## Data Flow

```
ChangeModal
  └── RefinementSplitLayout
        ├── ArtifactScrollPane
        │     └── ArtifactSection (proposal)
        │     └── ArtifactSection (design)
        │     └── ArtifactSection (tasks)
        └── RefinementInputPane
              └── textarea (local state)
              └── Submit button → onSubmitRefinement(feedback)
```

1. `ChangeModal` receives the `change` object (containing artifact strings) and the current modal mode.
2. When mode is `refinement`, it renders `RefinementSplitLayout`, passing the change data and a submit handler.
3. `ArtifactScrollPane` reads artifact strings from the change object and renders them.
4. `RefinementInputPane` manages textarea state locally; on submit, it lifts the feedback string to the parent via callback.
5. The parent (`ChangeModal` or the board page) handles the API call to persist the refinement note.

---

## API Contracts

No new API endpoints are required. The refinement submission uses the **existing refinement/feedback API** already wired to the modal. The only change is that the feedback string now originates from `RefinementInputPane` instead of the previous inline input.

Expected callback signature:
```ts
onSubmitRefinement: (feedback: string) => Promise<void>
```

The `change` prop shape (relevant fields):
```ts
interface Change {
  id: string;
  name: string;
  artifacts: {
    proposal: string | null;
    design: string | null;
    tasks: string | null;
  };
  // ...other fields
}
```

---

## Layout Specification

```
┌──────────────────────────────────────────────────────────────────┐
│  Change: example-change                                    [X]   │
├───────────────────────────────────┬──────────────────────────────┤
│  📄 Proposal          ▲           │  Refinement Feedback         │
│  [artifact content]   │           │  ┌────────────────────────┐  │
│                       │ scroll    │  │ textarea (scrollable)  │  │
│  📐 Design            │           │  │                        │  │
│  [artifact content]   │           │  └────────────────────────┘  │
│                       ▼           │  [Submit Feedback]           │
│  ✅ Tasks                         │                              │
│  [artifact content]               │                              │
└───────────────────────────────────┴──────────────────────────────┘
```

- Modal min-width: `800px` (or full-screen on small viewports — see Responsive section).
- Left pane: `flex: 1 1 0`, `overflow-y: auto`, `max-height` inherited from modal body.
- Right pane: `flex: 0 0 360px`, `overflow-y: auto`, `max-height` inherited from modal body.
- Modal body height: `70vh` or `min(700px, 80vh)`.

---

## Responsive Behavior

- **≥ 800px viewport**: Split-pane layout as described.
- **< 800px viewport**: Stack panes vertically. Artifact pane on top (fixed max-height ~40vh, scrollable), refinement pane below (fixed max-height ~40vh, scrollable). This avoids a broken side-by-side layout on mobile.

---

## Dependencies & Integration Points

- Existing modal component (`ChangeModal` or equivalent).
- Existing artifact display/markdown component.
- Existing refinement submission handler (API call, optimistic update, toast notification).
- CSS framework or styling approach already used in the project (Tailwind, CSS Modules, styled-components — implementation adapts accordingly).

---

## Error Handling

| Scenario | Handling |
|---|---|
| Artifact content is `null` / missing | Show a dimmed placeholder: "No [artifact] yet" |
| Submit with empty feedback | Disable submit button; show inline validation message |
| API error on submit | Surface existing error toast; keep textarea content so user does not lose input |
| Modal too narrow for split layout | Fall back to stacked responsive layout |

---

## Testing Approach

### Unit Tests
- `RefinementInputPane`: renders textarea, submit button disabled when empty, calls `onSubmitRefinement` with correct value on submit.
- `ArtifactScrollPane`: renders all three artifact sections; shows placeholder for null artifacts.
- `RefinementSplitLayout`: renders both child panes; passes correct props.

### Integration Tests
- `ChangeModal` in refinement mode renders `RefinementSplitLayout`.
- `ChangeModal` in non-refinement mode does **not** render `RefinementSplitLayout`.
- Full submit flow: type feedback → click submit → `onSubmitRefinement` called with typed value.

### Visual / Snapshot Tests
- Snapshot of `RefinementSplitLayout` with all artifacts populated.
- Snapshot with all artifacts null (empty states).
- Responsive stacked layout snapshot at narrow viewport.

### Manual / E2E
- Open a change in refinement mode on the workflow board.
- Scroll the artifact pane — refinement input remains visible and functional.
- Submit feedback — confirm API call fires and modal closes (or resets per existing behavior).
