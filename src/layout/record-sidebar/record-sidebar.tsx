"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./record-sidebar.module.css";

export interface RecordSidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * `<RecordSidebar>` anchors contextual metadata, audit logs, and document summaries
 * in master-detail and entity inspection layouts.
 *
 * @maturity stable
 */
export const RecordSidebar = forwardRef<HTMLElement, RecordSidebarProps>(
  ({ title = "Record Info", children, footer, className = "", ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={`${styles.sidebar} ${className}`.trim()}
        aria-label={typeof title === "string" ? title : "Record Details"}
        {...props}
      >
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </aside>
    );
  }
);

RecordSidebar.displayName = "RecordSidebar";

