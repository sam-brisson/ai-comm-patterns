# Design: Workflow Board Enhancement

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OpenSpecWorkflowBoard                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ [+ Start New Change]                                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Exploring  │  │  Proposed  │  │  Applied   │  │  Archived  │        │
│  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤        │
│  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ │  │            │        │
│  │ │  Card  │─┼──┼▶│  Card  │─┼──┼▶│  Card  │─┼──┼▶ Archive   │        │
│  │ └────────┘ │  │ └────────┘ │  │ └────────┘ │  │            │        │
│  │  (drag)    │  │            │  │            │  │            │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     ChangeDetailModal                             │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ [Proposal] [Design] [Tasks]  ← artifact tabs               │  │   │
│  │  │ content...                                                  │  │   │
│  │  ├────────────────────────────────────────────────────────────┤  │   │
│  │  │ [View Result]           [Advance to Proposed ▶]            │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     AdvanceWizardModal                            │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ Action: /opsx:propose                                      │  │   │
│  │  │ Change: [workflow-board-enhancement]  (editable if new)    │  │   │
│  │  ├────────────────────────────────────────────────────────────┤  │   │
│  │  │ ┌──────────────────────────────────────────────────────┐   │  │   │
│  │  │ │ Instructions / Transcript                            │   │  │   │
│  │  │ │                                                      │   │  │   │
│  │  │ └──────────────────────────────────────────────────────┘   │  │   │
│  │  ├────────────────────────────────────────────────────────────┤  │   │
│  │  │ [Cancel]                        [Create GitHub Issue ▶]    │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Structure

### State Management

```typescript
// Existing state
const [selectedChange, setSelectedChange] = useState<Change | null>(null);
const [selectedArtifact, setSelectedArtifact] = useState<ArtifactType | null>(null);

// New state for wizard
const [wizardState, setWizardState] = useState<{
  isOpen: boolean;
  mode: 'new' | 'advance';
  changeName: string;        // editable for 'new', fixed for 'advance'
  action: 'explore' | 'propose' | 'apply' | 'archive';
  transcript: string;
} | null>(null);

// Drag state
const [draggedChange, setDraggedChange] = useState<Change | null>(null);
const [dropTarget, setDropTarget] = useState<string | null>(null);
```

### Action Mapping

```typescript
const WORKFLOW_STAGES = [
  {
    id: 'exploring',
    label: 'Exploring',
    color: '#6366F1',
    nextAction: { label: 'Advance to Proposed', command: 'propose' }
  },
  {
    id: 'proposed',
    label: 'Proposed',
    color: '#F59E0B',
    nextAction: { label: 'Advance to Applied', command: 'apply' }
  },
  {
    id: 'applied',
    label: 'Applied',
    color: '#10B981',
    nextAction: { label: 'Archive Change', command: 'archive' }
  },
];
```

## Wizard Modal Behavior

### Opening the Wizard

| Trigger | Mode | Change Name | Action |
|---------|------|-------------|--------|
| [+ Start New Change] | `new` | User enters | User chooses `explore` or `propose` |
| [Advance] button | `advance` | From selected change | Next action for current stage |
| Drag to next column | `advance` | From dragged change | Action for target stage |

### New Change Flow

```
┌─────────────────────────────────────────────────────┐
│ Start New Change                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Change Name:                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ my-new-feature                                  │ │
│ └─────────────────────────────────────────────────┘ │
│ (kebab-case, will become folder name)               │
│                                                      │
│ How do you want to start?                           │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Explore first - I have a vague idea           │ │
│ │ ● Propose now   - I know what I want            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Transcript / Instructions:                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Paste your conversation or describe what you    │ │
│ │ want to build...                                │ │
│ │                                                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ [Cancel]                    [Create GitHub Issue ▶] │
└─────────────────────────────────────────────────────┘
```

### Advance Change Flow

```
┌─────────────────────────────────────────────────────┐
│ Advance to Proposed                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Change: workflow-board-enhancement                  │
│ Action: /opsx:propose                               │
│                                                      │
│ Additional Context (optional):                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Add any new transcript, instructions, or        │ │
│ │ context for this step...                        │ │
│ │                                                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ [Cancel]                    [Create GitHub Issue ▶] │
└─────────────────────────────────────────────────────┘
```

## GitHub Issue URL Construction

Instead of using issue templates, we construct the URL directly:

```typescript
function buildGitHubIssueUrl(
  changeName: string,
  action: 'explore' | 'propose' | 'apply' | 'archive',
  transcript: string
): string {
  const baseUrl = 'https://github.com/owner/repo/issues/new';

  const title = `[${action.toUpperCase()}]: ${changeName}`;
  const label = action;  // 'explore', 'propose', 'apply', or 'archive'

  const body = `### Change
${changeName}

### Instructions
${transcript || '(No additional context provided)'}`;

  const params = new URLSearchParams({
    title,
    labels: label,
    body,
  });

  return `${baseUrl}?${params.toString()}`;
}
```

### Why Direct URL Instead of Templates?

1. **Simpler** - No need to maintain 4 separate issue templates
2. **Pre-filled** - User sees exactly what will be submitted
3. **Consistent** - Wizard controls the format, not template variations
4. **Flexible** - Easy to add fields without template changes

## Drag and Drop Implementation

```typescript
// On card drag start
const handleDragStart = (change: Change) => {
  setDraggedChange(change);
};

// On column drag over
const handleDragOver = (stageId: string, e: DragEvent) => {
  e.preventDefault();
  const currentIndex = WORKFLOW_STAGES.findIndex(s => s.id === draggedChange?.workflowStatus);
  const targetIndex = WORKFLOW_STAGES.findIndex(s => s.id === stageId);

  // Only allow forward movement by one stage
  if (targetIndex === currentIndex + 1) {
    setDropTarget(stageId);
  }
};

// On drop
const handleDrop = (targetStageId: string) => {
  if (draggedChange && dropTarget) {
    const targetStage = WORKFLOW_STAGES.find(s => s.id === targetStageId);
    openWizard({
      mode: 'advance',
      changeName: draggedChange.id,
      action: targetStage?.nextAction?.command || 'propose',
    });
  }
  setDraggedChange(null);
  setDropTarget(null);
};
```

### Drag Constraints

- Cards can only move **forward** by **one stage**
- Exploring → Proposed (not directly to Applied)
- Visual feedback shows valid drop targets
- Invalid drops are ignored (no error, just no-op)

## Styling Considerations

### Add Button Placement

```css
.addButton {
  /* Positioned above the board */
  margin-bottom: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--ifm-color-primary);
  border-radius: 6px;
  cursor: pointer;
}
```

### Advance Button (replaces hint)

```css
.advanceButton {
  /* Replaces the nextActionHint */
  padding: 0.5rem 1rem;
  background: var(--ifm-color-primary);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advanceButton::after {
  content: '▶';
  font-size: 0.75rem;
}
```

### Drag Feedback

```css
.column.dropTarget {
  background: rgba(99, 102, 241, 0.1);
  border: 2px dashed var(--ifm-color-primary);
}

.changeCard.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
}
```

## Configuration

The GitHub repo URL should be configurable:

```typescript
// Could come from docusaurus.config.js or environment
const GITHUB_REPO_URL = 'https://github.com/owner/repo';
```

For now, we can read this from the site config or hardcode for the knowledge-site repo.
