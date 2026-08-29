"use client";

import { useState, useId, type FC, type ReactNode, type KeyboardEvent } from "react";
import styles from "./switch.module.css";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
  className?: string;
}

export const Switch: FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id: customId,
  className = "",
}) => {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internal;

  const generatedId = useId();
  const id = customId ?? generatedId;
  const labelId = label !== undefined ? `${id}-label` : undefined;

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

  const switchTrackClass = [
    styles.track,
    checked ? styles.checked : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      htmlFor={id}
      className={`${styles.container} ${disabled ? styles.disabledContainer : ""} ${className}`.trim()}
    >
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-labelledby={labelId}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={switchTrackClass}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </div>
      {label !== undefined && (
        <span id={labelId} className={styles.labelText}>
          {label}
        </span>
      )}
    </label>
  );
};
