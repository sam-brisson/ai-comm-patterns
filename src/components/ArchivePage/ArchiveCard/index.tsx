import React from 'react';
import styles from './styles.module.css';
import ArtifactLinks from '../ArtifactLinks';

interface Change {
  id: string;
  title?: string;
  description?: string;
  archivedAt?: string;
  artifacts: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}

interface Props {
  change: Change;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ArchiveCard({ change }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{change.title || change.id}</h3>
        {change.archivedAt && (
          <span className={styles.date}>
            <span className={styles.dateLabel}>Archived </span>
            <time dateTime={change.archivedAt}>{formatDate(change.archivedAt)}</time>
          </span>
        )}
      </div>
      {change.description && (
        <p className={styles.description}>{change.description}</p>
      )}
      <div className={styles.body}>
        <ArtifactLinks changeId={change.id} artifacts={change.artifacts} />
      </div>
    </article>
  );
}
