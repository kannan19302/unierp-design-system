"use client";

import React from "react";
import styles from "./integration-showcase.module.css";

export interface IntegrationShowcaseProps { title?: string; integrations: IntegrationItem[]; categories?: string[]; }
export interface IntegrationItem { name: string; icon: string; category: string; }

export const IntegrationShowcase: React.FC<IntegrationShowcaseProps> = (props) => {
  const { title = 'Integrations', integrations, categories = [...new Set(integrations.map(i => i.category))] } = props;
  const [active, setActive] = React.useState(categories[0] || '');
  const filtered = active ? integrations.filter(i => i.category === active) : integrations;
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <h3 className={styles.title} style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>{title}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {categories.map(c => <button key={c} className={`${styles.btn} ${c === active ? styles.btnPrimary : ''}`} onClick={() => setActive(c)}>{c}</button>)}
      </div>
      <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--space-32, 8rem), 1fr))' }}>
        {filtered.map((item, i) => <div key={i} className={styles.card} style={{ textAlign: 'center' }}><div style={{ fontSize: 'var(--text-2xl, 24px)' }}>{item.icon}</div><div style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>{item.name}</div></div>)}
      </div>
    </div>
  );
};
