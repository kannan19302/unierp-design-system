"use client";

import { forwardRef } from "react";
import styles from "./progress-notification.module.css";

export interface ProgressNotificationProps {
  title: string;
  progress: number;
  status: "running" | "success" | "error" | "paused";
  message?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

/**
 * ProgressNotification component for tracking long-running asynchronous processes, imports, and builds.
 *
 * @maturity stable
 */
export const ProgressNotification = forwardRef<HTMLDivElement, ProgressNotificationProps>(
  function ProgressNotification(
    {
      title,
      progress,
      status,
      message,
      onCancel,
      onRetry,
      className = "",
    },
    ref
  ) {
    const colors = {
      running: "var(--color-brand)",
      success: "var(--color-success)",
      error: "var(--color-error)",
      paused: "var(--color-warning)",
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="region"
        aria-label={title}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBlockEnd: "var(--space-2)",
          }}
        >
          <span style={{ fontWeight: "var(--weight-semibold, 600)", fontSize: "var(--text-sm)" }}>
            {title}
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: colors[status] }}>{progress}%</span>
        </div>
        <div
          className={styles.progress}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={title}
        >
          <div
            className={styles.progressFill}
            style={{ inlineSize: `${progress}%`, background: colors[status] }}
          />
        </div>
        {message && (
          <div
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-secondary)",
              marginBlockStart: "var(--space-1)",
            }}
          >
            {message}
          </div>
        )}
        <div style={{ display: "flex", gap: "var(--space-2)", marginBlockStart: "var(--space-2)" }}>
          {status === "running" && onCancel && (
            <button
              type="button"
              className={styles.btn}
              onClick={onCancel}
              style={{ fontSize: "var(--text-xs)" }}
            >
              Cancel
            </button>
          )}
          {status === "error" && onRetry && (
            <button
              type="button"
              className={styles.btn}
              onClick={onRetry}
              style={{ fontSize: "var(--text-xs)" }}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }
);

ProgressNotification.displayName = "ProgressNotification";
