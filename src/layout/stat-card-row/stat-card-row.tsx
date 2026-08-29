"use client";

import React from "react";
import { Skeleton } from "../../primitives/skeleton";
import styles from "./stat-card-row.module.css";

export interface StatCardItem {
  label: string;
  value: string | number;
  /** Signed number, e.g. 12.5 → "+12.5%", -3 → "-3%" */
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  /** CSS color token or value for the accent, e.g. 'var(--color-primary)' */
  color?: string;
  loading?: boolean;
}

export interface StatCardRowProps {
  stats: StatCardItem[];
  columns?: 2 | 3 | 4 | 5;
}

const StatCard: React.FC<StatCardItem> = ({
  label,
  value,
  change,
  changeLabel,
  icon,
  color = "var(--color-primary, #3b82f6)",
  loading = false,
}) => {
  const isPositive = typeof change === "number" && change >= 0;
  const changeColor = isPositive
    ? "var(--color-success-text, #059669)"
    : "var(--color-danger-text, #dc2626)";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardLabel}>{label}</span>
        {icon && (
          <div
            className={styles.iconWrap}
            style={{
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              color,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {loading ? (
        <Skeleton height={28} width="60%" />
      ) : (
        <div className={styles.cardValue}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      )}

      {typeof change === "number" && (
        <div
          className={styles.changeIndicator}
          style={{ color: changeColor }}
        >
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>
            {Math.abs(change).toFixed(1)}%{changeLabel ? ` ${changeLabel}` : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export const StatCardRow: React.FC<StatCardRowProps> = ({ stats, columns }) => {
  const cols = columns ?? (Math.min(stats.length, 4) as 2 | 3 | 4 | 5);

  return (
    <div
      className={styles.rowGrid}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};
