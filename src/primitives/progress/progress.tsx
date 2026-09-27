import { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./progress.module.css";

export type ProgressVariant = "primary" | "success" | "warning" | "danger" | "neutral";
export type ProgressSize = "xs" | "sm" | "md" | "lg";

/**
 * Class variance authority definitions for Progress.
 * Standardized across shadcn/ui and Salesforce Lightning activity indicators.
 */
export const progressVariants = cva(styles.track, {
  variants: {
    size: {
      xs: styles.xs,
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    variant: {
      primary: styles.primary,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
      neutral: styles.neutral,
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export interface ProgressProps
  extends VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  className?: string;
}

/**
 * `<Progress>` — Accessible progress bar element with determinate and indeterminate loading modes.
 * Standardized with cva, data-slot, and W3C APG progressbar specification.
 * @maturity stable
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      variant = "primary",
      size = "md",
      label = "Progress",
      showValue = false,
      className = "",
    },
    ref,
  ) => {
    const isIndeterminate = value === undefined;
    const percentage = !isIndeterminate
      ? Math.min(100, Math.max(0, (value / max) * 100))
      : undefined;

    const trackClasses = progressVariants({ size, variant });

    return (
      <div
        ref={ref}
        data-slot="progress"
        data-size={size}
        data-variant={variant}
        data-indeterminate={isIndeterminate ? "true" : undefined}
        className={`${styles.wrapper} ${className}`.trim()}
      >
        {(label || showValue) && (
          <div data-slot="progress-header" className={styles.header}>
            {label && <span data-slot="progress-label" className={styles.label}>{label}</span>}
            {showValue && !isIndeterminate && (
              <span data-slot="progress-value" className={styles.valueText}>
                {Math.round(percentage ?? 0)}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={isIndeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          data-slot="progress-track"
          className={trackClasses}
        >
          <div
            data-slot="progress-indicator"
            className={`${styles.indicator} ${isIndeterminate ? styles.indeterminate : ""}`}
            style={isIndeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
