"use client";

import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./label.module.css";

/**
 * Class variance authority definitions for Label.
 * Standardized across Radix UI / shadcn enterprise benchmark.
 */
export const labelVariants = cva(styles.label, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    disabled: {
      true: styles.disabled,
      false: "",
    },
    error: {
      true: styles.error,
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    disabled: false,
    error: false,
  },
});

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  /** Label text or rich node content */
  children: ReactNode;
  /** Mark field as mandatory with an indicator asterisk */
  required?: boolean;
  /** Display an '(optional)' badge/text */
  optional?: boolean;
  /** Visually indicate disabled state */
  disabled?: boolean;
  /** Size variant aligned with control density */
  size?: "sm" | "md" | "lg";
  /** Error state styling */
  error?: boolean;
  /** Optional custom CSS class */
  className?: string;
}

/**
 * `<Label>` — Accessible form field label primitive adhering to Strata DL 3.0.
 * Standardized with cva, data-slot, and Radix/shadcn benchmark.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      required = false,
      optional = false,
      disabled = false,
      size = "md",
      error = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const rootClass = labelVariants({ size, disabled, error, className });

    return (
      <label
        ref={ref}
        data-slot="label"
        data-size={size}
        data-disabled={disabled ? "true" : undefined}
        data-error={error ? "true" : undefined}
        className={rootClass}
        {...props}
      >
        {children}
        {required && (
          <span data-slot="label-asterisk" className={styles.required} aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span data-slot="label-optional" className={styles.optional}>
            (optional)
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";
