"use client";

import React from "react";
import styles from "./bullet-chart.module.css";

export interface BulletChartProps {
  label: string;
  actual: number;
  target: number;
  ranges: [number, number, number];
  maxValue?: number;
  unit?: string;
}

export const BulletChart: React.FC<BulletChartProps> = (props) => {
  const { label, actual, target, ranges, maxValue: mv, unit = '' } = props;
  const maxValue = mv || Math.max(target, actual, ...ranges) * 1.1;
  const pct = (v: number) => (v / maxValue) * 100;
  const rangeColors = ['var(--color-bg-sunken, #f1f5f9)', 'var(--color-border-default, #e2e8f0)', 'var(--color-border-subtle, #cbd5e1)'];

  return (
    <div className={styles.container} role="img" aria-label={`${label} bullet chart`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.track}>
        {ranges.map((r, i) => (
          <div key={i} className={styles.range} style={{ width: `${pct(r)}%`, background: rangeColors[i] }} />
        ))}
        <div className={styles.actual} style={{ width: `${pct(actual)}%` }} />
        <div className={styles.marker} style={{ left: `${pct(target)}%` }} />
      </div>
      <div className={styles.values}>
        <span>Actual: {actual.toLocaleString()}{unit}</span>
        <span>Target: {target.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
};
