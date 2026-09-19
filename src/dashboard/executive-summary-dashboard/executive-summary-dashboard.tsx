"use client";

import React, { forwardRef } from "react";
import styles from "./executive-summary-dashboard.module.css";

export interface ExecutiveMetric {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: number[];
}

export interface ExecutiveSummaryDashboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  metrics: ExecutiveMetric[];
  title?: string;
  period?: string;
}

/**
 * ExecutiveSummaryDashboard
 *
 * C-Suite high-level operational overview board rendering core business metrics,
 * revenue runs, customer counts, and period comparisons.
 *
 * @maturity stable
 */
export const ExecutiveSummaryDashboard = forwardRef<
  HTMLDivElement,
  ExecutiveSummaryDashboardProps
>(function ExecutiveSummaryDashboard(
  {
    metrics,
    title = "Executive Summary",
    period = "This Quarter",
    className,
    ...restProps
  },
  ref
) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="region"
      aria-label={title}
      {...restProps}
    >
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{period}</p>
        </div>
      </div>
      <div className={styles.grid}>
        {metrics.map((m, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.label}>{m.label}</div>
            <div className={styles.value}>{m.value}</div>
            {m.change !== undefined && (
              <span
                className={
                  m.change >= 0 ? styles.badgePositive : styles.badgeNegative
                }
              >
                {m.change >= 0 ? "↑" : "↓"} {Math.abs(m.change)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

ExecutiveSummaryDashboard.displayName = "ExecutiveSummaryDashboard";
