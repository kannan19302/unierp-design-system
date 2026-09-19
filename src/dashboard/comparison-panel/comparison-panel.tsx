"use client";

import React, { forwardRef } from "react";
import styles from "./comparison-panel.module.css";

export interface ComparisonItem {
  label: string;
  current: string | number;
  previous: string | number;
  change?: number;
}

export interface ComparisonPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: ComparisonItem[];
}

/**
 * ComparisonPanel
 *
 * Period-over-period financial and operational benchmark comparison scorecard
 * highlighting delta percentages, current run rates, and previous baselines.
 *
 * @maturity stable
 */
export const ComparisonPanel = forwardRef<
  HTMLDivElement,
  ComparisonPanelProps
>(function ComparisonPanel(
  { title = "Period Comparison", items, className, ...restProps },
  ref
) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="region"
      aria-label={title}
      {...restProps}
    >
      <h3 className={styles.title}>{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Metric</th>
            <th className={styles.th} style={{ textAlign: "right" }}>
              Current
            </th>
            <th className={styles.th} style={{ textAlign: "right" }}>
              Previous
            </th>
            <th className={styles.th} style={{ textAlign: "right" }}>
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className={styles.td}>{item.label}</td>
              <td
                className={styles.td}
                style={{
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.current}
              </td>
              <td
                className={styles.td}
                style={{
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--color-text-secondary)",
                }}
              >
                {item.previous}
              </td>
              <td className={styles.td} style={{ textAlign: "right" }}>
                {item.change !== undefined && (
                  <span
                    className={
                      item.change >= 0
                        ? styles.badgePositive
                        : styles.badgeNegative
                    }
                  >
                    {item.change >= 0 ? "+" : ""}
                    {item.change}%
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ComparisonPanel.displayName = "ComparisonPanel";
