import React, { useState, useId } from "react";
import styles from "./vital-signs-trend-strip.module.css";

export type VitalStatus = "normal" | "warning" | "critical";

export interface VitalMetricSeries {
  id: string;
  label: string;
  code: string; // e.g. "HR", "NIBP", "SpO2", "RR", "TEMP"
  unit: string;
  currentValue: number | string;
  normalMin: number;
  normalMax: number;
  dataPoints: Array<{ time: string; value: number }>;
  status: VitalStatus;
  alarmNote?: string;
}

export interface VitalSignsTrendStripProps {
  /** Patient or monitored subject identifier */
  subjectTitle?: string;
  /** Subtitle / room / bed identifier */
  locationNote?: string;
  /** Vital sign metric series */
  series: VitalMetricSeries[];
  /** Callback fired when an alarm acknowledge button is clicked */
  onAcknowledgeAlarm?: (seriesId: string) => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const VitalSignsTrendStrip: React.FC<VitalSignsTrendStripProps> = ({
  subjectTitle = "Telemetry Patient Monitored Feed",
  locationNote = "ICU Bed 04-A • Telemetry Channel Live",
  series,
  onAcknowledgeAlarm,
  density = "compact",
  className,
}) => {
  const stripId = useId();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${stripId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.clinicalBadge}>VITAL SIGNS</span>
          <div className={styles.titleTextWrapper}>
            <h3 id={`${stripId}-title`} className={styles.title}>
              {subjectTitle}
            </h3>
            <span className={styles.location}>{locationNote}</span>
          </div>
        </div>

        <div className={styles.liveIndicator}>
          <span className={styles.pulseDot} aria-hidden="true" />
          <span className={styles.liveText}>REALTIME MONITOR</span>
        </div>
      </div>

      {/* Grid of Multi-Parameter Channels */}
      <div
        className={styles.channelGrid}
        role="group"
        aria-label="Clinical telemetry channels"
      >
        {series.map((item) => {
          const isSelected = item.id === selectedChannelId;
          const statusClass =
            item.status === "critical"
              ? styles.channelCritical
              : item.status === "warning"
              ? styles.channelWarning
              : styles.channelNormal;

          // Simple SVG sparkline generation
          const values = item.dataPoints.map((p) => p.value);
          const minVal = Math.min(...values, item.normalMin);
          const maxVal = Math.max(...values, item.normalMax);
          const range = maxVal - minVal || 1;

          const pointsString = item.dataPoints
            .map((p, idx) => {
              const x = (idx / (item.dataPoints.length - 1 || 1)) * 100;
              const y = 100 - ((p.value - minVal) / range) * 100;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <div
              key={item.id}
              className={`${styles.channelCard} ${statusClass} ${
                isSelected ? styles.channelSelected : ""
              }`}
              onClick={() => setSelectedChannelId(item.id)}
              tabIndex={0}
              role="region"
              aria-label={`${item.label} (${item.code}): ${item.currentValue} ${item.unit}, status: ${item.status}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedChannelId(item.id);
                }
              }}
            >
              {/* Channel Header */}
              <div className={styles.channelHeader}>
                <div className={styles.metricNameGroup}>
                  <span className={styles.metricCode}>{item.code}</span>
                  <span className={styles.metricLabel}>{item.label}</span>
                </div>
                <div className={styles.statusPill}>
                  {item.status === "critical" && <span className={styles.alarmIcon}>🚨</span>}
                  <span className={styles.statusText}>{item.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Main Reading & Unit */}
              <div className={styles.readingRow}>
                <span className={styles.valueDisplay}>{item.currentValue}</span>
                <div className={styles.unitCol}>
                  <span className={styles.unitText}>{item.unit}</span>
                  <span className={styles.referenceCorridor}>
                    {item.normalMin}–{item.normalMax} ref
                  </span>
                </div>
              </div>

              {/* SVG Sparkline Strip with Reference Range */}
              {item.dataPoints.length > 1 && (
                <div className={styles.sparklineContainer} aria-hidden="true">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className={styles.sparklineSvg}
                  >
                    {/* Normal Range Reference Corridor Rect */}
                    <rect
                      x="0"
                      y={100 - ((item.normalMax - minVal) / range) * 100}
                      width="100"
                      height={((item.normalMax - item.normalMin) / range) * 100}
                      className={styles.refCorridorRect}
                    />
                    {/* Sparkline Polyline */}
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      points={pointsString}
                      className={styles.sparklinePolyline}
                    />
                  </svg>
                </div>
              )}

              {/* Alarm Alert & Action Note */}
              {item.status !== "normal" && (
                <div className={styles.alarmBanner}>
                  <span className={styles.alarmMessage}>
                    {item.alarmNote || `${item.label} out of normal clinical boundaries`}
                  </span>
                  {item.status === "critical" && onAcknowledgeAlarm && (
                    <button
                      type="button"
                      className={styles.ackBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcknowledgeAlarm(item.id);
                      }}
                    >
                      ACK ALARM
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
