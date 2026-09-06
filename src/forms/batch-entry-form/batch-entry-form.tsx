"use client";

import React from "react";
import styles from "./batch-entry-form.module.css";

export interface BatchEntryFormProps { columns: string[]; initialRows?: number; onSubmit?: (data: string[][]) => void; }

export const BatchEntryForm: React.FC<BatchEntryFormProps> = (props) => {
  const { columns, initialRows = 5, onSubmit } = props;
  const [rows, setRows] = React.useState<string[][]>(Array.from({ length: initialRows }, () => columns.map(() => '')));
  const update = (ri: number, ci: number, val: string) => { const next = rows.map(r => [...r]); const row = next[ri]; if (row) row[ci] = val; setRows(next); };
  return (
    <div className={styles.container} role="form" aria-label="Batch entry form">
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}><thead><tr>{columns.map((c, i) => <th key={i} className={styles.th}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((row, ri) => (<tr key={ri}>{row.map((val, ci) => <td key={ci} className={styles.td} style={{ padding: 'var(--space-1)' }}><input className={styles.input} value={val} onChange={e => update(ri, ci, e.target.value)} aria-label={`${columns[ci]} row ${ri + 1}`} style={{ border: 'none', background: 'transparent' }} /></td>)}</tr>))}</tbody></table>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => setRows([...rows, columns.map(() => '')])}>+ Add Row</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onSubmit?.(rows)}>Submit Batch</button>
      </div>
    </div>
  );
};
