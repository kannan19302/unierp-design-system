"use client";

import { forwardRef, type ChangeEvent } from "react";
import styles from "./slider.module.css";

export interface SliderProps {
  id?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  "aria-label"?: string;
  className?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      id,
      value = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      disabled = false,
      showValue = false,
      "aria-label": ariaLabel = "Slider control",
      className = "",
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    return (
      <div className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}>
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel}
          onChange={handleChange}
          className={styles.rangeInput}
        />
        {showValue && (
          <span className={styles.valueDisplay} aria-hidden="true">
            {value}
          </span>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";
