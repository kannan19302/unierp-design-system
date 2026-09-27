"use client";

import { forwardRef, type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./stat-card.module.css";

export const kpiStripVariants = cva(styles.strip, {
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

export const statCardVariants = kpiStripVariants;
export type KPIStripVariantProps = VariantProps<typeof kpiStripVariants>;

export interface KPICardItem {
  id: string;
  label: string;
  value: string | number;
  delta?: string | number;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  subtext?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface KPIStripProps
  extends React.HTMLAttributes<HTMLDivElement>,
    KPIStripVariantProps {
  items: KPICardItem[];
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

/**
 * KPIStrip renders a horizontal strip of Key Performance Indicator metric cards with trend indicators.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and data-slot annotations.
 *
 * @maturity stable
 */
export const KPIStrip = forwardRef<HTMLDivElement, KPIStripProps>(
  function KPIStrip({ items, density = "standard", className = "", ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="kpi-strip"
        data-density={density}
        className={`${kpiStripVariants({ density })}${className ? ` ${className}` : ""}`.trim()}
        role="region"
        aria-label="Key Performance Indicators"
        {...rest}
      >
        {items.map((item, index) => {
          const isClickable = !!item.onClick;
          const trendClass =
            item.trend === "up"
              ? styles.trendUp
              : item.trend === "down"
              ? styles.trendDown
              : styles.trendNeutral;

          return (
            <div
              key={item.id ?? item.label ?? `kpi-${index}`}
              data-slot="stat-card"
              data-trend={item.trend}
              className={`${styles.card} ${isClickable ? styles.cardClickable : ""}`.trim()}
              onClick={item.onClick}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        item.onClick?.();
                      }
                    }
                  : undefined
              }
            >
              <div className={styles.header} data-slot="stat-card-header">
                <span className={styles.label} data-slot="stat-card-label">{item.label}</span>
                {item.icon && <span className={styles.headerIcon} data-slot="stat-card-header-icon">{item.icon}</span>}
              </div>

              <div className={styles.valueRow} data-slot="stat-card-value-row">
                <span className={styles.value} data-slot="stat-card-value">{item.value}</span>

                {item.delta !== undefined && (
                  <span className={`${styles.trend} ${trendClass}`} data-slot="stat-card-trend">
                    {item.trend === "up" ? (
                      <TrendingUp size={12} aria-hidden="true" />
                    ) : item.trend === "down" ? (
                      <TrendingDown size={12} aria-hidden="true" />
                    ) : (
                      <Minus size={12} aria-hidden="true" />
                    )}
                    <span>{item.delta}</span>
                  </span>
                )}
              </div>

              {(item.trendLabel || item.subtext) && (
                <div className={styles.subtext} data-slot="stat-card-subtext">
                  {item.trendLabel ?? item.subtext}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

KPIStrip.displayName = "KPIStrip";

/**
 * StatCard displays a single metric KPI card.
 *
 * @maturity stable
 */
export const StatCard = forwardRef<HTMLDivElement, KPICardItem & { density?: "ultra-compact" | "compact" | "standard" | "comfortable"; className?: string }>(
  function StatCard({ className = "", density = "standard", ...props }, ref) {
    return <KPIStrip ref={ref} items={[props]} density={density} className={className} />;
  }
);

StatCard.displayName = "StatCard";
