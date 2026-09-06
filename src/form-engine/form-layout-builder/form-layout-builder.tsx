"use client";

import React from "react";
import styles from "./form-layout-builder.module.css";

export interface FormLayoutBuilderProps { sections: LayoutSection[]; onReorder?: (sections: LayoutSection[]) => void; }
export interface LayoutSection { id: string; label: string; columns: number; fields: string[]; }

export const FormLayoutBuilder: React.FC<FormLayoutBuilderProps> = (props) => {
  const { sections } = props;
  return (
    <div className={styles.container} role="region" aria-label="Form layout builder">
      <div className={styles.header}><h3 className={styles.title}>Form Layout Builder</h3></div>
      <div className={styles.content}>
        {sections.map(s => (
          <div key={s.id} className={styles.section}>
            <div className={styles.sectionTitle}>📐 {s.label} ({s.columns} column{s.columns > 1 ? 's' : ''})</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${s.columns}, 1fr)`, gap: 'var(--space-2)' }}>
              {s.fields.map((f, fi) => (
                <div key={fi} style={{ padding: 'var(--space-2)', background: 'var(--color-bg-sunken)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border-default)' }}>{f}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
