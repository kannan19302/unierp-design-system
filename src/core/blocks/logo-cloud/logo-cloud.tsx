"use client";

import React from "react";
import styles from "./logo-cloud.module.css";

export interface LogoCloudProps { title?: string; logos: LogoItem[]; }
export interface LogoItem { name: string; icon: string; }

export const LogoCloud: React.FC<LogoCloudProps> = (props) => {
  const { title = 'Trusted by leading companies', logos } = props;
  return (
    <div className={styles.container} role="region" aria-label={title} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-6)', alignItems: 'center' }}>
        {logos.map((l, i) => <div key={i} style={{ fontSize: 'var(--text-2xl, 24px)', opacity: 0.6, transition: 'opacity 0.2s' }} title={l.name}>{l.icon} <span style={{ fontSize: 'var(--text-sm)', verticalAlign: 'middle' }}>{l.name}</span></div>)}
      </div>
    </div>
  );
};
