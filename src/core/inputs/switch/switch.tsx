"use client";

import {
  useState,
  useId,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import styles from "./switch.module.css";

export interface SwitchProps extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange"> {
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
      density,
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

    const densityClass = density ? styles[density] : "";
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
        data-density={density}
        className={[
          styles.container,
          densityClass,
          disabled ? styles.disabledContainer : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
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
          className={switchTrackClass}
        >
          <span className={styles.thumb} aria-hidden="true" />
        </div>
        {(label !== undefined || description !== undefined) && (
          <div className={styles.labelCol}>
            {label !== undefined && (
              <span id={labelId} className={styles.labelText}>
                {label}
              </span>
            )}
            {description !== undefined && (
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

Switch.displayName = "Switch";
