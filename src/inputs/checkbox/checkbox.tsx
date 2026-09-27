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
  invalid?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  id?: string;
  name?: string;
  value?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

/**
 * @maturity stable
 * @since 1.0.0
 * Strata V1 Checkbox primitive — supports checked, unchecked, tri-state indeterminate,
 * 4-tier density scaling, assistive descriptions, and high-contrast focus rings.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      onChange,
      disabled = false,
      invalid = false,
      label,
      description,
      density,
      id: customId,
      name,
      value,
      "aria-label": ariaLabel,
      "aria-describedby": customDescribedBy,
      className = "",
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internal;

    const generatedId = useId();
    const id = customId ?? generatedId;
    const descId = description ? `${id}-desc` : undefined;
    const ariaDescribedBy = [customDescribedBy, descId].filter(Boolean).join(" ") || undefined;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const next = e.target.checked;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const densityClass = density ? styles[density] : "";
    const boxClass = [
      styles.box,
      checked ? styles.checked : "",
      indeterminate ? styles.indeterminate : "",
      invalid ? styles.invalid : "",
      disabled ? styles.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label
        htmlFor={id}
        data-density={density}
        className={[
          styles.container,
          densityClass,
          disabled ? styles.disabledContainer : "",
          invalid ? styles.invalidContainer : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-invalid={invalid ? "true" : undefined}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
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
        {(label || description) && (
          <div className={styles.labelCol}>
            {label && <span className={styles.labelText}>{label}</span>}
            {description && (
              <span id={descId} className={styles.descriptionText}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
