# Inline Proposal Feedback System - Technical Design

## Architecture Overview

The inline feedback system will be implemented as a client-side modal component that integrates with the existing proposal viewer. The system will pre-populate GitHub issue creation forms and guide users through the OpenSpec workflow.

### Component Architecture

```
ProposalViewer
├── FeedbackButton (floating action button)
└── FeedbackModal
    ├── FeedbackForm
    │   ├── FeedbackTypeSelector
    │   ├── CommentTextArea
    │   └── SubmissionOptions
    └── WorkflowGuidance
```

## Component Specifications

### FeedbackButton
- **Location**: Floating action button positioned in bottom-right of proposal view
- **Trigger**: Opens FeedbackModal on click
- **Styling**: Primary color with comment icon, subtle animation to draw attention

### FeedbackModal
- **Framework**: Modal overlay with backdrop blur
- **Responsive**: Full-screen on mobile, centered dialog on desktop
- **Escape handling**: Close on ESC key or backdrop click

### FeedbackForm
**Fields:**
- Feedback type selector (radio buttons):
  - General comment
  - Suggest changes
  - Request clarification
  - Approve with notes
- Comment textarea with placeholder text:
  ```
  Share your feedback on this proposal...
  
  💡 Tip: You can include conversation transcripts, meeting notes, or other supporting materials after clicking Create to help advance this change through the OpenSpec workflow.
  ```
- Character counter (optional, for UX guidance)

### GitHub Integration

**Pre-population Strategy:**
- Generate issue title: `[Feedback] {proposal-name}: {feedback-type}`
- Issue body template:
  ```markdown
  ## Proposal
  [Link to proposal]
  
  ## Feedback Type
  {selected-type}
  
  ## Comments
  {user-input}
  
  ## Context
  - Reviewer: {github-username}
  - Date: {current-date}
  - Proposal Version: {commit-hash}
  
  ### Transcript (Optional)
  <!-- Add conversation transcripts, meeting notes, or other supporting materials here to help advance this change through the OpenSpec workflow -->
  ```

## Data Flow

1. **User Journey:**
   ```
   View Proposal → Click Feedback Button → Fill Form → Submit → 
   Redirect to GitHub → Complete Issue Creation
   ```

2. **State Management:**
   - Modal open/closed state
   - Form validation state
   - Proposal context (name, URL, commit hash)

3. **URL Generation:**
   - Construct GitHub "new issue" URL with pre-populated query parameters
   - Handle URL encoding for special characters in comments

## Integration Points

### Existing Systems
- **Proposal Viewer**: Inject feedback button and modal
- **GitHub**: Use GitHub's URL-based issue creation API
- **OpenSpec Metadata**: Extract proposal name, version, and context

### Dependencies
- No new backend dependencies required
- Client-side JavaScript for modal functionality
- CSS for styling and responsive design
- GitHub's web interface for issue creation

## Error Handling

### Client-Side Errors
- **Form Validation**: Prevent submission with empty required fields
- **URL Generation Failure**: Show error message with fallback GitHub link
- **Modal Rendering Issues**: Graceful degradation to simple link

### User Experience
- **Offline Handling**: Detect offline state, show appropriate message
- **GitHub Unavailable**: Provide alternative feedback instructions
- **Browser Compatibility**: Fallback for older browsers without modal support

## Performance Considerations

- **Lazy Loading**: Load modal component only when needed
- **Bundle Size**: Keep modal JavaScript lightweight
- **GitHub Redirect**: Minimize time between form submission and GitHub redirect

## Security Considerations

- **XSS Prevention**: Sanitize all user input before URL encoding
- **URL Length Limits**: Truncate extremely long comments with continuation notice
- **GitHub Token**: No tokens stored or transmitted (using public URLs)

## Testing Strategy

### Unit Tests
- Modal open/close functionality
- Form validation logic
- URL generation with various input scenarios
- Error state handling

### Integration Tests
- End-to-end feedback submission flow
- GitHub URL pre-population accuracy
- Cross-browser modal functionality

### User Acceptance Tests
- Feedback workflow completion rates
- User experience validation with real proposals
- Mobile device testing

## Accessibility

- **Keyboard Navigation**: Full keyboard support for modal and form
- **Screen Reader**: ARIA labels and proper heading structure
- **Focus Management**: Return focus appropriately on modal close
- **Color Contrast**: Meet WCAG guidelines for all interactive elements

## Future Enhancements

- **Draft Saving**: Local storage for form drafts
- **Feedback Preview**: Show how the GitHub issue will appear
- **Integration Expansion**: Support for other issue tracking systems
- **Analytics**: Track feedback submission rates and user engagement