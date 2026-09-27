"use client";

import React, { forwardRef } from "react";
import { cva } from "../../foundation/utils/cva";
import styles from "./box-plot-chart.module.css";

export interface BoxPlotGroup {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
  color?: string;
}

export const boxPlotChartVariants = cva(styles.container, {
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

export interface BoxPlotChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: BoxPlotGroup[];
  height?: number;
  showOutliers?: boolean;
  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

/**
 * BoxPlotChart visualizes five-number statistical summaries (minimum, first quartile, median, third quartile, maximum)
 * and optional outliers across multiple categorical groups.
 *
 * @maturity stable
 */
export const BoxPlotChart = forwardRef<HTMLDivElement, BoxPlotChartProps>(
  (
    {
      data,
      height = 260,
      showOutliers = true,
      density = "standard",
      className = "",
      ...rest
    },
    ref
  ) => {
    const allValues = data.flatMap((d) => [
      d.min,
      d.max,
      ...(d.outliers || []),
    ]);
    const globalMin = allValues.length ? Math.min(...allValues) : 0;
    const globalMax = allValues.length ? Math.max(...allValues) : 100;
    const range = globalMax - globalMin || 1;
    const barWidth = 40;
    const svgWidth = data.length * (barWidth + 30) + 40;
    const pY = (v: number) =>
      ((globalMax - v) / range) * (height - 60) + 20;
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
        data-slot="box-plot-chart"
        data-density={density}
        className={boxPlotChartVariants({ density, className })}
        role="img"
        aria-label="Box plot chart"
        {...rest}
      >
        <svg
          data-slot="box-plot-chart-svg"
          width="100%"
          height={height}
          viewBox={`0 0 ${svgWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {data.map((d, i) => {
            const x = 20 + i * (barWidth + 30);
            const cx = x + barWidth / 2;
            const fill = d.color || colors[i % colors.length];
            return (
              <g data-slot="box-plot-chart-group" key={d.label || i}>
                <line
                  data-slot="box-plot-chart-whisker"
                  x1={cx}
                  y1={pY(d.max)}
                  x2={cx}
                  y2={pY(d.q3)}
                  stroke={fill}
                  strokeWidth={1}
                />
                <line
                  data-slot="box-plot-chart-whisker"
                  x1={cx}
                  y1={pY(d.q1)}
                  x2={cx}
                  y2={pY(d.min)}
                  stroke={fill}
                  strokeWidth={1}
                />
                <line
                  data-slot="box-plot-chart-whisker"
                  x1={x + 8}
                  y1={pY(d.max)}
                  x2={x + barWidth - 8}
                  y2={pY(d.max)}
                  stroke={fill}
                  strokeWidth={1.5}
                />
                <line
                  data-slot="box-plot-chart-whisker"
                  x1={x + 8}
                  y1={pY(d.min)}
                  x2={x + barWidth - 8}
                  y2={pY(d.min)}
                  stroke={fill}
                  strokeWidth={1.5}
                />
                <rect
                  data-slot="box-plot-chart-box"
                  x={x}
                  y={pY(d.q3)}
                  width={barWidth}
                  height={Math.max(1, pY(d.q1) - pY(d.q3))}
                  fill={fill}
                  fillOpacity={0.2}
                  stroke={fill}
                  strokeWidth={1}
                  rx={2}
                />
                <line
                  data-slot="box-plot-chart-median"
                  x1={x}
                  y1={pY(d.median)}
                  x2={x + barWidth}
                  y2={pY(d.median)}
                  stroke={fill}
                  strokeWidth={2}
                />
                {showOutliers &&
                  d.outliers?.map((o, oi) => (
                    <circle
                      key={oi}
                      data-slot="box-plot-chart-outlier"
                      cx={cx}
                      cy={pY(o)}
                      r={3}
                      fill={fill}
                      fillOpacity={0.6}
                    />
                  ))}
                <text
                  data-slot="box-plot-chart-label"
                  x={cx}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-text-secondary)"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

BoxPlotChart.displayName = "BoxPlotChart";
