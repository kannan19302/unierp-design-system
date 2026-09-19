"use client";

import React, { forwardRef } from "react";
import styles from "./metric-trend-card.module.css";

export interface MetricTrendCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: number;
  trend?: number[];
  color?: string;
}

/**
 * MetricTrendCard
 *
 * Compact analytical KPI block showing current measurement, variance indicator,
 * and integrated inline sparkline trend visualization.
 *
 * @maturity stable
 */
export const MetricTrendCard = forwardRef<HTMLDivElement, MetricTrendCardProps>(
  function MetricTrendCard(
    {
      label,
      value,
      change,
      trend,
      color = "var(--color-brand)",
      className,
      ...restProps
    },
    ref
  ) {
    const sparkW = 80;
    const sparkH = 24;

    const renderSparkline = (data: number[]) => {
      if (data.length < 2) return null;
      const mn = Math.min(...data);
      const mx = Math.max(...data);
      const r = mx - mn || 1;
      const pts = data
        .map(
          (v, i) =>
            `${(i / (data.length - 1)) * sparkW},${
              sparkH - ((v - mn) / r) * (sparkH - 4) - 2
            }`
        )
        .join(" ");
      return (
        <svg width={sparkW} height={sparkH} aria-hidden="true">
          <polyline
            points={pts}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      );
    };

    const containerClasses = [styles.container, styles.card, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="region"
        aria-label={label}
        {...restProps}
      >
        <div className={styles.label}>{label}</div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <div className={styles.value}>{value}</div>
            {change !== undefined && (
              <span
                className={
                  change >= 0 ? styles.badgePositive : styles.badgeNegative
                }
              >
                {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
              </span>
            )}
          </div>
          {trend && renderSparkline(trend)}
        </div>
      </div>
    );
  }
);

MetricTrendCard.displayName = "MetricTrendCard";
