"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./view-switcher.module.css";

export const viewSwitcherVariants = cva(styles.container, {
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

export type ViewSwitcherVariantProps = VariantProps<typeof viewSwitcherVariants>;

export type ViewMode = "list" | "chart" | "kanban" | "grid";

export interface ViewOption {
  mode: ViewMode;
  label: string;
  icon: React.ReactNode;
}

export interface ViewSwitcherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
  options?: ViewOption[];
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

const iconStyle: React.CSSProperties = {
  flexShrink: 0,
  display: "block",
  inlineSize: "14px",
  blockSize: "14px",
};

const ListIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
    aria-hidden="true"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const BarChartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
    aria-hidden="true"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const KanbanIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="5" height="18" rx="1" />
    <rect x="10" y="3" width="5" height="12" rx="1" />
    <rect x="17" y="3" width="5" height="15" rx="1" />
  </svg>
);

const GridIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={iconStyle}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const VIEW_ICONS: Record<ViewMode, React.ReactNode> = {
  list: <ListIcon />,
  chart: <BarChartIcon />,
  kanban: <KanbanIcon />,
  grid: <GridIcon />,
};

const VIEW_LABELS: Record<ViewMode, string> = {
  list: "List",
  chart: "Chart",
  kanban: "Kanban",
  grid: "Grid",
};

/**
 * ViewSwitcher component allows enterprise operators to switch between
 * list, chart, kanban, and grid operational visualizations.
 *
 * @maturity stable
 */
export const ViewSwitcher = forwardRef<HTMLDivElement, ViewSwitcherProps>(
  (
    {
      activeView,
      onViewChange,
      availableViews = ["list", "chart"],
      options,
      density = "standard",
      className = "",
      testId = "view-switcher",
      ...restProps
    },
    ref
  ) => {
    // If custom options provided, use them; otherwise use availableViews mapping
    const resolvedViews: ViewOption[] = options
      ? options
      : availableViews.map((mode) => ({
          mode,
          label: VIEW_LABELS[mode] ?? mode,
          icon: VIEW_ICONS[mode] ?? null,
        }));

    return (
      <div
        ref={ref}
        role="group"
        aria-label="View Switcher"
        data-slot="view-switcher"
        data-active-view={activeView}
        data-density={density}
        data-testid={testId}
        className={`${viewSwitcherVariants({ density })} ${className}`.trim()}
        {...restProps}
      >
        {resolvedViews.map((opt) => {
          const isActive = opt.mode === activeView;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => onViewChange(opt.mode)}
              title={opt.label}
              aria-pressed={isActive}
              data-slot="view-switcher-button"
              data-view-mode={opt.mode}
              className={`${styles.viewBtn} ${isActive ? styles.viewBtnActive : ""}`}
            >
              <span className={styles.icon} data-slot="view-switcher-icon" aria-hidden="true">
                {opt.icon}
              </span>
              <span className={styles.label} data-slot="view-switcher-label">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

ViewSwitcher.displayName = "ViewSwitcher";
