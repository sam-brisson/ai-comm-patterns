import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import ArchiveList from './ArchiveList';
import type { ArchivedChange } from '../../types/archive';

interface Props {
  changes: ArchivedChange[];
}

export default function ArchivePage({ changes }: Props) {
  return (
    <Layout
      title="Archive"
      description="Historical record of all archived OpenSpec changes"
    >
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.heading}>Archive</h1>
            <p className={styles.description}>
              Completed and archived changes — a historical record of work that has moved through the OpenSpec workflow.
            </p>
            {changes.length > 0 && (
              <span className={styles.count}>
                {changes.length} archived {changes.length === 1 ? 'change' : 'changes'}
              </span>
            )}
          </header>

          {changes.length === 0 ? (
            <div className={styles.empty}>
              <p>No archived changes yet.</p>
            </div>
          ) : (
            <ArchiveList changes={changes} />
          )}
        </div>
      </main>
    </Layout>
  );
}
