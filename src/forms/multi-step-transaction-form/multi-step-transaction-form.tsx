"use client";

import React from "react";
import styles from "./multi-step-transaction-form.module.css";

export interface MultiStepTransactionFormProps { steps: TransactionStep[]; onComplete?: (data: Record<string, unknown>) => void; }
export interface TransactionStep { id: string; label: string; content: React.ReactNode; }

export const MultiStepTransactionForm: React.FC<MultiStepTransactionFormProps> = (props) => {
  const { steps, onComplete } = props;
  const [current, setCurrent] = React.useState(0);
  return (
    <div className={styles.container} role="form" aria-label="Multi-step transaction form">
      <div className={styles.steps}>{steps.map((s, i) => (<React.Fragment key={s.id}>{i > 0 && <div className={styles.divider} />}<div className={`${styles.step} ${i === current ? styles.stepActive : i < current ? styles.stepComplete : ''}`}><span>{i < current ? '✓' : i + 1}</span> {s.label}</div></React.Fragment>))}</div>
      <div className={styles.content}>{steps[current]?.content}</div>
      <div className={styles.actions}>
        {current > 0 && <button className={styles.btn} onClick={() => setCurrent(c => c - 1)}>Back</button>}
        {current < steps.length - 1 ? <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setCurrent(c => c + 1)}>Next</button> : <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onComplete?.({})}>Submit</button>}
      </div>
    </div>
  );
};
