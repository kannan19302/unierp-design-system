"use client";

import { useId, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./radio-group.module.css";

export interface RadioOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL RadioGroup primitive — accessible mutually exclusive option selection with hint descriptions.
 */
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({
  options,
  value,
  onChange,
  name: customName,
  disabled = false,
  orientation = "vertical",
  className = "",
  ...props
}, ref) => {
  const generatedName = useId();
  const name = customName ?? generatedName;

  return (
    <div
      ref={ref}
      role="radiogroup"
      className={`${styles.group} ${styles[orientation]} ${className}`.trim()}
      {...props}
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
});

RadioGroup.displayName = "RadioGroup";
