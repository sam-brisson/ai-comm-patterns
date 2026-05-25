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
│  ─────────────────────────         │  ─────────────────────         │
│  [artifact content...]             │  [textarea for feedback]       │
│                                    │                                │
│  📐 Design                         │                                │
│  ─────────────────────────         │                                │
│  [artifact content...]             │                                │
│                                    │                                │
│  ✅ Tasks                          │                                │
│  ─────────────────────────         │                                │
│  [artifact content...]             │                                │
│                                    │                                │
│  [scrollable]                      │  [sticky]                      │
├────────────────────────────────────┴────────────────────────────────┤
│                              [Cancel]  [Re-run with Feedback]       │
└─────────────────────────────────────────────────────────────────────┘
```

## Success Criteria

- Users can scroll through artifacts without losing sight of the refinement input
- Works well on typical screen sizes (1280px+ width)
- Graceful fallback on smaller screens (stack vertically)
- Maintains current modal functionality for non-refinement views
