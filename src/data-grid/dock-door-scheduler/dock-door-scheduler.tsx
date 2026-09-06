import React, { useState, useId, useMemo } from "react";
import styles from "./dock-door-scheduler.module.css";

export type TrailerStatus = "scheduled" | "at_gate" | "docked_unloading" | "completed" | "delayed";

export interface DockAppointment {
  id: string;
  doorNumber: string; // e.g. "Door 01"
  timeSlot: string; // e.g. "08:00"
  carrierName: string;
  trailerId: string;
  purchaseOrder: string;
  palletCount: number;
  status: TrailerStatus;
  detentionRiskMinutes?: number;
}

export interface DockDoorSchedulerProps {
  /** Facility or DC Title */
  facilityTitle?: string;
  /** Schedule date */
  dateLabel?: string;
  /** List of dock doors */
  doors?: string[];
  /** Hourly time slots */
  timeSlots?: string[];
  /** Appointments list */
  appointments: DockAppointment[];
  /** Callback when an appointment is selected */
  onSelectAppointment?: (appointment: DockAppointment) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

const DEFAULT_DOORS = ["Door 01", "Door 02", "Door 03", "Door 04", "Door 05", "Door 06"];
const DEFAULT_SLOTS = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

export const DockDoorScheduler: React.FC<DockDoorSchedulerProps> = ({
  facilityTitle = "East Coast Logistics Gateway DC #02",
  dateLabel = "Today, Sep 06, 2026",
  doors = DEFAULT_DOORS,
  timeSlots = DEFAULT_SLOTS,
  appointments,
  onSelectAppointment,
  density = "compact",
  className = "",
}) => {
  const [selectedApptId, setSelectedApptId] = useState<string | null>(
    appointments[0]?.id || null
  );
  const headingId = useId();

  // Quick lookup map: "Door 01:08:00" -> DockAppointment
  const appointmentMap = useMemo(() => {
    const map = new Map<string, DockAppointment>();
    appointments.forEach((appt) => {
      map.set(`${appt.doorNumber}:${appt.timeSlot}`, appt);
    });
    return map;
  }, [appointments]);

  const selectedAppointment = appointments.find((a) => a.id === selectedApptId) || appointments[0];

  const getStatusClass = (status: TrailerStatus) => {
    switch (status) {
      case "scheduled":
        return styles.statusScheduled;
      case "at_gate":
        return styles.statusAtGate;
      case "docked_unloading":
        return styles.statusDocked;
      case "completed":
        return styles.statusCompleted;
      case "delayed":
        return styles.statusDelayed;
    }
  };

  const handleSlotClick = (appt: DockAppointment) => {
    setSelectedApptId(appt.id);
    onSelectAppointment?.(appt);
  };

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
            🚚
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.dateBadge}>{dateLabel}</span>
              <span className={styles.liveTag}>REAL-TIME YARD DISPATCH</span>
            </div>
            <h2 id={headingId} className={styles.title}>{facilityTitle}</h2>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legendBar} aria-label="Appointment Status Legend">
          <span className={`${styles.legendPill} ${styles.statusDocked}`}>Unloading</span>
          <span className={`${styles.legendPill} ${styles.statusAtGate}`}>At Gate</span>
          <span className={`${styles.legendPill} ${styles.statusDelayed}`}>Detention Risk</span>
          <span className={`${styles.legendPill} ${styles.statusCompleted}`}>Completed</span>
        </div>
      </header>

      {/* Cross-Dock Grid */}
      <div className={styles.gridWrapper} role="region" aria-label="Dock Door Schedule Grid">
        <table className={styles.scheduleTable}>
          <thead>
            <tr>
              <th className={styles.doorHeaderCell}>Dock Door</th>
              {timeSlots.map((slot) => (
                <th key={slot} className={styles.timeSlotTh}>
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doors.map((door) => (
              <tr key={door}>
                <td className={styles.doorLabelCell}>{door}</td>
                {timeSlots.map((slot) => {
                  const key = `${door}:${slot}`;
                  const appt = appointmentMap.get(key);
                  const isSelected = appt && appt.id === selectedApptId;

                  return (
                    <td key={slot} className={styles.slotCell}>
                      {appt ? (
                        <button
                          type="button"
                          className={`${styles.apptCard} ${getStatusClass(appt.status)} ${
                            isSelected ? styles.apptSelected : ""
                          }`}
                          onClick={() => handleSlotClick(appt)}
                        >
                          <span className={styles.carrierName}>{appt.carrierName}</span>
                          <span className={styles.trailerId}>{appt.trailerId}</span>
                          <span className={styles.palletCount}>
                            {appt.palletCount} Plts
                          </span>
                        </button>
                      ) : (
                        <div className={styles.emptySlot} aria-label={`Open slot at ${door} ${slot}`}>
                          <span className={styles.openText}>Open</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Inspection Drawer / Footer */}
      {selectedAppointment && (
        <aside className={styles.detailCard} aria-label="Selected Dock Appointment">
          <div className={styles.detailHeader}>
            <div className={styles.detailHeading}>
              <span className={styles.doorCode}>{selectedAppointment.doorNumber}</span>
              <div>
                <h3 className={styles.detailCarrier}>{selectedAppointment.carrierName}</h3>
                <span className={styles.detailSub}>
                  Slot: {selectedAppointment.timeSlot} • Trailer #{selectedAppointment.trailerId}
                </span>
              </div>
            </div>
            <span
              className={`${styles.legendPill} ${getStatusClass(selectedAppointment.status)}`}
            >
              {selectedAppointment.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className={styles.detailMetaGrid}>
            <div className={styles.metaCol}>
              <span className={styles.metaLabel}>Purchase Order:</span>
              <span className={styles.metaValue}>{selectedAppointment.purchaseOrder}</span>
            </div>
            <div className={styles.metaCol}>
              <span className={styles.metaLabel}>Freight Volume:</span>
              <span className={styles.metaValue}>
                {selectedAppointment.palletCount} Standard Pallets
              </span>
            </div>
            <div className={styles.metaCol}>
              <span className={styles.metaLabel}>Detention Timer:</span>
              <span
                className={`${styles.metaValue} ${
                  selectedAppointment.detentionRiskMinutes && selectedAppointment.detentionRiskMinutes > 0
                    ? styles.riskTimer
                    : ""
                }`}
              >
                {selectedAppointment.detentionRiskMinutes
                  ? `⏱️ ${selectedAppointment.detentionRiskMinutes}m remaining before demurrage`
                  : "✓ On Schedule"}
              </span>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
};
