# Proposal: Workflow Board Enhancement

## Problem

The OpenSpec workflow board currently displays changes and their status, but lacks interactive controls to advance changes through the workflow. Users must:

1. Leave the site to create GitHub issues manually
2. Remember the exact change name and correct label
3. Know the issue body format expected by the GitHub Action

This friction breaks the flow and increases the chance of errors.

## Solution

Add three interactive entry points to the workflow board that open a shared wizard modal:

1. **[+ Start New Change]** button - Creates new changes from scratch
2. **[Advance]** button in modal - Moves existing changes to the next stage
3. **Drag-to-advance** - Drag cards between columns to advance

All three entry points open the same wizard that:
- Shows the opsx command being invoked
- Displays the change name (editable for new, fixed for existing)
- Provides a textarea for transcript/instructions
- Opens a pre-filled GitHub issue on submit

## Two Distinct Flows

### Flow A: New Change
User clicks [+ Start New Change] → enters change name → chooses explore or propose → adds transcript → creates issue

### Flow B: Existing Change
User clicks [Advance] or drags card → wizard pre-filled with change name and next action → adds optional context → creates issue

The key insight: **existing changes don't need fuzzy matching**. When advancing a known change, we pass the explicit change ID in the issue body so the GitHub Action skips matching logic.

## Scope

### In Scope
- [+ Start New Change] button on the board
- [Advance] button replacing "Next:" hint in modal footer
- Drag-to-advance between workflow columns
- Shared wizard modal component
- Direct GitHub issue URL construction (bypasses template picker)

### Out of Scope
- Changes to the GitHub Action itself (it already supports explicit change matching)
- New issue templates for apply/archive (URL construction handles this)
- Authentication or GitHub API integration (we open issues in browser)

## Success Criteria

1. User can start a new change without leaving the site until the final "Create Issue" step
2. User can advance any existing change with two clicks (open modal → click Advance → submit wizard)
3. Drag-to-advance provides a quick alternative to the button flow
4. GitHub issues are correctly formatted with change name and appropriate label
