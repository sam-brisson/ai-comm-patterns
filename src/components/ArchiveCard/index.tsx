import React from 'react';
import { ArchivedChange } from '../../types/archive';
import ArtifactLinks from '../ArtifactLinks';
import LinkedItemsControl from '../LinkedItemsControl';
import styles from './styles.module.css';

interface Props {
  change: ArchivedChange;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ArchiveCard({ change }: Props) {
  return (
    <article className={styles.card} aria-label={`Archived change: ${change.title}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{change.title}</h3>
        <span className={styles.date} title={`Archived on ${change.archivedAt}`}>
          <span className={styles.archiveBadge}>Archived</span>
          {formatDate(change.archivedAt)}
        </span>
      </div>
      <div className={styles.body}>
        <ArtifactLinks slug={change.slug} artifacts={change.artifacts} />
        <LinkedItemsControl prs={change.links.prs} issues={change.links.issues} />
      </div>
    </article>
  );
}
