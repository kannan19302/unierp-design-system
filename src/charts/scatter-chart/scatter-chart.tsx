"use client";

import React, { forwardRef } from "react";
import { cva } from "../../foundation/utils/cva";
import styles from "./scatter-chart.module.css";

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  size?: number;
}

export const scatterChartVariants = cva(styles.container, {
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

export interface ScatterPlotChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ScatterDataPoint[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  showTrendLine?: boolean;
  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

/**
 * ScatterPlotChart visualizes bivariate correlations and cluster distributions
 * along continuous horizontal and vertical numeric axes.
 *
 * @maturity stable
 */
export const ScatterPlotChart = forwardRef<
  HTMLDivElement,
  ScatterPlotChartProps
>(
  (
    {
      data,
      height = 280,
      xLabel = "X",
      yLabel = "Y",
      showTrendLine = false,
      density = "standard",
      className = "",
      ...rest
    },
    ref
  ) => {
    void showTrendLine;
    const w = 400;
    const pad = 45;
    const maxX = Math.max(...data.map((d) => d.x), 1);
    const maxY = Math.max(...data.map((d) => d.y), 1);
    const sx = (v: number) => pad + (v / maxX) * (w - pad - 10);
    const sy = (v: number) =>
      height - pad - (v / maxY) * (height - pad - 10);
    const colors = [
      "var(--color-brand)",
      "var(--color-success)",
      "var(--color-warning)",
      "var(--color-error)",
      "var(--color-info)",
    ];

    return (
      <div
        ref={ref}
        data-slot="scatter-chart"
        data-density={density}
        className={scatterChartVariants({ density, className })}
        role="img"
        aria-label="Scatter plot chart"
        {...rest}
      >
        <svg
          data-slot="scatter-chart-svg"
          width="100%"
          height={height}
          viewBox={`0 0 ${w} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <line
            data-slot="scatter-chart-axis"
            x1={pad}
            y1={height - pad}
            x2={w - 10}
            y2={height - pad}
            stroke="var(--color-border-default)"
            strokeWidth={1}
          />
          <line
            data-slot="scatter-chart-axis"
            x1={pad}
            y1={10}
            x2={pad}
            y2={height - pad}
            stroke="var(--color-border-default)"
            strokeWidth={1}
          />
          <text
            data-slot="scatter-chart-label"
            x={10}
            y={height / 2}
            transform={`rotate(-90, 10, ${height / 2})`}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-tertiary)"
          >
            {yLabel}
          </text>
          <text
            data-slot="scatter-chart-label"
            x={w / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-tertiary)"
          >
            {xLabel}
          </text>
          {data.map((d, i) => {
            const fill = d.color || colors[i % colors.length];
            return (
              <circle
                key={d.label || i}
                data-slot="scatter-chart-point"
                cx={sx(d.x)}
                cy={sy(d.y)}
                r={d.size || 5}
                fill={fill}
                fillOpacity={0.7}
                stroke={fill}
                strokeWidth={1}
              >
                <title>{d.label || `(${d.x}, ${d.y})`}</title>
              </circle>
            );
          })}
        </svg>
      </div>
    );
  }
);

ScatterPlotChart.displayName = "ScatterPlotChart";

// Directory-level alias
export const ScatterChart = ScatterPlotChart;
export type ScatterChartProps = ScatterPlotChartProps;
