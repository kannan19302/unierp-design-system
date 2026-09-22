"use client";

import React, { forwardRef } from "react";
import styles from "./dashboard-grid-layout.module.css";

export interface DashboardGridLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  columns?: number;
  gap?: number | string;
}

/**
 * DashboardGridLayout
 *
 * Responsive multi-column layout grid for analytical dashboard cards,
 * widgets, charts, and operational telemetry blocks.
 *
 * @maturity stable
 */
export const DashboardGridLayout = forwardRef<
  HTMLDivElement,
  DashboardGridLayoutProps
>(function DashboardGridLayout(
  { children, columns = 3, gap = 16, className, style, ...restProps },
  ref
) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: typeof gap === "number" ? `${gap}px` : gap,
  };

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="region"
      aria-label="Dashboard grid"
      style={style}
      {...restProps}
    >
      <div className={styles.grid} style={gridStyle}>
        {children}
      </div>
    </div>
  );
});

DashboardGridLayout.displayName = "DashboardGridLayout";
