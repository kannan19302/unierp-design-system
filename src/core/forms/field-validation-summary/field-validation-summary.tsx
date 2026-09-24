"use client";

import React from "react";
import styles from "./field-validation-summary.module.css";

export interface FieldValidationSummaryProps { errors: ValidationError[]; onErrorClick?: (fieldKey: string) => void; }
export interface ValidationError { fieldKey: string; fieldLabel: string; message: string; }

export const FieldValidationSummary = React.forwardRef<
  HTMLDivElement,
  FieldValidationSummaryProps
>((props, ref) => {
  const { errors, onErrorClick } = props;
  if (errors.length === 0) return null;
  return (
    <div
      ref={ref}
      className={styles.container}
      role="alert"
      aria-label="Validation errors"
      style={{
        borderColor: "var(--color-error, #ef4444)",
        background: "var(--color-error-subtle, #fef2f2)",
      }}
    >
      <h4
        style={{
          margin: "0 0 var(--space-2)",
          color: "var(--color-error)",
          fontSize: "var(--text-sm)",
        }}
      >
        ⚠ {errors.length} validation error{errors.length > 1 ? "s" : ""}
      </h4>
      <ul style={{ margin: 0, paddingLeft: "var(--space-4)", listStyle: "none" }}>
        {errors.map((err, i) => (
          <li
            key={i}
            style={{ padding: "var(--space-1) 0", fontSize: "var(--text-sm)" }}
          >
            <button
              type="button"
              onClick={() => onErrorClick?.(err.fieldKey)}
              className={styles.errorLink}
            >
              {err.fieldLabel}
            </button>
            : {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
});

FieldValidationSummary.displayName = "FieldValidationSummary";
