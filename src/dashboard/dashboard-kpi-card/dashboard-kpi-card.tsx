"use client";

import React, { useState } from "react";
import { DrillDownModal, type DrillDownColumn } from "../drill-down-modal";
import styles from "./dashboard-kpi-card.module.css";

export interface DashboardKPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
  /** Progress toward a goal (0-100) */
  progress?: number;
  progressLabel?: string;
  /** Sparkline data points */
  trend?: number[];
  /** Drill-down configuration */
  drillDown?: {
    modalTitle: string;
    columns: DrillDownColumn[];
    rows: Record<string, unknown>[];
    loading?: boolean;
  };
  onClick?: () => void;
}

const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({
  data,
  color,
}) => {
  if (data.length < 2) return null;
  const width = 80;
  const height = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block", marginTop: "var(--space-1)" }}
    >
      <path d={fillD} fill={color} opacity={0.1} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = "#4f46e5",
  loading = false,
  progress,
  progressLabel,
  trend,
  drillDown,
  onClick,
}) => {
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const isClickable = !!drillDown || !!onClick;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (drillDown) {
      setIsDrillDownOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={isClickable ? handleCardClick : undefined}
        className={`${styles.card} ${isClickable ? styles.cardClickable : ""}`}
      >
        {/* Header row */}
        <div className={styles.headerRow}>
          <p className={styles.cardTitle}>{title}</p>
          {icon && (
            <div
              className={styles.iconContainer}
              style={{
                background: `linear-gradient(155deg, ${color}22, ${color}0d)`,
                boxShadow: `inset 0 0 0 1px ${color}26`,
                color,
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        {loading ? (
          <div
            style={{
              height: 32,
              width: 80,
              marginTop: "var(--space-1)",
              background: "var(--color-bg-sunken)",
              borderRadius: "var(--radius-sm)",
            }}
          />
        ) : (
          <p className={styles.cardValue}>{value}</p>
        )}

        {/* Change badge */}
        {change !== undefined && (
          <div className={styles.changeBadge}>
            <span
              className={change >= 0 ? styles.changePositive : styles.changeNegative}
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-semibold, 600)",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
            </span>
            {changeLabel && (
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                {changeLabel}
              </span>
            )}
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <div className={styles.progressBarContainer}>
            {progressLabel && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "var(--color-text-secondary)",
                }}
              >
                <span>{progressLabel}</span>
                <span
                  style={{
                    fontWeight: "var(--weight-semibold, 600)",
                    color:
                      progress >= 100
                        ? "var(--color-success, #10b981)"
                        : "var(--color-text-primary)",
                  }}
                >
                  {progress}%
                </span>
              </div>
            )}
            <div
              style={{
                height: 5,
                background: "var(--color-bg-sunken, #f1f5f9)",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: "100%",
                  background: progress >= 100 ? "var(--color-success, #10b981)" : color,
                  borderRadius: "var(--radius-full)",
                  transition: "width var(--duration-base, 200ms)",
                }}
              />
            </div>
          </div>
        )}

        {/* Sparkline */}
        {trend && trend.length > 1 && (
          <MiniSparkline data={trend} color={color} />
        )}

        {/* Click hint */}
        {isClickable && (
          <div className={styles.clickHint}>
            Click to drill down →
          </div>
        )}
      </div>

      {/* Drill-down modal */}
      {drillDown && (
        <DrillDownModal
          isOpen={isDrillDownOpen}
          onClose={() => setIsDrillDownOpen(false)}
          title={drillDown.modalTitle}
          icon={icon}
          columns={drillDown.columns}
          rows={drillDown.rows}
          loading={drillDown.loading}
        />
      )}
    </>
  );
};
