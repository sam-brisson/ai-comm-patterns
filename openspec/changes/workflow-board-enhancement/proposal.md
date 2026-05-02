# Proposal: Workflow Board Enhancement

## Problem

The OpenSpec workflow board currently displays changes and their status, but lacks interactive controls to advance changes through the workflow. Users must:

1. Leave the site to create GitHub issues manually
2. Remember the exact change name and correct label
3. Know the issue body format expected by the GitHub Action

Additionally, as the number of active changes grows, users need a way to quickly find specific changes on the board without manually scanning through all displayed items.

## Solution

Add three interactive entry points to the workflow board that open a shared wizard modal:

1. **[+ Start New Change]** button - Creates new changes from scratch
2. **[Advance]** button in modal - Moves existing changes to the next stage
3. **Drag-to-advance** - Drag cards between columns to advance

All three entry points open the same wizard that:
- Shows the opsx command being invoked
- Displays the change name (editable for new, fixed for existing)
- Provides a textarea for transcript/instructions
- Opens a pre-filled GitHub issue on submission

### Search Functionality

Add search capability to help users quickly locate specific changes:
- Search input field prominently displayed above the workflow board
- Real-time filtering of displayed changes as user types
- Search matches change names, descriptions, and tags
- Clear visual indication when search is active (showing "X of Y changes")
- Easy search reset/clear functionality