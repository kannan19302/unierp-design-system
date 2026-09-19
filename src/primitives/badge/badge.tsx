"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./badge.module.css";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Badge primitive — compact visual status indicator.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
  asChild?: boolean;
  children: ReactNode;
  className?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  variant = "default",
  size = "sm",
  dot = false,
  pulse = false,
  asChild = false,
  children,
  className = "",
  ...props
}, ref) => {
  const badgeClass = [styles.badge, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(" ");

  const Comp = asChild ? Slot : "span";

  return (
    <Comp ref={ref} className={badgeClass} {...props}>
      {dot && (
        <span
          className={`${styles.dot} ${pulse ? styles.pulse : ""}`.trim()}
          aria-hidden="true"
        />
      )}
      <span className={styles.label}>{children}</span>
    </Comp>
  );
});

Badge.displayName = "Badge";
