import React from 'react';
import Layout from '@theme/Layout';
import { ArchivedChange } from '../../types/archive';
import ArchiveList from '../ArchiveList';
import styles from './styles.module.css';

interface Props {
  changes: ArchivedChange[];
}

export default function ArchivePage({ changes }: Props) {
  return (
    <Layout title="Archive" description="Historical record of archived OpenSpec changes">
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Archive</h1>
            <p className={styles.description}>
              Historical record of changes that have completed the OpenSpec workflow.
            </p>
          </div>
          <div className={styles.meta}>
            <span className={styles.count}>
              {changes.length} {changes.length === 1 ? 'change' : 'changes'}
            </span>
          </div>
        </div>

        <div className={styles.content}>
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
