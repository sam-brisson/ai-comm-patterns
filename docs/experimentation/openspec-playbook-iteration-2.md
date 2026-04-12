---
title: "OpenSpec Playbook - Iteration 2"
sidebar_label: "OpenSpec Playbook - Iteration 2"
sidebar_position: 2
description: "Iterating on the OpenSpec workflow visualization based on stakeholder feedback from a real team jam session."
tags: [knowledge-management, ai-assisted-development, tools, patterns, openspec]
---

import ArtifactViewer from '@site/src/components/ArtifactViewer';
import OpenSpecDemo from '@site/src/components/OpenSpecDemo';

After publishing [Iteration 1](/docs/experimentation/self-documenting-systems), we gathered feedback in a team jam session. This article documents how we processed that feedback using OpenSpec to propose improvements.

<div style={{textAlign: 'center', marginBottom: '2rem'}}>
  <img
    src="/ai-comm-patterns/img/openspec-loop.webp"
    alt="OpenSpec iterative workflow loop showing Propose, Design, Tasks, Implement, and Archive stages"
    style={{maxWidth: '500px', width: '100%', borderRadius: '8px'}}
  />
</div>

## OpenSpec Workflow

Try clicking through this demo to see what a real PM/Engineer conversation looks like at each stage — and click the artifact links to see the actual spec files:

<OpenSpecDemo />

## The Process

Here's how we iterated from unstructured conversation to structured proposals:

### Step 1: Record the Jam Session

We recorded a ~45 minute conversation where the team reviewed the OpenSpecDemo component and discussed what was missing or misleading about the workflow visualization.

<ArtifactViewer
  filename="key-verbatims.md"
  buttonText="View Key Quotes"
  icon="🎙️"
  content={`## Key Verbatims from Jam Session

**On the missing implementation step:**

> "So that implementation arrow is definitely missing. Before archive, archive should be like a product agreed, and then we change the specs based on whatever was changed during engineering... this is the stamp, like AC, that we're putting into the spec."

---

**On the reality of engineering work:**

> "Most of the time when engineering goes in and does work, there's always a gotcha. I'd say like 75% of time when I'm doing work, there's like, oh, there's a gotcha. I'm gonna have to change this up a little bit."

---

**On partial progress and iteration:**

> "It's not as waterfall as you were thinking. Like within the tasks and the archive there's small iterations. You can be 30% through the checkbox, not necessarily 30% through the whole work... you at least have a reference of what's left."

---

**On the need for concise documentation:**

> "Something I was thinking of how to approach it was like a curated skill that's very concise... taking everything in this folder, reading through it, and then just creating a documentation page on something that's relevant to it."

---

**On human review as the critical gate:**

> "Review that goes in the doc site will always be a human doing it, whether it's engineers or TPMs or product, whoever's actually reviewing the PR and doing the Approval button to hit merge in, like they're doing the final review."`}
/>

### Step 2: Extract Key Feedback Themes

We analyzed the transcript to identify the main critiques:

**On the workflow itself:**
- The diagram skips from Design to Archive without showing Implementation
- 75% of engineering work hits "gotchas" that require design changes
- Archive should capture "planned vs. actual" with the **why** behind decisions
- Product sign-off should be a formal checkpoint, not just a visual indicator
- Work isn't linear - you can be 30% through tasks, pause, and resume later

**On documentation and knowledge capture:**
- Need a concise documentation skill to transform verbose specs into useful docs
- Human review on the knowledge site PR is the critical quality gate
- The "noise vs. signal" problem - verbose AI output that nobody will read

**On scope:**
- Is this scope creep for what should be a teaching example?
- How do we maintain the self-referential nature (demo built with OpenSpec showing OpenSpec)?
- Can an unstructured conversation actually drive structured proposals?

### Step 3: Recognize the Scope Split

A key insight emerged: the feedback addressed **two distinct problems**:

1. **Workflow Visualization** - The demo component itself needed to show the real workflow (with Implementation, gotchas, partial progress)

2. **Knowledge Site Publishing** - How archived specs become useful documentation (the skill, the patterns, the human review gate)

These are separate concerns that deserve separate proposals.

### Step 4: Generate Focused Proposals

Using `/opsx:propose`, we created two targeted changes:

---

## Change 1: spec-viewer-v2

Improving the workflow visualization to reflect how teams actually work.

<ArtifactViewer
  filename="spec-viewer-v2/proposal.md"
  buttonText="View Proposal"
  icon="📄"
  content={`## Why

Stakeholder feedback on the spec-viewer-demo revealed that the current workflow visualization skips critical steps and doesn't represent how teams actually use OpenSpec. The diagram jumps from Design directly to Archive without showing Implementation, misses the feedback loop where engineering discoveries change the design, and doesn't show that work can be paused and resumed mid-progress.

## What Changes

- Add an **Implement** stage between Tasks and Archive to show the actual build step
- Update Archive stage to show "planned vs. actual" - what changed during implementation, including gotchas, blockers, and pivots with the **why** behind each decision
- Add **product sign-off** as a formal checkpoint before archive (not just a visual indicator - this is the acceptance criteria stamp)
- Show **partial progress states** - work can be 30% done, paused, and picked up later; the workflow isn't strictly linear
- Update conversation examples to reflect the 75% gotcha reality (e.g., "we couldn't do X because of Y, so we did Z instead")

## Capabilities

### New Capabilities
- \`openspec-implement-stage\`: New stage component showing implementation in progress with task checkboxes, blocker callouts, and design change annotations when gotchas are hit

### Modified Capabilities
- \`openspec-demo\`: Update existing demo to include Implement stage, product sign-off checkpoint, "planned vs. actual" archive content, and partial progress indicators

## Impact

- Modified \`src/components/OpenSpecDemo/\` to add Implement stage and update Archive stage
- New conversation content reflecting implementation realities (gotchas, pivots, decisions)
- Updated stage indicator bar (4 stages → 5 stages: Propose → Design → Tasks → Implement → Archive)
- Visual indicator for partial progress / pause-resume capability
- Article updates to explain the complete workflow including the implementation feedback loop`}
/>

**Key improvements:**
- 5 stages instead of 4 (adds Implement)
- "Planned vs. actual" in Archive with decision rationale
- Formal product sign-off checkpoint
- Partial progress visibility

---

## Change 2: openspec-publish-workflow

Solving the "how do specs become useful knowledge" problem.

<ArtifactViewer
  filename="openspec-publish-workflow/proposal.md"
  buttonText="View Proposal"
  icon="📄"
  content={`## Why

OpenSpec artifacts are verbose by design - they capture the full conversation, decisions, and iteration history. But this verbosity means nobody will actually read them. The knowledge site needs concise, useful documentation that serves two audiences: humans refreshing their context on past work, and AI models picking up where previous work left off. Without a deliberate transformation from verbose specs to signal-rich docs, the self-documenting loop breaks down.

## What Changes

- Create a **concise documentation skill** that transforms verbose OpenSpec artifacts into readable knowledge articles, stripping noise while preserving essential decisions and rationale
- Define **content patterns** that work for dual audiences (human readers + AI context) - what makes documentation actually useful vs. just present
- Establish the **publish workflow**: archived spec → skill transforms to doc → PR created → human review gate → merge to knowledge site
- Human review is the **critical quality checkpoint** - not optional, not auto-accepted

## Capabilities

### New Capabilities
- \`openspec-to-docs-skill\`: Claude Code skill that reads archived OpenSpec artifacts and generates concise knowledge site documentation, focusing on decisions made, rationale (the "why"), and outcomes
- \`docs-content-patterns\`: Defined patterns for knowledge articles - what sections, what level of detail, how to structure for skimmability by humans while retaining context density for models
- \`publish-review-gate\`: Workflow integration that creates PRs from transformed docs with human approval required before merge

### Modified Capabilities
<!-- None - this is new infrastructure -->

## Impact

- New skill added to Claude Code configuration
- Documentation templates/patterns defined for knowledge site
- GitHub workflow or action for PR creation from archived specs
- Human review process defined and enforced
- Knowledge site gains structured, consistent documentation from OpenSpec work`}
/>

**Key improvements:**
- Dedicated skill for noise → signal transformation
- Explicit content patterns for dual audiences
- Human review as non-negotiable gate
- Clear workflow from archive to published doc

---

## What We Learned

### The transcript-to-proposal pipeline works

An unstructured 45-minute conversation produced two focused, actionable proposals. The key was:
1. Recording the raw conversation
2. Extracting themes by participant perspective
3. Recognizing when feedback addresses multiple distinct problems
4. Scoping each proposal tightly

### Scope discipline matters

The initial draft tried to solve everything in one proposal. Splitting into two changes made each one tractable for a bi-weekly iteration cycle.

### The "why" is the hardest part

Both proposals emphasize capturing decision rationale. This emerged as the thread connecting all feedback - without the "why", documentation becomes noise.

---

## Next Steps

Both proposals are ready for `/opsx:apply`:

- **spec-viewer-v2**: Update the OpenSpecDemo component with the 5-stage workflow
- **openspec-publish-workflow**: Build the skill and patterns for knowledge site publishing

We'll document the implementation in Iteration 3.

---

**Artifacts:**
- [spec-viewer-v2 proposal](pathname:///openspec/changes/spec-viewer-v2/proposal.md)
- [openspec-publish-workflow proposal](pathname:///openspec/changes/openspec-publish-workflow/proposal.md)
