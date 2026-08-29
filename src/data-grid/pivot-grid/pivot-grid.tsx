"use client";

import { useMemo, type ReactNode } from "react";
import styles from "./pivot-grid.module.css";

export type PivotAggregation = "sum" | "avg" | "count" | "min" | "max";

export interface PivotGridProps<T> {
  data: T[];
  rowDimension: keyof T;
  columnDimension: keyof T;
  metric: keyof T;
  aggregation?: PivotAggregation;
  rowLabel?: string;
  columnLabel?: string;
  metricLabel?: string;
  formatValue?: (val: number) => string;
  className?: string;
}

export function PivotGrid<T extends Record<string, any>>({
  data,
  rowDimension,
  columnDimension,
  metric,
  aggregation = "sum",
  rowLabel,
  columnLabel,
  metricLabel,
  formatValue = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 2 }),
  className = "",
}: PivotGridProps<T>): ReactNode {
  const { rowKeys, colKeys, matrix, rowTotals, colTotals, grandTotal } = useMemo(() => {
    const rSet = new Set<string>();
    const cSet = new Set<string>();
    const grouped: Record<string, Record<string, number[]>> = {};

    data.forEach((item) => {
      const rVal = String(item[rowDimension] ?? "Unknown");
      const cVal = String(item[columnDimension] ?? "Unknown");
      const numVal = Number(item[metric]) || 0;

      rSet.add(rVal);
      cSet.add(cVal);

      if (!grouped[rVal]) grouped[rVal] = {};
      const rowGroup = grouped[rVal]!;
      if (!rowGroup[cVal]) rowGroup[cVal] = [];
      rowGroup[cVal]!.push(numVal);
    });

    const rows = Array.from(rSet).sort();
    const cols = Array.from(cSet).sort();

    const calcAgg = (values: number[]): number => {
      if (!values || values.length === 0) return 0;
      if (aggregation === "sum") return values.reduce((a, b) => a + b, 0);
      if (aggregation === "count") return values.length;
      if (aggregation === "avg") return values.reduce((a, b) => a + b, 0) / values.length;
      if (aggregation === "min") return Math.min(...values);
      if (aggregation === "max") return Math.max(...values);
      return 0;
    };

    const mat: Record<string, Record<string, number>> = {};
    const rTot: Record<string, number> = {};
    const cTot: Record<string, number> = {};
    const allVals: number[] = [];

    rows.forEach((r) => {
      mat[r] = {};
      const rowAllVals: number[] = [];
      cols.forEach((c) => {
        const vals = grouped[r]?.[c] || [];
        const cellVal = calcAgg(vals);
        mat[r]![c] = cellVal;
        rowAllVals.push(...vals);
        allVals.push(...vals);
      });
      rTot[r] = calcAgg(rowAllVals);
    });


    cols.forEach((c) => {
      const colAllVals: number[] = [];
      rows.forEach((r) => {
        colAllVals.push(...(grouped[r]?.[c] || []));
      });
      cTot[c] = calcAgg(colAllVals);
    });

    const gTot = calcAgg(allVals);

    return {
      rowKeys: rows,
      colKeys: cols,
      matrix: mat,
      rowTotals: rTot,
      colTotals: cTot,
      grandTotal: gTot,
    };
  }, [data, rowDimension, columnDimension, metric, aggregation]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.toolbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span style={{ fontWeight: 600 }}>Pivot Matrix:</span>
          <span className={styles.badge}>
            {rowLabel || String(rowDimension)} ✕ {columnLabel || String(columnDimension)}
          </span>
          <span className={styles.badge} style={{ background: "var(--color-surface-hover)", color: "var(--color-text-secondary)" }}>
            Agg: {aggregation.toUpperCase()} ({metricLabel || String(metric)})
          </span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ minWidth: 160 }}>
                {rowLabel || String(rowDimension)} \ {columnLabel || String(columnDimension)}
              </th>
              {colKeys.map((col) => (
                <th key={col} className={`${styles.th} ${styles.tdNumber}`} style={{ minWidth: 120 }}>
                  {col}
                </th>
              ))}
              <th className={`${styles.th} ${styles.tdNumber}`} style={{ minWidth: 130, background: "var(--color-surface-hover)" }}>
                Total ({aggregation})
              </th>
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((row) => (
              <tr key={row}>
                <td className={styles.td} style={{ fontWeight: 500 }}>
                  {row}
                </td>
                {colKeys.map((col) => (
                  <td key={col} className={`${styles.td} ${styles.tdNumber}`}>
                    {formatValue(matrix[row]?.[col] || 0)}
                  </td>
                ))}
                <td className={`${styles.td} ${styles.tdNumber}`} style={{ fontWeight: 600, background: "var(--color-surface-hover)" }}>
                  {formatValue(rowTotals[row] || 0)}
                </td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td className={styles.td} style={{ fontWeight: 700 }}>
                Grand Total
              </td>
              {colKeys.map((col) => (
                <td key={col} className={`${styles.td} ${styles.tdNumber}`} style={{ fontWeight: 700 }}>
                  {formatValue(colTotals[col] || 0)}
                </td>
              ))}
              <td className={`${styles.td} ${styles.tdNumber}`} style={{ fontWeight: 700, color: "var(--color-brand)" }}>
                {formatValue(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
