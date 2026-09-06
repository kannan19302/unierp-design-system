"use client";

import React from "react";
import styles from "./real-time-metrics-board.module.css";

export interface RealTimeMetricsBoardProps { widgets: MetricWidget[]; refreshInterval?: number; title?: string; }
export interface MetricWidget { id: string; label: string; value: string | number; unit?: string; status?: 'normal' | 'warning' | 'critical'; }

export const RealTimeMetricsBoard: React.FC<RealTimeMetricsBoardProps> = (props) => {
  const { widgets, title = 'Real-Time Metrics' } = props;
  const statusColor = (s?: string) => s === 'critical' ? 'var(--color-error)' : s === 'warning' ? 'var(--color-warning)' : 'var(--color-success)';
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <div className={styles.header}><h2 className={styles.title}>{title}</h2><span className={styles.badge} style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)' }}>● Live</span></div>
      <div className={styles.grid}>
        {widgets.map(w => (
          <div key={w.id} className={styles.card}>
            <div className={styles.label}>{w.label}</div>
            <div className={styles.value} style={{ color: statusColor(w.status) }}>{w.value}{w.unit && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'normal' }}> {w.unit}</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
