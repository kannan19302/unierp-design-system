"use client";

import React, { forwardRef } from "react";
import styles from "./dashboard-widget-toolbar.module.css";

export interface DashboardWidgetToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  onRefresh?: () => void;
  onExpand?: () => void;
  onExport?: () => void;
  onEdit?: () => void;
  lastUpdated?: string;
}

/**
 * DashboardWidgetToolbar
 *
 * Micro-action header bar for individual dashboard widgets and analytical cards,
 * providing refresh triggers, fullscreen expand, CSV/PDF export, and configuration toggles.
 *
 * @maturity stable
 */
export const DashboardWidgetToolbar = forwardRef<
  HTMLDivElement,
  DashboardWidgetToolbarProps
>(function DashboardWidgetToolbar(
  {
    title,
    onRefresh,
    onExpand,
    onExport,
    onEdit,
    lastUpdated,
    className,
    ...restProps
  },
  ref
) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="toolbar"
      aria-label={`${title} toolbar`}
      {...restProps}
    >
      <div className={styles.inner}>
        <div className={styles.titleArea}>
          <span className={styles.title}>{title}</span>
          {lastUpdated && (
            <span className={styles.updated}>Updated {lastUpdated}</span>
          )}
        </div>
        <div className={styles.actions}>
          {onRefresh && (
            <button
              type="button"
              className={styles.btn}
              onClick={onRefresh}
              aria-label="Refresh widget data"
            >
              ⟳
            </button>
          )}
          {onExpand && (
            <button
              type="button"
              className={styles.btn}
              onClick={onExpand}
              aria-label="Expand widget fullscreen"
            >
              ⤢
            </button>
          )}
          {onExport && (
            <button
              type="button"
              className={styles.btn}
              onClick={onExport}
              aria-label="Export widget dataset"
            >
              ↗
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              className={styles.btn}
              onClick={onEdit}
              aria-label="Edit widget configuration"
            >
              ✎
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

DashboardWidgetToolbar.displayName = "DashboardWidgetToolbar";
