## Context

Currently, the repo has a GitHub Action (`process-article-issue.yml`) that generates knowledge articles from Slack conversations dropped into GitHub Issues. The team wants to pivot this to instead update OpenSpec change artifacts, enabling a "Slack to sprint planning" workflow.

The existing infrastructure includes:
- GitHub Actions with Claude API integration
- `openspec` CLI tool (npm package) for managing changes
- Existing changes in `openspec/changes/*/`
- GitHub Slack integration for creating issues from messages

## Goals / Non-Goals

**Goals:**
- Enable zero-friction flow: Slack thread → GitHub Issue → OpenSpec artifact updates
- Intelligently match conversations to existing changes without requiring user to specify
- Support both "propose" (update artifacts) and "explore" (analyze only) modes
- Provide clear reasoning in PRs so humans can review Claude's decisions
- Handle edge cases gracefully (no matches, multiple matches, ambiguous content)

**Non-Goals:**
- Building a custom Slack bot (use native GitHub integration)
- Real-time Slack monitoring (manual trigger via issue creation)
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

**Decision**: Always create a PR (for `propose` mode). PR description includes Claude's analysis: matched change(s), confidence, reasoning, and suggestions.

**Alternatives considered**:
- Commit directly to main → No review, dangerous
- Create draft PR → Adds extra step to mark ready
- Post to issue only → Doesn't show file diffs

**Rationale**: PRs are the natural review surface. Humans approve or reject Claude's suggestions via normal PR workflow.

### 4. Explore mode posts comment (no PR)

**Decision**: For `explore` label, Claude analyzes and posts a structured comment on the issue. No file changes.

**Alternatives considered**:
- Create exploration notes file → Clutters repo with temporary content
- Still create PR with "suggestions" → Confuses explore vs propose intent

**Rationale**: Exploration is about thinking, not committing. Issue comments capture insights without requiring merge decisions.

### 5. Create new changes when no match found

**Decision**: If Claude determines the conversation represents a genuinely new initiative, create a new change directory and populate initial artifacts.

**Alternatives considered**:
- Fail and ask user to create manually → Adds friction
- Always require existing change → Limits usefulness

**Rationale**: The "new change" case is valid for sprint planning. Claude can suggest a name; human approves via PR review.

### 6. Reuse openspec CLI for artifact generation

**Decision**: Install `openspec` in the Action, use `openspec instructions` to get templates and rules, then have Claude fill them in.

**Alternatives considered**:
- Hardcode templates in the Action → Drifts from openspec standards
- Call Claude without templates → Inconsistent artifact format

**Rationale**: Leveraging `openspec instructions` ensures artifacts follow project conventions and stay in sync with schema updates.

### 7. Summary message convention for Slack threads

**Decision**: Use team convention where someone posts a summary message at the end of a discussion, then creates the GitHub issue from that summary message.

**Alternatives considered**:
- Full thread capture via native integration → Not supported (only captures single message)
- Custom Slack bot to fetch threads → Adds infrastructure to build/maintain
- Slack Workflow Builder → Medium complexity, requires Slack admin setup
- Manual copy-paste of full thread → Works but adds friction

**Rationale**: The summary convention is zero-infrastructure and often produces better input for Claude than raw thread noise. It forces someone to synthesize the discussion, which is valuable in itself. Can upgrade to automated thread capture later if needed.

### 8. Slack Huddle transcripts via repository_dispatch

**Decision**: Support `repository_dispatch` webhook trigger to receive full Slack Huddle transcripts directly. The workflow auto-creates a GitHub Issue from the transcript, then processes it normally.

**Flow**:
```
Slack Huddle ends
       ↓
Transcript posted to channel
       ↓
Slack Workflow Builder sends webhook to GitHub
       ↓
repository_dispatch triggers Action
       ↓
Action creates Issue with transcript
       ↓
Action processes and creates PR
```

**Webhook payload format**:
```json
{
  "event_type": "slack-transcript",
  "client_payload": {
    "transcript": "Alice (0:00): We should use WebSockets...",
    "title": "Sprint Planning Huddle - April 4",
    "mode": "propose"
  }
}
```

**Rationale**: Slack Huddle transcripts are often longer than what fits in the native "Create issue from message" flow. Using `repository_dispatch` allows Slack Workflow Builder to send the full transcript programmatically, keeping the friction low while supporting richer input.

## Risks / Trade-offs

**[Risk] Claude misidentifies the relevant change**
→ Mitigation: PR review catches this. PR description explains reasoning so reviewer can verify. Include confidence indicator.

**[Risk] Conversation is too vague for meaningful updates**
→ Mitigation: Claude can decline to make changes and instead post a comment asking for clarification or suggesting explore mode.

**[Risk] Large conversations exceed context limits**
→ Mitigation: Summarize existing artifacts rather than including full text. Truncate very long conversations with note.

**[Risk] Multiple concurrent issues updating same change**
→ Mitigation: Each PR is on a separate branch. Merge conflicts surface naturally. Could add concurrency limits later if needed.

**[Trade-off] Less codebase awareness than interactive Claude Code**
→ Accepted: This flow is for capturing decisions, not deep technical design. Users can still use Claude Code for that.
