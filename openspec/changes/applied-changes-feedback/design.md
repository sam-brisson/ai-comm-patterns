# Applied Changes Feedback Workflow Design

## Decision Framework

When users identify follow-up work while reviewing applied changes, guide them through a decision tree:

### 1. Bug Fixes or Missing Implementation
**Trigger**: Original change didn't fully deliver on its proposal
**Action**: Regenerate design/tasks for existing change
**Rationale**: Maintains change coherence and completion tracking

### 2. Enhancement or Extension
**Trigger**: New feature ideas that build directly on the implemented change
**Action**: Create new change with clear parent relationship
**Rationale**: Keeps changes focused while maintaining lineage

### 3. Related but Separate Initiative
**Trigger**: Inspired ideas that are thematically related but independently valuable
**Action**: Create new change without direct dependency
**Rationale**: Prevents scope creep while capturing insights

## UI Components

### Applied Change Review Interface

```
[Applied Change Card]
┌─────────────────────────────────┐
│ Change: workflow-board-enhancement │
│ Status: Applied ✅              │
│ ─────────────────────────────── │
│ [View Implementation]           │
│ [See Results]                   │
│ ─────────────────────────────── │
│ Follow-up Actions:              │
│ • [Report Issue] 🐛             │
│ • [Enhance This] ⚡             │
│ • [New Related Work] ✨         │
└─────────────────────────────────┘
```

### Smart Action Modal

When user clicks any follow-up action, show guided wizard:

```
Step 1: Describe what you want to work on
[Text area for description]

Step 2: AI suggests the best approach
○ Fix/Complete existing change "workflow-board-enhancement"
  - Regenerate design and tasks
  - Maintain change history
  
● Create new change "workflow-board-mobile-support"
  - Builds on: workflow-board-enhancement
  - Independent tracking and completion
  
○ Create independent change "mobile-responsive-design"
  - Related theme but separate initiative
  
[Why this recommendation?] [Override Suggestion]
```

## Workflow Integration

### Change Relationships

- **Parent/Child**: Enhancement changes link to original
- **Sibling**: Related changes from same applied change review
- **Evolution**: Fixes/completions of original change

### Archive Considerations

Applied changes with active follow-ups should show connection indicators:
- "2 active enhancements"
- "1 completion in progress"

This supports the archived changes exploration by showing ongoing evolution.