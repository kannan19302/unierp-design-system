"use client";

import { type FC, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import styles from "./alert.module.css";

export type FeedbackVariant = "info" | "success" | "warning" | "danger";

const Icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

export interface AlertProps {
  variant?: FeedbackVariant;
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
  className?: string;
}

export const Alert: FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  action,
  className = "",
}) => {
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
      role="alert"
      className={`${styles.alert} ${variantClass} ${className}`.trim()}
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
};
