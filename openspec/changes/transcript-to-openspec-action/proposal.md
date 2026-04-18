## Why

Team discussions often contain valuable decisions about features and changes, but this context gets lost or requires manual transcription into OpenSpec artifacts. By automating the flow from conversation transcripts to OpenSpec updates via GitHub Actions, we capture decisions at the source and reduce friction in the sprint planning workflow.

Additionally, our working theory is that knowledge is derived from OpenSpec changes - therefore the OpenSpec Changes page should be a living repository that surfaces changes, their artifacts, and results consistently. This supports a closed loop driven by conversations where insights from discussions automatically flow into our knowledge base.

## What Changes

- GitHub Action processes conversation transcripts submitted via GitHub Issues
- Two modes via issue labels: `propose` (update artifacts, create PR) and `explore` (analyze and update with refinements)
- Claude API analyzes transcripts and intelligently matches to existing changes (or suggests new ones)
- Support iterative updates via `/update` comment command on existing issues
- PR descriptions include Claude's reasoning: which changes were identified, confidence level, and suggestions
- Automatically adds new changes to the OpenSpecChanges component for display on the site
- Ensures consistent surfacing of changes, artifacts, and results on the site to maintain the living repository approach

## Capabilities

### New Capabilities
- `transcript-analysis`: Process conversation transcripts to identify decisions, requirements, and actionable items
- `change-matching`: Intelligently match conversation content to existing OpenSpec changes with confidence scoring
- `artifact-updates`: Automatically update proposal.md, design.md, and tasks.md based on conversation insights
- `new-change-creation`: Suggest and create new changes when conversations don't match existing work
- `iterative-refinement`: Support multiple conversation rounds on the same topic via comment updates
- `living-repository-maintenance`: Ensure new changes are consistently surfaced on the OpenSpec Changes page as part of the conversation-driven workflow

### Integration Points
- GitHub Issues API for transcript submission
- GitHub Actions for automation workflow
- Claude API for intelligent analysis
- OpenSpecChanges React component for site display
- Existing change artifacts (proposal.md, design.md, tasks.md)
- Pull Request workflow for review and approval