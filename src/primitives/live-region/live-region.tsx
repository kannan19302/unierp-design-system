"use client";

import { type ReactNode } from "react";
import { cn } from "../../utils/cn";
import styles from "./live-region.module.css";

export type LiveRegionVariant = "hidden" | "badge" | "banner" | "hud";

export interface LiveRegionProps {
  children?: ReactNode;
  politeness?: "polite" | "assertive" | "off";
  role?: "status" | "alert" | "log";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all" | "additions text";
  visuallyHidden?: boolean;
  variant?: LiveRegionVariant;
  className?: string;
}

export function LiveRegion({
  children,
  politeness = "polite",
  role = politeness === "assertive" ? "alert" : "status",
  atomic = true,
  relevant = "additions text",
  visuallyHidden,
  variant,
  className,
}: LiveRegionProps) {
  // Resolve active variant
  const effectiveVariant: LiveRegionVariant =
    variant ?? (visuallyHidden === false ? "banner" : "hidden");
  const isHidden = effectiveVariant === "hidden";

  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn(
        styles.region,
        isHidden ? styles.srOnly : styles[effectiveVariant],
        styles[politeness],
        className
      )}
    >
      {!isHidden && (
        <div className={styles.beaconHeader}>
          <span className={styles.beacon}>
            <span className={styles.beaconPing} aria-hidden />
            <span className={styles.beaconDot} aria-hidden />
          </span>
          <span className={styles.politenessTag}>
            {politeness.toUpperCase()}
          </span>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

