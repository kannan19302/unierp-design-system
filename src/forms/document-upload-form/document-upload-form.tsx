"use client";

import React from "react";
import styles from "./document-upload-form.module.css";

export interface DocumentUploadFormProps { acceptedTypes?: string[]; maxFiles?: number; onUpload?: (files: File[]) => void; }

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = (props) => {
  const { acceptedTypes = ['PDF', 'PNG', 'JPG'], maxFiles = 10 } = props;
  const [files] = React.useState<string[]>([]);
  return (
    <div className={styles.container} role="form" aria-label="Document upload form">
      <h3 className={styles.title}>Upload Documents</h3>
      <div className={styles.content}>
        <div style={{ border: '2px dashed var(--color-border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
          <div style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>📄</div>
          <div>Drag and drop files here, or click to browse</div>
          <div style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>Accepted: {acceptedTypes.join(', ')} • Max {maxFiles} files</div>
        </div>
        {files.length > 0 && <div className={styles.content}>{files.map((f, i) => <div key={i} className={styles.item}><span>📄</span><span>{f}</span></div>)}</div>}
      </div>
    </div>
  );
};
