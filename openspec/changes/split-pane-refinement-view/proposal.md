# Split-Pane Refinement View

## Problem

When refining a change on the workflow board, users need to reference the existing artifacts (proposal, design, tasks) while writing their feedback. Currently, the modal shows artifacts and the refinement input in a single scrollable area, forcing users to scroll away from the input to see what they're refining.

## Solution

Implement a split-pane layout for the change modal when in refinement mode:

- **Left pane**: Scrollable view of all artifacts (proposal, design, tasks)
- **Right pane**: Sticky refinement input area that stays visible

Each pane scrolls independently, allowing users to browse artifacts while keeping the feedback textarea always accessible.

## User Experience

```
┌─────────────────────────────────────────────────────────────────────┐
│  Change: example-change                                        [X] │
├────────────────────────────────────┬────────────────────────────────┤
│  📄 Proposal                       │  Refinement                    │
│  ...                               │  ...                           │
└────────────────────────────────────┴────────────────────────────────┘
```

## Scrollbar Visibility

The scrollbar in the left (artifacts) pane must be **persistently visible** — not only appearing on hover or active scroll. This ensures users are immediately aware that the pane contains scrollable content and do not miss artifacts below the fold.

- Use CSS `overflow-y: scroll` (or equivalent) rather than `overflow-y: auto` on the scrollable pane so the scrollbar is always rendered.
- This applies to any scrollable pane within the modal in refinement mode.
