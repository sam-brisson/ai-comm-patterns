import React, { useState } from 'react';
import styles from './styles.module.css';

interface Change {
  id: string;
  title: string;
  status: 'active' | 'archived';
  description: string;
  resultLink?: string;
  resultLabel?: string;
  artifacts: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}

// Active changes - these would ideally be loaded dynamically, but for now we define them here
// and keep content in sync with the actual files
const changes: Change[] = [
  {
    id: 'openspec-demo',
    title: 'OpenSpec Workflow Demo',
    status: 'active',
    description: 'Interactive component showing the OpenSpec workflow stages with realistic team conversations and artifact examples.',
    resultLink: '/ai-comm-patterns/docs/experimentation/openspec-playbook-iteration-2',
    resultLabel: 'View Demo',
    artifacts: {
      proposal: `# OpenSpec Workflow Demo

## Why

The article about self-documenting systems needs a tangible example that shows what team collaboration looks like at each OpenSpec stage. Text descriptions aren't enough — readers need to see realistic PM/Engineer conversations that demonstrate how specs evolve through refinement.

## What Changes

- Add an interactive React component to the Docusaurus site
- Component shows four stages: Propose → Design → Tasks → Archive
- Each stage displays a realistic conversation snippet between PM and Engineer
- Uses a generalized "Document Import with Smart Sync" feature as the example
- Each stage includes a link to view the actual OpenSpec artifact
- The component itself is built using OpenSpec, making it self-referential

## Capabilities

### New Capabilities
- \`openspec-demo\`: Interactive React component that visualizes the OpenSpec workflow with example team conversations at each stage

## Impact

- New component in \`src/components/OpenSpecDemo/\`
- Updated article at \`docs/experimentation/self-documenting-systems.md\`
- No external dependencies beyond existing Docusaurus setup`,
      design: `# OpenSpec Workflow Demo - Design

## Component Structure

The OpenSpecDemo component provides:
- Stage navigator with clickable buttons
- Conversation panel showing PM/Engineer dialogue
- Artifact viewer modal for each stage's output
- Navigation controls for stepping through stages

## Stage Definitions

### Stage 1: Propose
Shows the initial problem framing conversation where the engineer's question reframes the approach.

### Stage 2: Design
Shows technical discussion of parsing approach and edge case handling.

### Stage 3: Tasks
Shows task breakdown and dependency ordering conversation.

### Stage 4: Archive
Shows reflection on what shipped vs planned, capturing learnings.

## UI Pattern

Reuses familiar patterns:
- Horizontal stage indicators with arrows
- Chat-bubble style messages
- Modal overlay for artifact viewing
- Simple markdown rendering`,
      tasks: `# OpenSpec Workflow Demo - Tasks

## Completed
- [x] Create stage navigator component
- [x] Implement conversation panel with speaker styling
- [x] Build artifact modal with markdown rendering
- [x] Write content for all 4 stages
- [x] Add to self-documenting-systems article
- [x] Style to match site theme

## Definition of Done
- [x] Component renders all 4 stages
- [x] Users can navigate between stages
- [x] Artifact modal displays formatted content
- [x] Responsive on mobile devices`
    }
  },
  {
    id: 'tdd-explorer-enhancement',
    title: 'TDD Knowledge Page with Example Mapping',
    status: 'active',
    description: 'Interactive documentation teaching TDD workflow using Example Mapping and Pytest, modeled on the OpenSpec demo pattern.',
    resultLink: undefined, // Not yet built
    resultLabel: 'Coming Soon',
    artifacts: {
      proposal: `# TDD Knowledge Page with Example Mapping

## Why

Our team lacks standardized TDD practices. Different engineers approach test-driven development inconsistently, and new team members have no clear resource for understanding how TDD fits into our workflow. The success of our OpenSpec demo showed that interactive documentation effectively communicates complex processes — people finally "got it" when they could click through the stages and see realistic conversations.

We want to apply the same approach to TDD: an interactive knowledge page that explains how our team uses Example Mapping to discover test cases and Pytest to implement them.

Additionally, the original TDD Explorer Enhancement proposed Jest integration, but our team uses Python/Pytest. This change pivots to Pytest and focuses on the knowledge page as the primary deliverable. Test explorer tooling improvements are deferred to a future change.

## What Changes

### Interactive TDD Knowledge Page

Build an interactive explanation of our TDD workflow, modeled on the OpenSpec demo:

- **Stage navigator** showing the TDD workflow: Story → Example Mapping → Pytest Tests → Red/Green/Refactor
- **Example Mapping visualization** with Matt Wynn's colored card system (yellow=rules, green=examples, red=questions, blue=story)
- **Realistic team conversations** at each stage showing how PM, Engineer, and QA collaborate
- **Pytest code examples** demonstrating how workshop outputs become executable tests
- **Artifact viewer** letting users inspect the actual test files, fixtures, and conftest patterns

### Content Focus

The knowledge page documents our team's actual practices:

- When Example Mapping fits into story refinement
- How rules and examples translate to Pytest test cases
- Our conventions for test file organization and naming
- Fixture patterns and conftest.py organization
- When to use parametrize, marks, and other Pytest features

### What's NOT in Scope

- Test explorer UI improvements (tree view, inline failures, re-run buttons) — deferred to separate change
- Drag-and-drop interactivity for Example Mapping cards — static step-through is sufficient to teach the concept
- Live test execution or workshop tooling — this is documentation, not a workshop facilitation tool

## Capabilities

### New Capability

- \`tdd-knowledge-page\`: Interactive React component explaining TDD workflow with Example Mapping, reusing the proven OpenSpec demo pattern

## Impact

- New component in \`src/components/TDDKnowledgePage/\`
- New documentation page linking to the component
- Content files (markdown/JSON) for stages, conversations, and code examples
- No changes to existing test infrastructure or tooling`,
      design: `# TDD Knowledge Page - Design

## Overview

The TDD Knowledge Page is an interactive documentation component that teaches our team's TDD workflow using Example Mapping. It follows the same proven pattern as the OpenSpec demo: a stage navigator with conversations, artifacts, and step-through navigation.

## Architecture

### Component Structure

\`\`\`
src/components/TDDKnowledgePage/
├── index.tsx           # Main component with stage navigation
├── styles.module.css   # Styling (based on OpenSpec demo)
└── content/
    └── stages.json     # Stage definitions, conversations, artifacts
\`\`\`

### Why External Content Files

The OpenSpec demo hardcodes ~250 lines of content in the TSX file. For maintainability, the TDD Knowledge Page will load content from external JSON/markdown files:

- **Easier updates**: Team members can update conventions without touching React code
- **Clear ownership**: Content changes are visible in PRs as documentation changes
- **Version tracking**: Content files can include last-updated dates

### Reusing OpenSpec Demo Patterns

The OpenSpec demo component provides a working pattern:

| OpenSpec Demo | TDD Knowledge Page |
|---------------|-------------------|
| 4 stages (Propose → Design → Tasks → Archive) | 5 stages (Story → Example Mapping → Tests → Red-Green-Refactor → Integration) |
| PM/Engineer conversations | PM/Engineer/QA conversations (three amigos) |
| Artifact modal (proposal.md, design.md, etc.) | Artifact modal (example_map.md, test_user_login.py, conftest.py) |
| ~400 lines of React | ~400 lines of React + external content |

## Stage Definitions

### Stage 1: Story Definition
**Intent**: Present the user story and acceptance criteria that will drive the Example Mapping session.

### Stage 2: Example Mapping
**Intent**: Show how the team collaboratively discovers rules and examples using Matt Wynn's colored card technique.

### Stage 3: Pytest Tests
**Intent**: Show how Example Mapping outputs translate directly to Pytest test cases.

### Stage 4: Red-Green-Refactor
**Intent**: Demonstrate the TDD cycle in action — write failing test, make it pass, clean up.

### Stage 5: Integration
**Intent**: Show how individual tests fit into the larger test suite and CI pipeline.

## UI Components

### Stage Navigator
Identical to OpenSpec demo — horizontal button row with icons, labels, and arrow connectors.

### Conversation Panel
Speaker labels (PM, Engineer, QA) with role-based styling. Static content, no typing animations.

### Artifact Viewer
Modal overlay with syntax highlighting for Python code blocks and copy-to-clipboard button.

### Example Mapping Card Display
**Not drag-and-drop.** Static visualization of cards with colored borders grouped under parent rules.

## Content Maintenance

Content updates should be reviewed by someone familiar with the team's Pytest conventions. Each content file includes lastUpdated metadata.`,
      tasks: `# TDD Knowledge Page - Tasks

## Slice 1: Component Skeleton + First Stage (Ship & Learn)

Goal: Get something live that team members can click through, even if incomplete.

### Component Setup
- [ ] Create \`src/components/TDDKnowledgePage/\` directory structure
- [ ] Copy and adapt stage navigator from OpenSpec demo
- [ ] Set up content loading from external JSON file
- [ ] Implement basic styling (reuse OpenSpec demo CSS as starting point)

### First Stage: Story Definition
- [ ] Write Stage 1 content: user story, conversation, artifact
- [ ] Implement conversation panel with PM/Engineer/QA speaker support
- [ ] Implement artifact modal (reuse from OpenSpec demo)
- [ ] Add component to a documentation page for testing

### Checkpoint
- [ ] Team member walks through Stage 1 and provides feedback
- [ ] Identify any usability issues before building more stages

---

## Slice 2: Example Mapping Stage (Core Value)

Goal: The Example Mapping stage is the key differentiator — this is what teaches the new concept.

### Stage 2: Example Mapping Content
- [ ] Write realistic three-amigos conversation discovering rules and examples
- [ ] Create example map artifact showing colored card structure
- [ ] Design static card visualization (colored borders, hierarchy)

### Checkpoint
- [ ] Team member unfamiliar with Example Mapping reviews Stage 2
- [ ] Verify the concept is clear without prior knowledge

---

## Slice 3: Pytest Tests Stage (The Payoff)

Goal: Show the direct connection from Example Mapping outputs to executable tests.

### Stage 3: Pytest Tests Content
- [ ] Write conversation explaining card-to-test translation
- [ ] Create test file artifact with real Pytest patterns

### Checkpoint
- [ ] Engineer reviews test examples for accuracy to team conventions

---

## Slice 4: Red-Green-Refactor + Integration Stages

Goal: Complete the workflow with TDD cycle demonstration and test suite organization.

---

## Slice 5: Content Maintenance & Documentation

Goal: Ensure the knowledge page can be maintained over time.

---

## Definition of Done

- [ ] All 5 stages have content and are navigable
- [ ] At least 2 team members have walked through and confirmed it's clear
- [ ] Content is in external files, not hardcoded in TSX
- [ ] Component is linked from documentation site
- [ ] Content ownership is assigned

---

## Deferred (Future Changes)

### Test Explorer Tooling (Separate Change)
- Hierarchical tree view for Pytest tests
- Inline failure details with assertion info
- Re-run buttons for failed tests`
    }
  },
  {
    id: 'slack-to-openspec-action',
    title: 'Slack to OpenSpec Action',
    status: 'active',
    description: 'GitHub Action that processes Slack huddle transcripts and generates OpenSpec artifacts automatically.',
    resultLink: 'https://github.com/sam-brisson/ai-comm-patterns/blob/main/.github/workflows/process-openspec-issue.yml',
    resultLabel: 'View Workflow',
    artifacts: {
      proposal: `# Slack to OpenSpec Action

## Why

Team discussions happen in Slack huddles, but the decisions and context get lost. We want to capture those conversations and automatically generate OpenSpec artifacts (proposals, designs, tasks) so the system documents itself.

## What Changes

- GitHub Action triggered by Slack webhook or issue label
- Claude API integration to analyze transcripts
- Automatic PR creation with generated artifacts
- Support for both "propose" and "explore" modes

## Capabilities

### New Capabilities
- \`process-openspec-issue\`: GitHub workflow that processes transcripts and generates artifacts
- \`slack-webhook-integration\`: Receives Slack huddle transcripts via webhook
- \`artifact-generation\`: Uses Claude to generate proposal, design, and tasks from conversations

## Impact

- New workflow in \`.github/workflows/\`
- New scripts in \`.github/scripts/\`
- Integration with existing OpenSpec directory structure`,
      design: `# Slack to OpenSpec Action - Design

## Architecture

### Workflow Triggers

1. **Issue Labeled**: When an issue is labeled with "propose" or "explore"
2. **Repository Dispatch**: When Slack webhook sends a transcript

### Processing Pipeline

1. Parse conversation from issue body or webhook payload
2. Gather context from existing OpenSpec changes
3. Call Claude API with conversation + context
4. Generate appropriate artifacts based on mode
5. Create PR (propose mode) or comment (explore mode)

### Mode Behaviors

**Propose Mode**:
- Generates/updates proposal.md, design.md, tasks.md
- Creates branch and PR
- Links PR to original issue

**Explore Mode**:
- Analyzes conversation for themes and questions
- Posts analysis as issue comment
- No file changes

### Claude Integration

Uses structured prompts that include:
- The conversation transcript
- Summaries of existing changes for context
- Instructions for artifact format`,
      tasks: `# Slack to OpenSpec Action - Tasks

## Completed
- [x] Create GitHub workflow file
- [x] Implement issue parsing logic
- [x] Add repository dispatch support
- [x] Integrate Claude API for processing
- [x] Implement propose mode (PR creation)
- [x] Implement explore mode (comment posting)
- [x] Add context gathering from existing changes

## In Progress
- [ ] Improve artifact matching for updates vs new changes
- [ ] Add support for spec generation in archive phase

## Future
- [ ] Direct Slack app integration (vs webhook)
- [ ] Real-time processing during huddles
- [ ] Multi-turn conversation support`
    }
  }
];

// Simple markdown-to-HTML renderer (same as OpenSpec demo)
function renderMarkdown(content: string): string {
  return content
    // Code blocks (must be before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Checkboxes
    .replace(/^- \[x\] (.+)$/gm, '<div class="checkbox checked">✓ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="checkbox">☐ $1</div>')
    // List items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Table rows (basic support)
    .replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      if (cells.every((cell: string) => cell.match(/^-+$/))) {
        return ''; // Skip separator rows
      }
      return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
    })
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines in content
    .replace(/\n/g, '<br />');
}

type ArtifactType = 'proposal' | 'design' | 'tasks';

export default function OpenSpecChanges(): React.ReactElement {
  const [selectedChange, setSelectedChange] = useState<Change | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactType | null>(null);

  const openArtifact = (change: Change, artifact: ArtifactType) => {
    setSelectedChange(change);
    setSelectedArtifact(artifact);
  };

  const closeModal = () => {
    setSelectedChange(null);
    setSelectedArtifact(null);
  };

  const activeChanges = changes.filter(c => c.status === 'active');

  const artifactLabels: Record<ArtifactType, string> = {
    proposal: 'Proposal',
    design: 'Design',
    tasks: 'Tasks'
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Change</th>
            <th>Description</th>
            <th>Artifacts</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {activeChanges.map(change => (
            <tr key={change.id}>
              <td className={styles.changeTitle}>{change.title}</td>
              <td className={styles.changeDescription}>{change.description}</td>
              <td className={styles.artifacts}>
                {(['proposal', 'design', 'tasks'] as ArtifactType[]).map(artifact => (
                  change.artifacts[artifact] && (
                    <button
                      key={artifact}
                      className={styles.artifactButton}
                      onClick={() => openArtifact(change, artifact)}
                    >
                      {artifactLabels[artifact]}
                    </button>
                  )
                ))}
              </td>
              <td className={styles.result}>
                {change.resultLink ? (
                  <a href={change.resultLink} className={styles.resultLink}>
                    {change.resultLabel || 'View Result'} →
                  </a>
                ) : (
                  <span className={styles.resultPending}>{change.resultLabel || 'In Progress'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedChange && selectedArtifact && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalChangeTitle}>{selectedChange.title}</span>
                <span className={styles.modalFilename}>{selectedArtifact}.md</span>
              </div>
              <div className={styles.modalTabs}>
                {(['proposal', 'design', 'tasks'] as ArtifactType[]).map(artifact => (
                  selectedChange.artifacts[artifact] && (
                    <button
                      key={artifact}
                      className={`${styles.modalTab} ${selectedArtifact === artifact ? styles.modalTabActive : ''}`}
                      onClick={() => setSelectedArtifact(artifact)}
                    >
                      {artifactLabels[artifact]}
                    </button>
                  )
                ))}
              </div>
              <button
                className={styles.modalClose}
                onClick={closeModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div
              className={styles.modalContent}
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(selectedChange.artifacts[selectedArtifact] || '')
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
