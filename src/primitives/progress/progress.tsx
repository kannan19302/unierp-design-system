"use client";

import { type FC } from "react";
import styles from "./progress.module.css";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export const Progress: FC<ProgressProps> = ({
  value,
  max = 100,
  label = "Progress",
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={`${styles.track} ${className}`.trim()}
    >
      <div
        className={styles.indicator}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
