"use client";

import React, { forwardRef } from "react";
import { cva } from "../../foundation/utils/cva";
import styles from "./bullet-chart.module.css";

export const bulletChartVariants = cva(styles.container, {
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

export interface BulletChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  actual: number;
  target: number;
  ranges: [number, number, number];
  maxValue?: number;
  unit?: string;
  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

/**
 * BulletChart displays a single performance metric compared against a target and qualitative range bands.
 *
 * @maturity stable
 */
export const BulletChart = forwardRef<HTMLDivElement, BulletChartProps>(
  (
    {
      label,
      actual,
      target,
      ranges,
      maxValue: mv,
      unit = "",
      density = "standard",
      className = "",
      ...rest
    },
    ref
  ) => {
    const maxValue = mv || Math.max(target, actual, ...ranges) * 1.1;
    const pct = (v: number) => (v / maxValue) * 100;
    const rangeColors = [
      "var(--color-bg-sunken)",
      "var(--color-border-default)",
      "var(--color-border-subtle)",
    ];

    return (
      <div
        ref={ref}
        data-slot="bullet-chart"
        data-density={density}
        className={bulletChartVariants({ density, className })}
        role="img"
        aria-label={`${label} bullet chart`}
        {...rest}
      >
        <div data-slot="bullet-chart-label" className={styles.label}>
          {label}
        </div>
        <div data-slot="bullet-chart-track" className={styles.track}>
          {ranges.map((r, i) => (
            <div
              key={i}
              data-slot="bullet-chart-range"
              className={styles.range}
              style={{
                inlineSize: `${pct(r)}%`,
                background: rangeColors[i],
              }}
            />
          ))}
          <div
            data-slot="bullet-chart-actual"
            className={styles.actual}
            style={{ inlineSize: `${pct(actual)}%` }}
          />
          <div
            data-slot="bullet-chart-marker"
            className={styles.marker}
            style={{ insetInlineStart: `${pct(target)}%` }}
          />
        </div>
        <div data-slot="bullet-chart-values" className={styles.values}>
          <span>
            Actual: {actual.toLocaleString()}
            {unit}
          </span>
          <span>
            Target: {target.toLocaleString()}
            {unit}
          </span>
        </div>
      </div>
    );
  }
);

BulletChart.displayName = "BulletChart";
