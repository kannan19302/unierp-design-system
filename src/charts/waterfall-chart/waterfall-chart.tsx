"use client";

import React, { forwardRef } from "react";
import { cva } from "../../foundation/utils/cva";
import styles from "./waterfall-chart.module.css";

export interface WaterfallDataPoint {
  label: string;
  value: number;
  isTotal?: boolean;
}

export const waterfallChartVariants = cva(styles.container, {
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

export interface WaterfallChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: WaterfallDataPoint[];
  height?: number;
  showConnectors?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
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
      density = "standard",
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
        data-slot="waterfall-chart"
        data-density={density}
        className={waterfallChartVariants({ density, className })}
        style={{ blockSize: height, ...style }}
        role="img"
        aria-label="Waterfall chart"
        {...rest}
      >
        <div data-slot="waterfall-chart-bars" className={styles.bars}>
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
              <div
                key={d.label || i}
                data-slot="waterfall-chart-bar-group"
                className={styles.barGroup}
              >
                <div
                  data-slot="waterfall-chart-bar-value"
                  className={styles.barValue}
                  style={{ color }}
                >
                  {d.value >= 0 ? "+" : ""}
                  {d.value.toLocaleString()}
                </div>
                <div
                  data-slot="waterfall-chart-bar"
                  className={styles.bar}
                  style={{
                    blockSize: Math.max(4, barHeight),
                    background: color,
                    opacity: isTotal ? 1 : 0.85,
                  }}
                  title={`${d.label}: ${d.value}`}
                />
                <div data-slot="waterfall-chart-bar-label" className={styles.barLabel}>
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

WaterfallChart.displayName = "WaterfallChart";
