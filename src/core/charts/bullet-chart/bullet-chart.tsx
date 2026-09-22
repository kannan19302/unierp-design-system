"use client";

import React, { forwardRef } from "react";
import styles from "./bullet-chart.module.css";

export interface BulletChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  actual: number;
  target: number;
  ranges: [number, number, number];
  maxValue?: number;
  unit?: string;
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
        className={`${styles.container} ${className}`.trim()}
        role="img"
        aria-label={`${label} bullet chart`}
        {...rest}
      >
        <div className={styles.label}>{label}</div>
        <div className={styles.track}>
          {ranges.map((r, i) => (
            <div
              key={i}
              className={styles.range}
              style={{
                inlineSize: `${pct(r)}%`,
                background: rangeColors[i],
              }}
            />
          ))}
          <div
            className={styles.actual}
            style={{ inlineSize: `${pct(actual)}%` }}
          />
          <div
            className={styles.marker}
            style={{ insetInlineStart: `${pct(target)}%` }}
          />
        </div>
        <div className={styles.values}>
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
