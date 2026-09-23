"use client";

import { forwardRef, type InputHTMLAttributes, type ChangeEvent, useState, useEffect, useId } from "react";
import styles from "./percent-input.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL PercentInput primitive — precision percentage input with suffix % glyph and min/max clamping.
 */
export interface PercentInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id?: string;
  value?: number | string;
  onChange?: (val: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const PercentInput = forwardRef<HTMLInputElement, PercentInputProps>(
  (
    {
      id,
      value,
      onChange,
      min = 0,
      max = 100,
      step = 0.1,
      disabled = false,
      placeholder = "0.0",
      invalid = false,
      required = false,
      label,
      error,
      density,
      className = "",
      ...props
    },
    ref
  ) => {
    const [displayVal, setDisplayVal] = useState<string>(
      value !== undefined && value !== null && value !== "" ? String(value) : ""
    );

    useEffect(() => {
      if (value !== undefined && value !== null && value !== "") {
        setDisplayVal(String(value));
      } else {
        setDisplayVal("");
      }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayVal(raw);

      if (raw === "") {
        onChange?.(undefined);
        return;
      }

      const num = parseFloat(raw);
      if (!isNaN(num)) {
        onChange?.(num);
      }
    };

    const handleBlur = () => {
      if (displayVal !== "") {
        const num = parseFloat(displayVal);
        if (!isNaN(num)) {
          const clamped = Math.max(min, Math.min(max, num));
          setDisplayVal(String(clamped));
          onChange?.(clamped);
        }
      }
    };

    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    const containerClass = [
      styles.wrapper,
      density ? styles[density] : "",
      invalid || !!error ? styles.invalid : "",
      disabled ? styles.disabled : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.rootContainer} data-density={density}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
          </label>
        )}
        <div className={containerClass}>
          <input
            ref={ref}
            id={inputId}
            type="number"
            step={step}
            min={min}
            max={max}
            value={displayVal}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            aria-invalid={invalid || !!error || undefined}
            aria-describedby={errorId}
            aria-label={label ? undefined : (props["aria-label"] ?? "Percentage value")}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.input}
            {...props}
          />
          <span className={styles.symbol} aria-hidden="true">
            %
          </span>
        </div>
        {error && (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);
PercentInput.displayName = "PercentInput";
