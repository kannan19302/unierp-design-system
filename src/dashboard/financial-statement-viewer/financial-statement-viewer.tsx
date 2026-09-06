"use client";

import React from "react";
import styles from "./financial-statement-viewer.module.css";

export interface FinancialStatementViewerProps { title: string; rows: FinancialRow[]; periods: string[]; }
export interface FinancialRow { label: string; values: number[]; isHeader?: boolean; isTotal?: boolean; indent?: number; }

export const FinancialStatementViewer: React.FC<FinancialStatementViewerProps> = (props) => {
  const { title, rows, periods } = props;
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <h2 className={styles.title}>{title}</h2>
      <table className={styles.table}><thead><tr><th className={styles.th}>Account</th>{periods.map((p, i) => <th key={i} className={styles.th} style={{ textAlign: 'right' }}>{p}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => (
        <tr key={i} style={{ fontWeight: r.isTotal || r.isHeader ? 'var(--weight-semibold, 600)' : 'normal' }}>
          <td className={styles.td} style={{ paddingLeft: (r.indent || 0) * 16 + 12 }}>{r.label}</td>
          {r.values.map((v, vi) => <td key={vi} className={styles.td} style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v.toLocaleString()}</td>)}
        </tr>
      ))}</tbody></table>
    </div>
  );
};
