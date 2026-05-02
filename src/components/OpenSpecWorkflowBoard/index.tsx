import React, { useState, useEffect } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

// GitHub repo URL - will be read from config or use default
const DEFAULT_GITHUB_REPO = 'https://github.com/sam-brisson/ai-comm-patterns';

// Character limit for transcript (URL length limit ~8000, leave room for encoding overhead)
const TRANSCRIPT_CHAR_LIMIT = 5000;
const TRANSCRIPT_WARNING_THRESHOLD = 4000;

type ActionType = 'explore' | 'propose' | 'apply' | 'archive';

// Workflow stages in order
const WORKFLOW_STAGES = [
  {
    id: 'exploring',
    label: 'Exploring',
    color: '#6366F1',
    description: 'Investigating ideas and gathering context',
    nextAction: { label: 'Advance to Proposed', command: 'propose' as ActionType }
  },
  {
    id: 'proposed',
    label: 'Proposed',
    color: '#F59E0B',
    description: 'Artifacts generated, soliciting feedback',
    nextAction: { label: 'Advance to Applied', command: 'apply' as ActionType }
  },
  {
    id: 'applied',
    label: 'Applied',
    color: '#10B981',
    description: 'Implementation complete, ready for review',
    nextAction: { label: 'Archive Change', command: 'archive' as ActionType }
  },
];

// Wizard state interface
interface WizardState {
  isOpen: boolean;
  mode: 'new' | 'advance';
  changeName: string;
  action: ActionType;
  transcript: string;
}

// Build GitHub issue URL with pre-filled content
function buildGitHubIssueUrl(
  repoUrl: string,
  changeName: string,
  action: ActionType,
  transcript: string
): string {
  const baseUrl = `${repoUrl}/issues/new`;
  const title = `[${action.toUpperCase()}]: ${changeName}`;
  const label = action;

  const body = `### Change
${changeName}

### Instructions
${transcript || '(No additional context provided)'}`;

  const params = new URLSearchParams({
    title,
    labels: label,
    body,
  });

  return `${baseUrl}?${params.toString()}`;
}

// Validate kebab-case change name
function isValidChangeName(name: string): boolean {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);
}

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

  // Wizard state
  const [wizardState, setWizardState] = useState<WizardState | null>(null);

  // Drag state
  const [draggedChange, setDraggedChange] = useState<Change | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Get GitHub repo URL from config
  const { siteConfig } = useDocusaurusContext();
  const githubRepoUrl = (siteConfig.customFields?.githubRepoUrl as string) || DEFAULT_GITHUB_REPO;

  // Load changes from the plugin
  const pluginData = usePluginData('openspec-artifacts-plugin') as PluginData | undefined;
  const changes = pluginData?.changes || [];

  // Handle escape key to close wizard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && wizardState?.isOpen) {
        closeWizard();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [wizardState?.isOpen]);

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

  // Wizard functions
  const openWizardForNew = () => {
    setWizardState({
      isOpen: true,
      mode: 'new',
      changeName: '',
      action: 'explore',
      transcript: '',
    });
  };

  const openWizardForAdvance = (change: Change) => {
    const stage = getStageForChange(change);
    if (!stage?.nextAction) return;

    setSelectedChange(null);
    setSelectedArtifact(null);
    setWizardState({
      isOpen: true,
      mode: 'advance',
      changeName: change.id,
      action: stage.nextAction.command,
      transcript: '',
    });
  };

  const closeWizard = () => {
    setWizardState(null);
  };

  const updateWizardField = <K extends keyof WizardState>(field: K, value: WizardState[K]) => {
    if (!wizardState) return;
    setWizardState({ ...wizardState, [field]: value });
  };

  const handleWizardSubmit = () => {
    if (!wizardState) return;

    const url = buildGitHubIssueUrl(
      githubRepoUrl,
      wizardState.changeName,
      wizardState.action,
      wizardState.transcript
    );

    window.open(url, '_blank');
    closeWizard();
  };

  const isWizardValid = (): boolean => {
    if (!wizardState) return false;
    // Always enforce character limit
    if (wizardState.transcript.length > TRANSCRIPT_CHAR_LIMIT) return false;
    if (wizardState.mode === 'new') {
      return isValidChangeName(wizardState.changeName) && wizardState.transcript.trim().length > 0;
    }
    return true; // For advance mode, transcript is optional
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, change: Change) => {
    setDraggedChange(change);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedChange(null);
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (!draggedChange) return;

    const currentIndex = WORKFLOW_STAGES.findIndex(s => s.id === draggedChange.workflowStatus);
    const targetIndex = WORKFLOW_STAGES.findIndex(s => s.id === stageId);

    // Only allow forward movement by one stage
    if (targetIndex === currentIndex + 1) {
      setDropTarget(stageId);
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (!draggedChange || !dropTarget) return;

    // Find the action for the target stage
    const currentIndex = WORKFLOW_STAGES.findIndex(s => s.id === draggedChange.workflowStatus);
    const currentStage = WORKFLOW_STAGES[currentIndex];

    if (currentStage?.nextAction) {
      setWizardState({
        isOpen: true,
        mode: 'advance',
        changeName: draggedChange.id,
        action: currentStage.nextAction.command,
        transcript: '',
      });
    }

    setDraggedChange(null);
    setDropTarget(null);
  };

  // Handle drop on archived column
  const handleArchiveDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedChange) return;

    // Only allow from 'applied' stage
    if (draggedChange.workflowStatus === 'applied') {
      setWizardState({
        isOpen: true,
        mode: 'advance',
        changeName: draggedChange.id,
        action: 'archive',
        transcript: '',
      });
    }

    setDraggedChange(null);
    setDropTarget(null);
  };

  const handleArchiveDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedChange) return;

    if (draggedChange.workflowStatus === 'applied') {
      setDropTarget('archived');
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const artifactLabels: Record<ArtifactType, string> = {
    proposal: 'Proposal',
    design: 'Design',
    tasks: 'Tasks'
  };

  const ChangeCard = ({ change }: { change: Change }) => {
    const hasArtifacts = Object.keys(change.artifacts).length > 0;
    const isDragging = draggedChange?.id === change.id;

    return (
      <div
        className={`${styles.changeCard} ${isDragging ? styles.dragging : ''}`}
        onClick={() => openChangeModal(change)}
        draggable
        onDragStart={(e) => handleDragStart(e, change)}
        onDragEnd={handleDragEnd}
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
    const isDropTarget = dropTarget === stage.id;

    return (
      <div
        className={`${styles.column} ${isDropTarget ? styles.dropTarget : ''}`}
        onDragOver={(e) => handleDragOver(e, stage.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, stage.id)}
      >
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
      {/* Start New Change button */}
      <button className={styles.addButton} onClick={openWizardForNew}>
        + Start New Change
      </button>

      <div className={styles.board}>
        {WORKFLOW_STAGES.map(stage => (
          <StageColumn key={stage.id} stage={stage} />
        ))}

        {/* Archived column - accepts drops from Applied */}
        <div
          className={`${styles.column} ${dropTarget === 'archived' ? styles.dropTarget : ''}`}
          onDragOver={handleArchiveDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleArchiveDrop}
        >
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

              {/* Advance button - opens wizard */}
              {getStageForChange(selectedChange)?.nextAction && (
                <button
                  className={styles.advanceButton}
                  onClick={() => openWizardForAdvance(selectedChange)}
                >
                  {getStageForChange(selectedChange)?.nextAction.label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advance Wizard Modal */}
      {wizardState?.isOpen && (
        <div className={styles.modalOverlay} onClick={closeWizard}>
          <div className={styles.wizardModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.wizardHeader}>
              <span className={styles.wizardTitle}>
                {wizardState.mode === 'new' ? 'Start New Change' : `Advance to ${
                  wizardState.action === 'propose' ? 'Proposed' :
                  wizardState.action === 'apply' ? 'Applied' :
                  'Archived'
                }`}
              </span>
              <button className={styles.modalClose} onClick={closeWizard}>×</button>
            </div>

            <div className={styles.wizardContent}>
              {/* Change name input (editable for new, read-only for advance) */}
              <div className={styles.wizardField}>
                <label className={styles.wizardLabel}>Change Name</label>
                {wizardState.mode === 'new' ? (
                  <>
                    <input
                      type="text"
                      className={`${styles.wizardInput} ${
                        wizardState.changeName && !isValidChangeName(wizardState.changeName)
                          ? styles.wizardInputError
                          : ''
                      }`}
                      value={wizardState.changeName}
                      onChange={(e) => updateWizardField('changeName', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="my-new-feature"
                      autoFocus
                    />
                    <span className={styles.wizardHint}>
                      kebab-case, will become folder name
                    </span>
                    {wizardState.changeName && !isValidChangeName(wizardState.changeName) && (
                      <span className={styles.wizardError}>
                        Must be kebab-case (e.g., my-feature-name)
                      </span>
                    )}
                  </>
                ) : (
                  <div className={styles.wizardReadOnly}>{wizardState.changeName}</div>
                )}
              </div>

              {/* Action selection (only for new mode) */}
              {wizardState.mode === 'new' && (
                <div className={styles.wizardField}>
                  <label className={styles.wizardLabel}>How do you want to start?</label>
                  <div className={styles.wizardRadioGroup}>
                    <label className={styles.wizardRadio}>
                      <input
                        type="radio"
                        name="action"
                        checked={wizardState.action === 'explore'}
                        onChange={() => updateWizardField('action', 'explore')}
                      />
                      <span className={styles.wizardRadioLabel}>
                        <strong>Explore first</strong>
                        <span>I have a vague idea to investigate</span>
                      </span>
                    </label>
                    <label className={styles.wizardRadio}>
                      <input
                        type="radio"
                        name="action"
                        checked={wizardState.action === 'propose'}
                        onChange={() => updateWizardField('action', 'propose')}
                      />
                      <span className={styles.wizardRadioLabel}>
                        <strong>Propose now</strong>
                        <span>I know what I want to build</span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action display (for advance mode) */}
              {wizardState.mode === 'advance' && (
                <div className={styles.wizardField}>
                  <label className={styles.wizardLabel}>Action</label>
                  <div className={styles.wizardReadOnly}>
                    <code>/opsx:{wizardState.action}</code>
                  </div>
                </div>
              )}

              {/* Transcript/instructions textarea */}
              <div className={styles.wizardField}>
                <label className={styles.wizardLabel}>
                  {wizardState.mode === 'new' ? 'Transcript / Instructions' : 'Additional Context'}
                  {wizardState.mode === 'advance' && <span className={styles.wizardOptional}>(optional)</span>}
                </label>
                <textarea
                  className={`${styles.wizardTextarea} ${
                    wizardState.transcript.length > TRANSCRIPT_CHAR_LIMIT ? styles.wizardInputError : ''
                  }`}
                  value={wizardState.transcript}
                  onChange={(e) => updateWizardField('transcript', e.target.value)}
                  placeholder={
                    wizardState.mode === 'new'
                      ? 'Brief description to get started. You can add the full transcript in the GitHub issue before submitting...'
                      : 'Add context for this step. You can add more detail in the GitHub issue before submitting...'
                  }
                  rows={6}
                />
                <div className={styles.wizardCharCount}>
                  <span className={
                    wizardState.transcript.length > TRANSCRIPT_CHAR_LIMIT
                      ? styles.wizardCharCountError
                      : wizardState.transcript.length > TRANSCRIPT_WARNING_THRESHOLD
                      ? styles.wizardCharCountWarning
                      : ''
                  }>
                    {wizardState.transcript.length.toLocaleString()} / {TRANSCRIPT_CHAR_LIMIT.toLocaleString()}
                  </span>
                  {wizardState.transcript.length > TRANSCRIPT_WARNING_THRESHOLD &&
                   wizardState.transcript.length <= TRANSCRIPT_CHAR_LIMIT && (
                    <span className={styles.wizardCharCountHint}>
                      Approaching limit - you can add more in the GitHub issue
                    </span>
                  )}
                  {wizardState.transcript.length > TRANSCRIPT_CHAR_LIMIT && (
                    <span className={styles.wizardCharCountHint}>
                      Over limit - trim here, then paste full transcript in GitHub issue
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.wizardFooter}>
              <button className={styles.wizardCancelButton} onClick={closeWizard}>
                Cancel
              </button>
              <button
                className={styles.wizardSubmitButton}
                onClick={handleWizardSubmit}
                disabled={!isWizardValid()}
              >
                Create GitHub Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
