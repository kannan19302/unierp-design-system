"use client";

import React from "react";
import styles from "./executive-summary-dashboard.module.css";

export interface ExecutiveSummaryDashboardProps { metrics: ExecutiveMetric[]; title?: string; period?: string; }
export interface ExecutiveMetric { label: string; value: string; change?: number; icon?: React.ReactNode; trend?: number[]; }

export const ExecutiveSummaryDashboard: React.FC<ExecutiveSummaryDashboardProps> = (props) => {
  const { metrics, title = 'Executive Summary', period = 'This Quarter' } = props;
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <div className={styles.header}>
        <div><h2 className={styles.title}>{title}</h2><p className={styles.subtitle}>{period}</p></div>
      </div>
      <div className={styles.grid}>
        {metrics.map((m, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.label}>{m.label}</div>
            <div className={styles.value}>{m.value}</div>
            {m.change !== undefined && <span className={m.change >= 0 ? styles.badgePositive : styles.badgeNegative}>{m.change >= 0 ? '↑' : '↓'} {Math.abs(m.change)}%</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
