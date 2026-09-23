"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import styles from "./textarea.module.css";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Size variant aligned with control density */
  textareaSize?: "sm" | "md" | "lg";
  /** Visual error state or error message flag */
  error?: boolean;
  /** Resize behavior control */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** Full width container stretching */
  fullWidth?: boolean;
}

/**
 * `<Textarea>` — Multiline text input primitive adhering to Strata DL 3.0.
 *
 * Provides density-aware typography, configurable resize direction,
 * focus rings, and disabled/error styling.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      textareaSize = "md",
      error = false,
      resize = "vertical",
      fullWidth = false,
      disabled = false,
      rows = 3,
      className = "",
      ...props
    },
    ref
  ) => {
    const rootClasses = [
      styles.textarea,
      styles[textareaSize],
      styles[`resize_${resize}`],
      fullWidth ? styles.fullWidth : "",
      error ? styles.error : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={rootClasses}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
