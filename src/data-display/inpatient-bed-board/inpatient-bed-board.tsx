import React, { useState, useId, useMemo } from "react";
import styles from "./inpatient-bed-board.module.css";

export type BedOccupancyState = "occupied" | "discharged_dirty" | "cleaning_in_progress" | "clean_ready";
export type IsolationPrecaution = "none" | "airborne" | "contact" | "droplet";

export interface InpatientBed {
  id: string;
  roomNumber: string; // e.g. "Room 304-A"
  wardName: string; // e.g. "Cardiology Step-Down"
  occupancyState: BedOccupancyState;
  patientInitials?: string;
  patientAge?: number;
  acuityLevel?: number; // 1 (lowest) to 5 (critical)
  attendingPhysician?: string;
  isolation: IsolationPrecaution;
  hoursUntilDischarge?: number;
  lastCleanedTimestamp?: string;
}

export interface InpatientBedBoardProps {
  /** Ward or Department title */
  wardTitle?: string;
  /** Hospital facility name */
  facilityName?: string;
  /** Beds in the unit */
  beds: InpatientBed[];
  /** Callback fired when a bed is selected */
  onSelectBed?: (bed: InpatientBed) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const InpatientBedBoard: React.FC<InpatientBedBoardProps> = ({
  wardTitle = "4-North Inpatient Surgical & Step-Down Ward",
  facilityName = "Memorial Academic Health Center",
  beds,
  onSelectBed,
  density = "compact",
  className = "",
}) => {
  const [selectedBedId, setSelectedBedId] = useState<string | null>(beds[0]?.id || null);
  const [filterState, setFilterState] = useState<"all" | BedOccupancyState>("all");
  const headingId = useId();

  const filteredBeds = useMemo(() => {
    if (filterState === "all") return beds;
    return beds.filter((b) => b.occupancyState === filterState);
  }, [beds, filterState]);

  const census = useMemo(() => {
    let occupied = 0;
    let dirty = 0;
    let cleaning = 0;
    let ready = 0;

    beds.forEach((b) => {
      if (b.occupancyState === "occupied") occupied += 1;
      if (b.occupancyState === "discharged_dirty") dirty += 1;
      if (b.occupancyState === "cleaning_in_progress") cleaning += 1;
      if (b.occupancyState === "clean_ready") ready += 1;
    });

    const occupancyRate = beds.length > 0 ? Math.round((occupied / beds.length) * 100) : 0;
    return { occupied, dirty, cleaning, ready, occupancyRate };
  }, [beds]);

  const selectedBed = beds.find((b) => b.id === selectedBedId) || beds[0];

  const getOccupancyBadge = (state: BedOccupancyState) => {
    switch (state) {
      case "occupied":
        return styles.stateOccupied;
      case "discharged_dirty":
        return styles.stateDirty;
      case "cleaning_in_progress":
        return styles.stateCleaning;
      case "clean_ready":
        return styles.stateReady;
    }
  };

  const getIsolationBadge = (iso: IsolationPrecaution) => {
    switch (iso) {
      case "airborne":
        return styles.isoAirborne;
      case "contact":
        return styles.isoContact;
      case "droplet":
        return styles.isoDroplet;
      case "none":
        return "";
    }
  };

  const handleBedClick = (bed: InpatientBed) => {
    setSelectedBedId(bed.id);
    onSelectBed?.(bed);
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
            🛏️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.facilityText}>{facilityName}</span>
              <span className={styles.censusPill}>
                {census.occupancyRate}% CENSUS ({census.occupied}/{beds.length} BEDS)
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>{wardTitle}</h2>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className={styles.filterGroup} role="group" aria-label="Filter beds by state">
          <button
            type="button"
            className={`${styles.filterBtn} ${filterState === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterState("all")}
          >
            All ({beds.length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterState === "occupied" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterState("occupied")}
          >
            Occupied ({census.occupied})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterState === "discharged_dirty" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterState("discharged_dirty")}
          >
            Dirty ({census.dirty})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterState === "clean_ready" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterState("clean_ready")}
          >
            Ready ({census.ready})
          </button>
        </div>
      </header>

      {/* Bed Cards Grid */}
      <div className={styles.bedGrid} role="region" aria-label="Bed Board Grid">
        {filteredBeds.map((bed) => {
          const isSelected = bed.id === selectedBedId;

          return (
            <div
              key={bed.id}
              className={`${styles.bedCard} ${getOccupancyBadge(bed.occupancyState)} ${
                isSelected ? styles.bedCardSelected : ""
              }`}
              onClick={() => handleBedClick(bed)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBedClick(bed);
                }
              }}
            >
              <div className={styles.bedTopRow}>
                <span className={styles.roomCode}>{bed.roomNumber}</span>
                <span className={`${styles.statePill} ${getOccupancyBadge(bed.occupancyState)}`}>
                  {bed.occupancyState.replace("_", " ").toUpperCase()}
                </span>
              </div>

              {bed.occupancyState === "occupied" ? (
                <div className={styles.patientPreview}>
                  <div className={styles.patientRow}>
                    <span className={styles.patientCode}>
                      Pt: {bed.patientInitials} (Age {bed.patientAge})
                    </span>
                    {bed.acuityLevel && (
                      <span className={styles.acuityBadge} title={`Acuity Level ${bed.acuityLevel}/5`}>
                        Acuity {bed.acuityLevel}
                      </span>
                    )}
                  </div>
                  <span className={styles.physicianText}>MD: {bed.attendingPhysician}</span>

                  {bed.isolation !== "none" && (
                    <span className={`${styles.isoBadge} ${getIsolationBadge(bed.isolation)}`}>
                      🛡️ {bed.isolation.toUpperCase()} ISOLATION
                    </span>
                  )}

                  {bed.hoursUntilDischarge !== undefined && bed.hoursUntilDischarge <= 4 && (
                    <span className={styles.dischargeTag}>
                      ⏱️ Discharge in ~{bed.hoursUntilDischarge}h
                    </span>
                  )}
                </div>
              ) : (
                <div className={styles.emptyBedMessage}>
                  {bed.occupancyState === "clean_ready"
                    ? "✓ Sanitized & Ready for Admit"
                    : bed.occupancyState === "cleaning_in_progress"
                    ? "⏳ EVS Sanitation In Progress"
                    : "⚠️ Patient Discharged — Awaiting EVS"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Bed Inspector */}
      {selectedBed && (
        <aside className={styles.detailDrawer} aria-label="Selected Bed Telemetry">
          <div className={styles.drawerHeader}>
            <div>
              <h3 className={styles.drawerTitle}>
                {selectedBed.roomNumber} • {selectedBed.wardName}
              </h3>
              <span className={styles.drawerSub}>
                Status: {selectedBed.occupancyState.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <span className={`${styles.statePill} ${getOccupancyBadge(selectedBed.occupancyState)}`}>
              {selectedBed.occupancyState.toUpperCase()}
            </span>
          </div>

          <div className={styles.drawerMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Patient Initials:</span>
              <span className={styles.metaVal}>{selectedBed.patientInitials || "None (Unoccupied)"}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Attending Clinician:</span>
              <span className={styles.metaVal}>{selectedBed.attendingPhysician || "Unassigned"}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Infection Control Protocol:</span>
              <span className={styles.metaVal}>
                {selectedBed.isolation !== "none"
                  ? `${selectedBed.isolation.toUpperCase()} PRECAUTIONS ACTIVE`
                  : "Standard Hospital Precautions"}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Clinical Acuity Level:</span>
              <span className={styles.metaVal}>
                {selectedBed.acuityLevel ? `Level ${selectedBed.acuityLevel} of 5` : "N/A"}
              </span>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
};
