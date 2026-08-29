"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import styles from "./date-picker.module.css";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  invalid?: boolean;
  minDate?: string;
  maxDate?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id,
      value = "",
      onChange,
      invalid = false,
      disabled = false,
      minDate,
      maxDate,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`${styles.wrapper} ${invalid ? styles.invalid : ""} ${
          disabled ? styles.disabled : ""
        } ${className}`.trim()}
      >
        <CalendarIcon size={14} className={styles.icon} aria-hidden="true" />
        <input
          ref={ref}
          id={id}
          type="date"
          value={value}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={styles.input}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";
