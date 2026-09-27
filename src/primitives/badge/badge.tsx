"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./badge.module.css";

/**
 * Class variance authority definitions for Badge.
 * Compatible with shadcn/ui community standards and Strata Design tokens.
 */
export const badgeVariants = cva(styles.badge, {
  variants: {
    variant: {
      default: styles.default,
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      destructive: styles.destructive,
      danger: styles.danger,
      success: styles.success,
      warning: styles.warning,
      info: styles.info,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "destructive"
    | "outline"
    | "info";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
  asChild?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * `<Badge>` — Compact visual status indicator and metadata tag.
 * Follows shadcn/ui and Strata design system standards with full cva, data-slot, and APG compliance.
 * @maturity stable
 * @since 1.0.0
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "sm",
      dot = false,
      pulse = false,
      asChild = false,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const badgeClass = badgeVariants({ variant, size, className });
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-size={size}
        className={badgeClass}
        {...props}
      >
        {dot && (
          <span
            data-slot="dot"
            className={`${styles.dot} ${pulse ? styles.pulse : ""}`.trim()}
            aria-hidden="true"
          />
        )}
        <span data-slot="label" className={styles.label}>
          {children}
        </span>
      </Comp>
    );
  },
);

Badge.displayName = "Badge";
