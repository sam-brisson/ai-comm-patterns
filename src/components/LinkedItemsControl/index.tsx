import React from 'react';
import { LinkedItem } from '../../types/archive';
import styles from './styles.module.css';

interface Props {
  prs: LinkedItem[];
  issues: LinkedItem[];
}

function Badge({ item, type }: { item: LinkedItem; type: 'pr' | 'issue' }) {
  const prefix = type === 'pr' ? 'PR' : '#';
  const isValid = item.url && item.url.startsWith('http');
  if (!isValid) return null;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.badge} ${type === 'pr' ? styles.badgePr : styles.badgeIssue}`}
      title={item.title}
      aria-label={`${type === 'pr' ? 'Pull Request' : 'Issue'} ${item.number}: ${item.title} (opens in new tab)`}
    >
      <span className={styles.badgePrefix}>{prefix}</span>
      <span className={styles.badgeNumber}>{item.number}</span>
      <span className={styles.badgeTitle}>{item.title}</span>
      <span className={styles.srOnly}> (opens in new tab)</span>
    </a>
  );
}

function Group({ label, items, type }: { label: string; items: LinkedItem[]; type: 'pr' | 'issue' }) {
  if (items.length === 0) return null;
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>{label}:</span>
      <div className={styles.badges}>
        {items.map((item) => (
          <Badge key={item.number} item={item} type={type} />
        ))}
      </div>
    </div>
  );
}

export default function LinkedItemsControl({ prs, issues }: Props) {
  if (prs.length === 0 && issues.length === 0) return null;
  return (
    <div className={styles.container}>
      <Group label="PRs" items={prs} type="pr" />
      <Group label="Issues" items={issues} type="issue" />
    </div>
  );
}
