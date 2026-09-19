"use client";

import { type FC } from "react";
import styles from "./spinner.module.css";

export type SpinnerVariant = "primary" | "current" | "white";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: SpinnerVariant;
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const spinnerClass = [
    styles.spinner,
    styles[size],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={spinnerClass} role="status" aria-label="Loading">
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};
