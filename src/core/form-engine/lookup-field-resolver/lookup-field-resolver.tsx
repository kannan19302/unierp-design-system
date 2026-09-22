"use client";

import React from "react";
import styles from "./lookup-field-resolver.module.css";

export interface LookupFieldResolverProps { label: string; placeholder?: string; results?: LookupResult[]; onSearch?: (query: string) => void; onSelect?: (result: LookupResult) => void; }
export interface LookupResult { id: string; label: string; subtitle?: string; }

export const LookupFieldResolver: React.FC<LookupFieldResolverProps> = (props) => {
  const { label, placeholder = 'Search...', results = [], onSearch, onSelect } = props;
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const handleChange = (val: string) => { setQuery(val); setOpen(true); onSearch?.(val); };
  return (
    <div className={styles.container} role="search" aria-label={label} style={{ position: 'relative' }}>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{label}</label>
        <input className={styles.input} value={query} onChange={e => handleChange(e.target.value)} placeholder={placeholder} aria-label={label} onFocus={() => setOpen(true)} />
      </div>
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', maxHeight: 200, overflowY: 'auto' }}>
          {results.map(r => (
            <button key={r.id} className={styles.item} style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }} onClick={() => { setQuery(r.label); setOpen(false); onSelect?.(r); }}>
              <div><div style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{r.label}</div>{r.subtitle && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{r.subtitle}</div>}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
