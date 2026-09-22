import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./feedback-toast.module.css";

export interface FeedbackToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  description?: string;
  type?: "info" | "success" | "warning" | "error";
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  icon?: ReactNode;
}

export const FeedbackToast = forwardRef<HTMLDivElement, FeedbackToastProps>(
  (
    {
      message,
      description,
      type = "success",
      actionLabel,
      onAction,
      onClose,
      icon,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={`${styles.toast} ${styles[type]} ${className}`}
        {...props}
      >
        <div className={styles.iconArea}>
          {icon || <span className={styles.bullet} />}
        </div>

        <div className={styles.textArea}>
          <div className={styles.message}>{message}</div>
          {description && <div className={styles.description}>{description}</div>}
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}

        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close toast notification"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

FeedbackToast.displayName = "FeedbackToast";
