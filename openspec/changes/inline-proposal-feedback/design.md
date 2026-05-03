# Design: Inline Proposal Feedback System

## Overview

Add an inline comment system directly within proposal views to enable contextual feedback without breaking the review flow. The design prioritizes simplicity and clear next-step guidance while supporting OpenSpec's conversation-driven workflow advancement.

## Architecture

### Component Structure
```
ProposalView/
├── ProposalContent (existing)
├── InlineFeedbackSection (new)
│   ├── CommentBox
│   ├── WorkflowGuidance
│   └── FeedbackDisplay
└── ProposalHeader (existing)
```

### Data Flow
1. User enters feedback in inline comment box
2. Comments stored locally (browser storage) until submitted
3. Submission creates GitHub issue with structured format
4. GitHub Action processes feedback and updates artifacts
5. UI refreshes to show updated proposal state

## User Interface Design

### Feedback Section Layout

Positioned at the bottom of each proposal view:

```
[Proposal Content Above]

─────────────────────────────────────

💬 Provide Feedback

┌─────────────────────────────────────┐
│ Share your thoughts on this         │
│ proposal...                         │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘

[Submit Feedback]  [Advance to Design]

💡 Your feedback will be processed automatically
   and may update this proposal or advance it
   to the design phase.
```

### Comment Box Specifications
- Multi-line textarea with 4-row minimum height
- Placeholder text: "Share your thoughts on this proposal..."
- Auto-resize as user types
- Character limit: 2000 characters with counter
- Markdown preview toggle option

### Action Buttons
- **Submit Feedback**: Primary button, submits comment only
- **Advance to Design**: Secondary button, advances workflow with optional comment
- Both buttons show loading state during submission

### Workflow Guidance
Clear explanation text below the comment box:
"💡 Your feedback will be processed automatically and may update this proposal or advance it to the design phase."

## Technical Implementation

### Frontend Components

#### FeedbackSection Component
```typescript
interface FeedbackSectionProps {
  changeName: string;
  currentStatus: 'proposed' | 'design' | 'tasks' | 'applied';
  onFeedbackSubmitted: () => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  changeName,
  currentStatus,
  onFeedbackSubmitted
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Implementation details...
};
```

#### CommentBox Component
```typescript
interface CommentBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  disabled: boolean;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  value,
  onChange,
  placeholder,
  maxLength,
  disabled
}) => {
  // Auto-resize textarea implementation
  // Character counter
  // Markdown preview toggle
};
```

### GitHub Integration

#### Issue Creation Format
When feedback is submitted, create GitHub issue with:

```
Title: "Feedback on [change-name] proposal"
Labels: ["feedback", "proposal"]
Body:
---
Change: [change-name]
Type: feedback
Source: inline-comment

## Feedback

[User's comment text]

---
Submitted via OpenSpec inline feedback system
```

#### Workflow Advancement Format
When "Advance to Design" is clicked:

```
Title: "Advance [change-name] to design"
Labels: ["advance", "design"]
Body:
---
Change: [change-name]
Type: advance
Target: design

## Additional Context

[User's comment if provided]

---
Advanced via OpenSpec inline feedback system
```

### Local Storage Integration

#### Draft Persistence
```typescript
interface CommentDraft {
  changeName: string;
  content: string;
  timestamp: number;
}

// Save draft as user types (debounced)
const saveDraft = (changeName: string, content: string) => {
  const draft: CommentDraft = {
    changeName,
    content,
    timestamp: Date.now()
  };
  localStorage.setItem(`feedback-draft-${changeName}`, JSON.stringify(draft));
};

// Load draft on component mount
const loadDraft = (changeName: string): string => {
  const stored = localStorage.getItem(`feedback-draft-${changeName}`);
  if (!stored) return '';
  
  const draft: CommentDraft = JSON.parse(stored);
  
  // Clear drafts older than 7 days
  if (Date.now() - draft.timestamp > 7 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem(`feedback-draft-${changeName}`);
    return '';
  }
  
  return draft.content;
};
```

## User Experience Flow

### Primary Feedback Flow
1. User reads proposal
2. User scrolls to feedback section at bottom
3. User types comment in text box (auto-saved as draft)
4. User clicks "Submit Feedback"
5. Loading state shows briefly
6. Success message appears: "Feedback submitted! It will be processed automatically."
7. Comment box clears, draft removed
8. Page may refresh if proposal gets updated by GitHub Action

### Advancement Flow
1. User reads proposal
2. User decides proposal is ready to advance
3. User optionally adds context comment
4. User clicks "Advance to Design"
5. Loading state shows
6. Success message: "Change advanced to design phase!"
7. User redirected to design view or workflow board

## Error Handling

### Network Errors
- Show retry button if GitHub API fails
- Preserve comment content during retry
- Clear error messaging

### Validation Errors
- Show inline validation for empty comments when required
- Character limit enforcement with helpful messaging
- Disable submit button until valid

### GitHub API Errors
- Show user-friendly error messages
- Log technical details to console
- Preserve user's comment for retry

## Mobile Considerations

### Responsive Design
- Comment box maintains usable height on mobile
- Action buttons stack vertically on narrow screens
- Touch-friendly button sizing (minimum 44px)
- Appropriate font sizing for mobile text input

### Performance
- Lazy load feedback section component
- Debounce draft saving to avoid excessive localStorage writes
- Minimize re-renders during typing

## Integration Points

### With Existing Proposal Views
- Add `<FeedbackSection>` component to all proposal view pages
- Pass through `changeName` and current status
- Handle feedback submission callbacks

### With GitHub Actions
- Ensure issue format matches existing action expectations
- Test both feedback and advancement issue types
- Verify label-based routing works correctly

### With Workflow Board
- Feedback submission may trigger workflow board updates
- Consider real-time updates or refresh patterns
- Ensure advancement redirects work properly

## Success Metrics

### User Engagement
- Track feedback submission rate per proposal view
- Monitor advancement usage vs external GitHub issue creation
- Measure time from proposal view to feedback submission

### Workflow Improvement
- Reduced external GitHub issue creation for simple feedback
- Faster feedback cycles on proposals
- Higher engagement rates on proposal reviews

## Future Enhancements

### Phase 2 Possibilities
- Real-time collaborative comments
- @mention support for team members
- Comment threading and replies
- Feedback categorization (question, suggestion, concern)
- Integration with team chat systems

### Advanced Features
- Inline editing of proposal text with suggestion mode
- Voice-to-text comment input
- Rich text formatting in comments
- Attachment support for mockups or diagrams