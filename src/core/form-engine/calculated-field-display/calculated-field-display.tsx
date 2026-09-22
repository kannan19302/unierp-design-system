"use client";

import React from "react";
import styles from "./calculated-field-display.module.css";

export interface CalculatedFieldDisplayProps { label: string; formula: string; value: string | number; breakdown?: { label: string; value: string | number }[]; }

export const CalculatedFieldDisplay: React.FC<CalculatedFieldDisplayProps> = (props) => {
  const { label, formula, value, breakdown } = props;
  return (
    <div className={styles.container} role="region" aria-label={label}>
      <div className={styles.header}><span className={styles.label}>{label}</span><span className={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</span></div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>Formula: {formula}</div>
      {breakdown && <div className={styles.content} style={{ marginTop: 'var(--space-3)' }}>
        {breakdown.map((b, i) => <div key={i} className={styles.row}><span className={styles.label}>{b.label}</span><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--weight-semibold)' }}>{b.value}</span></div>)}
      </div>}
    </div>
  );
};
