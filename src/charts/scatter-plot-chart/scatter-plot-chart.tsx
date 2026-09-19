"use client";

import React, { forwardRef } from "react";
import styles from "./scatter-plot-chart.module.css";

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  size?: number;
}

export interface ScatterPlotChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ScatterDataPoint[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  showTrendLine?: boolean;
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
        className={`${styles.container} ${className}`.trim()}
        role="img"
        aria-label="Scatter plot chart"
        {...rest}
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${w} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <line
            x1={pad}
            y1={height - pad}
            x2={w - 10}
            y2={height - pad}
            stroke="var(--color-border-default)"
            strokeWidth={1}
          />
          <line
            x1={pad}
            y1={10}
            x2={pad}
            y2={height - pad}
            stroke="var(--color-border-default)"
            strokeWidth={1}
          />
          <text
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
