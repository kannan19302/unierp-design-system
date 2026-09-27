"use client";

import React, { forwardRef } from "react";
import { cva } from "../../foundation/utils/cva";
import styles from "./treemap-chart.module.css";

export interface TreemapNode {
  label: string;
  value: number;
  children?: TreemapNode[];
  color?: string;
}

export const treemapChartVariants = cva(styles.container, {
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

export interface TreemapChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: TreemapNode[];
  height?: number;
  colorScale?: string[];
  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
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
      density = "standard",
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
        data-slot="treemap-chart"
        data-density={density}
        className={treemapChartVariants({ density, className })}
        style={{ blockSize: height, ...style }}
        role="img"
        aria-label="Treemap chart"
        {...rest}
      >
        <div data-slot="treemap-chart-grid" className={styles.grid}>
          {data.map((node, i) => {
            const pct = (node.value / total) * 100;
            const bg = node.color || colorScale[i % colorScale.length];
            return (
              <div
                key={node.label || i}
                data-slot="treemap-chart-cell"
                className={styles.cell}
                style={{ flex: `${pct} 1 0%`, background: bg, minBlockSize: 60 }}
                title={`${node.label}: ${node.value.toLocaleString()}`}
              >
                <span data-slot="treemap-chart-cell-label" className={styles.cellLabel}>
                  {node.label}
                </span>
                <span data-slot="treemap-chart-cell-value" className={styles.cellValue}>
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
