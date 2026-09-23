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
 * Strata V1 RadioGroup primitive — accessible mutually exclusive option selection with hint descriptions,
 * 4-tier density scaling, and high-contrast focus rings.
 */
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      onChange,
      name: customName,
      disabled = false,
      orientation = "vertical",
      density,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedName = useId();
    const name = customName ?? generatedName;
    const densityClass = density ? styles[density] : "";

    return (
      <div
        ref={ref}
        role="radiogroup"
        data-density={density}
        className={[
          styles.group,
          styles[orientation],
          densityClass,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {options.map((opt) => {
          const isChecked = value === opt.value;
          const isDisabled = opt.disabled || disabled;

          return (
            <label
              key={opt.value}
              className={[
                styles.item,
                isDisabled ? styles.disabledItem : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                type="radio"
                name={name}
                id={`${name}-${opt.value}`}
                value={opt.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => {
                  if (isDisabled) return;
                  onChange?.(opt.value);
                }}
                className={styles.hiddenInput}
              />
              <div
                className={[styles.radio, isChecked ? styles.checked : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              >
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
  }
);

RadioGroup.displayName = "RadioGroup";
