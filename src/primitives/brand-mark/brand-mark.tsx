"use client";

import type { FC } from "react";
import styles from "./brand-mark.module.css";

export interface BrandMarkProps {
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Canonical UniERP product mark used by every web surface. */
export const BrandMark: FC<BrandMarkProps> = ({
  compact = false,
  size = "md",
  className = "",
}) => {
  const pixels = size === "sm" ? 24 : size === "lg" ? 40 : 30;

  return (
    <span
      className={`${styles.container} ${className}`.trim()}
      aria-label="UniERP"
    >
      <svg
        aria-hidden="true"
        width={pixels}
        height={pixels}
        viewBox="0 0 32 32"
        fill="none"
        className={styles.svg}
      >
        <path
          d="M4 5.5 16 1l12 4.5v9.7c0 7.2-4.8 12.5-12 15.8C8.8 27.7 4 22.4 4 15.2V5.5Z"
          fill="var(--color-primary)"
        />
        <path
          d="M10 9v7.2c0 4 2.2 6.1 6 6.1s6-2.1 6-6.1V9h-3.7v7c0 2.1-.7 3.1-2.3 3.1s-2.3-1-2.3-3.1V9H10Z"
          fill="var(--surface-1-bg, white)"
        />
      </svg>
      {!compact && (
        <span className={styles.brandText}>
          Uni<span className={styles.erpAccent}>ERP</span>
        </span>
      )}
    </span>
  );
};
