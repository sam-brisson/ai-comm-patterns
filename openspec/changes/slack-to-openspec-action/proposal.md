## Why

Team discussions in Slack often contain valuable decisions about features and changes, but this context gets lost or requires manual transcription into OpenSpec artifacts. By automating the flow from Slack conversation to OpenSpec updates via GitHub Actions, we capture decisions at the source and reduce friction in the sprint planning workflow.

## What Changes

- Replace the current "article generation" GitHub Action with an OpenSpec-aware workflow
- GitHub Action will scan all existing `openspec/changes/*` to understand current state
- Claude API analyzes Slack conversations and intelligently matches to existing changes (or suggests new ones)
- PR descriptions include Claude's reasoning: which changes were identified, confidence level, and suggestions
- Support two modes via labels: `propose` (update artifacts, create PR) and `explore` (analyze only, post comment)
- Zero formatting requirements on the Slack-to-Issue step - just raw conversation

## Capabilities

### New Capabilities
- `slack-conversation-analysis`: Analyze Slack conversations to extract decisions, requirements, and action items relevant to OpenSpec changes
- `change-matching`: Match conversation content to existing OpenSpec changes or recommend creating new ones
- `artifact-updates`: Generate intelligent updates to proposal.md, design.md, and tasks.md based on conversation content

### Modified Capabilities

## Impact

- `.github/workflows/process-article-issue.yml` - major rewrite to handle OpenSpec instead of articles
- `.github/scripts/generate-with-claude.js` - replace or significantly modify for OpenSpec artifact generation
- New Claude API prompts needed for conversation analysis and artifact generation
- GitHub Issue templates may need updating (or removal of strict formatting)
- PR template changes to include Claude's analysis and suggestions
