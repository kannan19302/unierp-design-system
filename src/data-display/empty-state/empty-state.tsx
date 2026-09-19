"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./empty-state.module.css";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * EmptyState renders contextual placeholders for empty, uninitialized, or filtered-out data views.
 *
 * @maturity stable
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(({
  icon,
  title,
  description,
  action,
  className = "",
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.container} ${className}`.trim()}
      role="status"
      {...props}
    >
      {icon && <div className={styles.iconWell}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.actionWrap}>{action}</div>}
    </div>
  );
});

EmptyState.displayName = "EmptyState";
