import React, { useState, useId } from "react";
import styles from "./shipment-tracking-milestone-tracker.module.css";

export type TransitMode = "truck" | "vessel" | "rail" | "air" | "customs" | "warehouse";
export type MilestoneStatus = "completed" | "in_transit" | "delayed" | "pending";

export interface ShipmentMilestone {
  id: string;
  name: string;
  location: string;
  mode: TransitMode;
  status: MilestoneStatus;
  scheduledTime: string;
  actualTime?: string;
  dwellHours?: number;
  carrierName?: string;
  trackingRef?: string;
}

export interface ShipmentTrackingMilestoneTrackerProps {
  /** Shipment or container identification */
  shipmentNumber?: string;
  /** Origin and destination label */
  routeSummary?: string;
  /** Current projected ETA */
  projectedEta?: string;
  /** ETA variance note (e.g. "+2d 4h Delayed") */
  etaVariance?: string;
  /** True if shipment has active demurrage risk at port */
  isDemurrageRisk?: boolean;
  /** Container seal number */
  sealNumber?: string;
  /** Reefer / cold chain temperature string */
  temperatureStatus?: string;
  /** Ordered list of milestones */
  milestones: ShipmentMilestone[];
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const ShipmentTrackingMilestoneTracker: React.FC<ShipmentTrackingMilestoneTrackerProps> = ({
  shipmentNumber = "MSCU-849102-1",
  routeSummary = "Shanghai Port (CNSHA) → Port of Long Beach (USLGB) → Chicago Rail Hub",
  projectedEta = "2026-09-18 14:00 CST",
  etaVariance = "+3d 4h Delayed (Port Congestion)",
  isDemurrageRisk = true,
  sealNumber = "SEAL-US-99410",
  temperatureStatus = "-18.5°C (Reefer Normal)",
  milestones,
  density = "compact",
  className = "",
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    milestones.find((m) => m.status === "in_transit" || m.status === "delayed")?.id ||
      milestones[0]?.id ||
      ""
  );
  const headingId = useId();

  const selectedMilestone =
    milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  const getModeIcon = (mode: TransitMode) => {
    switch (mode) {
      case "truck":
        return "🚛";
      case "vessel":
        return "🚢";
      case "rail":
        return "🚂";
      case "air":
        return "✈️";
      case "customs":
        return "🛂";
      case "warehouse":
        return "🏭";
    }
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case "completed":
        return styles.statusCompleted;
      case "in_transit":
        return styles.statusInTransit;
      case "delayed":
        return styles.statusDelayed;
      case "pending":
        return styles.statusPending;
    }
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Shipment Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            📦
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.shipmentCode}>{shipmentNumber}</span>
              {isDemurrageRisk && (
                <span className={styles.demurrageBadge}>⚠️ DEMURRAGE RISK (&gt;48H DWELL)</span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>{routeSummary}</h2>
          </div>
        </div>

        {/* ETA Widget */}
        <div className={styles.etaWidget}>
          <span className={styles.etaLabel}>Estimated Arrival:</span>
          <span className={styles.etaTime}>{projectedEta}</span>
          <span className={styles.varianceText}>{etaVariance}</span>
        </div>
      </header>

      {/* Telemetry Quick Bar */}
      <div className={styles.telemetryBar}>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Container Seal:</span>
          <span className={styles.telemetryVal}>{sealNumber}</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Reefer Telemetry:</span>
          <span className={styles.telemetryVal}>❄️ {temperatureStatus}</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryLabel}>Active Carrier:</span>
          <span className={styles.telemetryVal}>{selectedMilestone?.carrierName || "Mediterranean Shipping Co"}</span>
        </div>
      </div>

      {/* Multimodal Milestone Path */}
      <div className={styles.milestoneScrollArea} role="region" aria-label="Milestone Progression">
        <ol className={styles.milestonePath}>
          {milestones.map((m, idx) => {
            const isSelected = m.id === selectedMilestoneId;
            const isLast = idx === milestones.length - 1;

            return (
              <li key={m.id} className={styles.milestoneNodeItem}>
                <div
                  className={`${styles.milestoneCard} ${
                    isSelected ? styles.milestoneCardSelected : ""
                  }`}
                  onClick={() => setSelectedMilestoneId(m.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedMilestoneId(m.id);
                    }
                  }}
                >
                  <div className={styles.nodeHeader}>
                    <span className={styles.modeIcon}>{getModeIcon(m.mode)}</span>
                    <span className={`${styles.statusPill} ${getStatusBadge(m.status)}`}>
                      {m.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <h3 className={styles.milestoneName}>{m.name}</h3>
                  <span className={styles.milestoneLocation}>{m.location}</span>

                  <div className={styles.nodeTimestamps}>
                    <span className={styles.timeLine}>
                      Sched: <strong>{m.scheduledTime}</strong>
                    </span>
                    {m.actualTime && (
                      <span className={styles.actualTimeLine}>
                        Actual: <strong>{m.actualTime}</strong>
                      </span>
                    )}
                  </div>

                  {m.dwellHours !== undefined && m.dwellHours > 24 && (
                    <span className={styles.dwellBadge}>
                      ⏱️ Dwell: {m.dwellHours} hrs
                    </span>
                  )}
                </div>

                {!isLast && (
                  <div className={styles.connector} aria-hidden="true">
                    <div
                      className={`${styles.connectorLine} ${
                        m.status === "completed" ? styles.lineCompleted : ""
                      }`}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Selected Milestone Inspection */}
      {selectedMilestone && (
        <aside className={styles.detailBox} aria-label="Milestone Details">
          <div className={styles.detailHeader}>
            <div className={styles.detailTitleGroup}>
              <span className={styles.detailIcon}>{getModeIcon(selectedMilestone.mode)}</span>
              <div>
                <h4 className={styles.detailTitle}>{selectedMilestone.name}</h4>
                <span className={styles.detailSub}>{selectedMilestone.location}</span>
              </div>
            </div>
            <span className={`${styles.statusPill} ${getStatusBadge(selectedMilestone.status)}`}>
              {selectedMilestone.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Transit Mode:</span>
              <span className={styles.detailVal}>
                {selectedMilestone.mode.toUpperCase()} FREIGHT
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Operating Carrier:</span>
              <span className={styles.detailVal}>
                {selectedMilestone.carrierName || "Designated Multi-Modal Carrier"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Tracking Ref / BOL:</span>
              <span className={styles.detailVal}>
                {selectedMilestone.trackingRef || "BOL-8829104-X"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Scheduled Timestamp:</span>
              <span className={styles.detailVal}>{selectedMilestone.scheduledTime}</span>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
};
