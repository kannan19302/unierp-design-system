"use client";

import React from "react";
import styles from "./dashboard-widget-toolbar.module.css";

export interface DashboardWidgetToolbarProps { title: string; onRefresh?: () => void; onExpand?: () => void; onExport?: () => void; onEdit?: () => void; lastUpdated?: string; }

export const DashboardWidgetToolbar: React.FC<DashboardWidgetToolbarProps> = (props) => {
  const { title, onRefresh, onExpand, onExport, onEdit, lastUpdated } = props;
  return (
    <div className={styles.container} style={{ padding: 'var(--space-2) var(--space-3)' }} role="toolbar" aria-label={title + ' toolbar'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{title}</span>
          {lastUpdated && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Updated {lastUpdated}</span>}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {onRefresh && <button className={styles.btn} onClick={onRefresh} aria-label="Refresh" style={{ padding: 'var(--space-1)' }}>⟳</button>}
          {onExpand && <button className={styles.btn} onClick={onExpand} aria-label="Expand" style={{ padding: 'var(--space-1)' }}>⤢</button>}
          {onExport && <button className={styles.btn} onClick={onExport} aria-label="Export" style={{ padding: 'var(--space-1)' }}>↗</button>}
          {onEdit && <button className={styles.btn} onClick={onEdit} aria-label="Edit" style={{ padding: 'var(--space-1)' }}>✎</button>}
        </div>
      </div>
    </div>
  );
};
