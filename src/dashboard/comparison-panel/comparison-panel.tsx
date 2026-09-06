"use client";

import React from "react";
import styles from "./comparison-panel.module.css";

export interface ComparisonPanelProps { title?: string; items: ComparisonItem[]; }
export interface ComparisonItem { label: string; current: string | number; previous: string | number; change?: number; }

export const ComparisonPanel: React.FC<ComparisonPanelProps> = (props) => {
  const { title = 'Period Comparison', items } = props;
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <h3 className={styles.title}>{title}</h3>
      <table className={styles.table}><thead><tr><th className={styles.th}>Metric</th><th className={styles.th} style={{ textAlign: 'right' }}>Current</th><th className={styles.th} style={{ textAlign: 'right' }}>Previous</th><th className={styles.th} style={{ textAlign: 'right' }}>Change</th></tr></thead>
      <tbody>{items.map((item, i) => (
        <tr key={i}><td className={styles.td}>{item.label}</td><td className={styles.td} style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{item.current}</td><td className={styles.td} style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-tertiary)' }}>{item.previous}</td><td className={styles.td} style={{ textAlign: 'right' }}>{item.change !== undefined && <span className={item.change >= 0 ? styles.badgePositive : styles.badgeNegative}>{item.change >= 0 ? '+' : ''}{item.change}%</span>}</td></tr>
      ))}</tbody></table>
    </div>
  );
};
