import React, { useState } from 'react';
import styles from './styles.module.css';

interface ArtifactViewerProps {
  filename: string;
  content: string;
  buttonText?: string;
  icon?: string;
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- \[x\] (.+)$/gm, '<div class="checkbox checked">✓ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="checkbox">☐ $1</div>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
}

export default function ArtifactViewer({
  filename,
  content,
  buttonText,
  icon = '📄'
}: ArtifactViewerProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={styles.artifactLink}
      >
        {icon} {buttonText || `View ${filename}`}
      </button>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalFilename}>{filename}</span>
              <button
                className={styles.modalClose}
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div
              className={styles.modalContent}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        </div>
      )}
    </>
  );
}
