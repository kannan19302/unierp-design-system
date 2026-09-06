"use client";

import React from "react";
import styles from "./field-validation-summary.module.css";

export interface FieldValidationSummaryProps { errors: ValidationError[]; onErrorClick?: (fieldKey: string) => void; }
export interface ValidationError { fieldKey: string; fieldLabel: string; message: string; }

export const FieldValidationSummary: React.FC<FieldValidationSummaryProps> = (props) => {
  const { errors, onErrorClick } = props;
  if (errors.length === 0) return null;
  return (
    <div className={styles.container} role="alert" aria-label="Validation errors" style={{ borderColor: 'var(--color-error, #ef4444)', background: 'var(--color-error-subtle, #fef2f2)' }}>
      <h4 style={{ margin: '0 0 var(--space-2)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>⚠ {errors.length} validation error{errors.length > 1 ? 's' : ''}</h4>
      <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', listStyle: 'none' }}>
        {errors.map((err, i) => (
          <li key={i} style={{ padding: 'var(--space-1) 0', fontSize: 'var(--text-sm)' }}>
            <button onClick={() => onErrorClick?.(err.fieldKey)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}>
              {err.fieldLabel}
            </button>: {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
};
