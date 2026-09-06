"use client";

import React from "react";
import styles from "./cohort-retention-chart.module.css";

export interface CohortRetentionChartProps {
  cohorts: CohortRow[];
  periodLabel?: string;
}

export interface CohortRow {
  label: string;
  initialSize: number;
  retentionPcts: number[];
}

export const CohortRetentionChart: React.FC<CohortRetentionChartProps> = (props) => {
  const { cohorts, periodLabel = 'Week' } = props;
  const maxPeriods = Math.max(...cohorts.map(c => c.retentionPcts.length));

  const getColor = (pct: number) => {
    if (pct >= 80) return 'var(--color-success, #10b981)';
    if (pct >= 50) return 'var(--color-warning, #f59e0b)';
    if (pct >= 20) return 'var(--color-info, #06b6d4)';
    return 'var(--color-error, #ef4444)';
  };

  const getOpacity = (pct: number) => Math.max(0.15, pct / 100);

  return (
    <div className={styles.container}>
      <table className={styles.table} aria-label="Cohort retention chart">
        <thead>
          <tr>
            <th className={styles.th}>Cohort</th>
            <th className={styles.th}>Users</th>
            {Array.from({ length: maxPeriods }, (_, i) => (
              <th key={i} className={styles.th}>{periodLabel} {i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((row, ri) => (
            <tr key={ri}>
              <td className={styles.td}>{row.label}</td>
              <td className={styles.tdNum}>{row.initialSize.toLocaleString()}</td>
              {Array.from({ length: maxPeriods }, (_, pi) => {
                const pct = row.retentionPcts[pi];
                if (pct === undefined) return <td key={pi} className={styles.tdEmpty} />;
                return (
                  <td key={pi} className={styles.tdCell} style={{ background: getColor(pct), opacity: getOpacity(pct) }}>
                    {pct}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
