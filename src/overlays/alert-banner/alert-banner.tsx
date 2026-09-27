"use client";

import { forwardRef, type ReactNode } from "react";
import styles from "./alert-banner.module.css";

export interface AlertBannerProps {
  variant?: "info" | "warning" | "error" | "success" | "danger";
  /** Alias for variant (BannerAlert compatibility) */
  severity?: "info" | "warning" | "error" | "success" | "danger";
  title?: string;
  message?: string;
  children?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  className?: string;
}

/**
 * AlertBanner component for critical system notices and dismissible alerts.
 *
 * @maturity stable
 */
export const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(function AlertBanner(
  {
    variant = "info",
    severity,
    title,
    message,
    children,
    dismissible = true,
    onDismiss,
    action,
    className = "",
  },
  ref
) {
  const activeVariant = (severity === "danger" ? "error" : severity) ?? (variant === "danger" ? "error" : variant) ?? "info";
  const colors = {
    info: "var(--color-info)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
    success: "var(--color-success)",
  };
  const icons = { info: "ℹ", warning: "⚠", error: "✕", success: "✓" };

  return (
    <div
      ref={ref}
      className={`${styles.container} ${className}`.trim()}
      role="alert"
      style={{
        borderColor: colors[activeVariant],
        borderInlineStartWidth: 4,
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
      }}
    >
      <span style={{ color: colors[activeVariant], fontSize: "var(--text-lg)", flexShrink: 0 }}>
        {icons[activeVariant]}
      </span>
      <div style={{ flex: 1, minInlineSize: 0 }}>
        {title && (
          <div style={{ fontWeight: "var(--weight-semibold, 600)", fontSize: "var(--text-sm)" }}>
            {title}
          </div>
        )}
        {(message || children) && (
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBlockStart: "var(--space-1)" }}>
            {message ?? children}
          </div>
        )}
        {action && (
          <button
            type="button"
            className={styles.btn}
            onClick={action.onClick}
            style={{ marginBlockStart: "var(--space-2)" }}
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-tertiary)",
            fontSize: "var(--text-lg)",
            padding: 0,
            lineHeight: 1,
          }}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
});

AlertBanner.displayName = "AlertBanner";
