import React from 'react';
import styles from './styles.module.css';

interface Props {
  changeId: string;
  artifacts: {
    proposal?: string;
    design?: string;
    tasks?: string;
  };
}

const ARTIFACTS = [
  { key: 'proposal', label: 'Proposal' },
  { key: 'design', label: 'Design' },
  { key: 'tasks', label: 'Tasks' },
] as const;

export default function ArtifactLinks({ changeId, artifacts }: Props) {
  const hasAny = ARTIFACTS.some(({ key }) => artifacts[key]);

  if (!hasAny) {
    return null;
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Artifacts:</span>
      {ARTIFACTS.map(({ key, label }) => {
        const exists = !!artifacts[key];
        return exists ? (
          <a
            key={key}
            href={`/docs/collaboration/openspec-changes/${changeId}#${key}`}
            className={styles.link}
            aria-label={`${label} for ${changeId}`}
          >
            {label}
          </a>
        ) : (
          <span
            key={key}
            className={styles.disabled}
            aria-label={`${label} not available`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
