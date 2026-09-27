"use client";

import { forwardRef, type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import styles from "./stat-card.module.css";

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

export interface KPIStripProps {
  items: KPICardItem[];
  className?: string;
}

/**
 * KPIStrip renders a horizontal strip of Key Performance Indicator metric cards with trend indicators.
 *
 * @maturity stable
 */
export const KPIStrip = forwardRef<HTMLDivElement, KPIStripProps>(
  function KPIStrip({ items, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`${styles.strip} ${className}`.trim()}
        role="region"
        aria-label="Key Performance Indicators"
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
              <div className={styles.header}>
                <span className={styles.label}>{item.label}</span>
                {item.icon && <span className={styles.headerIcon}>{item.icon}</span>}
              </div>

              <div className={styles.valueRow}>
                <span className={styles.value}>{item.value}</span>

                {item.delta !== undefined && (
                  <span className={`${styles.trend} ${trendClass}`}>
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
                <div className={styles.subtext}>
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
export const StatCard = forwardRef<HTMLDivElement, KPICardItem & { className?: string }>(
  function StatCard({ className = "", ...props }, ref) {
    return <KPIStrip ref={ref} items={[props]} className={className} />;
  }
);

StatCard.displayName = "StatCard";

