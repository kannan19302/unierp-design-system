"use client";

import { forwardRef } from "react";
import styles from "./system-status-bar.module.css";

export interface SystemStatusBarProps {
  status: "operational" | "degraded" | "outage" | "maintenance";
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
      message,
      lastChecked,
      incidentUrl,
      className = "",
    },
    ref
  ) {
    const config = {
      operational: {
        color: "var(--color-success)",
        icon: "●",
        label: "All Systems Operational",
      },
      degraded: {
        color: "var(--color-warning)",
        icon: "▲",
        label: "Degraded Performance",
      },
      outage: {
        color: "var(--color-error)",
        icon: "■",
        label: "Service Outage",
      },
      maintenance: {
        color: "var(--color-info)",
        icon: "◆",
        label: "Scheduled Maintenance",
      },
    };
    const c = config[status];

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="status"
        aria-label="System status"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          paddingBlock: "var(--space-2)",
          paddingInline: "var(--space-4)",
        }}
      >
        <span style={{ color: c.color, fontSize: "var(--text-sm)" }}>{c.icon}</span>
        <span
          style={{
            fontWeight: "var(--weight-semibold, 600)",
            fontSize: "var(--text-sm)",
            color: c.color,
          }}
        >
          {c.label}
        </span>
        {message && (
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            — {message}
          </span>
        )}
        <span
          style={{
            marginInlineStart: "auto",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-tertiary)",
          }}
        >
          {lastChecked && `Last checked: ${lastChecked}`}
        </span>
        {incidentUrl && (
          <a
            href={incidentUrl}
            style={{ fontSize: "var(--text-xs)", color: "var(--color-brand)" }}
          >
            View Incident
          </a>
        )}
      </div>
    );
  }
);

SystemStatusBar.displayName = "SystemStatusBar";
