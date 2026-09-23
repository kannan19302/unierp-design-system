"use client";

import React from "react";
import styles from "./form-version-history.module.css";

export interface FormVersionHistoryProps { versions: FormVersion[]; onRestore?: (versionId: string) => void; }
export interface FormVersion { id: string; timestamp: string; author: string; changes: string; isCurrent?: boolean; }

export const FormVersionHistory: React.FC<FormVersionHistoryProps> = (props) => {
  const { versions, onRestore } = props;
  return (
    <div className={styles.container} role="region" aria-label="Form version history">
      <h3 className={styles.title}>Version History</h3>
      <div className={styles.content}>
        {versions.map(v => (
          <div key={v.id} className={styles.item} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%' }}>
              <span style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{v.timestamp}</span>
              {v.isCurrent && <span className={styles.tag}>Current</span>}
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{v.author}</span>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{v.changes}</div>
            {!v.isCurrent && onRestore && <button className={styles.btn} style={{ marginTop: 'var(--space-2)', padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)' }} onClick={() => onRestore(v.id)}>Restore</button>}
          </div>
        ))}
      </div>
    </div>
  );
};
