"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
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
  className?: string;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(({
  id,
  value = "09:00",
  onChange,
  disabled = false,
  className = "",
  ...props
}, ref) => {
  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ""} ${className}`.trim()}>
      <Clock size={14} className={styles.icon} aria-hidden="true" />
      <input
        ref={ref}
        id={id}
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={styles.input}
        {...props}
      />
    </div>
  );
});

TimePicker.displayName = "TimePicker";
