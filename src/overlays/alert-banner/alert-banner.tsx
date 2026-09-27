"use client";

import { forwardRef, type ReactNode } from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2, X } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./alert-banner.module.css";

export const alertBannerVariants = cva(styles.container, {
  variants: {
    variant: {
      info: styles.variantInfo,
      warning: styles.variantWarning,
      error: styles.variantError,
      success: styles.variantSuccess,
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    variant: "info",
    density: "standard",
  },
});

export interface AlertBannerProps
  extends Omit<VariantProps<typeof alertBannerVariants>, "variant"> {
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
 * Benchmarked against Radix Callout, Salesforce SLDS Scoped Notification, and IBM Carbon Inline Notification.
 *
 * @maturity stable
 */
export const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(function AlertBanner(
  {
    variant = "info",
    severity,
    density = "standard",
    title,
    message,
    children,
    dismissible = true,
    onDismiss,
    action,
    className = "",
    ...props
  },
  ref
) {
  const activeVariant: "info" | "warning" | "error" | "success" =
    (severity === "danger" ? "error" : severity) ?? (variant === "danger" ? "error" : variant) ?? "info";

  const icons = {
    info: <Info size={18} aria-hidden="true" />,
    warning: <AlertTriangle size={18} aria-hidden="true" />,
    error: <AlertCircle size={18} aria-hidden="true" />,
    success: <CheckCircle2 size={18} aria-hidden="true" />,
  };

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="alert-banner"
      data-variant={activeVariant}
      data-density={density}
      className={alertBannerVariants({ variant: activeVariant, density, className })}
      {...props}
    >
      <span data-slot="alert-banner-icon" className={styles.icon}>
        {icons[activeVariant]}
      </span>
      <div data-slot="alert-banner-content" className={styles.content}>
        {title && (
          <div data-slot="alert-banner-title" className={styles.title}>
            {title}
          </div>
        )}
        {(message || children) && (
          <div data-slot="alert-banner-message" className={styles.message}>
            {message ?? children}
          </div>
        )}
        {action && (
          <button
            type="button"
            data-slot="alert-banner-action"
            className={styles.actionBtn}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          data-slot="alert-banner-dismiss"
          className={styles.dismissBtn}
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

AlertBanner.displayName = "AlertBanner";
