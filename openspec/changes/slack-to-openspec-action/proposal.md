## Why

Team discussions often contain valuable decisions about features and changes, but this context gets lost or requires manual transcription into OpenSpec artifacts. By automating the flow from conversation transcripts to OpenSpec updates via GitHub Actions, we capture decisions at the source and reduce friction in the sprint planning workflow.

## What Changes

- GitHub Action processes conversation transcripts submitted via GitHub Issues
- Two modes via issue labels: `propose` (update artifacts, create PR) and `explore` (analyze and update with refinements)
- Claude API analyzes transcripts and intelligently matches to existing changes (or suggests new ones)
- Support iterative updates via `/update` comment command on existing issues
- PR descriptions include Claude's reasoning: which changes were identified, confidence level, and suggestions
- Automatically adds new changes to the OpenSpecChanges component for display on the site

## Capabilities

### New Capabilities
- `transcript-analysis`: Analyze conversation transcripts to extract decisions, requirements, and action items relevant to OpenSpec changes
- `change-matching`: Match transcript content to existing OpenSpec changes or recommend creating new ones
- `artifact-updates`: Generate intelligent updates to proposal.md, design.md, and tasks.md based on transcript content

### Modified Capabilities

## Impact

- `.github/workflows/process-openspec-issue.yml` - processes issues labeled with `propose` or `explore`
- `.github/workflows/process-openspec-comment.yml` - handles `/update` command for iterative refinement
- `.github/scripts/process-openspec-conversation.js` - Claude API integration for analysis and artifact generation
- `.github/scripts/gather-openspec-context.js` - scans existing changes to provide context
- `src/components/OpenSpecChanges/index.tsx` - automatically updated when new changes are created
