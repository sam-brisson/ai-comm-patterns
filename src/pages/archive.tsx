import React from 'react';
import Layout from '@theme/Layout';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from '../components/ArchivePage/styles.module.css';

interface Change {
  id: string;
  title?: string;
  description?: string;
  workflowStatus?: string;
  archivedAt?: string;
  artifacts: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}

interface OpenSpecData {
  changes: Change[];
}

export default function Archive() {
  const { changes } = usePluginData('openspec-artifacts-plugin') as OpenSpecData;
  const archivedChanges = changes.filter(c => c.workflowStatus === 'archived');

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
            {archivedChanges.length > 0 && (
              <span className={styles.count}>
                {archivedChanges.length} archived {archivedChanges.length === 1 ? 'change' : 'changes'}
              </span>
            )}
          </header>

          {archivedChanges.length === 0 ? (
            <div className={styles.empty}>
              <p>No archived changes yet.</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {archivedChanges.map(change => (
                <li key={change.id} className={styles.card}>
                  <h3 className={styles.cardTitle}>{change.title || change.id}</h3>
                  {change.description && (
                    <p className={styles.cardDescription}>{change.description}</p>
                  )}
                  {change.archivedAt && (
                    <span className={styles.cardDate}>Archived {change.archivedAt}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Layout>
  );
}
