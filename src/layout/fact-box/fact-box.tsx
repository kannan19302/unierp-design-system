"use client";

import {
  useState,
  type FC,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { ChevronDown, ChevronRight, PanelRightClose, PanelRightOpen } from "lucide-react";
import styles from "./fact-box.module.css";

export type FactBoxDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface FactBoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Title for the FactBox sidebar */
  title?: string;
  /** Whether the sidebar can be collapsed into an icon strip */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Density scale */
  density?: FactBoxDensity;
  /** Width of the FactBox in expanded state (defaults to tokenized measure) */
  width?: string;
  /** Actions in the header (e.g., customize tiles, refresh) */
  headerActions?: ReactNode;
  /** Children tiles */
  children?: ReactNode;
}

export interface FactBoxTileProps {
  id?: string;
  title: string;
  badge?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface FactBoxFieldProps {
  label: string;
  value: ReactNode;
  helpText?: string;
  mono?: boolean;
  highlight?: boolean;
  className?: string;
}

export interface FactBoxMetricProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

/**
 * `<FactBoxField>` — Compact key-value metadata row for enterprise sidebars.
 */
export const FactBoxField: FC<FactBoxFieldProps> = ({
  label,
  value,
  helpText,
  mono = false,
  highlight = false,
  className = "",
}) => (
  <div className={`${styles.fieldRow} ${highlight ? styles.fieldHighlight : ""} ${className}`.trim()}>
    <span className={styles.fieldLabel} title={helpText}>
      {label}
    </span>
    <span className={`${styles.fieldValue} ${mono ? styles.fieldMono : ""}`.trim()}>
      {value}
    </span>
  </div>
);

/**
 * `<FactBoxMetric>` — Prominent high-density KPI stat tile for FactBox rails.
 */
export const FactBoxMetric: FC<FactBoxMetricProps> = ({
  label,
  value,
  subtext,
  trend,
  trendValue,
  className = "",
}) => (
  <div className={`${styles.metricTile} ${className}`.trim()}>
    <div className={styles.metricLabel}>{label}</div>
    <div className={styles.metricRow}>
      <span className={styles.metricValue}>{value}</span>
      {trend && trendValue && (
        <span
          className={`${styles.trendBadge} ${
            trend === "up" ? styles.trendUp : trend === "down" ? styles.trendDown : styles.trendNeutral
          }`}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} {trendValue}
        </span>
      )}
    </div>
    {subtext && <div className={styles.metricSubtext}>{subtext}</div>}
  </div>
);

/**
 * `<FactBoxTile>` — Modular card section inside the FactBox sidebar.
 */
export const FactBoxTile: FC<FactBoxTileProps> = ({
  id,
  title,
  badge,
  collapsible = true,
  defaultExpanded = true,
  actions,
  children,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section
      id={id}
      className={`${styles.tile} ${className}`.trim()}
      aria-labelledby={id ? `${id}-header` : undefined}
    >
      <div className={styles.tileHeader}>
        {collapsible ? (
          <button
            type="button"
            className={styles.tileHeaderBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronDown size={14} className={styles.toggleIcon} aria-hidden="true" />
            ) : (
              <ChevronRight size={14} className={styles.toggleIcon} aria-hidden="true" />
            )}
            <span id={id ? `${id}-header` : undefined} className={styles.tileTitle}>
              {title}
            </span>
          </button>
        ) : (
          <span id={id ? `${id}-header` : undefined} className={styles.tileTitle}>
            {title}
          </span>
        )}

        <div className={styles.tileHeaderRight}>
          {badge}
          {actions}
        </div>
      </div>

      {expanded && <div className={styles.tileBody}>{children}</div>}
    </section>
  );
};

/**
 * `<FactBox>` — Inspired by Microsoft Dynamics 365 Business Central (§31) and SAP Fiori (§5).
 * Collapsible right-hand telemetry side-rail displaying real-time customer, vendor, or transaction intelligence.
 */
export const FactBox: FC<FactBoxProps> = ({
  title = "FactBox Details",
  collapsible = true,
  defaultCollapsed = false,
  onCollapsedChange,
  density = "compact",
  width,
  headerActions,
  children,
  className = "",
  style,
  ...props
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <aside
      className={`${styles.root} ${collapsed ? styles.collapsed : ""} ${className}`.trim()}
      data-density={density}
      aria-label={title}
      style={{
        ...style,
        ...(width && !collapsed ? { width } : {}),
      }}
      {...props}
    >
      <div className={styles.topBar}>
        {!collapsed && <h3 className={styles.barTitle}>{title}</h3>}
        <div className={styles.barActions}>
          {!collapsed && headerActions}
          {collapsible && (
            <button
              type="button"
              className={styles.collapseToggle}
              onClick={handleToggle}
              aria-label={collapsed ? "Expand FactBox" : "Collapse FactBox"}
              title={collapsed ? "Expand FactBox" : "Collapse FactBox"}
            >
              {collapsed ? (
                <PanelRightOpen size={16} aria-hidden="true" />
              ) : (
                <PanelRightClose size={16} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      {!collapsed && <div className={styles.tilesContainer}>{children}</div>}
    </aside>
  );
};
