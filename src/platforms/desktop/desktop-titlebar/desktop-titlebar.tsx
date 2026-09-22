import { forwardRef, type HTMLAttributes } from "react";
import styles from "./desktop-titlebar.module.css";

export interface DesktopTitlebarProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  tenantName?: string;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const DesktopTitlebar = forwardRef<HTMLDivElement, DesktopTitlebarProps>(
  (
    {
      title = "UniERP Desktop Workbench",
      tenantName = "Acme Production (acme)",
      isMaximized = false,
      onMinimize,
      onMaximize,
      onClose,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.titlebar} ${className}`}
        role="region"
        aria-label="Desktop Titlebar"
        {...props}
      >
        <div className={styles.dragRegion}>
          <span className={styles.icon}>◆</span>
          <span className={styles.title}>{title}</span>
          <span className={styles.separator}>—</span>
          <span className={styles.tenantBadge}>{tenantName}</span>
        </div>

        <div className={styles.windowControls}>
          <button
            type="button"
            className={styles.controlBtn}
            aria-label="Minimize Window"
            onClick={onMinimize}
          >
            ─
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            aria-label={isMaximized ? "Restore Window" : "Maximize Window"}
            onClick={onMaximize}
          >
            {isMaximized ? "❐" : "□"}
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${styles.closeBtn}`}
            aria-label="Close Window"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }
);

DesktopTitlebar.displayName = "DesktopTitlebar";
