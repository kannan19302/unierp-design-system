"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./field-validation-summary.module.css";

export interface ValidationError {
  fieldKey: string;
  fieldLabel: string;
  message: string;
}

export const fieldValidationSummaryVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type FieldValidationSummaryDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface FieldValidationSummaryProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldValidationSummaryVariants> {
  errors: ValidationError[];
  onErrorClick?: (fieldKey: string) => void;
  density?: FieldValidationSummaryDensity;
  className?: string;
}

export const FieldValidationSummary = forwardRef<
  HTMLDivElement,
  FieldValidationSummaryProps
>(
  (
    {
      errors,
      onErrorClick,
      density = "standard",
      className = "",
      ...restProps
    },
    ref
  ) => {
    if (errors.length === 0) return null;

    return (
      <div
        ref={ref}
        data-slot="field-validation-summary"
        data-density={density}
        className={fieldValidationSummaryVariants({ density, className })}
        role="alert"
        aria-label="Validation errors"
        {...restProps}
      >
        <h4 className={styles.title} data-slot="field-validation-summary-title">
          <span aria-hidden="true">⚠</span>
          <span>
            {errors.length} validation error{errors.length > 1 ? "s" : ""}
          </span>
        </h4>
        <ul className={styles.list} data-slot="field-validation-summary-list">
          {errors.map((err, i) => (
            <li key={i} className={styles.item} data-slot="field-validation-summary-item">
              <button
                type="button"
                onClick={() => onErrorClick?.(err.fieldKey)}
                className={styles.errorLink}
                data-slot="field-validation-summary-link"
              >
                {err.fieldLabel}
              </button>
              <span className={styles.errorMessage} data-slot="field-validation-summary-message">
                : {err.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

FieldValidationSummary.displayName = "FieldValidationSummary";
