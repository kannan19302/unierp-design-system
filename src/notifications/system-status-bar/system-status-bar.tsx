"use client";

import React from "react";
import styles from "./system-status-bar.module.css";

export interface SystemStatusBarProps { status: 'operational' | 'degraded' | 'outage' | 'maintenance'; message?: string; lastChecked?: string; incidentUrl?: string; }

export const SystemStatusBar: React.FC<SystemStatusBarProps> = (props) => {
  const { status, message, lastChecked, incidentUrl } = props;
  const config = { operational: { color: 'var(--color-success)', icon: '●', label: 'All Systems Operational' }, degraded: { color: 'var(--color-warning)', icon: '▲', label: 'Degraded Performance' }, outage: { color: 'var(--color-error)', icon: '■', label: 'Service Outage' }, maintenance: { color: 'var(--color-info)', icon: '◆', label: 'Scheduled Maintenance' } };
  const c = config[status];
  return (
    <div className={styles.container} role="status" aria-label="System status" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)' }}>
      <span style={{ color: c.color, fontSize: 'var(--text-sm)' }}>{c.icon}</span>
      <span style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)', color: c.color }}>{c.label}</span>
      {message && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>— {message}</span>}
      <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{lastChecked && `Last checked: ${lastChecked}`}</span>
      {incidentUrl && <a href={incidentUrl} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand)' }}>View Incident</a>}
    </div>
  );
};
