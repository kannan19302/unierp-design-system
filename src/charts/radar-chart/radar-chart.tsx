"use client";

import React from "react";
import styles from "./radar-chart.module.css";

export interface RadarChartProps {
  axes: string[];
  datasets: RadarDataset[];
  size?: number;
  showLabels?: boolean;
}

export interface RadarDataset {
  label: string;
  values: number[];
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = (props) => {
  const { axes, datasets, size = 240, showLabels = true } = props;
  const center = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (2 * Math.PI) / axes.length;

  const getPoint = (index: number, value: number) => ({
    x: center + radius * (value / 100) * Math.sin(index * angleStep),
    y: center - radius * (value / 100) * Math.cos(index * angleStep),
  });

  return (
    <div className={styles.container} role="img" aria-label="Radar chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[20, 40, 60, 80, 100].map(level => (
          <polygon
            key={level}
            points={axes.map((_, i) => {
              const p = getPoint(i, level);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--color-border-default, #e2e8f0)"
            strokeWidth={0.5}
            opacity={0.5}
          />
        ))}
        {datasets.map((ds, di) => (
          <polygon
            key={di}
            points={ds.values.map((v, i) => {
              const p = getPoint(i, v);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill={ds.color || 'var(--color-brand, #2563eb)'}
            fillOpacity={0.15}
            stroke={ds.color || 'var(--color-brand, #2563eb)'}
            strokeWidth={1.5}
          />
        ))}
        {showLabels && axes.map((label, i) => {
          const p = getPoint(i, 115);
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">{label}</text>;
        })}
      </svg>
      <div className={styles.legend}>
        {datasets.map((ds, i) => (
          <span key={i} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: ds.color || 'var(--color-brand)' }} />
            {ds.label}
          </span>
        ))}
      </div>
    </div>
  );
};
