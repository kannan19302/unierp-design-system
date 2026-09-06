"use client";

import React from "react";
import styles from "./escalation-alert-stack.module.css";

export interface EscalationAlertStackProps { alerts: EscalationAlert[]; onAcknowledge?: (id: string) => void; onSnooze?: (id: string) => void; }
export interface EscalationAlert { id: string; title: string; severity: 'critical' | 'high' | 'medium'; timestamp: string; source: string; }

export const EscalationAlertStack: React.FC<EscalationAlertStackProps> = (props) => {
  const { alerts, onAcknowledge, onSnooze } = props;
  const severityColors = { critical: 'var(--color-error)', high: 'var(--color-warning)', medium: 'var(--color-info)' };
  return (
    <div className={styles.container} role="alert" aria-label="Escalation alerts" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {alerts.map(a => (
        <div key={a.id} className={styles.item} style={{ borderLeftWidth: 3, borderLeftColor: severityColors[a.severity], flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{a.title}</span>
            <span className={styles.tag} style={{ borderColor: severityColors[a.severity], color: severityColors[a.severity] }}>{a.severity}</span>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{a.source} • {a.timestamp}</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {onAcknowledge && <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onAcknowledge(a.id)} style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}>Acknowledge</button>}
            {onSnooze && <button className={styles.btn} onClick={() => onSnooze(a.id)} style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}>Snooze</button>}
          </div>
        </div>
      ))}
    </div>
  );
};
