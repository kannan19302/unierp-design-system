"use client";

import React, { forwardRef } from "react";
import styles from "./treemap-chart.module.css";

export interface TreemapNode {
  label: string;
  value: number;
  children?: TreemapNode[];
  color?: string;
}

export interface TreemapChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: TreemapNode[];
  height?: number;
  colorScale?: string[];
}

const DEFAULT_COLOR_SCALE = [
  "var(--color-brand)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-error)",
  "var(--color-info)",
];

/**
 * TreemapChart displays hierarchical and nested quantitative data using nested proportional rectangles.
 *
 * @maturity stable
 */
export const TreemapChart = forwardRef<HTMLDivElement, TreemapChartProps>(
  (
    {
      data,
      height = 300,
      colorScale = DEFAULT_COLOR_SCALE,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        style={{ height, ...style }}
        role="img"
        aria-label="Treemap chart"
        {...rest}
      >
        <div className={styles.grid}>
          {data.map((node, i) => {
            const pct = (node.value / total) * 100;
            const bg = node.color || colorScale[i % colorScale.length];
            return (
              <div
                key={node.label || i}
                className={styles.cell}
                style={{ flex: `${pct} 1 0%`, background: bg, minHeight: 60 }}
                title={`${node.label}: ${node.value.toLocaleString()}`}
              >
                <span className={styles.cellLabel}>{node.label}</span>
                <span className={styles.cellValue}>
                  {node.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

TreemapChart.displayName = "TreemapChart";
