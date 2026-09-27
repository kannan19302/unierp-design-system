"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./status-bar.module.css";

export const statusBarVariants = cva(styles.container, {
  variants: {
    status: {
      operational: styles.statusOperational,
      degraded: styles.statusDegraded,
      outage: styles.statusOutage,
      maintenance: styles.statusMaintenance,
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    status: "operational",
    density: "standard",
  },
});

export type StatusBarVariantProps = VariantProps<typeof statusBarVariants>;

export interface SystemStatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "operational" | "degraded" | "outage" | "maintenance";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  message?: string;
  lastChecked?: string;
  incidentUrl?: string;
  className?: string;
}

/**
 * SystemStatusBar component displaying global platform infrastructure health and incident state.
 *
 * @maturity stable
 */
export const SystemStatusBar = forwardRef<HTMLDivElement, SystemStatusBarProps>(
  function SystemStatusBar(
    {
      status,
      density = "standard",
      message,
      lastChecked,
      incidentUrl,
      className = "",
      ...rest
    },
    ref
  ) {
    const config = {
      operational: {
        color: "var(--color-success, #10b981)",
        icon: "●",
        label: "All Systems Operational",
      },
      degraded: {
        color: "var(--color-warning, #f59e0b)",
        icon: "▲",
        label: "Degraded Performance",
      },
      outage: {
        color: "var(--color-error, #ef4444)",
        icon: "■",
        label: "Service Outage",
      },
      maintenance: {
        color: "var(--color-info, #3b82f6)",
        icon: "◆",
        label: "Scheduled Maintenance",
      },
    };
    const c = config[status] ?? config.operational;

    return (
      <div
        ref={ref}
        className={`${statusBarVariants({ status, density })} ${className}`.trim()}
        role="status"
        aria-label="System status"
        data-slot="status-bar"
        data-status={status}
        data-density={density}
        {...rest}
      >
        <span className={styles.icon} data-slot="status-bar-icon" style={{ color: c.color }} aria-hidden="true">
          {c.icon}
        </span>
        <span
          className={styles.label}
          data-slot="status-bar-label"
          style={{ color: c.color }}
        >
          {c.label}
        </span>
        {message && (
          <span className={styles.message} data-slot="status-bar-message">
            — {message}
          </span>
        )}
        {lastChecked && (
          <span className={styles.timestamp} data-slot="status-bar-timestamp">
            Last checked: {lastChecked}
          </span>
        )}
        {incidentUrl && (
          <a
            href={incidentUrl}
            className={styles.incidentLink}
            data-slot="status-bar-incident"
          >
            View Incident
          </a>
        )}
      </div>
    );
  }
);

SystemStatusBar.displayName = "SystemStatusBar";

export const StatusBar = SystemStatusBar;
export type StatusBarProps = SystemStatusBarProps;
