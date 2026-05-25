import React from 'react';
import styles from './styles.module.css';
import ArchiveCard from '../ArchiveCard';
import type { ArchivedChange } from '../../../types/archive';

interface Props {
  changes: ArchivedChange[];
}

export default function ArchiveList({ changes }: Props) {
  const sorted = [...changes].sort(
    (a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
  );

  return (
    <ul className={styles.list}>
      {sorted.map(change => (
        <li key={change.slug} className={styles.item}>
          <ArchiveCard change={change} />
        </li>
      ))}
    </ul>
  );
}
