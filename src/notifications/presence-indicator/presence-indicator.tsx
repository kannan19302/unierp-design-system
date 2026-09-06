"use client";

import React from "react";
import styles from "./presence-indicator.module.css";

export interface PresenceIndicatorProps { status: 'online' | 'away' | 'busy' | 'offline' | 'dnd'; name?: string; avatar?: string; statusMessage?: string; size?: 'sm' | 'md' | 'lg'; }

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = (props) => {
  const { status, name, avatar, statusMessage, size = 'md' } = props;
  const colors = { online: 'var(--color-success, #10b981)', away: 'var(--color-warning, #f59e0b)', busy: 'var(--color-error, #ef4444)', offline: '#94a3b8', dnd: 'var(--color-error, #ef4444)' };
  const labels = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline', dnd: 'Do Not Disturb' };
  const sizes = { sm: 24, md: 32, lg: 40 };
  const dotSizes = { sm: 8, md: 10, lg: 12 };
  const sz = sizes[size];
  return (
    <div className={styles.container} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-1)' }} role="status" aria-label={`${name || 'User'} is ${labels[status]}`}>
      <div style={{ position: 'relative', width: sz, height: sz }}>
        <div style={{ width: sz, height: sz, borderRadius: '50%', background: avatar ? undefined : 'var(--color-brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: sz * 0.4, color: 'var(--color-brand)' }}>{name ? name[0]?.toUpperCase() : '?'}</div>
        <span style={{ position: 'absolute', bottom: -1, right: -1, width: dotSizes[size], height: dotSizes[size], borderRadius: '50%', background: colors[status], border: '2px solid var(--color-surface-elevated, #fff)' }} />
      </div>
      {name && <div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium, 500)' }}>{name}</div>{statusMessage && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{statusMessage}</div>}</div>}
    </div>
  );
};
