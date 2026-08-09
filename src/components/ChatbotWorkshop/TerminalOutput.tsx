import React from 'react';
import styles from './styles.module.css';

interface TerminalLine {
  text: string;
  status?: 'pass' | 'fail' | 'neutral';
  indent?: number;
}

interface TerminalOutputProps {
  lines: TerminalLine[];
  title?: string;
}

export default function TerminalOutput({
  lines,
  title = '$ promptfoo eval'
}: TerminalOutputProps): React.ReactElement {
  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalDots}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        <span className={styles.terminalTitle}>Terminal</span>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.terminalCommand}>{title}</div>
        <div className={styles.terminalOutput}>
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${styles.terminalLine} ${
                line.status === 'pass' ? styles.linePass :
                line.status === 'fail' ? styles.lineFail : ''
              }`}
              style={{ paddingLeft: line.indent ? `${line.indent * 1.5}rem` : undefined }}
            >
              {line.status === 'pass' && <span className={styles.statusIcon}>✅</span>}
              {line.status === 'fail' && <span className={styles.statusIcon}>❌</span>}
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
