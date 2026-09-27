import { useId, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./radio-group.module.css";

export const radioGroupVariants = cva(styles.group, {
  variants: {
    orientation: {
      vertical: styles.vertical,
      horizontal: styles.horizontal,
    },
    density: {
      "ultra-compact": styles["ultra-compact"],
      compact: styles.compact,
      standard: styles.standard,
      comfortable: styles.comfortable,
    },
  },
  defaultVariants: {
    orientation: "vertical",
    density: "standard",
  },
});

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
 * Standardized with cva, data-slot, and W3C APG radiogroup pattern.
 */
export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof radioGroupVariants> {
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
      density = "standard",
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedName = useId();
    const name = customName ?? generatedName;
    const groupClass = `${radioGroupVariants({ orientation, density })} ${className}`.trim();

    return (
      <div
        ref={ref}
        role="radiogroup"
        data-slot="radio-group"
        data-orientation={orientation}
        data-density={density}
        className={groupClass}
        {...props}
      >
        {options.map((opt) => {
          const isChecked = value === opt.value;
          const isDisabled = opt.disabled || disabled;

          return (
            <label
              key={opt.value}
              data-slot="radio-group-item"
              data-state={isChecked ? "checked" : "unchecked"}
              data-disabled={isDisabled ? "true" : undefined}
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
                data-slot="radio-group-input"
                onChange={() => {
                  if (isDisabled) return;
                  onChange?.(opt.value);
                }}
                className={styles.hiddenInput}
              />
              <div
                data-slot="radio-group-indicator"
                className={[styles.radio, isChecked ? styles.checked : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              >
                {isChecked && <span data-slot="radio-group-dot" className={styles.dot} />}
              </div>
              <div data-slot="radio-group-content" className={styles.labelContent}>
                <span data-slot="radio-group-label" className={styles.label}>{opt.label}</span>
                {opt.hint && <span data-slot="radio-group-hint" className={styles.hint}>{opt.hint}</span>}
              </div>
            </label>
          );
        })}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
