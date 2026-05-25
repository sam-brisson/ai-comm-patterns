import React from 'react';
import styles from './styles.module.css';
import ArtifactLinks from '../ArtifactLinks';
import LinkedItemsControl from '../LinkedItemsControl';
import type { ArchivedChange } from '../../../types/archive';

interface Props {
  change: ArchivedChange;
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
        <h3 className={styles.title}>{change.title}</h3>
        <span className={styles.date}>
          <span className={styles.dateLabel}>Archived </span>
          <time dateTime={change.archivedAt}>{formatDate(change.archivedAt)}</time>
        </span>
      </div>
      <div className={styles.body}>
        <ArtifactLinks slug={change.slug} artifacts={change.artifacts} />
        <LinkedItemsControl prs={change.links.prs} issues={change.links.issues} />
      </div>
    </article>
  );
}
