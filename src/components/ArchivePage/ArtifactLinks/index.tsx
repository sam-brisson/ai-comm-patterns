import React from 'react';
import styles from './styles.module.css';

interface Props {
  slug: string;
  artifacts: {
    proposal: boolean;
    design: boolean;
    tasks: boolean;
  };
}

const ARTIFACTS = [
  { key: 'proposal', label: 'Proposal', path: 'proposal' },
  { key: 'design', label: 'Design', path: 'design' },
  { key: 'tasks', label: 'Tasks', path: 'tasks' },
] as const;

export default function ArtifactLinks({ slug, artifacts }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Artifacts:</span>
      {ARTIFACTS.map(({ key, label, path }) => {
        const exists = artifacts[key];
        return exists ? (
          <a
            key={key}
            href={`/changes/${slug}/${path}`}
            className={styles.link}
            aria-label={`${label} for ${slug}`}
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
