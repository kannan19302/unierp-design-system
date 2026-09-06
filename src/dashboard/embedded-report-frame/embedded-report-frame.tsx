"use client";

import React from "react";
import styles from "./embedded-report-frame.module.css";

export interface EmbeddedReportFrameProps { title: string; src?: string; height?: number; loading?: boolean; error?: string; }

export const EmbeddedReportFrame: React.FC<EmbeddedReportFrameProps> = (props) => {
  const { title, src, height = 400, loading = false, error } = props;
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <div className={styles.header}><h3 className={styles.title}>{title}</h3></div>
      {loading ? <div className={styles.empty}>Loading report...</div> : error ? <div className={styles.empty} style={{ color: 'var(--color-error)' }}>{error}</div> : src ? <div style={{ width: '100%', height, background: 'var(--color-bg-sunken)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Embedded Report: {src}</div> : <div className={styles.empty}>No report configured</div>}
    </div>
  );
};
