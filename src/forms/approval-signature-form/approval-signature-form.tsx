"use client";

import React from "react";
import styles from "./approval-signature-form.module.css";

export interface ApprovalSignatureFormProps { signerName: string; documentTitle: string; onSign?: (signature: string) => void; onReject?: (reason: string) => void; }

export const ApprovalSignatureForm: React.FC<ApprovalSignatureFormProps> = (props) => {
  const { signerName, documentTitle, onSign, onReject } = props;
  const [agreed, setAgreed] = React.useState(false);
  return (
    <div className={styles.container} role="form" aria-label="Approval signature form">
      <h3 className={styles.title}>Document Approval</h3>
      <div className={styles.content}>
        <div className={styles.card}><div className={styles.label}>Document</div><div style={{ fontWeight: 'var(--weight-semibold, 600)' }}>{documentTitle}</div></div>
        <div className={styles.card}><div className={styles.label}>Signer</div><div style={{ fontWeight: 'var(--weight-semibold, 600)' }}>{signerName}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className={styles.checkbox} id="agree-terms" />
          <label htmlFor="agree-terms" className={styles.label}>I agree to electronically sign this document</label>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={!agreed} onClick={() => onSign?.(signerName)}>Sign & Approve</button>
          <button className={styles.btn} onClick={() => onReject?.('')}>Reject</button>
        </div>
      </div>
    </div>
  );
};
