## Context

The repository has a GitHub Action workflow that processes conversation transcripts from GitHub Issues and generates or updates OpenSpec change artifacts. This enables a low-friction workflow where team discussions can be captured and translated into structured change documentation.

The infrastructure includes:
- GitHub Actions with Claude API integration
- `openspec` CLI tool (npm package) for managing changes
- Existing changes in `openspec/changes/*/`
- OpenSpecChanges React component for displaying changes on the site
- GitHubProjectBoard component for tracking issues

## Goals / Non-Goals

**Goals:**
- Enable zero-friction flow: Conversation transcript → GitHub Issue → OpenSpec artifact updates
- Intelligently match conversations to existing changes without requiring user to specify
- Support both "propose" (create/update artifacts) and "explore" (analyze and refine) modes
- Allow iterative updates via comment commands
- Provide clear reasoning in PRs so humans can review Claude's decisions
- Handle edge cases gracefully (no matches, multiple matches, ambiguous content)

**Non-Goals:**
- Direct Slack integration (future enhancement - see separate change)
- Real-time monitoring (manual trigger via issue creation)
- Replacing interactive Claude Code sessions for deep exploration
- Supporting changes across multiple repos

## Decisions

### 1. Single workflow with label-based branching

**Decision**: One workflow file triggered by `labeled` event, branching on label type (`propose` vs `explore`).

**Alternatives considered**:
- Separate workflow files per mode → More duplication, harder to maintain
- Single label with mode in issue body → More parsing, easier to get wrong

**Rationale**: Labels are visible, easy to change, and integrate well with GitHub's UI.

### 2. Claude scans all changes for matching

**Decision**: On each run, gather summaries of all `openspec/changes/*/proposal.md` files and include in Claude's context. Claude decides which change(s) to update.

**Alternatives considered**:
- Require user to specify change name → Adds friction, defeats purpose
- Use embeddings/vector search → Over-engineering for expected scale (<50 changes)
- Match on keywords only → Too brittle, misses semantic connections

**Rationale**: With weekly sprint planning cadence and modest number of changes, full-context approach is simple and effective.

### 3. PR as the review interface

**Decision**: Always create a PR (for both modes). PR description includes Claude's analysis: matched change(s), confidence, reasoning, and suggestions.

**Alternatives considered**:
- Commit directly to main → No review, dangerous
- Create draft PR → Adds extra step to mark ready
- Post to issue only → Doesn't show file diffs

**Rationale**: PRs are the natural review surface. Humans approve or reject Claude's suggestions via normal PR workflow.

### 4. Explore mode updates artifacts with refinements

**Decision**: For `explore` label, Claude analyzes the conversation, identifies refinements, and updates artifacts accordingly. Also posts structured analysis as issue comment.

**Alternatives considered**:
- Analysis only (no artifact changes) → Less useful, doesn't capture insights
- Create exploration notes file → Clutters repo with temporary content

**Rationale**: Exploration discussions often contain valuable refinements. Capturing these in artifacts (with PR review) is more useful than just comments.

### 5. Create new changes when no match found

**Decision**: If Claude determines the conversation represents a genuinely new initiative, create a new change directory and populate initial artifacts. Also add entry to OpenSpecChanges component.

**Alternatives considered**:
- Fail and ask user to create manually → Adds friction
- Always require existing change → Limits usefulness

**Rationale**: The "new change" case is valid for sprint planning. Claude can suggest a name; human approves via PR review.

### 6. Comment-triggered iterative updates

**Decision**: Support `/update` command in issue comments to trigger re-analysis with new context. Updates existing PR branch if one exists.

**Alternatives considered**:
- New issue for each update → Clutters issue tracker
- Manual re-labeling → Confusing workflow

**Rationale**: Conversations evolve. The `/update` command allows iterative refinement without creating new issues.

### 7. Retry logic for API reliability

**Decision**: Implement exponential backoff retry for transient API errors (529 Overloaded, 503, 500).

**Alternatives considered**:
- Fail immediately → Poor UX, requires manual re-run
- Fixed delay retry → Less efficient

**Rationale**: Transient errors are common with LLM APIs. Automatic retry improves reliability.

### 8. Automatic component registration

**Decision**: When creating a new change, automatically add an entry to the OpenSpecChanges React component so it appears on the site.

**Alternatives considered**:
- Manual registration → Easy to forget, extra step
- Scan directory at runtime → Would work but adds complexity

**Rationale**: Keeping the component in sync with changes reduces manual work and ensures visibility.

## Risks / Trade-offs

**[Risk] Claude misidentifies the relevant change**
→ Mitigation: PR review catches this. PR description explains reasoning so reviewer can verify. Include confidence indicator.

**[Risk] Conversation is too vague for meaningful updates**
→ Mitigation: Claude can decline to make changes and post a comment asking for clarification or suggesting explore mode.

**[Risk] Large conversations exceed context limits**
→ Mitigation: Summarize existing artifacts rather than including full text. Truncate very long conversations with note.

**[Risk] Multiple concurrent issues updating same change**
→ Mitigation: Each PR is on a separate branch. Merge conflicts surface naturally. Could add concurrency limits later if needed.

**[Trade-off] Less codebase awareness than interactive Claude Code**
→ Accepted: This flow is for capturing decisions, not deep technical design. Users can still use Claude Code for that.
