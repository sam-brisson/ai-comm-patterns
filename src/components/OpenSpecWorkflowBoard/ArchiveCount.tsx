import React from 'react';
import Link from '@docusaurus/Link';
import styles from './ArchiveCount.module.css';

interface Props {
  count: number;
}

export default function ArchiveCount({ count }: Props) {
  return (
    <Link
      to="/archive"
      className={styles.link}
      aria-label={`View ${count} archived ${count === 1 ? 'change' : 'changes'}`}
    >
      <span className={styles.badge}>
        <span className={styles.count}>{count}</span>
        <span className={styles.label}>Archived</span>
      </span>
    </Link>
  );
}
