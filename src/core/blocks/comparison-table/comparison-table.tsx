"use client";

import React from "react";
import styles from "./comparison-table.module.css";

export interface ComparisonTableProps { plans: ComparisonPlan[]; features: ComparisonFeature[]; highlightPlan?: string; }
export interface ComparisonPlan { id: string; name: string; price: string; cta: string; }
export interface ComparisonFeature { label: string; values: Record<string, boolean | string>; }

export const ComparisonTable: React.FC<ComparisonTableProps> = (props) => {
  const { plans, features, highlightPlan } = props;
  return (
    <div className={styles.container} role="region" aria-label="Plan comparison">
      <table className={styles.table}><thead><tr><th className={styles.th}>Feature</th>{plans.map(p => <th key={p.id} className={styles.th} style={{ textAlign: 'center', background: p.id === highlightPlan ? 'var(--color-brand-subtle)' : undefined }}><div style={{ fontWeight: 'var(--weight-bold, 700)' }}>{p.name}</div><div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold, 700)', margin: 'var(--space-1) 0' }}>{p.price}</div><button className={`${styles.btn} ${p.id === highlightPlan ? styles.btnPrimary : ''}`} style={{ width: '100%' }}>{p.cta}</button></th>)}</tr></thead>
      <tbody>{features.map((f, i) => <tr key={i}><td className={styles.td}>{f.label}</td>{plans.map(p => <td key={p.id} className={styles.td} style={{ textAlign: 'center' }}>{typeof f.values[p.id] === 'boolean' ? (f.values[p.id] ? '✓' : '—') : f.values[p.id] || '—'}</td>)}</tr>)}</tbody></table>
    </div>
  );
};
