"use client";

import React, { forwardRef } from "react";
import styles from "./financial-statement-viewer.module.css";

export interface FinancialRow {
  label: string;
  values: number[];
  isHeader?: boolean;
  isTotal?: boolean;
  indent?: number;
}

export interface FinancialStatementViewerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  rows: FinancialRow[];
  periods: string[];
}

/**
 * FinancialStatementViewer
 *
 * GAAP / IFRS hierarchical financial statement grid (Income Statement, Balance Sheet,
 * Cash Flow Statement) with multi-period comparative columns and tabular indentation.
 *
 * @maturity stable
 */
export const FinancialStatementViewer = forwardRef<
  HTMLDivElement,
  FinancialStatementViewerProps
>(function FinancialStatementViewer(
  { title, rows, periods, className, ...restProps },
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
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Account</th>
              {periods.map((p, i) => (
                <th
                  key={i}
                  className={styles.th}
                  style={{ textAlign: "right" }}
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                style={{
                  fontWeight:
                    r.isTotal || r.isHeader
                      ? "var(--weight-semibold, 600)"
                      : "normal",
                }}
              >
                <td
                  className={styles.td}
                  style={{
                    paddingInlineStart: (r.indent || 0) * 16 + 12,
                  }}
                >
                  {r.label}
                </td>
                {r.values.map((v, vi) => (
                  <td
                    key={vi}
                    className={styles.td}
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {v.toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

FinancialStatementViewer.displayName = "FinancialStatementViewer";
