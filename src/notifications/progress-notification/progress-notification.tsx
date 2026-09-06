"use client";

import React from "react";
import styles from "./progress-notification.module.css";

export interface ProgressNotificationProps { title: string; progress: number; status: 'running' | 'success' | 'error' | 'paused'; message?: string; onCancel?: () => void; onRetry?: () => void; }

export const ProgressNotification: React.FC<ProgressNotificationProps> = (props) => {
  const { title, progress, status, message, onCancel, onRetry } = props;
  const colors = { running: 'var(--color-brand)', success: 'var(--color-success)', error: 'var(--color-error)', paused: 'var(--color-warning)' };
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <span style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{title}</span>
        <span style={{ fontSize: 'var(--text-xs)', color: colors[status] }}>{progress}%</span>
      </div>
      <div className={styles.progress} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={title}><div className={styles.progressFill} style={{ width: `${progress}%`, background: colors[status] }} /></div>
      {message && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{message}</div>}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        {status === 'running' && onCancel && <button className={styles.btn} onClick={onCancel} style={{ fontSize: 'var(--text-xs)' }}>Cancel</button>}
        {status === 'error' && onRetry && <button className={styles.btn} onClick={onRetry} style={{ fontSize: 'var(--text-xs)' }}>Retry</button>}
      </div>
    </div>
  );
};
