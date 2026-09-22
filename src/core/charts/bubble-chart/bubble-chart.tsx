"use client";

import React, { forwardRef } from "react";
import styles from "./bubble-chart.module.css";

export interface BubbleDataPoint {
  x: number;
  y: number;
  size: number;
  label: string;
  color?: string;
}

export interface BubbleChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: BubbleDataPoint[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
}

/**
 * BubbleChart displays multi-dimensional numeric data using Cartesian coordinates (X, Y)
 * and bubble surface area (Z) across distinct data categories.
 *
 * @maturity stable
 */
export const BubbleChart = forwardRef<HTMLDivElement, BubbleChartProps>(
  (
    {
      data,
      height = 300,
      xLabel = "X Axis",
      yLabel = "Y Axis",
      sizeLabel: _sizeLabel,
      className = "",
      ...rest
    },
    ref
  ) => {
    const width = 400;
    const padding = 40;
    const maxX = Math.max(...data.map((d) => d.x), 1);
    const maxY = Math.max(...data.map((d) => d.y), 1);
    const maxSize = Math.max(...data.map((d) => d.size), 1);
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
        aria-label="Bubble chart"
        {...rest}
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - 10}
            y2={height - padding}
            stroke="var(--color-border-default)"
            strokeWidth={1}
          />
          <line
            x1={padding}
            y1={10}
            x2={padding}
            y2={height - padding}
            stroke="var(--color-border-default)"
            strokeWidth={1}
          />
          <text
            x={width / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-tertiary)"
          >
            {xLabel}
          </text>
          <text
            x={10}
            y={height / 2}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            transform={`rotate(-90, 10, ${height / 2})`}
          >
            {yLabel}
          </text>
          {data.map((d, i) => {
            const cx = padding + (d.x / maxX) * (width - padding - 20);
            const cy =
              height - padding - (d.y / maxY) * (height - padding - 20);
            const r = 6 + (d.size / maxSize) * 24;
            const fill = d.color || colors[i % colors.length];
            return (
              <g key={d.label || i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  fillOpacity={0.4}
                  stroke={fill}
                  strokeWidth={1.5}
                />
                <title>{`${d.label}: (${d.x}, ${d.y}) size=${d.size}`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

BubbleChart.displayName = "BubbleChart";
