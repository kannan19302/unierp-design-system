"use client";

import { forwardRef, type ChangeEvent, useState, useEffect } from "react";
import styles from "./percent-input.module.css";

export interface PercentInputProps {
  id?: string;
  value?: number | string;
  onChange?: (val: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
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
      className = "",
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
        <input
          ref={ref}
          id={id}
          type="number"
          step={step}
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
        <span className={styles.symbol} aria-hidden="true">
          %
        </span>
      </div>
    );
  }
);
PercentInput.displayName = "PercentInput";
