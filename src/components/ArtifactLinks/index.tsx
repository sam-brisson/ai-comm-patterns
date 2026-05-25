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

const ARTIFACT_LABELS: { key: keyof Props['artifacts']; label: string; file: string }[] = [
  { key: 'proposal', label: 'Proposal', file: 'proposal' },
  { key: 'design', label: 'Design', file: 'design' },
  { key: 'tasks', label: 'Tasks', file: 'tasks' },
];

export default function ArtifactLinks({ slug, artifacts }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Artifacts:</span>
      <div className={styles.links}>
        {ARTIFACT_LABELS.map(({ key, label, file }) => {
          const exists = artifacts[key];
          const href = `/changes/${slug}/${file}`;
          return exists ? (
            <a
              key={key}
              href={href}
              className={styles.link}
              aria-label={`View ${label} for ${slug}`}
            >
              {label}
            </a>
          ) : (
            <span
              key={key}
              className={styles.linkDisabled}
              aria-label={`${label} not available`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
