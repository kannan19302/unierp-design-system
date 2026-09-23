"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Clock } from "lucide-react";
import styles from "./date-time-picker.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL TimePicker primitive — standalone 24-hour time picker with Clock glyph prefix.
 */
export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  id?: string;
  value?: string; // HH:mm
  onChange?: (time: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(({
  id,
  value = "09:00",
  onChange,
  disabled = false,
  invalid = false,
  required = false,
  label,
  error,
  density,
  className = "",
  ...props
}, ref) => {
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
        <Clock size={14} className={styles.icon} aria-hidden="true" />
        <input
          ref={ref}
          id={inputId}
          type="time"
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || !!error || undefined}
          aria-describedby={errorId}
          aria-label={label ? undefined : (props["aria-label"] ?? "Select time")}
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
});

TimePicker.displayName = "TimePicker";
