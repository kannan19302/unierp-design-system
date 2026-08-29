"use client";

import { useId, type FC, type ReactNode } from "react";
import styles from "./radio-group.module.css";

export interface RadioOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export const RadioGroup: FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name: customName,
  disabled = false,
  orientation = "vertical",
  className = "",
}) => {
  const generatedName = useId();
  const name = customName ?? generatedName;

  return (
    <div
      role="radiogroup"
      className={`${styles.group} ${styles[orientation]} ${className}`.trim()}
    >
      {options.map((opt) => {
        const isChecked = value === opt.value;
        const isDisabled = opt.disabled || disabled;

        return (
          <label
            key={opt.value}
            className={`${styles.item} ${isDisabled ? styles.disabledItem : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => onChange?.(opt.value)}
              className={styles.hiddenInput}
            />
            <div className={`${styles.radio} ${isChecked ? styles.checked : ""}`} aria-hidden="true">
              {isChecked && <span className={styles.dot} />}
            </div>
            <div className={styles.labelContent}>
              <span className={styles.label}>{opt.label}</span>
              {opt.hint && <span className={styles.hint}>{opt.hint}</span>}
            </div>
          </label>
        );
      })}
    </div>
  );
};
