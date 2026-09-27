import { forwardRef } from "react";
import styles from "./spinner.module.css";

export type SpinnerVariant = "primary" | "current" | "white";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: SpinnerVariant;
  className?: string;
}

/**
 * `<Spinner>` — Accessible rotary progress indicator for loading and asynchronous states.
 * @maturity stable
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = "md",
  variant = "primary",
  className = "",
}, ref) => {
  const spinnerClass = [
    styles.spinner,
    styles[size],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={spinnerClass} role="status" aria-label="Loading">
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
});

Spinner.displayName = "Spinner";
