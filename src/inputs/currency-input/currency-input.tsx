"use client";

import { forwardRef, type ChangeEvent, useState, useEffect } from "react";
import styles from "./currency-input.module.css";

export interface CurrencyInputProps {
  id?: string;
  value?: number | string;
  onChange?: (val: number | undefined) => void;
  currencySymbol?: string;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
  min?: number;
  max?: number;
}

/**
 * `<CurrencyInput>` — Financial-grade decimal input primitive.
 * Enforces tabular alignment and exact cents/sub-unit calculation.
 */
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
      className = "",
      min,
      max,
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

    const containerClass = [
      styles.wrapper,
      invalid ? styles.invalid : "",
      disabled ? styles.disabled : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClass}>
        <span className={styles.symbol} aria-hidden="true">
          {currencySymbol}
        </span>
        <input
          ref={ref}
          id={id}
          type="number"
          step="0.01"
          min={min}
          max={max}
          value={displayVal}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          className={styles.input}
        />
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";
