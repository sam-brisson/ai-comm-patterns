import React from 'react';
import styles from './styles.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({
  code,
  language = 'yaml',
  filename
}: CodeBlockProps): React.ReactElement {
  return (
    <div className={styles.codeBlock}>
      {filename && (
        <div className={styles.codeFilename}>
          <span className={styles.fileIcon}>📄</span>
          {filename}
        </div>
      )}
      <pre className={styles.codeContent}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
