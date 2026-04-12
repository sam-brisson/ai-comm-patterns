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

// Status columns matching the AI Knowledge Mgmt project
const STATUS_COLUMNS = [
  { id: 'new', label: 'New', color: '#6366F1' },
  { id: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'review', label: 'Review', color: '#8B5CF6' },
  { id: 'done', label: 'Done', color: '#10B981' },
];

// Issue templates
const ISSUE_TEMPLATES = {
  propose: {
    title: 'Propose a Change',
    template: 'openspec-propose',
    description: 'Generate artifacts from a conversation',
    color: '#10B981',
  },
  explore: {
    title: 'Explore an Idea',
    template: 'openspec-explore',
    description: 'Analyze and document insights',
    color: '#6366F1',
  },
};

export default function GitHubProjectBoard({ owner, repo }: GitHubProjectBoardProps): React.ReactElement {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=50&labels=propose,explore`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }
        const data = await response.json();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issues');
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [owner, repo]);

  const getIssueStatus = (issue: Issue): string => {
    // Check for status labels
    const statusLabels = issue.labels.map(l => l.name.toLowerCase());
    if (statusLabels.includes('done') || issue.state === 'closed') return 'done';
    if (statusLabels.includes('in-progress') || statusLabels.includes('in progress')) return 'in-progress';
    if (statusLabels.includes('review') || statusLabels.includes('in-review')) return 'review';
    return 'new';
  };

  const getIssueType = (issue: Issue): 'propose' | 'explore' | null => {
    const labels = issue.labels.map(l => l.name.toLowerCase());
    if (labels.includes('propose')) return 'propose';
    if (labels.includes('explore')) return 'explore';
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const openIssueTemplate = (template: 'propose' | 'explore') => {
    const labels = template;
    const title = template === 'propose' ? '[Propose] ' : '[Explore] ';
    const body = template === 'propose'
      ? encodeURIComponent('## Conversation Transcript\n\nPaste your conversation here...\n\n## Context\n\nAny additional context about this change.')
      : encodeURIComponent('## Topic\n\nWhat are you exploring?\n\n## Conversation Transcript\n\nPaste your conversation here...');

    window.open(
      `https://github.com/${owner}/${repo}/issues/new?labels=${labels}&title=${title}&body=${body}`,
      '_blank'
    );
    setShowTemplateMenu(false);
  };

  const IssueCard = ({ issue }: { issue: Issue }) => {
    const issueType = getIssueType(issue);
    return (
      <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className={styles.issueCard}>
        <div className={styles.issueHeader}>
          <span className={styles.issueNumber}>#{issue.number}</span>
          <span className={styles.issueDate}>{formatDate(issue.created_at)}</span>
        </div>
        <div className={styles.issueTitle}>{issue.title}</div>
        <div className={styles.issueLabels}>
          {issue.labels
            .filter(label => !['propose', 'explore', 'new', 'in-progress', 'review', 'done'].includes(label.name.toLowerCase()))
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
  };

  const Swimlane = ({
    type,
    issues,
    statusId
  }: {
    type: 'propose' | 'explore';
    issues: Issue[];
    statusId: string;
  }) => {
    const filteredIssues = issues.filter(issue => {
      const issueType = getIssueType(issue);
      const issueStatus = getIssueStatus(issue);
      return issueType === type && issueStatus === statusId;
    });

    if (filteredIssues.length === 0) return null;

    return (
      <div className={styles.swimlane}>
        {filteredIssues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    );
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.newIssueDropdown}>
          <button
            className={styles.newIssueButton}
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
          >
            + New Issue ▾
          </button>
          {showTemplateMenu && (
            <div className={styles.templateMenu}>
              <button
                className={styles.templateOption}
                onClick={() => openIssueTemplate('propose')}
              >
                <span className={styles.templateIcon} style={{ backgroundColor: ISSUE_TEMPLATES.propose.color }}>P</span>
                <div className={styles.templateInfo}>
                  <span className={styles.templateTitle}>{ISSUE_TEMPLATES.propose.title}</span>
                  <span className={styles.templateDesc}>{ISSUE_TEMPLATES.propose.description}</span>
                </div>
              </button>
              <button
                className={styles.templateOption}
                onClick={() => openIssueTemplate('explore')}
              >
                <span className={styles.templateIcon} style={{ backgroundColor: ISSUE_TEMPLATES.explore.color }}>E</span>
                <div className={styles.templateInfo}>
                  <span className={styles.templateTitle}>{ISSUE_TEMPLATES.explore.title}</span>
                  <span className={styles.templateDesc}>{ISSUE_TEMPLATES.explore.description}</span>
                </div>
              </button>
            </div>
          )}
        </div>
        <a
          href={`https://github.com/${owner}/${repo}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewAllLink}
        >
          View all on GitHub →
        </a>
      </div>
      <div className={styles.board}>
        {STATUS_COLUMNS.map(status => (
          <StatusColumn key={status.id} status={status} />
        ))}
      </div>
    </div>
  );
}
