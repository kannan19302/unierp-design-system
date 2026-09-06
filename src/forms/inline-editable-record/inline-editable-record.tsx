"use client";

import React from "react";
import styles from "./inline-editable-record.module.css";

export interface InlineEditableRecordProps { fields: RecordField[]; onSave?: (data: Record<string, string>) => void; }
export interface RecordField { key: string; label: string; value: string; editable?: boolean; }

export const InlineEditableRecord: React.FC<InlineEditableRecordProps> = (props) => {
  const { fields, onSave } = props;
  const [editing, setEditing] = React.useState<string | null>(null);
  const [values, setValues] = React.useState<Record<string, string>>(Object.fromEntries(fields.map(f => [f.key, f.value])));
  return (
    <div className={styles.container} role="form" aria-label="Inline editable record">
      <div className={styles.content}>
        {fields.map(f => (
          <div key={f.key} className={styles.row}>
            <div className={styles.label} style={{ minWidth: 120 }}>{f.label}</div>
            {editing === f.key ? (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
                <input className={styles.input} value={values[f.key]} onChange={e => setValues({ ...values, [f.key]: e.target.value })} aria-label={f.label} autoFocus />
                <button className={styles.btn} onClick={() => { setEditing(null); onSave?.(values); }}>✓</button>
                <button className={styles.btn} onClick={() => setEditing(null)}>✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
                <span>{values[f.key]}</span>
                {f.editable !== false && <button className={styles.btn} onClick={() => setEditing(f.key)} style={{ padding: 'var(--space-1)' }}>✎</button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
