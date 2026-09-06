"use client";

import React from "react";
import styles from "./scatter-plot-chart.module.css";

export interface ScatterPlotChartProps {
  data: ScatterDataPoint[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  showTrendLine?: boolean;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  size?: number;
}

export const ScatterPlotChart: React.FC<ScatterPlotChartProps> = (props) => {
  const { data, height = 280, xLabel = 'X', yLabel = 'Y', showTrendLine = false } = props;
  void showTrendLine;
  const w = 400;
  const pad = 45;
  const maxX = Math.max(...data.map(d => d.x), 1);
  const maxY = Math.max(...data.map(d => d.y), 1);
  const sx = (v: number) => pad + (v / maxX) * (w - pad - 10);
  const sy = (v: number) => (height - pad) - (v / maxY) * (height - pad - 10);
  const colors = ['var(--color-brand, #2563eb)', 'var(--color-success, #10b981)', 'var(--color-warning, #f59e0b)', 'var(--color-error, #ef4444)', 'var(--color-info, #8b5cf6)'];

  return (
    <div className={styles.container} role="img" aria-label="Scatter plot chart">
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="xMidYMid meet">
        <line x1={pad} y1={height - pad} x2={w - 10} y2={height - pad} stroke="var(--color-border-default)" strokeWidth={1} />
        <line x1={pad} y1={10} x2={pad} y2={height - pad} stroke="var(--color-border-default)" strokeWidth={1} />
        <text x={10} y={height / 2} transform={`rotate(-90, 10, ${height / 2})`} textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)">{yLabel}</text>
        <text x={w / 2} y={height - 5} textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)">{xLabel}</text>
        {data.map((d, i) => (
          <circle key={i} cx={sx(d.x)} cy={sy(d.y)} r={d.size || 5} fill={d.color || colors[i % colors.length]} fillOpacity={0.7} stroke={d.color || colors[i % colors.length]} strokeWidth={1}>
            <title>{d.label || `(${d.x}, ${d.y})`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};
