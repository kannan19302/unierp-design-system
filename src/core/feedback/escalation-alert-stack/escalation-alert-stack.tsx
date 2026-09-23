"use client";

import { forwardRef } from "react";
import styles from "./escalation-alert-stack.module.css";

export interface EscalationAlertStackProps {
  alerts: EscalationAlert[];
  onAcknowledge?: (id: string) => void;
  onSnooze?: (id: string) => void;
  className?: string;
}

export interface EscalationAlert {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  timestamp: string;
  source: string;
}

/**
 * EscalationAlertStack component for mission-critical operations and real-time incident responses.
 *
 * @maturity stable
 */
export const EscalationAlertStack = forwardRef<HTMLDivElement, EscalationAlertStackProps>(
  function EscalationAlertStack(
    { alerts, onAcknowledge, onSnooze, className = "" },
    ref
  ) {
    const severityColors = {
      critical: "var(--color-error)",
      high: "var(--color-warning)",
      medium: "var(--color-info)",
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="alert"
        aria-label="Escalation alerts"
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
      >
        {alerts.map((a) => (
          <div
            key={a.id}
            className={styles.item}
            style={{
              borderInlineStartWidth: 3,
              borderInlineStartColor: severityColors[a.severity],
              borderInlineStartStyle: "solid",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", inlineSize: "100%", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "var(--weight-semibold, 600)", fontSize: "var(--text-sm)" }}>
                {a.title}
              </span>
              <span
                className={styles.tag}
                style={{
                  borderColor: severityColors[a.severity],
                  color: severityColors[a.severity],
                }}
              >
                {a.severity}
              </span>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
              {a.source} • {a.timestamp}
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBlockStart: "var(--space-2)" }}>
              {onAcknowledge && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => onAcknowledge(a.id)}
                  style={{ fontSize: "var(--text-xs)", paddingBlock: "var(--space-1)", paddingInline: "var(--space-2)" }}
                >
                  Acknowledge
                </button>
              )}
              {onSnooze && (
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => onSnooze(a.id)}
                  style={{ fontSize: "var(--text-xs)", paddingBlock: "var(--space-1)", paddingInline: "var(--space-2)" }}
                >
                  Snooze
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

EscalationAlertStack.displayName = "EscalationAlertStack";
