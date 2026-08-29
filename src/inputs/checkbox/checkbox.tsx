"use client";

import { useState, useId, forwardRef, type ReactNode, type ChangeEvent } from "react";
import { Check, Minus } from "lucide-react";
import styles from "./checkbox.module.css";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      onChange,
      disabled = false,
      label,
      id: customId,
      className = "",
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internal;

    const generatedId = useId();
    const id = customId ?? generatedId;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const next = e.target.checked;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const boxClass = [
      styles.box,
      checked ? styles.checked : "",
      indeterminate ? styles.indeterminate : "",
      disabled ? styles.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label
        htmlFor={id}
        className={`${styles.container} ${disabled ? styles.disabledContainer : ""} ${className}`.trim()}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className={styles.hiddenInput}
        />
        <div className={boxClass} aria-hidden="true">
          {indeterminate ? (
            <Minus size={11} strokeWidth={3} className={styles.icon} />
          ) : checked ? (
            <Check size={11} strokeWidth={3} className={styles.icon} />
          ) : null}
        </div>
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
