import React from 'react';
import { ArchivedChange } from '../../types/archive';
import ArchiveCard from '../ArchiveCard';
import styles from './styles.module.css';

interface Props {
  changes: ArchivedChange[];
}

export default function ArchiveList({ changes }: Props) {
  return (
    <ul className={styles.list}>
      {changes.map((change) => (
        <li key={change.slug} className={styles.item}>
          <ArchiveCard change={change} />
        </li>
      ))}
    </ul>
  );
}
