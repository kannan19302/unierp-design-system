"use client";

import React, { forwardRef } from "react";
import styles from "./cohort-retention-chart.module.css";

export interface CohortRow {
  label: string;
  initialSize: number;
  retentionPcts: number[];
}

export interface CohortRetentionChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  cohorts: CohortRow[];
  periodLabel?: string;
}

/**
 * CohortRetentionChart displays customer or user group lifecycle retention percentages
 * structured in a triangular cohort matrix with dynamic color scaling.
 *
 * @maturity stable
 */
export const CohortRetentionChart = forwardRef<
  HTMLDivElement,
  CohortRetentionChartProps
>(({ cohorts, periodLabel = "Week", className = "", ...rest }, ref) => {
  const maxPeriods = Math.max(...cohorts.map((c) => c.retentionPcts.length), 0);

  const getColor = (pct: number) => {
    if (pct >= 80) return "var(--color-success)";
    if (pct >= 50) return "var(--color-warning)";
    if (pct >= 20) return "var(--color-info)";
    return "var(--color-error)";
  };

  const getOpacity = (pct: number) => Math.max(0.15, pct / 100);

  return (
    <div
      ref={ref}
      className={`${styles.container} ${className}`.trim()}
      {...rest}
    >
      <table className={styles.table} aria-label="Cohort retention chart">
        <thead>
          <tr>
            <th scope="col" className={styles.th}>
              Cohort
            </th>
            <th scope="col" className={styles.th}>
              Users
            </th>
            {Array.from({ length: maxPeriods }, (_, i) => (
              <th key={i} scope="col" className={styles.th}>
                {periodLabel} {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((row, ri) => (
            <tr key={ri} className={styles.row}>
              <td className={styles.td}>{row.label}</td>
              <td className={styles.tdNum}>
                {row.initialSize.toLocaleString()}
              </td>
              {Array.from({ length: maxPeriods }, (_, pi) => {
                const pct = row.retentionPcts[pi];
                if (pct === undefined) {
                  return <td key={pi} className={styles.tdEmpty} />;
                }
                return (
                  <td
                    key={pi}
                    className={styles.tdCell}
                    style={{
                      background: getColor(pct),
                      opacity: getOpacity(pct),
                    }}
                  >
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
});

CohortRetentionChart.displayName = "CohortRetentionChart";
