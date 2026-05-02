# Tasks: Workflow Board Enhancement

## Phase 1: Wizard Modal Foundation

- [x] Create `AdvanceWizardModal` component
  - [x] Modal overlay and container structure
  - [x] Close on overlay click / escape key
  - [x] State for mode ('new' | 'advance')
  - [x] State for change name (editable input)
  - [x] State for action selection (explore/propose for new)
  - [x] State for transcript textarea
  - [x] Cancel and Submit buttons

- [x] Implement `buildGitHubIssueUrl` function
  - [x] Accept changeName, action, transcript params
  - [x] Construct title: `[ACTION]: change-name`
  - [x] Set labels param to action name
  - [x] Build body with `### Change` and `### Instructions` sections
  - [x] URL encode all params properly
  - [x] Return complete GitHub new issue URL

- [x] Style the wizard modal
  - [x] Match existing modal styling patterns
  - [x] Form layout for inputs
  - [x] Radio buttons for action selection (new mode)
  - [x] Textarea styling
  - [x] Button styling (cancel secondary, submit primary)

## Phase 2: Add New Change Button

- [x] Add `[+ Start New Change]` button above the board
  - [x] Position in board header area
  - [x] Primary button styling

- [x] Wire button to open wizard in 'new' mode
  - [x] Set mode to 'new'
  - [x] Clear change name (user enters)
  - [x] Show action radio buttons (explore/propose)
  - [x] Focus on change name input

- [x] Add change name validation
  - [x] Require kebab-case format
  - [x] Show inline validation feedback
  - [x] Disable submit until valid

## Phase 3: Advance Button in Modal

- [x] Replace `nextActionHint` with `advanceButton`
  - [x] Remove the span-based hint display
  - [x] Add button with dynamic label ("Advance to Proposed", etc.)
  - [x] Style as actionable button with arrow

- [x] Wire advance button to open wizard in 'advance' mode
  - [x] Set mode to 'advance'
  - [x] Pre-fill change name from selected change
  - [x] Pre-select action from stage's nextAction
  - [x] Hide action radio buttons (already determined)
  - [x] Focus on transcript textarea

- [x] Close detail modal when wizard opens
  - [x] Or overlay wizard on top of detail modal
  - [x] Decision: close detail modal for cleaner UX

## Phase 4: Drag to Advance

- [x] Add drag handlers to ChangeCard
  - [x] `draggable` attribute
  - [x] `onDragStart` - set dragged change
  - [x] `onDragEnd` - clear drag state

- [x] Add drop handlers to StageColumn
  - [x] `onDragOver` - validate drop target, show feedback
  - [x] `onDragLeave` - clear drop target styling
  - [x] `onDrop` - open wizard for target stage

- [x] Implement drag constraints
  - [x] Only allow forward movement
  - [x] Only allow single-stage jumps
  - [x] Visual feedback for valid/invalid targets

- [x] Add drag styling
  - [x] `.dragging` class on dragged card
  - [x] `.dropTarget` class on valid columns
  - [x] Smooth transitions

## Phase 5: Polish and Edge Cases

- [x] Handle archived column
  - [x] Applied cards can drag to archive column
  - [x] Archive column accepts drops
  - [x] Opens wizard with 'archive' action

- [x] Keyboard accessibility
  - [x] Focus management in wizard
  - [x] Escape to close
  - [ ] Enter to submit (when valid)

- [ ] Loading/transition states
  - [ ] Button shows "Opening GitHub..." briefly
  - [ ] Or just opens immediately (simpler)

- [x] Get GitHub repo URL from config
  - [x] Read from docusaurus.config.js custom field
  - [x] Fallback to hardcoded value for now

## Out of Scope (tracked for reference)

- [x] ~Issue templates for apply/archive~ (URL construction handles this)
- [x] ~GitHub API integration~ (browser handles auth)
- [x] ~Real-time status updates~ (requires page refresh after action completes)
- [x] ~Backward movement in workflow~ (changes only move forward)
