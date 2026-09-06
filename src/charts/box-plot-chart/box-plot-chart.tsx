"use client";

import React from "react";
import styles from "./box-plot-chart.module.css";

export interface BoxPlotChartProps {
  data: BoxPlotGroup[];
  height?: number;
  showOutliers?: boolean;
}

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

export const BoxPlotChart: React.FC<BoxPlotChartProps> = (props) => {
  const { data, height = 260, showOutliers = true } = props;
  const allValues = data.flatMap(d => [d.min, d.max, ...(d.outliers || [])]);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const range = globalMax - globalMin || 1;
  const barWidth = 40;
  const svgWidth = data.length * (barWidth + 30) + 40;
  const pY = (v: number) => ((globalMax - v) / range) * (height - 60) + 20;
  const colors = ['var(--color-brand, #2563eb)', 'var(--color-success, #10b981)', 'var(--color-warning, #f59e0b)', 'var(--color-error, #ef4444)', 'var(--color-info, #8b5cf6)'];

  return (
    <div className={styles.container} role="img" aria-label="Box plot chart">
      <svg width="100%" height={height} viewBox={`0 0 ${svgWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
        {data.map((d, i) => {
          const x = 20 + i * (barWidth + 30);
          const cx = x + barWidth / 2;
          const fill = d.color || colors[i % colors.length];
          return (
            <g key={i}>
              <line x1={cx} y1={pY(d.max)} x2={cx} y2={pY(d.q3)} stroke={fill} strokeWidth={1} />
              <line x1={cx} y1={pY(d.q1)} x2={cx} y2={pY(d.min)} stroke={fill} strokeWidth={1} />
              <line x1={x + 8} y1={pY(d.max)} x2={x + barWidth - 8} y2={pY(d.max)} stroke={fill} strokeWidth={1.5} />
              <line x1={x + 8} y1={pY(d.min)} x2={x + barWidth - 8} y2={pY(d.min)} stroke={fill} strokeWidth={1.5} />
              <rect x={x} y={pY(d.q3)} width={barWidth} height={pY(d.q1) - pY(d.q3)} fill={fill} fillOpacity={0.2} stroke={fill} strokeWidth={1} rx={2} />
              <line x1={x} y1={pY(d.median)} x2={x + barWidth} y2={pY(d.median)} stroke={fill} strokeWidth={2} />
              {showOutliers && d.outliers?.map((o, oi) => (
                <circle key={oi} cx={cx} cy={pY(o)} r={3} fill={fill} fillOpacity={0.6} />
              ))}
              <text x={cx} y={height - 5} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
