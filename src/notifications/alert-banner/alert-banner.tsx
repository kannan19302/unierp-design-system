"use client";

import React from "react";
import styles from "./alert-banner.module.css";

export interface AlertBannerProps { variant: 'info' | 'warning' | 'error' | 'success'; title: string; message?: string; dismissible?: boolean; onDismiss?: () => void; action?: { label: string; onClick: () => void }; }

export const AlertBanner: React.FC<AlertBannerProps> = (props) => {
  const { variant, title, message, dismissible = true, onDismiss, action } = props;
  const colors = { info: 'var(--color-info, #06b6d4)', warning: 'var(--color-warning, #f59e0b)', error: 'var(--color-error, #ef4444)', success: 'var(--color-success, #10b981)' };
  const icons = { info: 'ℹ', warning: '⚠', error: '✕', success: '✓' };
  return (
    <div className={styles.container} role="alert" style={{ borderColor: colors[variant], borderLeftWidth: 4, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
      <span style={{ color: colors[variant], fontSize: 'var(--text-lg)', flexShrink: 0 }}>{icons[variant]}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{title}</div>
        {message && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{message}</div>}
        {action && <button className={styles.btn} onClick={action.onClick} style={{ marginTop: 'var(--space-2)' }}>{action.label}</button>}
      </div>
      {dismissible && <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-lg)' }} aria-label="Dismiss">×</button>}
    </div>
  );
};
