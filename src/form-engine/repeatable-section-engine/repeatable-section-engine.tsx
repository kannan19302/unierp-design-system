"use client";

import React from "react";
import styles from "./repeatable-section-engine.module.css";

export interface RepeatableSectionEngineProps { sectionLabel: string; fieldLabels: string[]; maxSections?: number; }

export const RepeatableSectionEngine: React.FC<RepeatableSectionEngineProps> = (props) => {
  const { sectionLabel, fieldLabels, maxSections = 10 } = props;
  const [sections, setSections] = React.useState([0]);
  return (
    <div className={styles.container} role="group" aria-label={`Repeatable ${sectionLabel}`}>
      <div className={styles.header}><h3 className={styles.title}>{sectionLabel}</h3><button className={styles.btn} onClick={() => sections.length < maxSections && setSections([...sections, sections.length])} disabled={sections.length >= maxSections}>+ Add {sectionLabel}</button></div>
      <div className={styles.content}>
        {sections.map((_, si) => (
          <div key={si} className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span className={styles.sectionTitle}>{sectionLabel} #{si + 1}</span>
              {sections.length > 1 && <button className={styles.btn} onClick={() => setSections(sections.filter((_, i) => i !== si))} style={{ padding: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>Remove</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(var(--space-48, 11.25rem), 1fr))`, gap: 'var(--space-2)' }}>
              {fieldLabels.map((fl, fi) => (
                <div key={fi} className={styles.fieldGroup}><label className={styles.fieldLabel}>{fl}</label><input className={styles.input} placeholder={fl} aria-label={`${sectionLabel} ${si + 1} ${fl}`} /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
