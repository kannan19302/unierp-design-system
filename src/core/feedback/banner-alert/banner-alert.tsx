import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./banner-alert.module.css";

export interface BannerAlertProps extends HTMLAttributes<HTMLDivElement> {
  severity?: "info" | "success" | "warning" | "error";
  title?: string;
  action?: ReactNode;
  onDismiss?: () => void;
}

export const BannerAlert = forwardRef<HTMLDivElement, BannerAlertProps>(
  (
    {
      severity = "info",
      title,
      action,
      onDismiss,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={`${styles.banner} ${styles[severity]} ${className}`}
        {...props}
      >
        <div className={styles.content}>
          {title && <strong className={styles.title}>{title}</strong>}
          <div className={styles.body}>{children}</div>
        </div>

        {action && <div className={styles.action}>{action}</div>}

        {onDismiss && (
          <button
            type="button"
            className={styles.dismissBtn}
            aria-label="Dismiss banner"
            onClick={onDismiss}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

BannerAlert.displayName = "BannerAlert";
