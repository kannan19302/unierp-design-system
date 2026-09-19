"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import styles from "./alert.module.css";

export type FeedbackVariant = "info" | "success" | "warning" | "danger";

const Icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Alert primitive — prominent status and contextual feedback notification banner.
 */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: FeedbackVariant;
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
  className?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  variant = "info",
  title,
  children,
  onClose,
  action,
  className = "",
  ...props
}, ref) => {
  const IconComponent = Icons[variant];
  const variantClass =
    variant === "success"
      ? styles.alertSuccess
      : variant === "warning"
        ? styles.alertWarning
        : variant === "danger"
          ? styles.alertDanger
          : styles.alertInfo;

  return (
    <div
      ref={ref}
      role="alert"
      className={`${styles.alert} ${variantClass} ${className}`.trim()}
      {...props}
    >
      <IconComponent size={18} className={styles.icon} />
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div>{children}</div>}
      </div>
      {action && <div>{action}</div>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

Alert.displayName = "Alert";
