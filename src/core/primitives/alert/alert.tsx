"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import styles from "./alert.module.css";

export type FeedbackVariant = "info" | "success" | "warning" | "danger" | "destructive" | "default";

const Icons = {
  info: Info,
  default: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
  destructive: XCircle,
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
  const IconComponent = Icons[variant] || Info;
  const isDestructive = variant === "danger" || variant === "destructive";
  const variantClass =
    variant === "success"
      ? styles.alertSuccess
      : variant === "warning"
        ? styles.alertWarning
        : isDestructive
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

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ children, className = "", ...props }, ref) => (
    <h5
      ref={ref}
      className={`${styles.title} ${className}`.trim()}
      {...props}
    >
      {children}
    </h5>
  )
);
AlertTitle.displayName = "AlertTitle";

export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`${styles.description || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
);
AlertDescription.displayName = "AlertDescription";

