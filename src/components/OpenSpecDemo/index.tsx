import React, { useState } from 'react';
import styles from './styles.module.css';

interface Message {
  speaker: 'Product Manager' | 'Engineer';
  text: string;
}

interface Stage {
  id: string;
  label: string;
  icon: string;
  artifactName: string;
  artifactContent: string;
  description: string;
  scenario: string;
  conversation: Message[];
}

const stages: Stage[] = [
  {
    id: 'propose',
    label: 'Propose',
    icon: '💡',
    artifactName: 'proposal.md',
    artifactContent: `## Why

When documents come in from clients, we're currently updating three different systems
manually — our internal tracker and two external platforms. The ops team is spending
hours on repetitive data entry, and the manual process is error-prone. Data drifts
out of sync between systems, and we often don't catch it until reporting time.

We initially thought we'd pull data from the external systems and reconcile it in our
app. But in refinement, the engineer proposed flipping the flow: make our app the
single entry point that pushes to the other systems. One source of truth, synced everywhere.

## What Changes

- Add document upload capability with PDF text parsing and field extraction
- Create a review screen where users verify extracted data before saving
- Implement sync adapters for external system APIs
- Our app becomes the source of truth; external systems receive updates from us
- Manual entry fallback when parsing confidence is low

## Capabilities

### New Capabilities
- \`document-upload\`: Upload client documents (PDFs) and extract key fields via text parsing
- \`review-and-confirm\`: Human-in-the-loop review screen before data is committed
- \`external-sync\`: Push confirmed data to external systems

## Impact

- New API endpoints for upload, review, and sync
- New React components for upload UI and review screen
- Integration with PDF parsing library
- API credentials needed for external systems
- Ops workflow changes from "enter data 3 times" to "review once and submit"`,
    description: 'OpenSpec generates a proposal based on team discussion, transcripts, and other inputs. The team discusses and refines based on decisions and ideas that emerge.',
    scenario: 'The PM describes the problem. The engineer asks a clarifying question that reframes the entire approach.',
    conversation: [
      {
        speaker: 'Product Manager',
        text: "Right now when we get documents, we're updating three different systems manually. It's error-prone and the ops team is spending hours on data entry.",
      },
      {
        speaker: 'Engineer',
        text: "Wait — are we pulling from those systems and reconciling, or should we flip it? Make our app the source of truth and push to them?",
      },
      {
        speaker: 'Product Manager',
        text: "Oh. That's... actually way better. Ok so our feature is a Document Import that lets us pull it into one entry point and then syncs everywhere.",
      },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    icon: '📐',
    artifactName: 'design.md',
    artifactContent: `## Context

We need to build a document import feature that replaces the current manual workflow.
Today the ops team receives client documents via email, then manually enters the same
data into three systems: our internal tracker and two external platforms.

Key insight from refinement: instead of pulling from external systems and reconciling,
we flip the flow. Our app becomes the source of truth that pushes to external systems.

## Goals / Non-Goals

**Goals:**
- Reduce data entry from 3x to 1x (enter once, sync everywhere)
- Catch parsing errors before they propagate to external systems
- Create audit trail with source documents attached to records

**Non-Goals:**
- Not replacing the external systems (they stay as-is)
- Not building a general-purpose document parser

## Decisions

### Decision 1: Parsing approach
**Choice**: PDF text extraction with field pattern matching

**Rationale**: Most client documents are text-based PDFs (not scanned images).
We can extract text and use regex/patterns to find key fields.

### Decision 2: Review flow
**Choice**: Always show review screen, pre-filled with parsed results

**Rationale**: Even 95% accuracy means 1 in 20 documents has errors. Human
verification is non-negotiable for financial data.

### Decision 3: Source of truth
**Choice**: Our app is authoritative; external systems are downstream

**Rationale**: If we push, we control the data flow and eliminate drift.

## Risks / Trade-offs

**[Risk]** Parsing accuracy varies by document format
→ Mitigation: Flag low-confidence fields; require explicit confirmation

**[Risk]** External API rate limits or downtime
→ Mitigation: Retry queue with exponential backoff`,
    description: 'The LLM drafts technical design based on the proposal. The team evaluates tradeoffs, considers edge cases, and documents key decisions with rationale.',
    scenario: 'The engineer proposes an approach. The PM raises an edge case. They work through the tradeoff together.',
    conversation: [
      {
        speaker: 'Engineer',
        text: "So when they upload the PDF, I'm thinking we parse out the text, extract the key fields, and pre-fill a form — but require a human review before save.",
      },
      {
        speaker: 'Product Manager',
        text: "What if the document format varies? Like different clients send different layouts?",
      },
      {
        speaker: 'Engineer',
        text: "We handle the common case with parsing, but always show a review screen. If extraction confidence is low, we flag those fields. The user just verifies and hits submit.",
      },
      {
        speaker: 'Product Manager',
        text: "So it's not fully automated, but it's way less typing. I like that.",
      },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: '✅',
    artifactName: 'tasks.md',
    artifactContent: `## 1. Infrastructure

- [x] 1.1 Set up PDF parsing library and dependencies
- [x] 1.2 Create database tables for documents and extracted fields
- [x] 1.3 Set up retry queue for failed sync operations

## 2. Document Upload

- [x] 2.1 Create upload API endpoint with file validation
- [x] 2.2 Build upload UI component with drag-and-drop
- [x] 2.3 Integrate PDF parser for text extraction
- [x] 2.4 Implement field pattern matching with confidence scores

## 3. Review Screen

- [x] 3.1 Create review page layout with form fields
- [x] 3.2 Pre-fill form with parsed values
- [x] 3.3 Highlight low-confidence fields in yellow
- [x] 3.4 Add manual entry fallback for failed parsing
- [x] 3.5 Implement "Confirm & Submit" action

## 4. External Sync

- [x] 4.1 Build sync adapter for System A
- [x] 4.2 Build sync adapter for System B
- [x] 4.3 Implement synchronous sync on submit
- [x] 4.4 Add retry logic for transient failures

## 5. Testing & Rollout

- [x] 5.1 Test with sample documents from ops team
- [x] 5.2 Verify sync accuracy against manual entry
- [x] 5.3 Train ops team on new workflow`,
    description: 'The LLM breaks down the design into implementable tasks. The team identifies dependencies, risks, and sequencing to guide development.',
    scenario: 'The engineer breaks down the work. They identify what to tackle first based on risk and dependencies.',
    conversation: [
      {
        speaker: 'Engineer',
        text: "Alright, breaking this down: upload endpoint, PDF parser, review screen UI, sync to System A, sync to System B. I'd say the review screen is the riskiest — we should spike that first.",
      },
      {
        speaker: 'Product Manager',
        text: "What's the dependency order?",
      },
      {
        speaker: 'Engineer',
        text: "Upload and parsing can be parallel. Review screen needs parser output. Syncs need the review to be done. So: upload + parser first, then review UI, then syncs.",
      },
    ],
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: '📦',
    artifactName: 'spec.md',
    artifactContent: `## ADDED Requirements

### Requirement: Document upload with text extraction
The system SHALL allow users to upload client documents (PDF format) and automatically
extract key fields using text parsing and pattern matching.

#### Scenario: Successful document upload
- **WHEN** user uploads a valid PDF document
- **THEN** document is stored and text extraction begins

#### Scenario: Low confidence fields are flagged
- **WHEN** extraction confidence for a field is below 80%
- **THEN** that field is highlighted for manual review

---

### Requirement: Human review before commit
The system SHALL require human verification of extracted data before syncing to
external systems.

#### Scenario: Review screen shows pre-filled data
- **WHEN** user navigates to review screen after upload
- **THEN** form fields are pre-populated with extracted values

#### Scenario: Manual entry fallback
- **WHEN** parsing fails completely on a document
- **THEN** user can manually enter all fields

---

### Requirement: Sync to external systems
The system SHALL push confirmed data to external systems upon user submission.
Our application is the source of truth; external systems are downstream.

#### Scenario: Successful sync to both systems
- **WHEN** user clicks "Confirm & Submit"
- **THEN** data is sent to System A AND System B
- **AND** user sees confirmation of successful sync

#### Scenario: Retry on transient failure
- **WHEN** sync fails due to network/API timeout
- **THEN** system retries with exponential backoff`,
    description: 'After implementation, specs are archived as searchable knowledge. The team captures what actually shipped, learnings, and context for future reference.',
    scenario: 'The team reflects on what shipped vs. what was planned, capturing learnings for future work.',
    conversation: [
      {
        speaker: 'Product Manager',
        text: "So what actually shipped vs what we planned?",
      },
      {
        speaker: 'Engineer',
        text: "We reversed the data flow — app is now source of truth. Parsing works about 95% of the time, so we added a manual entry fallback. The review screen caught two edge cases we didn't anticipate.",
      },
      {
        speaker: 'Product Manager',
        text: "And the sync reliability?",
      },
      {
        speaker: 'Engineer',
        text: "Rock solid. Having one entry point eliminated the drift we had before.",
      },
    ],
  },
];

// Simple markdown-to-HTML renderer for basic formatting
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Checkboxes
    .replace(/^- \[x\] (.+)$/gm, '<div class="checkbox checked">✓ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="checkbox">☐ $1</div>')
    // List items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines in content
    .replace(/\n/g, '<br />');
}

export default function OpenSpecDemo(): React.ReactElement {
  const [currentStage, setCurrentStage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const stage = stages[currentStage];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📋</span>
        <span className={styles.headerText}>OpenSpec Workflow: Document Import with Smart Sync</span>
      </div>

      {/* Stage indicators */}
      <div className={styles.stageIndicators}>
        {stages.map((s, index) => (
          <React.Fragment key={s.id}>
            <button
              className={`${styles.stageButton} ${index === currentStage ? styles.active : ''} ${index < currentStage ? styles.completed : ''}`}
              onClick={() => setCurrentStage(index)}
              aria-label={`Go to ${s.label} stage`}
              aria-current={index === currentStage ? 'step' : undefined}
            >
              <span className={styles.stageIcon}>{s.icon}</span>
              <span className={styles.stageLabel}>{s.label}</span>
            </button>
            {index < stages.length - 1 && (
              <div className={`${styles.arrow} ${index < currentStage ? styles.arrowCompleted : ''}`}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Phase description bar */}
      <div className={styles.phaseDescription}>
        <div className={styles.phaseIntent}>
          <strong>Intent:</strong> {stage.description}
        </div>
        <div className={styles.phaseScenario}>
          <strong>In this example:</strong> {stage.scenario}
        </div>
      </div>

      {/* Conversation area */}
      <div
        className={styles.conversationArea}
        role="region"
        aria-live="polite"
        aria-label={`${stage.label} stage conversation`}
      >
        <div className={styles.conversation}>
          {stage.conversation.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${msg.speaker === 'Product Manager' ? styles.productManager : styles.engineer}`}
            >
              <span className={styles.speaker}>{msg.speaker}</span>
              <p className={styles.messageText}>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Artifact button */}
        <button
          onClick={() => setModalOpen(true)}
          className={styles.artifactLink}
        >
          📄 View {stage.artifactName}
        </button>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
          disabled={currentStage === 0}
        >
          ← Previous
        </button>
        <span className={styles.progress}>
          {currentStage + 1} / {stages.length}
        </span>
        <button
          className={styles.navButton}
          onClick={() => setCurrentStage(Math.min(stages.length - 1, currentStage + 1))}
          disabled={currentStage === stages.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalFilename}>{stage.artifactName}</span>
              <button
                className={styles.modalClose}
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div
              className={styles.modalContent}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(stage.artifactContent) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
