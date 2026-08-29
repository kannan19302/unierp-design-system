"use client";

import { type ReactNode } from "react";
import { cn } from "../../utils/cn";
import styles from "./live-region.module.css";

export interface LiveRegionProps {
  children?: ReactNode;
  politeness?: "polite" | "assertive" | "off";
  role?: "status" | "alert" | "log";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all" | "additions text";
  visuallyHidden?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  politeness = "polite",
  role = politeness === "assertive" ? "alert" : "status",
  atomic = true,
  relevant = "additions text",
  visuallyHidden = true,
  className,
}: LiveRegionProps) {
  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn(visuallyHidden && styles.srOnly, styles.region, className)}
    >
      {children}
    </div>
  );
}
