import {
  useState,
  useId,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./switch.module.css";

export const switchVariants = cva(styles.container, {
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
  },
  defaultVariants: {
    density: "standard",
    disabled: false,
  },
});

export interface SwitchProps
  extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange">,
    VariantProps<typeof switchVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
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
 * Strata V1 Switch primitive — accessible binary toggle switch adhering to W3C ARIA switch pattern,
 * supporting 4-tier density scaling, micro-animations, and high-contrast focus indicators.
 * Standardized with cva, data-slot, and W3C APG switch pattern.
 */
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      label,
      description,
      density = "standard",
      id: customId,
      name,
      value,
      "aria-label": ariaLabel,
      "aria-describedby": customDescribedBy,
      className = "",
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internal;

    const generatedId = useId();
    const id = customId ?? generatedId;
    const labelId = label !== undefined ? `${id}-label` : undefined;
    const descId = description !== undefined ? `${id}-desc` : undefined;
    const ariaDescribedBy = [customDescribedBy, descId].filter(Boolean).join(" ") || undefined;

    const toggle = () => {
      if (disabled) return;
      const next = !checked;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    };

    const containerClass = `${switchVariants({ density, disabled })} ${className}`.trim();
    const switchTrackClass = [
      styles.track,
      checked ? styles.checked : "",
      disabled ? styles.disabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label
        ref={ref}
        htmlFor={id}
        data-slot="switch"
        data-state={checked ? "checked" : "unchecked"}
        data-density={density}
        data-disabled={disabled ? "true" : undefined}
        className={containerClass}
        {...props}
      >
        <div
          id={id}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled || undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
          tabIndex={disabled ? -1 : 0}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          data-slot="switch-track"
          data-state={checked ? "checked" : "unchecked"}
          className={switchTrackClass}
        >
          <span data-slot="switch-thumb" className={styles.thumb} aria-hidden="true" />
        </div>
        {(label !== undefined || description !== undefined) && (
          <div data-slot="switch-label-wrapper" className={styles.labelCol}>
            {label !== undefined && (
              <span id={labelId} data-slot="switch-label" className={styles.labelText}>
                {label}
              </span>
            )}
            {description !== undefined && (
              <span id={descId} data-slot="switch-description" className={styles.descriptionText}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";
