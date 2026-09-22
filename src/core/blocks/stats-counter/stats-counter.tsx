"use client";

import React from "react";
import styles from "./stats-counter.module.css";

export interface StatsCounterProps { stats: StatItem[]; }
export interface StatItem { value: string; label: string; }

export const StatsCounter: React.FC<StatsCounterProps> = (props) => {
  const { stats } = props;
  return (
    <div className={styles.container} role="region" aria-label="Statistics">
      <div className={styles.grid} style={{ textAlign: 'center' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-3xl, 30px)', fontWeight: 'var(--weight-bold, 700)', color: 'var(--color-brand)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
