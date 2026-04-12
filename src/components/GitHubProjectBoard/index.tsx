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

export default function GitHubProjectBoard({ owner, repo }: GitHubProjectBoardProps): React.ReactElement {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);

  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=20`
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

  const proposeIssues = issues.filter(issue =>
    issue.labels.some(label => label.name.toLowerCase() === 'propose')
  );
  const exploreIssues = issues.filter(issue =>
    issue.labels.some(label => label.name.toLowerCase() === 'explore')
  );
  const otherIssues = issues.filter(issue =>
    !issue.labels.some(label => ['propose', 'explore'].includes(label.name.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const IssueCard = ({ issue }: { issue: Issue }) => (
    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className={styles.issueCard}>
      <div className={styles.issueHeader}>
        <span className={styles.issueNumber}>#{issue.number}</span>
        <span className={styles.issueDate}>{formatDate(issue.created_at)}</span>
      </div>
      <div className={styles.issueTitle}>{issue.title}</div>
      <div className={styles.issueLabels}>
        {issue.labels.map(label => (
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

  const IssueColumn = ({ title, issues, color }: { title: string; issues: Issue[]; color: string }) => (
    <div className={styles.column}>
      <div className={styles.columnHeader} style={{ borderTopColor: color }}>
        <span className={styles.columnTitle}>{title}</span>
        <span className={styles.columnCount}>{issues.length}</span>
      </div>
      <div className={styles.columnContent}>
        {issues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <div className={styles.emptyColumn}>No issues</div>
        )}
      </div>
    </div>
  );

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
        <button
          className={styles.newIssueButton}
          onClick={() => window.open(`https://github.com/${owner}/${repo}/issues/new`, '_blank')}
        >
          + New Issue
        </button>
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
        <IssueColumn title="Propose" issues={proposeIssues} color="#10B981" />
        <IssueColumn title="Explore" issues={exploreIssues} color="#6366F1" />
        <IssueColumn title="Other" issues={otherIssues} color="#9CA3AF" />
      </div>
    </div>
  );
}
