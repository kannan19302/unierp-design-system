"use client";

import React, { type ChangeEvent, type KeyboardEvent } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./number-stepper.module.css";

export interface NumberStepperProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function NumberStepper({
  value,
  defaultValue = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 0,
  disabled = false,
  readOnly = false,
  label,
  size = "md",
  className,
}: NumberStepperProps) {
  const [internalValue, setInternalValue] = React.useState<number>(
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

  return (
    <div className={cn(styles.wrapper, styles[size], disabled && styles.disabled, className)}>
      {label && <label className={styles.label}>{label}</label>}
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
          aria-label={label ?? "Numeric stepper value"}
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
    </div>
  );
}
