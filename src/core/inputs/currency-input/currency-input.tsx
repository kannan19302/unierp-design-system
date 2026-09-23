"use client";

import { forwardRef, type InputHTMLAttributes, type ChangeEvent, useState, useEffect, useId } from "react";
import styles from "./currency-input.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL CurrencyInput primitive — financial-grade decimal input with currency symbol slot and 2-decimal blur formatting.
 */
export interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id?: string;
  value?: number | string;
  onChange?: (val: number | undefined) => void;
  currencySymbol?: string;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  min?: number;
  max?: number;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      id,
      value,
      onChange,
      currencySymbol = "$",
      disabled = false,
      placeholder = "0.00",
      invalid = false,
      required = false,
      label,
      error,
      density,
      className = "",
      min,
      max,
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
          const clamped = min !== undefined && num < min ? min : max !== undefined && num > max ? max : num;
          setDisplayVal(clamped.toFixed(2));
          onChange?.(clamped);
        }
      }
    };

    const isNegative = !isNaN(parseFloat(displayVal)) && parseFloat(displayVal) < 0;
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    const containerClass = [
      styles.wrapper,
      density ? styles[density] : "",
      invalid || !!error ? styles.invalid : "",
      isNegative ? styles.negative : "",
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
          <span className={styles.symbol} aria-hidden="true">
            {currencySymbol}
          </span>
          <input
            ref={ref}
            id={inputId}
            type="number"
            step="0.01"
            min={min}
            max={max}
            value={displayVal}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            aria-invalid={invalid || !!error || undefined}
            aria-describedby={errorId}
            aria-label={label ? undefined : (props["aria-label"] ?? "Monetary amount")}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.input}
            {...props}
          />
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
CurrencyInput.displayName = "CurrencyInput";
