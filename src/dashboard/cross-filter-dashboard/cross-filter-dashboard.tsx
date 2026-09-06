"use client";

import React from "react";
import styles from "./cross-filter-dashboard.module.css";

export interface CrossFilterDashboardProps { filters: DashboardFilter[]; onFilterChange?: (filters: Record<string, string>) => void; children: React.ReactNode; }
export interface DashboardFilter { id: string; label: string; options: string[]; defaultValue?: string; }

export const CrossFilterDashboard: React.FC<CrossFilterDashboardProps> = (props) => {
  const { filters, onFilterChange, children } = props;
  const [active, setActive] = React.useState<Record<string, string>>({});
  const handleChange = (id: string, val: string) => { const next = { ...active, [id]: val }; setActive(next); onFilterChange?.(next); };
  return (
    <div className={styles.container} role="region" aria-label="Cross-filter dashboard">
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <select key={f.id} className={styles.select} style={{ width: 'auto' }} value={active[f.id] || f.defaultValue || ''} onChange={e => handleChange(f.id, e.target.value)} aria-label={f.label}>
            <option value="">{f.label}</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};
