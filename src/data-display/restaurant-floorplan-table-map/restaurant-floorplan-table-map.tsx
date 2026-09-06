import React, { useId, useState, useMemo } from "react";
import styles from "./restaurant-floorplan-table-map.module.css";

export type TableOccupancyStatus =
  | "available"
  | "seated"
  | "check_dropped"
  | "dirty"
  | "reserved";

export type TableShape = "round" | "square" | "rectangle" | "bar_stool";

export interface DiningTableItem {
  id: string;
  tableNumber: string; // "T-12"
  zone: string; // "Main Dining", "Patio", "Bar"
  shape: TableShape;
  seats: number;
  status: TableOccupancyStatus;
  serverName?: string;
  partySize?: number;
  seatedMinutes?: number; // e.g. 48 minutes elapsed
  activeTicketTotal?: number; // e.g. $142.50
  posX: number; // percentage on floorplan
  posY: number; // percentage on floorplan
}

export interface RestaurantFloorplanTableMapProps {
  restaurantName?: string;
  shiftLabel?: string; // e.g. "Dinner Service (17:00 - 23:00)"
  tables: DiningTableItem[];
  onSelectTable?: (table: DiningTableItem) => void;
  onUpdateTableStatus?: (tableId: string, status: TableOccupancyStatus) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const RestaurantFloorplanTableMap: React.FC<RestaurantFloorplanTableMapProps> = ({
  restaurantName = "L'Osteria Meridian Ristorante",
  shiftLabel = "Friday Dinner Service (Turn 2)",
  tables: initialTables,
  onSelectTable,
  onUpdateTableStatus,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [tables, setTables] = useState<DiningTableItem[]>(initialTables);
  const [activeZone, setActiveZone] = useState<string>("all");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(
    initialTables.length > 0 ? (initialTables[0]?.id ?? null) : null
  );


  const zones = useMemo(() => {
    const set = new Set<string>();
    tables.forEach((t) => set.add(t.zone));
    return Array.from(set);
  }, [tables]);

  const filteredTables = useMemo(() => {
    if (activeZone === "all") return tables;
    return tables.filter((t) => t.zone === activeZone);
  }, [tables, activeZone]);

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) || null,
    [tables, selectedTableId]
  );

  const occupancyStats = useMemo(() => {
    let seatedCount = 0;
    let availableCount = 0;
    let dirtyCount = 0;
    let reservedCount = 0;
    let totalGuests = 0;
    let grossOpenChecks = 0;

    tables.forEach((t) => {
      if (t.status === "seated" || t.status === "check_dropped") {
        seatedCount++;
        totalGuests += t.partySize || t.seats;
        grossOpenChecks += t.activeTicketTotal || 0;
      } else if (t.status === "available") {
        availableCount++;
      } else if (t.status === "dirty") {
        dirtyCount++;
      } else if (t.status === "reserved") {
        reservedCount++;
      }
    });

    return {
      seatedCount,
      availableCount,
      dirtyCount,
      reservedCount,
      totalGuests,
      grossOpenChecks,
    };
  }, [tables]);

  const handleTableClick = (table: DiningTableItem) => {
    setSelectedTableId(table.id);
    onSelectTable?.(table);
  };

  const handleStatusChange = (status: TableOccupancyStatus) => {
    if (!selectedTableId) return;
    setTables((prev) =>
      prev.map((t) => (t.id === selectedTableId ? { ...t, status } : t))
    );
    onUpdateTableStatus?.(selectedTableId, status);
  };

  const statusColors: Record<TableOccupancyStatus, string> = {
    available: "var(--color-success, #16a34a)",
    seated: "var(--color-brand, #2563eb)",
    check_dropped: "var(--color-warning, #f59e0b)",
    dirty: "var(--color-danger, #ef4444)",
    reserved: "#8b5cf6",
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);

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
            🍽️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.shiftBadge}>{shiftLabel}</span>
              <span className={styles.activeGuestTag}>
                {occupancyStats.totalGuests} Active Guests Seated
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {restaurantName} — Floorplan &amp; Table Turn Map
            </h2>
          </div>
        </div>

        {/* Zone Selector */}
        <div className={styles.zoneTabs} role="tablist" aria-label="Floorplan zones">
          <button
            type="button"
            role="tab"
            aria-selected={activeZone === "all"}
            className={`${styles.zoneTab} ${activeZone === "all" ? styles.zoneTabActive : ""}`}
            onClick={() => setActiveZone("all")}
          >
            All Areas ({tables.length})
          </button>
          {zones.map((zone) => (
            <button
              key={zone}
              type="button"
              role="tab"
              aria-selected={activeZone === zone}
              className={`${styles.zoneTab} ${activeZone === zone ? styles.zoneTabActive : ""}`}
              onClick={() => setActiveZone(zone)}
            >
              {zone}
            </button>
          ))}
        </div>
      </header>

      {/* Service Telemetry Bar */}
      <div className={styles.telemetryBar}>
        <div className={styles.telemetryItem}>
          <span className={styles.telemDot} style={{ backgroundColor: statusColors.available }} />
          <span>{occupancyStats.availableCount} Available</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemDot} style={{ backgroundColor: statusColors.seated }} />
          <span>{occupancyStats.seatedCount} Seated</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemDot} style={{ backgroundColor: statusColors.check_dropped }} />
          <span>Check Dropped</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemDot} style={{ backgroundColor: statusColors.dirty }} />
          <span>{occupancyStats.dirtyCount} Dirty / Bus</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemDot} style={{ backgroundColor: statusColors.reserved }} />
          <span>{occupancyStats.reservedCount} Reserved</span>
        </div>
        <div className={styles.openChecksSummary}>
          <span>Open Checks: <strong>{formatCurrency(occupancyStats.grossOpenChecks)}</strong></span>
        </div>
      </div>

      {/* Main Floorplan Canvas and Table Inspector */}
      <div className={styles.mainGrid}>
        {/* Floorplan Layout Canvas */}
        <div className={styles.canvasArea} role="region" aria-label="Restaurant dining floorplan">
          <div className={styles.floorplanBounds}>
            {filteredTables.map((table) => {
              const isSelected = table.id === selectedTableId;
              const color = statusColors[table.status];

              return (
                <button
                  key={table.id}
                  type="button"
                  className={`${styles.tableButton} ${
                    table.shape === "round"
                      ? styles.shapeRound
                      : table.shape === "bar_stool"
                      ? styles.shapeStool
                      : styles.shapeRect
                  } ${isSelected ? styles.tableSelected : ""}`}
                  style={{
                    left: `${table.posX}%`,
                    top: `${table.posY}%`,
                    borderColor: color,
                  }}
                  onClick={() => handleTableClick(table)}
                  aria-label={`Table ${table.tableNumber}, ${table.seats} seats, status: ${table.status}`}
                >
                  <span className={styles.tableNumber}>{table.tableNumber}</span>
                  <span className={styles.seatBadge}>{table.seats}p</span>
                  {table.seatedMinutes && (
                    <span className={styles.timerPill}>{table.seatedMinutes}m</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Inspector Sidebar */}
        <div className={styles.inspectorSidebar}>
          {selectedTable ? (
            <div className={styles.tableDetailCard}>
              <div className={styles.detailCardHeader}>
                <div>
                  <span className={styles.detailZone}>{selectedTable.zone}</span>
                  <h3 className={styles.detailTableNumber}>Table {selectedTable.tableNumber}</h3>
                </div>
                <span
                  className={styles.statusPill}
                  style={{
                    backgroundColor: `${statusColors[selectedTable.status]}20`,
                    color: statusColors[selectedTable.status],
                    border: `1px solid ${statusColors[selectedTable.status]}`,
                  }}
                >
                  {selectedTable.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              <div className={styles.detailRows}>
                <div className={styles.detailRow}>
                  <span className={styles.rowLabel}>Capacity:</span>
                  <span className={styles.rowVal}>{selectedTable.seats} Guests Max</span>
                </div>
                {selectedTable.serverName && (
                  <div className={styles.detailRow}>
                    <span className={styles.rowLabel}>Server:</span>
                    <span className={styles.rowVal}>{selectedTable.serverName}</span>
                  </div>
                )}
                {selectedTable.partySize && (
                  <div className={styles.detailRow}>
                    <span className={styles.rowLabel}>Current Party:</span>
                    <span className={styles.rowVal}>{selectedTable.partySize} Guests</span>
                  </div>
                )}
                {selectedTable.seatedMinutes && (
                  <div className={styles.detailRow}>
                    <span className={styles.rowLabel}>Elapsed Time:</span>
                    <span className={styles.rowVal}>{selectedTable.seatedMinutes} minutes</span>
                  </div>
                )}
                {selectedTable.activeTicketTotal !== undefined && (
                  <div className={styles.detailRow}>
                    <span className={styles.rowLabel}>Active Check:</span>
                    <span className={styles.rowValBold}>
                      {formatCurrency(selectedTable.activeTicketTotal)}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className={styles.statusButtonGroup}>
                <span className={styles.actionPrompt}>Update Table State:</span>
                <div className={styles.actionGrid}>
                  <button
                    type="button"
                    className={`${styles.stateBtn} ${
                      selectedTable.status === "available" ? styles.stateBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("available")}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    className={`${styles.stateBtn} ${
                      selectedTable.status === "seated" ? styles.stateBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("seated")}
                  >
                    Seat Party
                  </button>
                  <button
                    type="button"
                    className={`${styles.stateBtn} ${
                      selectedTable.status === "check_dropped" ? styles.stateBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("check_dropped")}
                  >
                    Drop Check
                  </button>
                  <button
                    type="button"
                    className={`${styles.stateBtn} ${
                      selectedTable.status === "dirty" ? styles.stateBtnActive : ""
                    }`}
                    onClick={() => handleStatusChange("dirty")}
                  >
                    Dirty / Bus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.noSelection}>Select a table on the floorplan to inspect.</p>
          )}
        </div>
      </div>
    </section>
  );
};
