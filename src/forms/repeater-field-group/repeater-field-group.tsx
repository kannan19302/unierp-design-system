"use client";

import React from "react";
import styles from "./repeater-field-group.module.css";

export interface RepeaterFieldGroupProps { label: string; fields: string[]; maxRows?: number; }

export const RepeaterFieldGroup: React.FC<RepeaterFieldGroupProps> = (props) => {
  const { label, fields, maxRows = 20 } = props;
  const [rows, setRows] = React.useState([fields.reduce((a, f) => ({ ...a, [f]: '' }), {} as Record<string, string>)]);
  const addRow = () => rows.length < maxRows && setRows([...rows, fields.reduce((a, f) => ({ ...a, [f]: '' }), {} as Record<string, string>)]);
  const removeRow = (i: number) => setRows(rows.filter((_, ri) => ri !== i));
  return (
    <div className={styles.container} role="group" aria-label={label}>
      <div className={styles.header}><h3 className={styles.title}>{label}</h3><button className={styles.btn} onClick={addRow}>+ Add Row</button></div>
      {rows.map((row, ri) => (
        <div key={ri} className={styles.row} style={{ gap: 'var(--space-2)' }}>
          {fields.map(f => <input key={f} className={styles.input} placeholder={f} value={row[f]} onChange={e => { const next = [...rows]; next[ri] = { ...next[ri], [f]: e.target.value }; setRows(next); }} aria-label={f} />)}
          <button className={styles.btn} onClick={() => removeRow(ri)} aria-label="Remove row" style={{ flexShrink: 0 }}>✕</button>
        </div>
      ))}
    </div>
  );
};
