"use client";

import React from "react";
import styles from "./sparkline-grid.module.css";

export interface SparklineGridProps {
  rows: SparklineGridRow[];
  columns?: string[];
}

export interface SparklineGridRow {
  label: string;
  values: number[];
  current: string | number;
  change?: number;
}

export const SparklineGrid: React.FC<SparklineGridProps> = (props) => {
  const { rows, columns = ['Metric', 'Trend', 'Current', 'Change'] } = props;

  const MiniSparkline = ({ data }: { data: number[] }) => {
    if (data.length < 2) return null;
    const w = 80, h = 20;
    const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / r) * (h - 4) - 2}`).join(' ');
    const isUp = (data[data.length - 1] ?? 0) >= (data[0] ?? 0);
    return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={isUp ? 'var(--color-success, #10b981)' : 'var(--color-error, #ef4444)'} strokeWidth={1.5} /></svg>;
  };

  return (
    <div className={styles.container}>
      <table className={styles.table} aria-label="Sparkline grid">
        <thead>
          <tr>{columns.map((c, i) => <th key={i} className={styles.th}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={styles.row}>
              <td className={styles.td}>{row.label}</td>
              <td className={styles.tdChart}><MiniSparkline data={row.values} /></td>
              <td className={styles.tdNum}>{row.current}</td>
              <td className={styles.tdChange}>
                {row.change !== undefined && (
                  <span style={{ color: row.change >= 0 ? 'var(--color-success, #10b981)' : 'var(--color-error, #ef4444)' }}>
                    {row.change >= 0 ? '↑' : '↓'} {Math.abs(row.change)}%
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
