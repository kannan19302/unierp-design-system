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
      role="img"
    >
      <svg
        aria-hidden="true"
        width={pixels}
        height={pixels}
        viewBox="0 0 100 100"
        fill="none"
        className={styles.svg}
      >
        <rect
          width="100"
          height="100"
          rx="30"
          fill="var(--color-primary, var(--color-brand, #2563eb))"
        />
        <path
          d="M36 32V58C36 66.284 42.716 73 51 73C59.284 73 66 66.284 66 58V50"
          stroke="var(--color-white, #ffffff)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="66"
          cy="33"
          r="8"
          fill="var(--color-brand-cyan, #38bdf8)"
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
