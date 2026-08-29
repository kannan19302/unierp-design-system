"use client";

import { type ReactNode, type KeyboardEvent } from "react";
import { cn } from "../../utils/cn";
import styles from "./segmented-control.module.css";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  name = "segmented-control",
  size = "md",
  fullWidth = false,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Selection options",
}: SegmentedControlProps<T>) {
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, currentIndex: number) => {
    if (disabled || options.length === 0) return;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % options.length;
      while (options[nextIndex]?.disabled && nextIndex !== currentIndex) {
        nextIndex = (nextIndex + 1) % options.length;
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + options.length) % options.length;
      while (options[nextIndex]?.disabled && nextIndex !== currentIndex) {
        nextIndex = (nextIndex - 1 + options.length) % options.length;
      }
    }

    const targetOption = options[nextIndex];
    if (nextIndex !== currentIndex && targetOption && !targetOption.disabled) {
      onChange(targetOption.value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        styles.container,
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            name={name}
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => !isDisabled && onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              styles.segment,
              isSelected && styles.selected,
              isDisabled && styles.segmentDisabled,
            )}
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
