"use client";

import React from "react";
import styles from "./newsletter-signup.module.css";

export interface NewsletterSignupProps { title?: string; subtitle?: string; onSubmit?: (email: string) => void; privacyUrl?: string; }

export const NewsletterSignup: React.FC<NewsletterSignupProps> = (props) => {
  const { title = 'Stay Updated', subtitle = 'Get the latest product updates and industry insights.', onSubmit, privacyUrl } = props;
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = () => { if (email) { onSubmit?.(email); setSubmitted(true); } };
  return (
    <div className={styles.container} role="form" aria-label="Newsletter signup" style={{ textAlign: 'center' }}>
      <h3 className={styles.title}>{title}</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 var(--space-4)' }}>{subtitle}</p>
      {submitted ? (
        <div style={{ color: 'var(--color-success)', fontWeight: 'var(--weight-semibold, 600)' }}>✓ Thanks for subscribing!</div>
      ) : (
        <div style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 400, margin: '0 auto' }}>
          <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Email address" />
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} style={{ flexShrink: 0 }}>Subscribe</button>
        </div>
      )}
      {privacyUrl && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>We respect your privacy.</div>}
    </div>
  );
};
