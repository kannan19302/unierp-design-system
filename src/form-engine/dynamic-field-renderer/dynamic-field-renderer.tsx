"use client";

import React from "react";
import styles from "./dynamic-field-renderer.module.css";

export interface DynamicFieldRendererProps { schema: DynamicField[]; values?: Record<string, unknown>; onChange?: (key: string, value: unknown) => void; }
export interface DynamicField { key: string; label: string; type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox'; options?: string[]; required?: boolean; }

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = (props) => {
  const { schema, values = {}, onChange } = props;
  return (
    <div className={styles.container} role="form" aria-label="Dynamic field renderer">
      <div className={styles.content}>
        {schema.map(field => (
          <div key={field.key} className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{field.label}{field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}</label>
            {field.type === 'select' ? (
              <select className={styles.select} value={String(values[field.key] || '')} onChange={e => onChange?.(field.key, e.target.value)} aria-label={field.label}>
                <option value="">Select...</option>
                {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea className={styles.input} style={{ minHeight: 80, resize: 'vertical' }} value={String(values[field.key] || '')} onChange={e => onChange?.(field.key, e.target.value)} aria-label={field.label} />
            ) : field.type === 'checkbox' ? (
              <input type="checkbox" className={styles.checkbox} checked={Boolean(values[field.key])} onChange={e => onChange?.(field.key, e.target.checked)} aria-label={field.label} />
            ) : (
              <input className={styles.input} type={field.type} value={String(values[field.key] || '')} onChange={e => onChange?.(field.key, e.target.value)} aria-label={field.label} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
