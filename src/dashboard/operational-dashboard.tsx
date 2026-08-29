"use client";

import { type FC, type ReactNode } from "react";
import { KPIStrip, type KPICardItem } from "../data-display/stat-card";
import styles from "./multi-page-dashboard.module.css";

export interface OperationalDashboardProps {
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;

  /** Pinned KPI metrics strip */
  kpis: KPICardItem[];

  /** Filter bar or perspective switcher */
  filterBar?: ReactNode;

  /** Action queue or exception alerts */
  actionQueue?: ReactNode;

  /** Primary chart or operational visual */
  mainChart?: ReactNode;

  /** Secondary chart / breakdown */
  secondaryChart?: ReactNode;

  /** Working activity stream / live records table */
  activityTable?: ReactNode;

  className?: string;
}

/**
 * `<OperationalDashboard>` — Standardized operational dashboard anatomy for DL 2.0.
 *
 * Anatomy: `[KPI Strip] → [Perspective/Filters] → [Action Queue] → [Charts] → [Active Records]`
 *
 * Designed for control-room, operations, warehouse, and finance monitoring.
 */
export const OperationalDashboard: FC<OperationalDashboardProps> = ({
  title,
  subtitle,
  headerActions,
  kpis,
  filterBar,
  actionQueue,
  mainChart,
  secondaryChart,
  activityTable,
  className = "",
}) => {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      <div className={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: "var(--type-workspace, 1.125rem)", fontWeight: 700 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--type-dense, var(--text-sm))", color: "var(--color-text-secondary)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {headerActions && <div style={{ display: "flex", gap: "var(--space-2)" }}>{headerActions}</div>}
      </div>

      {/* 1. KPI Strip */}
      <section aria-label="Key Metrics" style={{ marginBottom: "var(--density-section-gap, 20px)" }}>
        <KPIStrip items={kpis} />
      </section>

      {/* 2. Filter Bar */}
      {filterBar && (
        <div style={{ marginBottom: "var(--density-section-gap, 16px)" }}>
          {filterBar}
        </div>
      )}

      {/* 3. Action Queue / Critical Exceptions */}
      {actionQueue && (
        <section aria-label="Action Queue" style={{ marginBottom: "var(--density-section-gap, 20px)" }}>
          {actionQueue}
        </section>
      )}

      {/* 4. Charts Section */}
      {(mainChart || secondaryChart) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: secondaryChart ? "repeat(auto-fit, minmax(360px, 1fr))" : "1fr",
            gap: "var(--density-panel-gap, 16px)",
            marginBottom: "var(--density-section-gap, 20px)",
          }}
        >
          {mainChart && (
            <div
              style={{
                background: "var(--surface-1-bg, var(--color-bg-elevated))",
                border: "1px solid var(--surface-1-border, var(--color-border))",
                borderRadius: "var(--radius-md)",
                padding: "var(--density-card-padding, 16px)",
              }}
            >
              {mainChart}
            </div>
          )}
          {secondaryChart && (
            <div
              style={{
                background: "var(--surface-1-bg, var(--color-bg-elevated))",
                border: "1px solid var(--surface-1-border, var(--color-border))",
                borderRadius: "var(--radius-md)",
                padding: "var(--density-card-padding, 16px)",
              }}
            >
              {secondaryChart}
            </div>
          )}
        </div>
      )}

      {/* 5. Live Activity Table */}
      {activityTable && (
        <section
          aria-label="Recent Activity"
          style={{
            background: "var(--surface-1-bg, var(--color-bg-elevated))",
            border: "1px solid var(--surface-1-border, var(--color-border))",
            borderRadius: "var(--radius-md)",
            padding: "var(--density-card-padding, 16px)",
          }}
        >
          {activityTable}
        </section>
      )}
    </div>
  );
};
