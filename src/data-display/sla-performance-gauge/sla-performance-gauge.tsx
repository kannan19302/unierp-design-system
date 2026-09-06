import React, { useId } from "react";
import styles from "./sla-performance-gauge.module.css";

export type SlaStageType = "first_response" | "workaround" | "resolution";
export type SlaStatus = "on_track" | "warning" | "breached" | "achieved";

export interface SlaMilestone {
  id: string;
  name: string;
  type: SlaStageType;
  targetMinutes: number;
  elapsedMinutes: number;
  status: SlaStatus;
  penaltyAmount?: number;
}

export interface SlaPerformanceGaugeProps {
  /** Ticket or incident ID */
  ticketRef?: string;
  /** Service commitment tier label */
  commitmentTier?: string;
  /** SLA milestones list */
  milestones: SlaMilestone[];
  /** Flag for business hours only */
  isBusinessHoursOnly?: boolean;
  /** Currency code for penalty amounts */
  currency?: string;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const SlaPerformanceGauge: React.FC<SlaPerformanceGaugeProps> = ({
  ticketRef = "INC-88912",
  commitmentTier = "Mission-Critical Tier 1 (99.99% Availability SLA)",
  milestones,
  isBusinessHoursOnly = true,
  currency = "USD",
  density = "compact",
  className = "",
}) => {
  const headingId = useId();

  // Find active or highest priority milestone
  const primaryMilestone =
    milestones.find((m) => m.status === "warning" || m.status === "on_track") ||
    milestones[0];

  const totalPenalty = milestones.reduce((sum, m) => {
    if (m.status === "breached") return sum + (m.penaltyAmount || 0);
    return sum;
  }, 0);

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusClass = (status: SlaStatus) => {
    switch (status) {
      case "on_track":
        return styles.statusTrack;
      case "warning":
        return styles.statusWarn;
      case "breached":
        return styles.statusBreached;
      case "achieved":
        return styles.statusAchieved;
    }
  };

  // Compute percentage remaining on primary milestone
  const remainingMinutes = primaryMilestone
    ? Math.max(primaryMilestone.targetMinutes - primaryMilestone.elapsedMinutes, 0)
    : 0;
  const percentElapsed = primaryMilestone
    ? Math.min(
        Math.round((primaryMilestone.elapsedMinutes / Math.max(primaryMilestone.targetMinutes, 1)) * 100),
        100
      )
    : 0;

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            ⏱️
          </div>
          <div>
            <div className={styles.refRow}>
              <span className={styles.ticketCode}>{ticketRef}</span>
              {isBusinessHoursOnly && (
                <span className={styles.businessPill}>24/7 MISSION-CRITICAL CLOCK</span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>{commitmentTier}</h2>
          </div>
        </div>

        {/* Penalty Credit Alert */}
        {totalPenalty > 0 ? (
          <div className={styles.penaltyAlert}>
            <span className={styles.penaltyLabel}>Breach Penalty Accrued:</span>
            <span className={styles.penaltyVal}>{formatCurrency(totalPenalty)}</span>
          </div>
        ) : (
          <div className={styles.safeBox}>
            <span className={styles.safePill}>✓ ZERO CONTRACTUAL PENALTIES</span>
          </div>
        )}
      </header>

      {/* Primary Milestone Progress Meter */}
      {primaryMilestone && (
        <div className={styles.primaryMeterBox}>
          <div className={styles.meterHeader}>
            <div>
              <span className={styles.meterSub}>Active SLA Target:</span>
              <h3 className={styles.meterTitle}>{primaryMilestone.name}</h3>
            </div>
            <div className={styles.countdownBadge}>
              {primaryMilestone.status === "breached" ? (
                <span className={styles.breachCountdown}>BREACHED BY {formatMinutes(primaryMilestone.elapsedMinutes - primaryMilestone.targetMinutes)}</span>
              ) : primaryMilestone.status === "achieved" ? (
                <span className={styles.achievedCountdown}>✓ SLA MET</span>
              ) : (
                <span className={styles.activeCountdown}>
                  ⏱️ {formatMinutes(remainingMinutes)} remaining
                </span>
              )}
            </div>
          </div>

          {/* Progress Track */}
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={percentElapsed}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${primaryMilestone.name} SLA progress`}
          >
            <div
              className={`${styles.progressFill} ${
                primaryMilestone.status === "breached"
                  ? styles.fillBreached
                  : primaryMilestone.status === "warning"
                  ? styles.fillWarn
                  : styles.fillOk
              }`}
              style={{ width: `${percentElapsed}%` }}
            />
          </div>

          <div className={styles.progressMeta}>
            <span>Elapsed: {formatMinutes(primaryMilestone.elapsedMinutes)}</span>
            <span>Target Window: {formatMinutes(primaryMilestone.targetMinutes)}</span>
          </div>
        </div>
      )}

      {/* Milestones Hierarchy List */}
      <div className={styles.milestonesSection}>
        <h4 className={styles.sectionTitle}>SLA Target Commitments</h4>
        <ul className={styles.milestoneList}>
          {milestones.map((m) => {
            const isBreached = m.status === "breached";

            return (
              <li key={m.id} className={styles.milestoneRow}>
                <div className={styles.milestoneInfo}>
                  <span className={styles.milestoneName}>{m.name}</span>
                  <span className={styles.milestoneTarget}>
                    Target: {formatMinutes(m.targetMinutes)} • Actual: {formatMinutes(m.elapsedMinutes)}
                  </span>
                </div>

                <div className={styles.milestoneStatusGroup}>
                  {m.penaltyAmount && isBreached && (
                    <span className={styles.penaltyAmountTag}>
                      -{formatCurrency(m.penaltyAmount)} Credit
                    </span>
                  )}
                  <span className={`${styles.statusBadge} ${getStatusClass(m.status)}`}>
                    {m.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
