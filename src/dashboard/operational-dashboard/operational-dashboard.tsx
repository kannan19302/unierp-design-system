"use client";

import { type FC, type ReactNode } from "react";
import { KPIStrip, type KPICardItem } from "../../data-display/stat-card";
import styles from "./operational-dashboard.module.css";

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
          <h1 className={styles.title}>{title}</h1>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>
        {headerActions && <div style={{ display: "flex", gap: "var(--space-2)" }}>{headerActions}</div>}
      </div>

      {/* 1. KPI Strip */}
      <section aria-label="Key Metrics" style={{ marginBottom: "var(--space-4)" }}>
        <KPIStrip items={kpis} />
      </section>

      {/* 2. Filter Bar */}
      {filterBar && (
        <div style={{ marginBottom: "var(--space-4)" }}>
          {filterBar}
        </div>
      )}

      {/* 3. Action Queue / Critical Exceptions */}
      {actionQueue && (
        <section aria-label="Action Queue" style={{ marginBottom: "var(--space-4)" }}>
          {actionQueue}
        </section>
      )}

      {/* 4. Charts Section */}
      {(mainChart || secondaryChart) && (
        <div className={styles.chartsGrid} style={{ gridTemplateColumns: secondaryChart ? "repeat(auto-fit, minmax(var(--chart-min-width, 360px), 1fr))" : "1fr" }}>
          {mainChart && (
            <div className={styles.chartCard}>
              {mainChart}
            </div>
          )}
          {secondaryChart && (
            <div className={styles.chartCard}>
              {secondaryChart}
            </div>
          )}
        </div>
      )}

      {/* 5. Live Activity Table */}
      {activityTable && (
        <section aria-label="Recent Activity" className={styles.activityCard}>
          {activityTable}
        </section>
      )}
    </div>
  );
};
