import React, { useState } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './styles.module.css';

interface ChangeMetadata {
  id: string;
  title: string;
  status: 'active' | 'archived';
  description: string;
  resultLink?: string;
  resultLabel?: string;
  showWorkflowModal?: boolean;
  // Directory name in openspec/changes/ to load artifacts from
  // If not specified, uses id as the directory name
  artifactDir?: string;
  // Fallback artifacts if not found in files (for changes not yet in openspec/changes/)
  fallbackArtifacts?: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}

interface Artifacts {
  proposal?: string;
  design?: string;
  tasks?: string;
}

interface OpenSpecArtifactsData {
  artifacts: Record<string, Artifacts>;
}

// Change metadata - artifacts are loaded from files at build time
const changeMetadata: ChangeMetadata[] = [
  {
    id: 'openspec-demo',
    title: 'OpenSpec Workflow Demo',
    status: 'active',
    description: 'Interactive component showing the OpenSpec workflow stages with realistic team conversations and artifact examples.',
    resultLink: '/ai-comm-patterns/docs/experimentation/openspec-playbook-iteration-2',
    resultLabel: 'View Demo',
    artifactDir: 'spec-viewer-demo', // Maps to openspec/changes/spec-viewer-demo/
    // Fallback for archived changes that may not have files
    fallbackArtifacts: {
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
    resultLink: '/ai-comm-patterns/docs/experimentation/tdd-example-mapping',
    resultLabel: 'View Demo',
    artifactDir: 'tdd-explorer-enhancement', // Maps to openspec/changes/tdd-explorer-enhancement/
  },
  {
    id: 'transcript-to-openspec-action',
    title: 'Transcript to OpenSpec Action',
    status: 'active',
    description: 'GitHub Action that processes conversation transcripts and generates OpenSpec artifacts automatically.',
    resultLink: undefined,
    resultLabel: 'View Workflow',
    showWorkflowModal: true,
    artifactDir: 'slack-to-openspec-action', // Maps to openspec/changes/slack-to-openspec-action/
  }
];

// Simple markdown-to-HTML renderer
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

const workflowDiagram = `
## How It Works

\`\`\`
┌─────────────────────┐
│  Team Conversation  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Capture Transcript │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│ Create GitHub Issue w/      │
│ Transcript                  │
└──────────┬──────────────────┘
           │
           ▼
      ┌────┴────┐
      │  Label  │
      │  Type   │
      └────┬────┘
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌───────────────┐
│ propose │ │    explore    │
└────┬────┘ └───────┬───────┘
     │              │
     ▼              ▼
┌──────────┐ ┌─────────────┐
│ Generate │ │ Analyze &   │
│ Artifacts│ │ Document    │
└────┬─────┘ └──────┬──────┘
     │              │
     └──────┬───────┘
            │
            ▼
┌───────────────────────┐
│  Create Pull Request  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Review & Refine     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Merge to Main      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Published to Docs Site│
└───────────────────────┘
\`\`\`

Both \`propose\` and \`explore\` can create a **new** OpenSpec change or **update an existing one**.
`;

interface ChangeWithArtifacts extends ChangeMetadata {
  artifacts: Artifacts;
}

export default function OpenSpecChanges(): React.ReactElement {
  const [selectedChange, setSelectedChange] = useState<ChangeWithArtifacts | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactType | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  // Load artifacts from the plugin (hook must be called unconditionally)
  const pluginData = usePluginData('openspec-artifacts-plugin') as OpenSpecArtifactsData | undefined;
  const pluginArtifacts = pluginData?.artifacts || {};

  // Merge metadata with artifacts from files
  const changes: ChangeWithArtifacts[] = changeMetadata.map(meta => {
    const dirName = meta.artifactDir || meta.id;
    const fileArtifacts = pluginArtifacts[dirName] || {};

    // Use file artifacts if available, otherwise fall back to hardcoded
    const artifacts: Artifacts = {
      proposal: fileArtifacts.proposal || meta.fallbackArtifacts?.proposal,
      design: fileArtifacts.design || meta.fallbackArtifacts?.design,
      tasks: fileArtifacts.tasks || meta.fallbackArtifacts?.tasks,
    };

    return { ...meta, artifacts };
  });

  const openArtifact = (change: ChangeWithArtifacts, artifact: ArtifactType) => {
    setSelectedChange(change);
    setSelectedArtifact(artifact);
  };

  const closeModal = () => {
    setSelectedChange(null);
    setSelectedArtifact(null);
    setShowWorkflow(false);
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
                {change.showWorkflowModal ? (
                  <button
                    className={styles.resultLink}
                    onClick={() => setShowWorkflow(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {change.resultLabel || 'View Workflow'} →
                  </button>
                ) : change.resultLink ? (
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

      {showWorkflow && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalChangeTitle}>OpenSpec Workflow</span>
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
                __html: renderMarkdown(workflowDiagram)
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
