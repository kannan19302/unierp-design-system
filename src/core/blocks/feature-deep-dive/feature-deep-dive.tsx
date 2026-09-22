"use client";

import React from "react";
import styles from "./feature-deep-dive.module.css";

export interface FeatureDeepDiveProps { features: FeatureSection[]; }
export interface FeatureSection { title: string; description: string; icon: string; align?: 'left' | 'right'; }

export const FeatureDeepDive: React.FC<FeatureDeepDiveProps> = (props) => {
  const { features } = props;
  return (
    <div className={styles.container} role="region" aria-label="Features">
      <div className={styles.content} style={{ gap: 'var(--space-8)' }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexDirection: (f.align || (i % 2 === 0 ? 'left' : 'right')) === 'right' ? 'row-reverse' : 'row' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-xl, 20px)', fontWeight: 'var(--weight-bold, 700)', marginBottom: 'var(--space-2)' }}>{f.title}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.description}</div>
            </div>
            <div style={{ width: 120, height: 120, background: 'var(--color-brand-subtle)', borderRadius: 'var(--radius-xl, 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl, 30px)', flexShrink: 0 }}>{f.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
