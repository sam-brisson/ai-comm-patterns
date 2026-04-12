import React from 'react';
import styles from './styles.module.css';

interface CodePanelProps {
  code: string;
  status: 'pass' | 'fail';
  comment?: string;
}

export default function CodePanel({
  code,
  status,
  comment,
}: CodePanelProps): React.ReactElement {
  return (
    <div className={styles.codePanel}>
      {comment && (
        <div className={styles.codeComment}># {comment}</div>
      )}
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
      <div className={`${styles.testStatus} ${status === 'pass' ? styles.testPass : styles.testFail}`}>
        {status === 'pass' ? '✅ PASSES' : '❌ FAILS'}
      </div>
    </div>
  );
}
