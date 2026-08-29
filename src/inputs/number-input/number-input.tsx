"use client";

import { forwardRef, type ChangeEvent, useState, useEffect } from "react";
import styles from "./number-input.module.css";

export interface NumberInputProps {
  id?: string;
  value?: number | string;
  onChange?: (val: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
  "aria-label"?: string;
  className?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      id,
      value,
      onChange,
      min,
      max,
      step = 1,
      disabled = false,
      placeholder,
      invalid = false,
      "aria-label": ariaLabel = "Number input",
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
          const clamped = min !== undefined && num < min ? min : max !== undefined && num > max ? max : num;
          setDisplayVal(String(clamped));
          onChange?.(clamped);
        }
      }
    };

    const inputClass = [
      styles.input,
      invalid ? styles.invalid : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
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
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputClass}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";
