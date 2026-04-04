## 1. Workflow Setup

- [x] 1.1 Rename workflow file from `process-article-issue.yml` to `process-openspec-issue.yml`
- [x] 1.2 Update workflow triggers to handle `propose` and `explore` labels
- [x] 1.3 Add `openspec` npm package to workflow dependencies
- [x] 1.4 Remove article-specific issue template requirements

## 2. Context Gathering

- [x] 2.1 Add step to scan `openspec/changes/*/proposal.md` for existing changes
- [x] 2.2 Create summary of each change (name + first few lines of proposal)
- [x] 2.3 Read `openspec` artifact templates via `openspec instructions`

## 3. Claude API Integration

- [x] 3.1 Create new prompt for conversation analysis (extract decisions, requirements, action items)
- [x] 3.2 Create prompt for change matching (compare conversation to existing changes)
- [x] 3.3 Create prompt for artifact generation (update/create proposal, design, tasks)
- [x] 3.4 Update `generate-with-claude.js` to support new prompts and modes

## 4. Propose Mode Implementation

- [x] 4.1 Implement change matching logic (call Claude with conversation + change summaries)
- [x] 4.2 Handle "no match" case: create new change via `openspec new change`
- [x] 4.3 Generate artifact updates based on conversation content
- [x] 4.4 Write updated artifacts to change directory
- [x] 4.5 Create PR with analysis in description

## 5. Explore Mode Implementation

- [x] 5.1 Implement explore-only analysis (no file changes)
- [x] 5.2 Format analysis as structured issue comment
- [x] 5.3 Post comment to original issue via GitHub API

## 6. PR Description Generation

- [x] 6.1 Include matched change name(s) and confidence levels
- [x] 6.2 List files changed with brief explanation of each
- [x] 6.3 Add suggestions section (related changes, open questions)
- [x] 6.4 Include link back to original issue

## 7. Error Handling

- [x] 7.1 Handle empty/trivial conversations gracefully
- [x] 7.2 Handle Claude API failures with retry and informative error
- [x] 7.3 Post error details as issue comment when workflow fails
- [x] 7.4 Handle branch conflicts (existing branch from previous run)

## 8. Testing (Manual - requires deployment)

- [ ] 8.1 Test with conversation matching existing change
- [ ] 8.2 Test with conversation requiring new change creation
- [ ] 8.3 Test with ambiguous conversation (multiple potential matches)
- [ ] 8.4 Test explore mode (comment only, no PR)
- [ ] 8.5 Test error cases (empty conversation, API failure)
