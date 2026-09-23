"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import styles from "./date-time-picker.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL DateTimePicker primitive — combined date and time selector with ISO 8601 datetime-local formatting.
 */
export interface DateTimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: string; // YYYY-MM-DDTHH:mm
  onChange?: (datetime: string) => void;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  min?: string;
  max?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      id,
      value = "",
      onChange,
      invalid = false,
      disabled = false,
      required = false,
      label,
      error,
      min,
      max,
      density,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    const wrapperClass = [
      styles.wrapper,
      density ? styles[density] : "",
      invalid || !!error ? styles.invalid : "",
      disabled ? styles.disabled : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.rootContainer} data-density={density}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
          </label>
        )}
        <div className={wrapperClass}>
          <CalendarIcon size={14} className={styles.icon} aria-hidden="true" />
          <input
            ref={ref}
            id={inputId}
            type="datetime-local"
            value={value}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            aria-invalid={invalid || !!error || undefined}
            aria-describedby={errorId}
            aria-label={label ? undefined : (props["aria-label"] ?? "Select date and time")}
            onChange={(e) => onChange?.(e.target.value)}
            className={styles.input}
            {...props}
          />
        </div>
        {error && (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
