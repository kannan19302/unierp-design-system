"use client";

import React from "react";
import styles from "./stacked-bar-chart.module.css";

export interface StackedBarChartProps {
  categories: string[];
  series: StackedBarSeries[];
  height?: number;
  orientation?: 'vertical' | 'horizontal';
}

export interface StackedBarSeries {
  label: string;
  values: number[];
  color: string;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = (props) => {
  const { categories, series, height = 280, orientation = 'vertical' } = props;
  const totals = categories.map((_, ci) => series.reduce((s, sr) => s + (sr.values[ci] ?? 0), 0));
  const maxTotal = Math.max(...totals, 1);

  return (
    <div className={styles.container} style={{ height }} role="img" aria-label="Stacked bar chart">
      <div className={orientation === 'vertical' ? styles.barsVertical : styles.barsHorizontal}>
        {categories.map((cat, ci) => (
          <div key={ci} className={styles.barStack}>
            <div className={styles.segments} style={orientation === 'vertical' ? { height: ((totals[ci] ?? 0) / maxTotal) * (height - 60) } : { width: `${((totals[ci] ?? 0) / maxTotal) * 100}%` }}>
              {series.map((sr, si) => {
                const val = sr.values[ci] ?? 0; const tot = totals[ci] ?? 1; const pct = tot > 0 ? (val / tot) * 100 : 0;
                return <div key={si} style={orientation === 'vertical' ? { height: `${pct}%`, background: sr.color } : { width: `${pct}%`, background: sr.color }} className={styles.segment} title={`${sr.label}: ${(sr.values[ci] ?? 0).toLocaleString()}`} />;
              })}
            </div>
            <div className={styles.catLabel}>{cat}</div>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        {series.map((sr, i) => (
          <span key={i} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: sr.color }} />
            {sr.label}
          </span>
        ))}
      </div>
    </div>
  );
};
