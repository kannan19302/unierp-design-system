"use client";

import { type FC, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import styles from "./alert.module.css";
import type { FeedbackVariant } from "./alert";

const Icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

export interface BannerProps {
  variant?: FeedbackVariant;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Banner: FC<BannerProps> = ({
  variant = "info",
  children,
  action,
  onDismiss,
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
      role="region"
      aria-label="Notification Banner"
      className={`${styles.alert} ${variantClass} ${className}`.trim()}
    >
      <IconComponent size={18} className={styles.icon} />
      <div className={styles.content}>{children}</div>
      {action && <div>{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={styles.closeButton}
          aria-label="Dismiss banner"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
