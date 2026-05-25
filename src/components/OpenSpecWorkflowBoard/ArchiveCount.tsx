import React from 'react';
import styles from './ArchiveCount.module.css';

interface Props {
  count: number;
}

export default function ArchiveCount({ count }: Props) {
  return (
    <a
      href="/archive"
      className={styles.link}
      aria-label={`View ${count} archived ${count === 1 ? 'change' : 'changes'}`}
    >
      <span className={styles.badge}>
        <span className={styles.icon}>🗄️</span>
        <span className={styles.text}>
          {count} Archived
        </span>
        <span className={styles.arrow}>→</span>
      </span>
    </a>
  );
}
