"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import styles from "./date-time-picker.module.css";

export interface DateTimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: string; // YYYY-MM-DDTHH:mm
  onChange?: (datetime: string) => void;
  invalid?: boolean;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      id,
      value = "",
      onChange,
      invalid = false,
      disabled = false,
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
          type="datetime-local"
          value={value}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={styles.input}
          {...props}
        />
      </div>
    );
  }
);
DateTimePicker.displayName = "DateTimePicker";
