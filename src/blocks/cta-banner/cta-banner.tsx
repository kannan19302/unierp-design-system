"use client";

import React from "react";
import styles from "./cta-banner.module.css";

export interface CTABannerProps { headline: string; subtext?: string; primaryAction: { label: string; onClick?: () => void }; secondaryAction?: { label: string; onClick?: () => void }; }

export const CTABanner: React.FC<CTABannerProps> = (props) => {
  const { headline, subtext, primaryAction, secondaryAction } = props;
  return (
    <div className={styles.container} role="banner" aria-label="Call to action" style={{ background: 'linear-gradient(135deg, var(--color-brand, #2563eb), var(--color-brand-active, #1d4ed8))', color: 'var(--color-brand-contrast, #ffffff)', textAlign: 'center', padding: 'var(--space-8)' }}>
      <h2 style={{ fontSize: 'var(--text-2xl, 24px)', fontWeight: 'var(--weight-bold, 700)', margin: 0 }}>{headline}</h2>
      {subtext && <p style={{ fontSize: 'var(--text-base)', opacity: 0.9, marginTop: 'var(--space-2)', margin: 'var(--space-2) auto 0', maxWidth: 500 }}>{subtext}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <button onClick={primaryAction.onClick} style={{ padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-md)', background: 'var(--color-brand-contrast, #ffffff)', color: 'var(--color-brand)', fontWeight: 'var(--weight-semibold, 600)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>{primaryAction.label}</button>
        {secondaryAction && <button onClick={secondaryAction.onClick} style={{ padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-brand-contrast, #ffffff)', fontWeight: 'var(--weight-semibold, 600)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>{secondaryAction.label}</button>}
      </div>
    </div>
  );
};
