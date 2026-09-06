"use client";

import React from "react";
import styles from "./announcement-card.module.css";

export interface AnnouncementCardProps { title: string; body: string; ctaLabel?: string; onCtaClick?: () => void; onDismiss?: () => void; variant?: 'info' | 'feature' | 'update'; }

export const AnnouncementCard: React.FC<AnnouncementCardProps> = (props) => {
  const { title, body, ctaLabel, onCtaClick, onDismiss, variant = 'info' } = props;
  const gradients = { info: 'linear-gradient(135deg, #eff6ff, #dbeafe)', feature: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', update: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' };
  return (
    <div className={styles.container} role="article" aria-label={title} style={{ background: gradients[variant] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 'var(--weight-bold, 700)', fontSize: 'var(--text-base)' }}>{title}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{body}</div>
          {ctaLabel && <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onCtaClick} style={{ marginTop: 'var(--space-3)' }}>{ctaLabel}</button>}
        </div>
        {onDismiss && <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-lg)' }} aria-label="Dismiss">×</button>}
      </div>
    </div>
  );
};
