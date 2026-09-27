"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import styles from "./select.module.css";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

/**
 * Select — Native accessible dropdown form control.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options = [], error, helperText, className = "", id, children, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${styles.select} ${error ? styles.hasError : ""} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
        </select>
        {error && <span className={styles.errorText} role="alert">{error}</span>}
        {!error && helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
