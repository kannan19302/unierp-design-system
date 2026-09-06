"use client";

import React from "react";
import styles from "./waterfall-chart.module.css";

export interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  height?: number;
  showConnectors?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
}

export interface WaterfallDataPoint {
  label: string;
  value: number;
  isTotal?: boolean;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = (props) => {
  const {
    data,
    height = 280,
    showConnectors: _showConnectors = true,
    positiveColor = 'var(--color-success, #10b981)',
    negativeColor = 'var(--color-error, #ef4444)',
    totalColor = 'var(--color-brand, #2563eb)',
  } = props;

  const maxAbs = Math.max(...data.map(d => Math.abs(d.value)), 1);
  let running = 0;

  return (
    <div className={styles.container} style={{ height }} role="img" aria-label="Waterfall chart">
      <div className={styles.bars}>
        {data.map((d, i) => {
          const isTotal = d.isTotal;
          const barHeight = Math.abs(d.value) / maxAbs * (height - 60);
          const color = isTotal ? totalColor : d.value >= 0 ? positiveColor : negativeColor;
          if (!isTotal) running += d.value;
          else running = d.value;
          return (
            <div key={i} className={styles.barGroup}>
              <div className={styles.barValue} style={{ color }}>{d.value >= 0 ? '+' : ''}{d.value.toLocaleString()}</div>
              <div
                className={styles.bar}
                style={{ height: barHeight, background: color, opacity: isTotal ? 1 : 0.85 }}
                title={`${d.label}: ${d.value}`}
              />
              <div className={styles.barLabel}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
