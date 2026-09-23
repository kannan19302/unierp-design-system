"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ChangeEvent } from "react";
import styles from "./slider.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata V1 Slider primitive — accessible continuous or discrete numerical range input
 * with 4-tier density scaling, tabular numeric indicators, and custom value formatting.
 */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  valueFormatter?: (val: number) => string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
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
      valueFormatter,
      density,
      "aria-label": ariaLabel = "Slider control",
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    const densityClass = density ? styles[density] : "";
    const formattedValue = valueFormatter ? valueFormatter(value) : value;

    return (
      <div
        data-density={density}
        className={[
          styles.container,
          densityClass,
          disabled ? styles.disabled : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          ref={ref}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onChange={handleChange}
          className={styles.rangeInput}
          {...props}
        />
        {showValue && (
          <span className={styles.valueDisplay} aria-hidden="true">
            {formattedValue}
          </span>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";
