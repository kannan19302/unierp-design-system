"use client";

import { useState, type FC, type ReactNode } from "react";
import { MeridianBar, type MeridianSegment, type MeridianAction, type MeridianState } from "../meridian-bar";
import { PageHeader } from "../../layout/page-header";
import styles from "./planning-workspace.module.css";

export type PlanningTimeframe = "day" | "week" | "month" | "quarter" | "year";

export interface PlanningWorkspaceProps {
  /** Context address segments */
  segments?: MeridianSegment[];
  /** Lifecycle status */
  state?: { label: string; tone?: MeridianState };
  /** Primary action */
  action?: MeridianAction;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Supported timeframes */
  timeframes?: PlanningTimeframe[];
  selectedTimeframe?: PlanningTimeframe;
  onTimeframeChange?: (timeframe: PlanningTimeframe) => void;
  /** Active period label (e.g. "Q3 2026", "Sep 2026") */
  periodLabel?: string;
  onPrevPeriod?: () => void;
  onNextPeriod?: () => void;
  onToday?: () => void;
  /** Filter slot */
  filters?: ReactNode;
  /** Key metrics or allocation legend */
  legend?: ReactNode;
  /** Main timeline, Gantt chart, or grid */
  children: ReactNode;
  className?: string;
}

export const PlanningWorkspace: FC<PlanningWorkspaceProps> = ({
  segments,
  state,
  action,
  title,
  subtitle,
  actions,
  timeframes = ["day", "week", "month", "quarter", "year"],
  selectedTimeframe = "month",
  onTimeframeChange,
  periodLabel,
  onPrevPeriod,
  onNextPeriod,
  onToday,
  filters,
  legend,
  children,
  className = "",
}) => {
  const [currentTimeframe, setCurrentTimeframe] = useState<PlanningTimeframe>(selectedTimeframe);

  const handleTimeframe = (tf: PlanningTimeframe) => {
    setCurrentTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div className={`${styles.root} ${className}`.trim()} data-floorplan="planning-workspace">
      {/* Context boundary */}
      {segments && segments.length > 0 && (
        <MeridianBar
          segments={segments}
          state={state}
          action={action}
          copyable
          className={styles.meridianBar}
        />
      )}

      {/* Header */}
      <div className={styles.headerRow}>
        <PageHeader title={title} description={subtitle} actions={actions} />
      </div>

      {/* Planning Navigation & Timeframe Controls */}
      <div className={styles.controlBar} role="toolbar" aria-label="Planning Controls">
        <div className={styles.periodNavigation}>
          {onToday && (
            <button type="button" onClick={onToday} className={styles.navBtn}>
              Today
            </button>
          )}
          {onPrevPeriod && (
            <button
              type="button"
              onClick={onPrevPeriod}
              className={styles.navBtn}
              aria-label="Previous period"
            >
              ←
            </button>
          )}
          {periodLabel && <span className={styles.periodText}>{periodLabel}</span>}
          {onNextPeriod && (
            <button
              type="button"
              onClick={onNextPeriod}
              className={styles.navBtn}
              aria-label="Next period"
            >
              →
            </button>
          )}
        </div>

        {filters && <div className={styles.filtersSlot}>{filters}</div>}

        {timeframes.length > 0 && (
          <div className={styles.timeframeGroup} role="group" aria-label="Timeframe selector">
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => handleTimeframe(tf)}
                className={`${styles.timeframeBtn} ${
                  currentTimeframe === tf ? styles.timeframeBtnActive : ""
                }`}
                aria-pressed={currentTimeframe === tf}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Legend / Metrics */}
      {legend && <div className={styles.legendSlot}>{legend}</div>}

      {/* Main Planning Canvas / Timeline View */}
      <div className={styles.timelineCard} role="region" aria-label="Planning Timeline">
        {children}
      </div>
    </div>
  );
};
