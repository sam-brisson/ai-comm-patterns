import React from 'react';
import styles from './styles.module.css';
import ArchiveCard from '../ArchiveCard';

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
  changes: Change[];
}

export default function ArchiveList({ changes }: Props) {
  const sorted = [...changes].sort(
    (a, b) => new Date(b.archivedAt || '').getTime() - new Date(a.archivedAt || '').getTime()
  );

  return (
    <ul className={styles.list}>
      {sorted.map(change => (
        <li key={change.id} className={styles.item}>
          <ArchiveCard change={change} />
        </li>
      ))}
    </ul>
  );
}
