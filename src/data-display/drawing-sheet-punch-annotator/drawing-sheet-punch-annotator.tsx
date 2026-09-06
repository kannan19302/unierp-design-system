import React, { useId, useState, useMemo } from "react";
import styles from "./drawing-sheet-punch-annotator.module.css";

export type PunchTrade = "electrical" | "plumbing" | "hvac" | "finishes" | "safety";
export type PunchStatus = "draft" | "open" | "pending_inspection" | "closed";

export interface PunchItemPin {
  id: string;
  pinNumber: number;
  posX: number; // percentage 0-100 on blueprint
  posY: number; // percentage 0-100 on blueprint
  trade: PunchTrade;
  title: string;
  description: string;
  assignedSubcontractor: string;
  dueDate: string;
  status: PunchStatus;
  severity: "critical" | "standard" | "minor";
  photoCount?: number;
}

export interface DrawingSheetMeta {
  sheetNumber: string; // e.g. "A-201"
  sheetTitle: string; // "Level 2 Floorplan - West Wing"
  revisionNumber: string; // "Rev C"
  scale: string; // "1/8\" = 1'-0\""
  projectCode: string; // "PRJ-BLD-882"
}

export interface DrawingSheetPunchAnnotatorProps {
  sheet: DrawingSheetMeta;
  initialPins?: PunchItemPin[];
  onSelectPin?: (pin: PunchItemPin) => void;
  onUpdatePinStatus?: (pinId: string, status: PunchStatus) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DrawingSheetPunchAnnotator: React.FC<DrawingSheetPunchAnnotatorProps> = ({
  sheet,
  initialPins = [],
  onSelectPin,
  onUpdatePinStatus,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [pins, setPins] = useState<PunchItemPin[]>(initialPins);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(
    initialPins.length > 0 ? (initialPins[0]?.id ?? null) : null
  );

  const [tradeFilter, setTradeFilter] = useState<string>("all");

  const filteredPins = useMemo(() => {
    if (tradeFilter === "all") return pins;
    return pins.filter((p) => p.trade === tradeFilter);
  }, [pins, tradeFilter]);

  const selectedPin = useMemo(
    () => pins.find((p) => p.id === selectedPinId) || null,
    [pins, selectedPinId]
  );

  const handlePinClick = (pin: PunchItemPin) => {
    setSelectedPinId(pin.id);
    onSelectPin?.(pin);
  };

  const handleStatusChange = (status: PunchStatus) => {
    if (!selectedPinId) return;
    setPins((prev) =>
      prev.map((p) => (p.id === selectedPinId ? { ...p, status } : p))
    );
    onUpdatePinStatus?.(selectedPinId, status);
  };

  const tradeColors: Record<PunchTrade, string> = {
    electrical: "var(--color-warning, #f59e0b)",
    plumbing: "var(--color-brand, #2563eb)",
    hvac: "var(--color-success, #16a34a)",
    finishes: "#8b5cf6",
    safety: "var(--color-danger, #ef4444)",
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
            📐
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.sheetBadge}>{sheet.sheetNumber}</span>
              <span className={styles.revTag}>{sheet.revisionNumber}</span>
              <span className={styles.scaleTag}>{sheet.scale}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {sheet.sheetTitle}
            </h2>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className={styles.filterGroup}>
          <label htmlFor={`${headingId}-trade-filter`} className={styles.filterLabel}>
            Trade Filter:
          </label>
          <select
            id={`${headingId}-trade-filter`}
            className={styles.filterSelect}
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
          >
            <option value="all">All Disciplines ({pins.length})</option>
            <option value="safety">Safety &amp; Egress</option>
            <option value="electrical">Electrical &amp; Power</option>
            <option value="plumbing">Plumbing &amp; Piping</option>
            <option value="hvac">Mechanical &amp; HVAC</option>
            <option value="finishes">Architectural Finishes</option>
          </select>
        </div>
      </header>

      {/* Main Split View: Left SVG Blueprint Sheet with Pins, Right Detail Drawer */}
      <div className={styles.viewerGrid}>
        {/* Drawing Canvas Area */}
        <div className={styles.canvasWrapper} role="region" aria-label="Architectural drawing sheet canvas">
          <div className={styles.blueprintCanvas}>
            {/* Background Grid / Architectural Plan Lines */}
            <svg
              className={styles.blueprintSvg}
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* Outer Room Boundaries */}
              <rect
                x="40"
                y="40"
                width="720"
                height="420"
                fill="none"
                stroke="var(--color-border, #cbd5e1)"
                strokeWidth="2"
              />
              {/* Corridor Walls */}
              <line x1="40" y1="200" x2="760" y2="200" stroke="var(--color-border, #cbd5e1)" strokeWidth="2" />
              <line x1="40" y1="280" x2="760" y2="280" stroke="var(--color-border, #cbd5e1)" strokeWidth="2" />
              {/* Room Partitions */}
              <line x1="240" y1="40" x2="240" y2="200" stroke="var(--color-border, #cbd5e1)" strokeWidth="1.5" />
              <line x1="500" y1="40" x2="500" y2="200" stroke="var(--color-border, #cbd5e1)" strokeWidth="1.5" />
              <line x1="360" y1="280" x2="360" y2="460" stroke="var(--color-border, #cbd5e1)" strokeWidth="1.5" />
              <line x1="580" y1="280" x2="580" y2="460" stroke="var(--color-border, #cbd5e1)" strokeWidth="1.5" />

              {/* Room Text Annotations */}
              <text x="120" y="120" fill="var(--color-text-muted, #94a3b8)" fontSize="12" fontFamily="monospace">
                CONF RM 201
              </text>
              <text x="350" y="120" fill="var(--color-text-muted, #94a3b8)" fontSize="12" fontFamily="monospace">
                ELEC CLOSET 202
              </text>
              <text x="610" y="120" fill="var(--color-text-muted, #94a3b8)" fontSize="12" fontFamily="monospace">
                LAB 203
              </text>
              <text x="360" y="245" fill="var(--color-text-muted, #94a3b8)" fontSize="12" fontFamily="monospace">
                CENTRAL CORRIDOR W-2
              </text>
            </svg>

            {/* Interactive Pin Drops */}
            {filteredPins.map((pin) => {
              const isSelected = pin.id === selectedPinId;
              const color = tradeColors[pin.trade];

              return (
                <button
                  key={pin.id}
                  type="button"
                  className={`${styles.pinButton} ${isSelected ? styles.pinSelected : ""}`}
                  style={{
                    left: `${pin.posX}%`,
                    top: `${pin.posY}%`,
                    borderColor: color,
                  }}
                  onClick={() => handlePinClick(pin)}
                  aria-label={`Punch pin #${pin.pinNumber}: ${pin.title} (${pin.trade})`}
                >
                  <span
                    className={styles.pinDot}
                    style={{ backgroundColor: color }}
                  />
                  <span className={styles.pinNumber}>{pin.pinNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Issue Detail Pane */}
        <div className={styles.detailPane}>
          {selectedPin ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <span className={styles.pinIdBadge}>ITEM #{selectedPin.pinNumber}</span>
                <span
                  className={`${styles.statusBadge} ${
                    selectedPin.status === "closed"
                      ? styles.statusClosed
                      : selectedPin.status === "pending_inspection"
                      ? styles.statusPending
                      : styles.statusOpen
                  }`}
                >
                  {selectedPin.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              <h3 className={styles.pinTitle}>{selectedPin.title}</h3>

              <div className={styles.metaFieldList}>
                <div className={styles.metaRowItem}>
                  <span className={styles.fieldLabel}>Trade Discipline:</span>
                  <span className={styles.fieldValue}>{selectedPin.trade.toUpperCase()}</span>
                </div>
                <div className={styles.metaRowItem}>
                  <span className={styles.fieldLabel}>Assigned Subcontractor:</span>
                  <span className={styles.fieldValue}>{selectedPin.assignedSubcontractor}</span>
                </div>
                <div className={styles.metaRowItem}>
                  <span className={styles.fieldLabel}>Target Due Date:</span>
                  <span className={styles.fieldValue}>{selectedPin.dueDate}</span>
                </div>
                <div className={styles.metaRowItem}>
                  <span className={styles.fieldLabel}>Severity Level:</span>
                  <span
                    className={`${styles.sevBadge} ${
                      selectedPin.severity === "critical"
                        ? styles.sevCrit
                        : styles.sevStandard
                    }`}
                  >
                    {selectedPin.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className={styles.descBox}>
                <span className={styles.fieldLabel}>Deficiency Details:</span>
                <p className={styles.descText}>{selectedPin.description}</p>
              </div>

              {selectedPin.photoCount && selectedPin.photoCount > 0 ? (
                <div className={styles.photoBox}>
                  <span>📷 {selectedPin.photoCount} Site Photos Attached</span>
                </div>
              ) : null}

              {/* Status Transition Buttons */}
              <div className={styles.statusActions}>
                <label className={styles.actionLabel}>Update Inspection Status:</label>
                <div className={styles.btnRow}>
                  <button
                    type="button"
                    className={`${styles.statusBtn} ${
                      selectedPin.status === "open" ? styles.statusBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("open")}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className={`${styles.statusBtn} ${
                      selectedPin.status === "pending_inspection" ? styles.statusBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("pending_inspection")}
                  >
                    Ready for Inspect
                  </button>
                  <button
                    type="button"
                    className={`${styles.statusBtn} ${
                      selectedPin.status === "closed" ? styles.statusBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("closed")}
                  >
                    ✓ Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.noSelection}>Select a pin on the drawing sheet to inspect.</p>
          )}
        </div>
      </div>
    </section>
  );
};
