import React, { useState } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './styles.module.css';

// Workflow stages in order
const WORKFLOW_STAGES = [
  {
    id: 'exploring',
    label: 'Exploring',
    color: '#6366F1',
    description: 'Investigating ideas and gathering context',
    nextAction: { label: 'Run /opsx:propose', command: 'propose' }
  },
  {
    id: 'proposed',
    label: 'Proposed',
    color: '#F59E0B',
    description: 'Artifacts generated, soliciting feedback',
    nextAction: { label: 'Run /opsx:apply', command: 'apply' }
  },
  {
    id: 'applied',
    label: 'Applied',
    color: '#10B981',
    description: 'Implementation complete, ready for review',
    nextAction: { label: 'Run /opsx:archive', command: 'archive' }
  },
];

interface Change {
  id: string;
  title?: string;
  description?: string;
  workflowStatus?: 'exploring' | 'proposed' | 'applied' | 'archived';
  resultLink?: string | null;
  resultLabel?: string | null;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string;
  artifacts: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}

interface PluginData {
  changes: Change[];
  artifacts: Record<string, Record<string, string>>;
}

type ArtifactType = 'proposal' | 'design' | 'tasks';

// Simple markdown renderer
function renderMarkdown(content: string): string {
  return content
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- \[x\] (.+)$/gm, '<div class="checkbox checked">✓ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="checkbox">☐ $1</div>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
}

export default function OpenSpecWorkflowBoard(): React.ReactElement {
  const [selectedChange, setSelectedChange] = useState<Change | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactType | null>(null);

  // Load changes from the plugin
  const pluginData = usePluginData('openspec-artifacts-plugin') as PluginData | undefined;
  const changes = pluginData?.changes || [];

  // Filter out archived changes for the board view
  const activeChanges = changes.filter(c => c.workflowStatus !== 'archived');
  const archivedCount = changes.filter(c => c.workflowStatus === 'archived').length;

  // Group changes by workflow status
  const changesByStage = WORKFLOW_STAGES.reduce((acc, stage) => {
    acc[stage.id] = activeChanges.filter(c => c.workflowStatus === stage.id);
    return acc;
  }, {} as Record<string, Change[]>);

  const openChangeModal = (change: Change) => {
    setSelectedChange(change);
    // Default to proposal if available
    if (change.artifacts.proposal) {
      setSelectedArtifact('proposal');
    } else if (change.artifacts.design) {
      setSelectedArtifact('design');
    } else if (change.artifacts.tasks) {
      setSelectedArtifact('tasks');
    } else {
      setSelectedArtifact(null);
    }
  };

  const closeModal = () => {
    setSelectedChange(null);
    setSelectedArtifact(null);
  };

  const getStageForChange = (change: Change) => {
    return WORKFLOW_STAGES.find(s => s.id === change.workflowStatus);
  };

  const artifactLabels: Record<ArtifactType, string> = {
    proposal: 'Proposal',
    design: 'Design',
    tasks: 'Tasks'
  };

  const ChangeCard = ({ change }: { change: Change }) => {
    const stage = getStageForChange(change);
    const hasArtifacts = Object.keys(change.artifacts).length > 0;

    return (
      <div
        className={styles.changeCard}
        onClick={() => openChangeModal(change)}
      >
        <div className={styles.changeTitle}>{change.title || change.id}</div>
        {change.description && (
          <div className={styles.changeDescription}>{change.description}</div>
        )}
        <div className={styles.changeFooter}>
          {hasArtifacts && (
            <div className={styles.artifactIndicators}>
              {change.artifacts.proposal && <span className={styles.artifactDot} title="Proposal">P</span>}
              {change.artifacts.design && <span className={styles.artifactDot} title="Design">D</span>}
              {change.artifacts.tasks && <span className={styles.artifactDot} title="Tasks">T</span>}
            </div>
          )}
          {change.resultLink && (
            <span className={styles.hasResult} title="Has result">✓</span>
          )}
        </div>
      </div>
    );
  };

  const StageColumn = ({ stage }: { stage: typeof WORKFLOW_STAGES[0] }) => {
    const stageChanges = changesByStage[stage.id] || [];

    return (
      <div className={styles.column}>
        <div className={styles.columnHeader} style={{ borderTopColor: stage.color }}>
          <span className={styles.columnTitle}>{stage.label}</span>
          <span className={styles.columnCount} style={{ backgroundColor: stage.color }}>
            {stageChanges.length}
          </span>
        </div>
        <div className={styles.columnContent}>
          {stageChanges.map(change => (
            <ChangeCard key={change.id} change={change} />
          ))}
          {stageChanges.length === 0 && (
            <div className={styles.emptyColumn}>No changes</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {WORKFLOW_STAGES.map(stage => (
          <StageColumn key={stage.id} stage={stage} />
        ))}

        {/* Archived column - just shows count with link */}
        <div className={styles.column}>
          <div className={styles.columnHeader} style={{ borderTopColor: '#6B7280' }}>
            <span className={styles.columnTitle}>Archived</span>
            <span className={styles.columnCount} style={{ backgroundColor: '#6B7280' }}>
              {archivedCount}
            </span>
          </div>
          <div className={styles.columnContent}>
            <div className={styles.archivedPlaceholder}>
              <span className={styles.archivedCount}>{archivedCount} changes</span>
              <a href="/ai-comm-patterns/docs/collaboration/openspec-archive" className={styles.archivedLink}>
                View Archive →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Change Detail Modal */}
      {selectedChange && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleArea}>
                <span
                  className={styles.modalStatusBadge}
                  style={{ backgroundColor: getStageForChange(selectedChange)?.color || '#6B7280' }}
                >
                  {getStageForChange(selectedChange)?.label || 'Unknown'}
                </span>
                <span className={styles.modalChangeTitle}>{selectedChange.title || selectedChange.id}</span>
              </div>
              <button className={styles.modalClose} onClick={closeModal}>×</button>
            </div>

            {selectedChange.description && (
              <div className={styles.modalDescription}>{selectedChange.description}</div>
            )}

            {/* Artifact tabs */}
            {Object.keys(selectedChange.artifacts).length > 0 && (
              <>
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

                {selectedArtifact && selectedChange.artifacts[selectedArtifact] && (
                  <div
                    className={styles.modalContent}
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(selectedChange.artifacts[selectedArtifact] || '')
                    }}
                  />
                )}
              </>
            )}

            {/* Action footer */}
            <div className={styles.modalFooter}>
              {selectedChange.resultLink && (
                <a
                  href={selectedChange.resultLink}
                  className={styles.resultButton}
                >
                  {selectedChange.resultLabel || 'View Result'} →
                </a>
              )}

              {/* Show next action based on workflow status */}
              {getStageForChange(selectedChange)?.nextAction && (
                <div className={styles.nextActionHint}>
                  <span className={styles.nextActionLabel}>Next:</span>
                  <code className={styles.nextActionCommand}>
                    {getStageForChange(selectedChange)?.nextAction.label}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
