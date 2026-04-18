import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Issue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubProjectBoardProps {
  owner: string;
  repo: string;
}

// Status columns matching the AI Knowledge Mgmt GitHub project
// Only showing active work columns (Done is viewable on GitHub)
const STATUS_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: '#6B7280' },
  { id: 'ready', label: 'Ready', color: '#10B981' },
  { id: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'in-review', label: 'In Review', color: '#8B5CF6' },
];

// Issue templates
const ISSUE_TEMPLATES = {
  propose: {
    title: 'Propose a Change',
    description: 'Generate artifacts from a conversation',
    color: '#10B981',
    icon: 'P',
    titlePrefix: '[Propose] ',
    bodyTemplate: `## Conversation Transcript

Paste your conversation here...

## Context

Any additional context about this change.`,
  },
  explore: {
    title: 'Explore an Idea',
    description: 'Analyze and document insights',
    color: '#6366F1',
    icon: 'E',
    titlePrefix: '[Explore] ',
    bodyTemplate: `## Topic

What are you exploring?

## Conversation Transcript

Paste your conversation here...`,
  },
};

type IssueType = 'propose' | 'explore';

export default function GitHubProjectBoard({ owner, repo }: GitHubProjectBoardProps): React.ReactElement {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<IssueType | null>(null);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');

  useEffect(() => {
    async function fetchIssues() {
      try {
        // Fetch propose and explore issues separately (labels param is AND, not OR)
        const cacheBuster = `&_=${Date.now()}`;
        const [proposeRes, exploreRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=50&labels=propose${cacheBuster}`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=50&labels=explore${cacheBuster}`)
        ]);

        if (!proposeRes.ok || !exploreRes.ok) {
          throw new Error('Failed to fetch issues');
        }

        const [proposeIssues, exploreIssues] = await Promise.all([
          proposeRes.json(),
          exploreRes.json()
        ]);

        // Combine and dedupe (in case an issue has both labels)
        const allIssues = [...proposeIssues, ...exploreIssues];
        const uniqueIssues = allIssues.filter((issue, index, self) =>
          index === self.findIndex(i => i.id === issue.id)
        );

        setIssues(uniqueIssues);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issues');
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [owner, repo]);

  const getIssueStatus = (issue: Issue): string => {
    const labelNames = issue.labels.map(l => l.name.toLowerCase());

    // Closed issues go to done (filtered out of display)
    if (issue.state === 'closed') return 'done';

    // Map labels to column IDs
    // Check for explicit status labels first
    if (labelNames.includes('in-review') || labelNames.includes('pending-review')) return 'in-review';
    if (labelNames.includes('in-progress')) return 'in-progress';
    if (labelNames.includes('ready')) return 'ready';
    if (labelNames.includes('backlog')) return 'backlog';

    // Default: open issues without status labels go to backlog
    return 'backlog';
  };

  const getIssueType = (issue: Issue): IssueType | null => {
    const labels = issue.labels.map(l => l.name.toLowerCase());
    if (labels.includes('propose')) return 'propose';
    if (labels.includes('explore')) return 'explore';
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const openNewIssueModal = (type: IssueType) => {
    const template = ISSUE_TEMPLATES[type];
    setModalType(type);
    setIssueTitle('');
    setIssueBody(template.bodyTemplate);
    setShowModal(true);
    setShowTemplateMenu(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setIssueTitle('');
    setIssueBody('');
  };

  const submitToGitHub = () => {
    if (!modalType) return;

    const template = ISSUE_TEMPLATES[modalType];
    const fullTitle = template.titlePrefix + issueTitle;
    const url = `https://github.com/${owner}/${repo}/issues/new?labels=${modalType}&title=${encodeURIComponent(fullTitle)}&body=${encodeURIComponent(issueBody)}`;

    window.open(url, '_blank');
    closeModal();
  };

  const IssueCard = ({ issue }: { issue: Issue }) => (
    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className={styles.issueCard}>
      <div className={styles.issueHeader}>
        <span className={styles.issueNumber}>#{issue.number}</span>
        <span className={styles.issueDate}>{formatDate(issue.created_at)}</span>
      </div>
      <div className={styles.issueTitle}>{issue.title}</div>
      <div className={styles.issueLabels}>
        {issue.labels
          .filter(label => !['propose', 'explore', 'backlog', 'ready', 'in-progress', 'in-review', 'in review', 'review', 'done'].includes(label.name.toLowerCase()))
          .map(label => (
            <span
              key={label.name}
              className={styles.label}
              style={{ backgroundColor: `#${label.color}` }}
            >
              {label.name}
            </span>
          ))}
      </div>
    </a>
  );

  const StatusColumn = ({ status }: { status: typeof STATUS_COLUMNS[0] }) => {
    const proposeIssues = issues.filter(i => getIssueType(i) === 'propose' && getIssueStatus(i) === status.id);
    const exploreIssues = issues.filter(i => getIssueType(i) === 'explore' && getIssueStatus(i) === status.id);
    const totalCount = proposeIssues.length + exploreIssues.length;

    return (
      <div className={styles.column}>
        <div className={styles.columnHeader} style={{ borderTopColor: status.color }}>
          <span className={styles.columnTitle}>{status.label}</span>
          <span className={styles.columnCount}>{totalCount}</span>
        </div>
        <div className={styles.columnContent}>
          {proposeIssues.length > 0 && (
            <div className={styles.swimlaneSection}>
              <div className={styles.swimlaneLabel} style={{ color: ISSUE_TEMPLATES.propose.color }}>
                Propose
              </div>
              {proposeIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
          {exploreIssues.length > 0 && (
            <div className={styles.swimlaneSection}>
              <div className={styles.swimlaneLabel} style={{ color: ISSUE_TEMPLATES.explore.color }}>
                Explore
              </div>
              {exploreIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
          {totalCount === 0 && (
            <div className={styles.emptyColumn}>No issues</div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading issues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error}
          <a
            href={`https://github.com/${owner}/${repo}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fallbackLink}
          >
            View issues on GitHub →
          </a>
        </div>
      </div>
    );
  }

  const currentTemplate = modalType ? ISSUE_TEMPLATES[modalType] : null;

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div
          className={styles.newIssueDropdown}
          onMouseLeave={() => setShowTemplateMenu(false)}
        >
          <button
            className={styles.newIssueButton}
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
          >
            + New Issue ▾
          </button>
          {showTemplateMenu && (
            <div className={styles.templateMenu}>
              <div className={styles.templateMenuInner}>
                <button
                  className={styles.templateOption}
                  onClick={() => openNewIssueModal('propose')}
                >
                  <span className={styles.templateIcon} style={{ backgroundColor: ISSUE_TEMPLATES.propose.color }}>P</span>
                  <div className={styles.templateInfo}>
                    <span className={styles.templateTitle}>{ISSUE_TEMPLATES.propose.title}</span>
                    <span className={styles.templateDesc}>{ISSUE_TEMPLATES.propose.description}</span>
                  </div>
                </button>
                <button
                  className={styles.templateOption}
                  onClick={() => openNewIssueModal('explore')}
                >
                  <span className={styles.templateIcon} style={{ backgroundColor: ISSUE_TEMPLATES.explore.color }}>E</span>
                  <div className={styles.templateInfo}>
                    <span className={styles.templateTitle}>{ISSUE_TEMPLATES.explore.title}</span>
                    <span className={styles.templateDesc}>{ISSUE_TEMPLATES.explore.description}</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        <a
          href="https://github.com/users/sam-brisson/projects/2/views/9"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewAllButton}
        >
          View all on GitHub
        </a>
      </div>
      <div className={styles.board}>
        {STATUS_COLUMNS.map(status => (
          <StatusColumn key={status.id} status={status} />
        ))}
      </div>

      {/* New Issue Modal */}
      {showModal && currentTemplate && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <span
                  className={styles.modalTypeIcon}
                  style={{ backgroundColor: currentTemplate.color }}
                >
                  {currentTemplate.icon}
                </span>
                <span className={styles.modalTitle}>{currentTemplate.title}</span>
              </div>
              <button className={styles.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <div className={styles.titleInputWrapper}>
                  <span className={styles.titlePrefix}>{currentTemplate.titlePrefix}</span>
                  <input
                    type="text"
                    className={styles.titleInput}
                    placeholder="Brief description of the change..."
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Details</label>
                <textarea
                  className={styles.bodyInput}
                  value={issueBody}
                  onChange={(e) => setIssueBody(e.target.value)}
                  rows={12}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.submitButton}
                onClick={submitToGitHub}
                disabled={!issueTitle.trim()}
                style={{ backgroundColor: currentTemplate.color }}
              >
                Create on GitHub →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
