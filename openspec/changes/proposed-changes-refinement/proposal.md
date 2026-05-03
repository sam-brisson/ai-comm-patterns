# Proposed Changes Refinement Workflow

## Why

When users review proposed changes on the workflow board, they often realize the proposal needs refinement or adjustment before moving forward. Currently, there's no clear path for providing targeted feedback to guide the proposal in a different direction or making direct edits to improve the proposal.

The workflow board has become a central hub for understanding all work in progress, which creates opportunities for users to take various actions when reviewing changes. However, the interface doesn't provide natural entry points for common scenarios like:

1. **Proposal needs direction change**: User sees a proposal but wants to suggest a different approach or focus
2. **Proposal needs editing**: User spots issues or improvements that could be made directly to the proposal text
3. **Proposal needs additional context**: User has insights that should be incorporated before the change advances

Without these refinement pathways, proposals may advance to design phase with fundamental issues, or valuable feedback gets lost because there's no convenient way to provide it.

## What Changes

### Proposal Refinement Actions

- Add "Refine" action button to proposed changes on the workflow board
- Provide two refinement pathways:
  1. **Guided Feedback**: Modal form for providing structured feedback to redirect the proposal
  2. **Direct Edit**: Link to GitHub editor for making direct text changes to the proposal

### Workflow Board Action Framework

- Establish patterns for contextual actions users can take on different change statuses
- Design extensible action system that can support future workflow enhancements
- Ensure actions integrate with existing GitHub Action automation

### User Experience Flow

- Users reviewing the workflow board can immediately act on changes they want to influence
- Feedback flows through the same transcript-to-OpenSpec pipeline for consistency
- Direct edits create pull requests with clear context about the refinement

## Success Criteria

- Users can provide refinement feedback without leaving the workflow board context
- Proposal improvements can be made either through guided feedback or direct editing
- The workflow board becomes a more interactive hub for managing changes
- Refinement actions integrate smoothly with existing automation