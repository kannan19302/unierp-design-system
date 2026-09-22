"use client";

import React, { forwardRef } from "react";
import styles from "./real-time-metrics-board.module.css";

export interface MetricWidget {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status?: "normal" | "warning" | "critical";
}

export interface RealTimeMetricsBoardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  widgets: MetricWidget[];
  refreshInterval?: number;
  title?: string;
}

/**
 * RealTimeMetricsBoard displays high-frequency streaming telemetry and operational metrics
 * with automated status color indicators and a live polling indicator.
 *
 * @maturity stable
 */
export const RealTimeMetricsBoard = forwardRef<
  HTMLDivElement,
  RealTimeMetricsBoardProps
>(({ widgets, refreshInterval: _refreshInterval, title = "Real-Time Metrics", className = "", ...rest }, ref) => {
  const statusColor = (s?: string) =>
    s === "critical"
      ? "var(--color-error)"
      : s === "warning"
      ? "var(--color-warning)"
      : "var(--color-success)";

  return (
    <div
      ref={ref}
      className={`${styles.container} ${className}`.trim()}
      role="region"
      aria-label={title}
      {...rest}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span
          className={styles.badge}
          style={{
            background: "var(--color-success-subtle)",
            color: "var(--color-success)",
          }}
        >
          ● Live
        </span>
      </div>
      <div className={styles.grid}>
        {widgets.map((w) => (
          <div key={w.id} className={styles.card}>
            <div className={styles.label}>{w.label}</div>
            <div
              className={styles.value}
              style={{ color: statusColor(w.status) }}
            >
              {w.value}
              {w.unit && (
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "normal",
                  }}
                >
                  {" "}
                  {w.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

RealTimeMetricsBoard.displayName = "RealTimeMetricsBoard";
