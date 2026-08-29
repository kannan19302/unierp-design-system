"use client";

import { type FC, type ReactNode } from "react";
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

export const KPIStrip: FC<KPIStripProps> = ({ items, className = "" }) => {
  return (
    <div
      className={`${styles.strip} ${className}`.trim()}
      role="region"
      aria-label="Key Performance Indicators"
    >
      {items.map((item) => {
        const isClickable = !!item.onClick;
        const trendClass =
          item.trend === "up"
            ? styles.trendUp
            : item.trend === "down"
            ? styles.trendDown
            : styles.trendNeutral;

        return (
          <div
            key={item.id}
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
};

export const StatCard: FC<KPICardItem & { className?: string }> = ({
  className = "",
  ...props
}) => {
  return <KPIStrip items={[props]} className={className} />;
};
