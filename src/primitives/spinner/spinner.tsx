import { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./spinner.module.css";

export const spinnerVariants = cva(styles.spinner, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    variant: {
      primary: styles.primary,
      current: styles.current,
      white: styles.white,
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export type SpinnerVariant = "primary" | "current" | "white";

export interface SpinnerProps
  extends VariantProps<typeof spinnerVariants> {
  size?: "sm" | "md" | "lg";
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
}

/**
 * `<Spinner>` — Accessible rotary progress indicator for loading and asynchronous states.
 * Standardized with cva, data-slot, and W3C APG status role.
 * @maturity stable
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = "md",
  variant = "primary",
  className = "",
  label = "Loading",
}, ref) => {
  const spinnerClass = `${spinnerVariants({ size, variant })} ${className}`.trim();

  return (
    <div
      ref={ref}
      className={spinnerClass}
      role="status"
      aria-label={label}
      data-slot="spinner"
      data-size={size}
      data-variant={variant}
    >
      <span data-slot="spinner-sr" className={styles.srOnly}>{label}...</span>
    </div>
  );
});

Spinner.displayName = "Spinner";
