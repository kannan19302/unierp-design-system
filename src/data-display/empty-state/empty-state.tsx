"use client";

import { type FC, type ReactNode } from "react";
import styles from "./empty-state.module.css";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`${styles.container} ${className}`.trim()} role="status">
      {icon && <div className={styles.iconWell}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.actionWrap}>{action}</div>}
    </div>
  );
};
