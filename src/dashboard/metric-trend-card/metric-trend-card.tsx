"use client";

import React from "react";
import styles from "./metric-trend-card.module.css";

export interface MetricTrendCardProps { label: string; value: string; change?: number; trend?: number[]; color?: string; }

export const MetricTrendCard: React.FC<MetricTrendCardProps> = (props) => {
  const { label, value, change, trend, color = 'var(--color-brand, #2563eb)' } = props;
  const sparkW = 80, sparkH = 24;
  const renderSparkline = (data: number[]) => {
    if (data.length < 2) return null;
    const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * sparkW},${sparkH - ((v - mn) / r) * (sparkH - 4) - 2}`).join(' ');
    return <svg width={sparkW} height={sparkH}><polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" /></svg>;
  };
  return (
    <div className={`${styles.container} ${styles.card}`} role="region" aria-label={label}>
      <div className={styles.label}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div>
          <div className={styles.value}>{value}</div>
          {change !== undefined && <span className={change >= 0 ? styles.badgePositive : styles.badgeNegative}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>}
        </div>
        {trend && renderSparkline(trend)}
      </div>
    </div>
  );
};
