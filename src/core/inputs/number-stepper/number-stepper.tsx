"use client";

import { useState, forwardRef, useId, type HTMLAttributes, type ChangeEvent, type KeyboardEvent } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./number-stepper.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL NumberStepper primitive — precision numerical stepper with tactile plus/minus buttons and clamping.
 */
export interface NumberStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  id?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const NumberStepper = forwardRef<HTMLDivElement, NumberStepperProps>(({
  id,
  value,
  defaultValue = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 0,
  disabled = false,
  readOnly = false,
  invalid = false,
  required = false,
  error,
  label,
  size = "md",
  density,
  className,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState<number>(
    value !== undefined ? value : defaultValue,
  );

  const currentValue = value !== undefined ? value : internalValue;

  const clamp = (val: number): number => {
    let clamped = Math.min(Math.max(val, min), max);
    if (precision >= 0) {
      clamped = Number(clamped.toFixed(precision));
    }
    return clamped;
  };

  const updateValue = (nextVal: number) => {
    const clamped = clamp(nextVal);
    if (value === undefined) {
      setInternalValue(clamped);
    }
    onChange?.(clamped);
  };

  const handleIncrement = () => {
    if (disabled || readOnly || currentValue >= max) return;
    updateValue(currentValue + step);
  };

  const handleDecrement = () => {
    if (disabled || readOnly || currentValue <= min) return;
    updateValue(currentValue - step);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      updateValue(parsed);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  const isMinDisabled = disabled || readOnly || currentValue <= min;
  const isMaxDisabled = disabled || readOnly || currentValue >= max;

  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div
      ref={ref}
      data-density={density}
      className={cn(
        styles.wrapper,
        size && styles[size],
        density && styles[density],
        (invalid || !!error) && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
      {...props}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={styles.stepperContainer}>
        <button
          type="button"
          className={cn(styles.stepBtn, styles.decrementBtn)}
          onClick={handleDecrement}
          disabled={isMinDisabled}
          aria-label="Decrease value"
          tabIndex={-1}
        >
          <Minus size={14} />
        </button>
        <input
          id={inputId}
          type="number"
          className={styles.input}
          value={currentValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={(invalid || !!error) || undefined}
          aria-describedby={errorId}
          aria-label={label ? undefined : "Numeric stepper value"}
        />
        <button
          type="button"
          className={cn(styles.stepBtn, styles.incrementBtn)}
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          aria-label="Increase value"
          tabIndex={-1}
        >
          <Plus size={14} />
        </button>
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

NumberStepper.displayName = "NumberStepper";
