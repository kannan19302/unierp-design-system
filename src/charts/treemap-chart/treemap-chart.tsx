"use client";

import React from "react";
import styles from "./treemap-chart.module.css";

export interface TreemapChartProps {
  data: TreemapNode[];
  height?: number;
  colorScale?: string[];
}

export interface TreemapNode {
  label: string;
  value: number;
  children?: TreemapNode[];
  color?: string;
}

export const TreemapChart: React.FC<TreemapChartProps> = (props) => {
  const { data, height = 300, colorScale = ['var(--color-brand, #2563eb)', 'var(--color-success, #10b981)', 'var(--color-warning, #f59e0b)', 'var(--color-error, #ef4444)', 'var(--color-info, #8b5cf6)', 'var(--color-info, #06b6d4)', '#ec4899'] } = props;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div className={styles.container} style={{ height }} role="img" aria-label="Treemap chart">
      <div className={styles.grid}>
        {data.map((node, i) => {
          const pct = (node.value / total) * 100;
          const bg = node.color || colorScale[i % colorScale.length];
          return (
            <div
              key={i}
              className={styles.cell}
              style={{ flex: `${pct} 1 0%`, background: bg, minHeight: 60 }}
              title={`${node.label}: ${node.value.toLocaleString()}`}
            >
              <span className={styles.cellLabel}>{node.label}</span>
              <span className={styles.cellValue}>{node.value.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
