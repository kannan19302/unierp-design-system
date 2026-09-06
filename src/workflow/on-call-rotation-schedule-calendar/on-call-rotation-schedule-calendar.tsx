import React, { useId, useState } from "react";
import styles from "./on-call-rotation-schedule-calendar.module.css";

export type EscalationTier = "tier_1_primary" | "tier_2_secondary" | "escalation_lead";

export interface OnCallShift {
  id: string;
  tier: EscalationTier;
  engineerName: string; // "Elena Rostova"
  engineerEmail: string; // "elena.rostova@unierp.internal"
  dayLabel: string; // "Mon Sep 14"
  startTime: string; // "09:00 UTC"
  endTime: string; // "09:00 UTC (+1d)"
  isOverride?: boolean;
  originalEngineer?: string; // "Marcus Vance"
  handoffNotes?: string; // "Cluster migration scheduled for Tuesday maintenance window"
}

export interface EscalationLayer {
  tier: EscalationTier;
  title: string; // "Tier 1: Primary On-Call"
  escalationTimeoutMinutes: number; // e.g. 5
}

export interface OnCallRotationScheduleCalendarProps {
  scheduleName: string; // "Core Infrastructure & SRE Escalation"
  weekRange: string; // "Sep 14, 2026 – Sep 20, 2026"
  timeZone?: string; // "UTC (Coordinated Universal Time)"
  days: string[]; // ["Mon 9/14", "Tue 9/15", "Wed 9/16", "Thu 9/17", "Fri 9/18", "Sat 9/19", "Sun 9/20"]
  layers: EscalationLayer[];
  shifts: OnCallShift[];
  onRequestOverride?: () => void;
  onSelectShift?: (shift: OnCallShift) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const OnCallRotationScheduleCalendar: React.FC<OnCallRotationScheduleCalendarProps> = ({
  scheduleName,
  weekRange,
  timeZone = "UTC (Coordinated Universal Time)",
  days,
  layers,
  shifts,
  onRequestOverride,
  onSelectShift,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [activeShiftId, setActiveShiftId] = useState<string | null>(
    shifts[0]?.id ?? null
  );

  const activeShift = shifts.find((s) => s.id === activeShiftId) ?? null;

  const getShiftForTierAndDay = (tier: EscalationTier, day: string) => {
    return shifts.find((s) => s.tier === tier && s.dayLabel === day);
  };

  const handleShiftClick = (shift: OnCallShift) => {
    setActiveShiftId(shift.id);
    onSelectShift?.(shift);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.taglineRow}>
            <span className={styles.badge}>ROTATION ESCALATION MATRIX</span>
            <span className={styles.tzBadge}>{timeZone}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {scheduleName}
          </h2>
          <p className={styles.subtitle}>{weekRange}</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.overrideBtn}
            onClick={onRequestOverride}
            aria-label="Request on-call shift override or swap"
          >
            Request Shift Swap
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.calendarWrapper}>
          <table className={styles.scheduleTable} aria-label="Weekly On-Call Shift Rotation Grid">
            <caption className={styles.srOnly}>
              Escalation tiers and engineer shifts across the current week
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.tierHeaderCol}>
                  Escalation Tier
                </th>
                {days.map((day) => (
                  <th key={day} scope="col" className={styles.dayHeaderCol}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {layers.map((layer) => (
                <tr key={layer.tier} className={styles.layerRow}>
                  <th scope="row" className={styles.tierNameCell}>
                    <div className={styles.tierTitle}>{layer.title}</div>
                    <div className={styles.tierTimeout}>
                      Paging timeout: {layer.escalationTimeoutMinutes}m
                    </div>
                  </th>
                  {days.map((day) => {
                    const shift = getShiftForTierAndDay(layer.tier, day);

                    if (!shift) {
                      return (
                        <td key={day} className={styles.emptySlot}>
                          <span className={styles.unassigned}>Unassigned</span>
                        </td>
                      );
                    }

                    const isSelected = activeShiftId === shift.id;

                    return (
                      <td key={day} className={styles.shiftSlot}>
                        <button
                          type="button"
                          className={`${styles.shiftCard} ${
                            shift.isOverride ? styles.shiftOverride : styles.shiftStandard
                          } ${isSelected ? styles.shiftSelected : ""}`}
                          onClick={() => handleShiftClick(shift)}
                          aria-label={`${layer.title} shift on ${day} assigned to ${shift.engineerName}${
                            shift.isOverride ? " (Override swap)" : ""
                          }`}
                        >
                          <strong className={styles.engineerName}>{shift.engineerName}</strong>
                          <span className={styles.shiftHours}>{shift.startTime}</span>
                          {shift.isOverride && (
                            <span className={styles.overrideTag}>Override</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeShift && (
          <aside
            className={styles.inspectorDrawer}
            aria-label="Shift Handover and Paging Details"
          >
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTag}>
                {activeShift.tier === "tier_1_primary"
                  ? "TIER 1 PRIMARY"
                  : activeShift.tier === "tier_2_secondary"
                  ? "TIER 2 SECONDARY"
                  : "ESCALATION LEAD"}
              </span>
              <h3 className={styles.drawerEngineer}>{activeShift.engineerName}</h3>
              <p className={styles.drawerEmail}>{activeShift.engineerEmail}</p>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Shift Interval:</span>
              <span className={styles.detailValue}>
                {activeShift.dayLabel} ({activeShift.startTime} - {activeShift.endTime})
              </span>
            </div>

            {activeShift.isOverride && (
              <div className={styles.overrideAlert}>
                <strong>Active Coverage Swap</strong>
                <p className={styles.overrideSub}>
                  Covering scheduled rotation for: {activeShift.originalEngineer}
                </p>
              </div>
            )}

            {activeShift.handoffNotes && (
              <div className={styles.notesBox}>
                <span className={styles.detailLabel}>Handoff Briefing:</span>
                <p className={styles.notesText}>{activeShift.handoffNotes}</p>
              </div>
            )}

            <div className={styles.escalationPathBox}>
              <span className={styles.detailLabel}>Immediate Paging Channels:</span>
              <div className={styles.channelsList}>
                <span className={styles.channelBadge}>SMS Push Priority 1</span>
                <span className={styles.channelBadge}>Slack #incident-war-room</span>
                <span className={styles.channelBadge}>Voice Call Broadcast</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
