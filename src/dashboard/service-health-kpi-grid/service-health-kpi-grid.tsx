"use client";

import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./service-health-kpi-grid.module.css";

export type HealthStatus = "healthy" | "warning" | "critical";

export interface ServiceHealthKpiItem {
  id: string;
  title: string;
  value: string;
  target?: string;
  status: HealthStatus;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  progressPercent?: number;
  icon?: ReactNode;
  subtitle?: string;
}

export interface ServiceHealthKpiGridProps {
  /** Array of service health KPI items */
  metrics: ServiceHealthKpiItem[];
  /** Grid title */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const STATUS_LABELS: Record<HealthStatus, string> = {
  healthy: "Healthy",
  warning: "Degraded",
  critical: "Critical SLA Breach",
};

/**
 * `<ServiceHealthKpiGrid>` — Operational microservice reliability and telemetry scorecard grid.
 *
 * @maturity stable
 */
export const ServiceHealthKpiGrid = forwardRef<
  HTMLDivElement,
  ServiceHealthKpiGridProps
>(({ metrics, title = "Microservice Reliability & Telemetry", className, style }, ref) => {
  const containerClasses = [styles.gridContainer, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={style}
      role="region"
      aria-label={title}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.grid} role="list">
        {metrics.map((m) => (
          <div
            key={m.id}
            role="listitem"
            className={`${styles.card} ${styles[m.status]}`}
            aria-label={`${m.title}: ${m.value} (${STATUS_LABELS[m.status]})`}
          >
            <div className={styles.cardTop}>
              <span className={styles.kpiTitle}>{m.title}</span>
              <span className={`${styles.statusDot} ${styles[`dot_${m.status}`]}`} aria-hidden="true" />
            </div>

            <div className={styles.valueRow}>
              <span className={styles.kpiValue}>{m.value}</span>
              {m.change && (
                <span
                  className={`${styles.changeBadge} ${styles[m.changeType ?? "neutral"]}`}
                >
                  {m.change}
                </span>
              )}
            </div>

            {m.progressPercent !== undefined && (
              <div className={styles.progressTrack} aria-hidden="true">
                <div
                  className={`${styles.progressBar} ${styles[`bar_${m.status}`]}`}
                  style={{ inlineSize: `${Math.min(100, Math.max(0, m.progressPercent))}%` }}
                />
              </div>
            )}

            <div className={styles.cardBottom}>
              {m.target && <span className={styles.targetText}>{m.target}</span>}
              {m.subtitle && <span className={styles.subText}>{m.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ServiceHealthKpiGrid.displayName = "ServiceHealthKpiGrid";
