"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./sparkline.module.css";

export interface SparklineGridRow {
  label: string;
  values: number[];
  current: string | number;
  change?: number;
}

export const sparklineGridVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type SparklineGridDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface SparklineGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sparklineGridVariants> {
  rows: SparklineGridRow[];
  columns?: string[];
  density?: SparklineGridDensity;
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
      density = "standard",
      className = "",
      ...rest
    },
    ref
  ) => {
    const MiniSparkline = ({ data }: { data: number[] }) => {
      if (data.length < 2) return null;
      const w = density === "ultra-compact" ? 60 : density === "compact" ? 70 : density === "comfortable" ? 100 : 80;
      const h = density === "ultra-compact" ? 14 : density === "compact" ? 16 : density === "comfortable" ? 24 : 20;
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
        <svg width={w} height={h} aria-hidden="true" data-slot="sparkline-mini-chart">
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
        data-slot="sparkline-grid"
        data-density={density}
        className={sparklineGridVariants({ density, className })}
        {...rest}
      >
        <table className={styles.table} data-slot="sparkline-table" aria-label="Sparkline grid">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} scope="col" className={styles.th} data-slot="sparkline-header-cell">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={styles.row} data-slot="sparkline-row">
                <td className={styles.td} data-slot="sparkline-cell">{row.label}</td>
                <td className={styles.tdChart} data-slot="sparkline-chart-cell">
                  <MiniSparkline data={row.values} />
                </td>
                <td className={styles.tdNum} data-slot="sparkline-num-cell">{row.current}</td>
                <td className={styles.tdChange} data-slot="sparkline-change-cell">
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

export const Sparkline = SparklineGrid;
