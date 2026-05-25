import React from 'react';
import styles from './styles.module.css';
import type { LinkedItem } from '../../../types/archive';

interface Props {
  prs: LinkedItem[];
  issues: LinkedItem[];
}

function Badge({ item, type }: { item: LinkedItem; type: 'pr' | 'issue' }) {
  const isValidUrl = item.url && item.url.startsWith('http');
  if (!isValidUrl) return null;

  const truncated = item.title.length > 40 ? item.title.slice(0, 37) + '...' : item.title;
  const prefix = type === 'pr' ? 'PR' : '#';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.badge} ${type === 'pr' ? styles.prBadge : styles.issueBadge}`}
      title={`${item.title} (opens in new tab)`}
      aria-label={`${type === 'pr' ? 'Pull Request' : 'Issue'} ${item.number}: ${item.title}, opens in new tab`}
    >
      <span className={styles.number}>{prefix}{item.number}</span>
      <span className={styles.title}>{truncated}</span>
    </a>
  );
}

function Group({ label, items, type }: { label: string; items: LinkedItem[]; type: 'pr' | 'issue' }) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>{label}:</span>
      {items.length === 0 ? (
        <span className={styles.none}>None</span>
      ) : (
        items.map(item => <Badge key={item.number} item={item} type={type} />)
      )}
    </div>
  );
}

export default function LinkedItemsControl({ prs, issues }: Props) {
  if (prs.length === 0 && issues.length === 0) return null;

  return (
    <div className={styles.container}>
      {prs.length > 0 && <Group label="PRs" items={prs} type="pr" />}
      {issues.length > 0 && <Group label="Issues" items={issues} type="issue" />}
    </div>
  );
}
