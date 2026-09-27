import { useState, useId, forwardRef, type ReactNode, type ChangeEvent } from "react";
import { Check, Minus } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./checkbox.module.css";

export const checkboxVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"],
      compact: styles.compact,
      standard: styles.standard,
      comfortable: styles.comfortable,
    },
    disabled: {
      true: styles.disabledContainer,
      false: "",
    },
    invalid: {
      true: styles.invalidContainer,
      false: "",
    },
  },
  defaultVariants: {
    density: "standard",
    disabled: false,
    invalid: false,
  },
});

export interface CheckboxProps
  extends VariantProps<typeof checkboxVariants> {
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
 * Standardized with cva, data-slot, and W3C APG checkbox pattern.
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
      density = "standard",
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

    const containerClass = `${checkboxVariants({ density, disabled, invalid })} ${className}`.trim();
    const boxClass = [
      styles.box,
      checked ? styles.checked : "",
      indeterminate ? styles.indeterminate : "",
      invalid ? styles.invalid : "",
      disabled ? styles.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";

    return (
      <label
        htmlFor={id}
        data-slot="checkbox"
        data-density={density}
        data-state={state}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={invalid ? "true" : undefined}
        className={containerClass}
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
          data-slot="checkbox-input"
          className={styles.hiddenInput}
        />
        <div data-slot="checkbox-indicator" className={boxClass} aria-hidden="true">
          {indeterminate ? (
            <Minus size={11} strokeWidth={3} className={styles.icon} />
          ) : checked ? (
            <Check size={11} strokeWidth={3} className={styles.icon} />
          ) : null}
        </div>
        {(label || description) && (
          <div data-slot="checkbox-label-wrapper" className={styles.labelCol}>
            {label && <span data-slot="checkbox-label" className={styles.labelText}>{label}</span>}
            {description && (
              <span id={descId} data-slot="checkbox-description" className={styles.descriptionText}>
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
