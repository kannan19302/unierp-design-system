"use client";

import React, { forwardRef } from "react";
import styles from "./sparkline-grid.module.css";

export interface SparklineGridRow {
  label: string;
  values: number[];
  current: string | number;
  change?: number;
}

export interface SparklineGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rows: SparklineGridRow[];
  columns?: string[];
}

/**
 * SparklineGrid displays dense tabular metrics accompanied by inline mini sparkline trendlines
 * and percentage variation indicators.
 *
 * @maturity stable
 */
export const SparklineGrid = forwardRef<HTMLDivElement, SparklineGridProps>(
  (
    {
      rows,
      columns = ["Metric", "Trend", "Current", "Change"],
      className = "",
      ...rest
    },
    ref
  ) => {
    const MiniSparkline = ({ data }: { data: number[] }) => {
      if (data.length < 2) return null;
      const w = 80;
      const h = 20;
      const mn = Math.min(...data);
      const mx = Math.max(...data);
      const r = mx - mn || 1;
      const pts = data
        .map(
          (v, i) =>
            `${(i / (data.length - 1)) * w},${
              h - ((v - mn) / r) * (h - 4) - 2
            }`
        )
        .join(" ");
      const isUp = (data[data.length - 1] ?? 0) >= (data[0] ?? 0);
      return (
        <svg width={w} height={h} aria-hidden="true">
          <polyline
            points={pts}
            fill="none"
            stroke={
              isUp
                ? "var(--color-success)"
                : "var(--color-error)"
            }
            strokeWidth={1.5}
          />
        </svg>
      );
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        {...rest}
      >
        <table className={styles.table} aria-label="Sparkline grid">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} scope="col" className={styles.th}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={styles.row}>
                <td className={styles.td}>{row.label}</td>
                <td className={styles.tdChart}>
                  <MiniSparkline data={row.values} />
                </td>
                <td className={styles.tdNum}>{row.current}</td>
                <td className={styles.tdChange}>
                  {row.change !== undefined && (
                    <span
                      style={{
                        color:
                          row.change >= 0
                            ? "var(--color-success)"
                            : "var(--color-error)",
                      }}
                    >
                      {row.change >= 0 ? "↑" : "↓"} {Math.abs(row.change)}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

SparklineGrid.displayName = "SparklineGrid";
