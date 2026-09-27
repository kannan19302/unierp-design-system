"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./dashboard-page.module.css";

export const dashboardGridVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

const densityGapMap = {
  "ultra-compact": 8,
  compact: 12,
  standard: 16,
  comfortable: 24,
} as const;

export interface DashboardGridLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardGridVariants> {
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
  {
    children,
    columns = 3,
    gap,
    density = "standard",
    className,
    style,
    ...restProps
  },
  ref
) {
  const resolvedDensity = density ?? "standard";
  const resolvedGap = gap ?? densityGapMap[resolvedDensity];

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: typeof resolvedGap === "number" ? `${resolvedGap}px` : resolvedGap,
  };

  return (
    <div
      ref={ref}
      className={`${dashboardGridVariants({ density: resolvedDensity })} ${className ?? ""}`.trim()}
      data-slot="dashboard-page"
      data-density={resolvedDensity}
      role="region"
      aria-label="Dashboard grid"
      style={style}
      {...restProps}
    >
      <div
        className={styles.grid}
        data-slot="dashboard-page-grid"
        style={gridStyle}
      >
        {children}
      </div>
    </div>
  );
});

DashboardGridLayout.displayName = "DashboardGridLayout";

export const DashboardPageTemplate = DashboardGridLayout;
