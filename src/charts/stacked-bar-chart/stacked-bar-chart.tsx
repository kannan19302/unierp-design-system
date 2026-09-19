"use client";

import React, { forwardRef } from "react";
import styles from "./stacked-bar-chart.module.css";

export interface StackedBarSeries {
  label: string;
  values: number[];
  color: string;
}

export interface StackedBarChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  categories: string[];
  series: StackedBarSeries[];
  height?: number;
  orientation?: "vertical" | "horizontal";
}

/**
 * StackedBarChart displays component breakdowns of aggregate categorical totals
 * using segmented vertical columns or horizontal stacked strips.
 *
 * @maturity stable
 */
export const StackedBarChart = forwardRef<
  HTMLDivElement,
  StackedBarChartProps
>(
  (
    {
      categories,
      series,
      height = 280,
      orientation = "vertical",
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const totals = categories.map((_, ci) =>
      series.reduce((s, sr) => s + (sr.values[ci] ?? 0), 0)
    );
    const maxTotal = Math.max(...totals, 1);

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        style={{ height, ...style }}
        role="img"
        aria-label="Stacked bar chart"
        {...rest}
      >
        <div
          className={
            orientation === "vertical"
              ? styles.barsVertical
              : styles.barsHorizontal
          }
        >
          {categories.map((cat, ci) => (
            <div key={cat || ci} className={styles.barStack}>
              <div
                className={styles.segments}
                style={
                  orientation === "vertical"
                    ? {
                        height: Math.max(
                          2,
                          ((totals[ci] ?? 0) / maxTotal) * (height - 60)
                        ),
                      }
                    : {
                        inlineSize: `${
                          ((totals[ci] ?? 0) / maxTotal) * 100
                        }%`,
                      }
                }
              >
                {series.map((sr, si) => {
                  const val = sr.values[ci] ?? 0;
                  const tot = totals[ci] ?? 1;
                  const pct = tot > 0 ? (val / tot) * 100 : 0;
                  return (
                    <div
                      key={sr.label || si}
                      style={
                        orientation === "vertical"
                          ? { height: `${pct}%`, background: sr.color }
                          : { inlineSize: `${pct}%`, background: sr.color }
                      }
                      className={styles.segment}
                      title={`${sr.label}: ${(
                        sr.values[ci] ?? 0
                      ).toLocaleString()}`}
                    />
                  );
                })}
              </div>
              <div className={styles.catLabel}>{cat}</div>
            </div>
          ))}
        </div>
        <div className={styles.legend}>
          {series.map((sr, i) => (
            <span key={sr.label || i} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: sr.color }}
              />
              {sr.label}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

StackedBarChart.displayName = "StackedBarChart";
