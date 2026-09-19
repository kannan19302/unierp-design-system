"use client";

import { type FC } from "react";
import styles from "./progress.module.css";

export type ProgressVariant = "primary" | "success" | "warning" | "danger" | "neutral";
export type ProgressSize = "xs" | "sm" | "md" | "lg";

export interface ProgressProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const Progress: FC<ProgressProps> = ({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  label = "Progress",
  showValue = false,
  className = "",
}) => {
  const isIndeterminate = value === undefined;
  const percentage = !isIndeterminate
    ? Math.min(100, Math.max(0, (value / max) * 100))
    : undefined;

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && !isIndeterminate && (
            <span className={styles.valueText}>{Math.round(percentage ?? 0)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={`${styles.track} ${styles[size]} ${styles[variant]}`}
      >
        <div
          className={`${styles.indicator} ${isIndeterminate ? styles.indeterminate : ""}`}
          style={isIndeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
