"use client";

import { forwardRef, useId, type HTMLAttributes, type ReactNode, type KeyboardEvent } from "react";
import { cn } from "../../utils/cn";
import styles from "./segmented-control.module.css";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

/**
 * @maturity stable
 * @since 1.0.0
 * Strata V1 SegmentedControl primitive — high-density inline view/filter switch
 * with arrow-key roving tabindex, 4-tier density scaling, and tactile segment transitions.
 */
export interface SegmentedControlProps<T extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  size?: "sm" | "md" | "lg";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps<any>>(
  (
    {
      options,
      value,
      onChange,
      name,
      size = "md",
      density,
      fullWidth = false,
      disabled = false,
      className,
      "aria-label": ariaLabel = "Selection options",
      ...props
    },
    ref
  ) => {
    const generatedName = useId();
    const controlName = name || generatedName;
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

    const densityClass = density ? styles[density] : "";

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        data-density={density}
        className={cn(
          styles.container,
          styles[size],
          densityClass,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          className
        )}
        {...props}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              name={controlName}
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !isDisabled && onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                styles.segment,
                isSelected && styles.selected,
                isDisabled && styles.segmentDisabled
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
);

SegmentedControl.displayName = "SegmentedControl";
