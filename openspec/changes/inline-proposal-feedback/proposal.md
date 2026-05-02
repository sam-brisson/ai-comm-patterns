# Inline Proposal Feedback System

## Why

The current workflow for providing feedback on proposed changes requires users to navigate away from the proposal view to submit comments through GitHub issues or other external systems. This breaks the review flow and creates friction that can lead to:

1. **Lost context**: Reviewers lose their place in the proposal when navigating away
2. **Reduced feedback**: The extra steps discourage quick, contextual feedback
3. **Disconnected discussions**: Feedback gets scattered across different platforms
4. **Workflow confusion**: Users aren't reminded of the next steps in the OpenSpec workflow

When reviewing proposals, team members should be able to provide immediate, contextual feedback without losing their place. Additionally, since our workflow supports advancing changes via conversation transcripts, the interface should guide users toward this capability.

## What Changes

### Inline Comment System
- Add a feedback comment box directly within the proposal view
- Allow users to submit comments without leaving the current page
- Display existing feedback/comments in-line with the proposal content
- Integrate with existing GitHub-based workflow for persistence

### Workflow Guidance Integration
- Add contextual reminders about transcript-based workflow advancement
- Inform users they can paste full conversation transcripts when moving to next stage
- Connect to existing `transcript-to-openspec-action` functionality
- Provide clear call-to-action for advancing changes through the workflow

### User Experience Improvements
- Maintain user's reading position when submitting feedback
- Provide immediate visual confirmation of submitted comments
- Streamline the path from proposal review to workflow advancement

This enhancement supports the OpenSpec philosophy of reducing friction in the development workflow while maintaining the GitHub-based infrastructure that powers our change management system.