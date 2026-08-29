"use client";

import { type FC, type ReactNode } from "react";
import styles from "./record-sidebar.module.css";

export interface RecordSidebarProps {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const RecordSidebar: FC<RecordSidebarProps> = ({
  title = "Record Info",
  children,
  footer,
  className = "",
}) => {
  return (
    <aside
      className={`${styles.sidebar} ${className}`.trim()}
      aria-label={typeof title === "string" ? title : "Record Details"}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
};
