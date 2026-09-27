"use client";

import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";
import styles from "./label.module.css";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
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
 *
 * Provides standard font weighting, required/optional indicators,
 * density responsiveness, and disabled state styling.
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
    const rootClass = [
      styles.label,
      styles[size],
      disabled ? styles.disabled : "",
      error ? styles.error : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label ref={ref} className={rootClass} {...props}>
        {children}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className={styles.optional}>
            (optional)
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";
