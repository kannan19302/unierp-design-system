"use client";

import React, { forwardRef } from "react";
import styles from "./waterfall-chart.module.css";

export interface WaterfallDataPoint {
  label: string;
  value: number;
  isTotal?: boolean;
}

export interface WaterfallChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: WaterfallDataPoint[];
  height?: number;
  showConnectors?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
}

/**
 * WaterfallChart visualizes the cumulative effect of sequentially introduced positive or negative values
 * leading to a net financial or operational total.
 *
 * @maturity stable
 */
export const WaterfallChart = forwardRef<HTMLDivElement, WaterfallChartProps>(
  (
    {
      data,
      height = 280,
      showConnectors: _showConnectors = true,
      positiveColor = "var(--color-success)",
      negativeColor = "var(--color-error)",
      totalColor = "var(--color-brand)",
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    void _showConnectors;
    const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 1);

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        style={{ height, ...style }}
        role="img"
        aria-label="Waterfall chart"
        {...rest}
      >
        <div className={styles.bars}>
          {data.map((d, i) => {
            const isTotal = d.isTotal;
            const barHeight =
              (Math.abs(d.value) / maxAbs) * (height - 60);
            const color = isTotal
              ? totalColor
              : d.value >= 0
              ? positiveColor
              : negativeColor;

            return (
              <div key={d.label || i} className={styles.barGroup}>
                <div className={styles.barValue} style={{ color }}>
                  {d.value >= 0 ? "+" : ""}
                  {d.value.toLocaleString()}
                </div>
                <div
                  className={styles.bar}
                  style={{
                    height: Math.max(4, barHeight),
                    background: color,
                    opacity: isTotal ? 1 : 0.85,
                  }}
                  title={`${d.label}: ${d.value}`}
                />
                <div className={styles.barLabel}>{d.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

WaterfallChart.displayName = "WaterfallChart";
