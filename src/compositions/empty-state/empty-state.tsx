"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./empty-state.module.css";

export const emptyStateVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type EmptyStateVariantProps = VariantProps<typeof emptyStateVariants>;

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>,
    EmptyStateVariantProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  "data-slot"?: string;
}

/**
 * EmptyState renders contextual placeholders for empty, uninitialized, or filtered-out data views.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and data-slot annotations.
 *
 * @maturity stable
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(({
  icon,
  title,
  description,
  action,
  density = "standard",
  className = "",
  "data-slot": dataSlot = "empty-state",
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      data-slot={dataSlot}
      data-density={density}
      className={`${emptyStateVariants({ density })}${className ? ` ${className}` : ""}`.trim()}
      role="status"
      {...props}
    >
      {icon && <div className={styles.iconWell} data-slot="empty-state-icon">{icon}</div>}
      <h3 className={styles.title} data-slot="empty-state-title">{title}</h3>
      {description && <p className={styles.description} data-slot="empty-state-description">{description}</p>}
      {action && <div className={styles.actionWrap} data-slot="empty-state-action">{action}</div>}
    </div>
  );
});

EmptyState.displayName = "EmptyState";
