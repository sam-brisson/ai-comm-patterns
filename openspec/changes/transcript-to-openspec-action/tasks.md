## 1. Workflow Setup

- [x] 1.1 Rename workflow file from `process-article-issue.yml` to `process-openspec-issue.yml`
- [x] 1.2 Update workflow triggers to handle `propose` and `explore` labels
- [x] 1.3 Add `@anthropic-ai/sdk` npm package to workflow dependencies
- [x] 1.4 Remove article-specific issue template requirements

## 2. Context Gathering

- [x] 2.1 Add step to scan `openspec/changes/*/proposal.md` for existing changes
- [x] 2.2 Create summary of each change (name + proposal excerpt + task completion)
- [x] 2.3 Create `gather-openspec-context.js` script to build context JSON

## 3. Claude API Integration

- [x] 3.1 Create prompt for conversation analysis (extract decisions, requirements, action items)
- [x] 3.2 Create prompt for change matching (compare conversation to existing changes)
- [x] 3.3 Create prompt for artifact generation (update/create proposal, design, tasks)
- [x] 3.4 Create `process-openspec-conversation.js` for Claude API calls
- [x] 3.5 Add retry logic with exponential backoff for transient API errors

## 4. Propose Mode Implementation

- [x] 4.1 Implement change matching logic (call Claude with conversation + change summaries)
- [x] 4.2 Handle "no match" case: create new change directory
- [x] 4.3 Generate artifact updates based on conversation content
- [x] 4.4 Write updated artifacts to change directory
- [x] 4.5 Create PR with analysis in description
- [x] 4.6 Add entry to OpenSpecChanges component for new changes

## 5. Explore Mode Implementation

- [x] 5.1 Implement explore analysis with artifact updates
- [x] 5.2 Format analysis as structured issue comment
- [x] 5.3 Post comment to original issue via GitHub API
- [x] 5.4 Create PR with refinements

## 6. Comment-Triggered Updates

- [x] 6.1 Create `process-openspec-comment.yml` workflow
- [x] 6.2 Trigger on `/update` command in issue comments
- [x] 6.3 Gather full conversation including all comments
- [x] 6.4 Update existing PR branch or create new one
- [x] 6.5 Add reaction indicators (👀 processing, 🚀 complete)

## 7. PR Description Generation

- [x] 7.1 Include matched change name(s) and confidence levels
- [x] 7.2 List files changed with brief explanation of each
- [x] 7.3 Add suggestions section (related changes, open questions)
- [x] 7.4 Include link back to original issue

## 8. Error Handling

- [x] 8.1 Handle empty/trivial conversations gracefully
- [x] 8.2 Handle Claude API failures with retry and informative error
- [x] 8.3 Handle branch conflicts (existing branch from previous run)

## 9. Testing (Manual - requires deployment)

- [ ] 9.1 Test with conversation matching existing change
- [ ] 9.2 Test with conversation requiring new change creation
- [ ] 9.3 Test with ambiguous conversation (multiple potential matches)
- [ ] 9.4 Test explore mode with artifact updates
- [ ] 9.5 Test `/update` comment command
- [ ] 9.6 Test error cases (empty conversation, API failure)
