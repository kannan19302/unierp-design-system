"use client";

import React, { forwardRef } from "react";
import styles from "./radar-chart.module.css";

export interface RadarDataset {
  label: string;
  values: number[];
  color?: string;
}

export interface RadarChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  axes: string[];
  datasets: RadarDataset[];
  size?: number;
  showLabels?: boolean;
}

/**
 * RadarChart plots multivariate quantitative data across equi-angular radiating axes
 * with overlaid polygon series for comparative capability analysis.
 *
 * @maturity stable
 */
export const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      axes,
      datasets,
      size = 240,
      showLabels = true,
      className = "",
      ...rest
    },
    ref
  ) => {
    const center = size / 2;
    const radius = size / 2 - 30;
    const angleStep = axes.length ? (2 * Math.PI) / axes.length : 1;

    const getPoint = (index: number, value: number) => ({
      x: center + radius * (value / 100) * Math.sin(index * angleStep),
      y: center - radius * (value / 100) * Math.cos(index * angleStep),
    });

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="img"
        aria-label="Radar chart"
        {...rest}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          {[20, 40, 60, 80, 100].map((level) => (
            <polygon
              key={level}
              points={axes
                .map((_, i) => {
                  const p = getPoint(i, level);
                  return `${p.x},${p.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="var(--color-border-default)"
              strokeWidth={0.5}
              opacity={0.5}
            />
          ))}
          {datasets.map((ds, di) => (
            <polygon
              key={ds.label || di}
              points={ds.values
                .map((v, i) => {
                  const p = getPoint(i, v);
                  return `${p.x},${p.y}`;
                })
                .join(" ")}
              fill={ds.color || "var(--color-brand)"}
              fillOpacity={0.15}
              stroke={ds.color || "var(--color-brand)"}
              strokeWidth={1.5}
            />
          ))}
          {showLabels &&
            axes.map((label, i) => {
              const p = getPoint(i, 115);
              return (
                <text
                  key={label || i}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-text-secondary)"
                >
                  {label}
                </text>
              );
            })}
        </svg>
        <div className={styles.legend}>
          {datasets.map((ds, i) => (
            <span key={ds.label || i} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: ds.color || "var(--color-brand)" }}
              />
              {ds.label}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

RadarChart.displayName = "RadarChart";
