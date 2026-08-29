"use client";

import { type FC } from "react";
import { Clock } from "lucide-react";
import styles from "./date-time-picker.module.css";

export interface TimePickerProps {
  id?: string;
  value?: string; // HH:mm
  onChange?: (time: string) => void;
  disabled?: boolean;
  className?: string;
}

export const TimePicker: FC<TimePickerProps> = ({
  id,
  value = "09:00",
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ""} ${className}`.trim()}>
      <Clock size={14} className={styles.icon} aria-hidden="true" />
      <input
        id={id}
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};
