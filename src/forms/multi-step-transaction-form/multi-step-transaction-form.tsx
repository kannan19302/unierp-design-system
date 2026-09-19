"use client";

import React, { forwardRef, useState } from "react";
import styles from "./multi-step-transaction-form.module.css";

export interface TransactionStep {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface MultiStepTransactionFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  steps: TransactionStep[];
  onComplete?: (data: Record<string, unknown>) => void;
  initialStepIndex?: number;
}

/**
 * MultiStepTransactionForm
 *
 * A progressive wizard and guided workflow container for multi-step ERP transactions
 * including ledger postings, approvals, and complex checkouts.
 *
 * @maturity stable
 */
export const MultiStepTransactionForm = forwardRef<
  HTMLDivElement,
  MultiStepTransactionFormProps
>(function MultiStepTransactionForm(
  {
    steps,
    onComplete,
    initialStepIndex = 0,
    className,
    ...restProps
  },
  ref
) {
  const [current, setCurrent] = useState(initialStepIndex);

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="form"
      aria-label="Multi-step transaction form"
      {...restProps}
    >
      <div className={styles.steps}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <div className={styles.divider} aria-hidden="true" />}
            <div
              className={`${styles.step} ${
                i === current
                  ? styles.stepActive
                  : i < current
                  ? styles.stepComplete
                  : ""
              }`}
              aria-current={i === current ? "step" : undefined}
            >
              <span>{i < current ? "✓" : i + 1}</span> {s.label}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.content}>{steps[current]?.content}</div>
      <div className={styles.actions}>
        {current > 0 && (
          <button
            type="button"
            className={styles.btn}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Back
          </button>
        )}
        {current < steps.length - 1 ? (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onComplete?.({})}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
});

MultiStepTransactionForm.displayName = "MultiStepTransactionForm";
