import React, { useState, useId, useMemo } from "react";
import styles from "./bin-location-grid.module.css";

export interface StorageBin {
  id: string;
  binCode: string; // e.g. "A01-02-C"
  bay: number; // 1-indexed column
  tier: number; // 1-indexed row (vertical shelf level)
  capacityPercent: number; // 0 to 100
  skuCount: number;
  primarySku?: string;
  primarySkuName?: string;
  lotNumber?: string;
  expiryDate?: string;
  onHandQty?: number;
  isQuarantined?: boolean;
  isHazardous?: boolean;
  isColdChain?: boolean;
}

export interface BinLocationGridProps {
  /** Aisle identifier (e.g. "Aisle 04 — High-Velocity Cold Storage") */
  aisleCode: string;
  /** Number of bays (columns) in the aisle */
  bays: number;
  /** Number of vertical tiers (shelves) in each bay */
  tiers: number;
  /** Array of bins in this aisle */
  bins: StorageBin[];
  /** Currently selected bin ID */
  selectedBinId?: string;
  /** Callback fired when a bin is selected */
  onSelectBin?: (bin: StorageBin) => void;
  /** Optional density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const BinLocationGrid: React.FC<BinLocationGridProps> = ({
  aisleCode,
  bays,
  tiers,
  bins,
  selectedBinId,
  onSelectBin,
  density = "compact",
  className,
}) => {
  const gridId = useId();
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(selectedBinId);
  const [statusFilter, setStatusFilter] = useState<"all" | "empty" | "occupied" | "quarantine">("all");

  const currentSelectedId = selectedBinId !== undefined ? selectedBinId : internalSelectedId;

  // Build a 2D lookup map: [tier][bay] -> StorageBin
  const binMap = useMemo(() => {
    const map = new Map<string, StorageBin>();
    bins.forEach((b) => {
      map.set(`${b.tier}-${b.bay}`, b);
    });
    return map;
  }, [bins]);

  const selectedBin = useMemo(() => {
    return bins.find((b) => b.id === currentSelectedId);
  }, [bins, currentSelectedId]);

  const handleBinSelect = (bin: StorageBin) => {
    setInternalSelectedId(bin.id);
    onSelectBin?.(bin);
  };

  // Generate tier rows from top to bottom (tier = tiers down to 1)
  const tierRows = useMemo(() => {
    const rows: number[] = [];
    for (let t = tiers; t >= 1; t--) {
      rows.push(t);
    }
    return rows;
  }, [tiers]);

  // Generate bay columns from 1 to bays
  const bayCols = useMemo(() => {
    const cols: number[] = [];
    for (let b = 1; b <= bays; b++) {
      cols.push(b);
    }
    return cols;
  }, [bays]);

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${gridId}-title`}
    >
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.aisleBadge}>AISLE</span>
          <h3 id={`${gridId}-title`} className={styles.aisleTitle}>
            {aisleCode}
          </h3>
          <span className={styles.metricPill}>
            {bins.length} Locations ({bays} Bays × {tiers} Tiers)
          </span>
        </div>

        {/* Quick Status Filter Tabs */}
        <div className={styles.filterGroup} role="group" aria-label="Filter warehouse bins">
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Bins
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "occupied" ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter("occupied")}
          >
            Occupied
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "empty" ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter("empty")}
          >
            Available (Empty)
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${statusFilter === "quarantine" ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter("quarantine")}
          >
            Quarantine
          </button>
        </div>
      </div>

      {/* Main Workspace Area: Rack Grid on Left, Bin Inspection Card on Right */}
      <div className={styles.workspace}>
        <div className={styles.gridScrollContainer}>
          {/* Bay column labels on top */}
          <div className={styles.bayHeaderRow} aria-hidden="true">
            <div className={styles.tierLabelSpacer} />
            {bayCols.map((bay) => (
              <div key={bay} className={styles.bayHeaderCell}>
                Bay {String(bay).padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* 2D Interactive Shelf Matrix */}
          <div
            className={styles.matrix}
            role="grid"
            aria-label={`${aisleCode} physical storage rack`}
          >
            {tierRows.map((tier) => (
              <div key={tier} className={styles.matrixRow} role="row">
                <div className={styles.tierHeaderCell} aria-hidden="true">
                  T{tier}
                </div>
                {bayCols.map((bay) => {
                  const bin = binMap.get(`${tier}-${bay}`);
                  if (!bin) {
                    return (
                      <div
                        key={bay}
                        role="gridcell"
                        className={`${styles.binCell} ${styles.binEmptySlot}`}
                        aria-label={`Tier ${tier}, Bay ${bay}: No bin configured`}
                      />
                    );
                  }

                  const isSelected = bin.id === currentSelectedId;
                  const isFilteredOut =
                    (statusFilter === "occupied" && bin.capacityPercent === 0) ||
                    (statusFilter === "empty" && bin.capacityPercent > 0) ||
                    (statusFilter === "quarantine" && !bin.isQuarantined);

                  return (
                    <div
                      key={bay}
                      role="gridcell"
                      aria-selected={isSelected}
                      tabIndex={isFilteredOut ? -1 : 0}
                      onClick={() => handleBinSelect(bin)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleBinSelect(bin);
                        }
                      }}
                      className={`${styles.binCell} ${
                        isSelected ? styles.binSelected : ""
                      } ${bin.isQuarantined ? styles.binQuarantine : ""} ${
                        isFilteredOut ? styles.binDimmed : ""
                      }`}
                      aria-label={`${bin.binCode} (${bin.capacityPercent}% full, ${
                        bin.isQuarantined ? "Quarantined" : bin.primarySku ?? "Empty"
                      })`}
                    >
                      <div className={styles.binCodeText}>{bin.binCode}</div>
                      {/* Capacity fill indicator */}
                      <div className={styles.capacityBar} aria-hidden="true">
                        <div
                          className={`${styles.capacityFill} ${
                            bin.capacityPercent >= 90
                              ? styles.fillFull
                              : bin.capacityPercent > 0
                              ? styles.fillPartial
                              : styles.fillEmpty
                          }`}
                          style={{ width: `${bin.capacityPercent}%` }}
                        />
                      </div>
                      <div className={styles.binFooter}>
                        <span className={styles.percentText}>{bin.capacityPercent}%</span>
                        <div className={styles.badgeIcons}>
                          {bin.isColdChain && <span title="Cold Chain">❄</span>}
                          {bin.isHazardous && <span title="Hazardous">⚠</span>}
                          {bin.isQuarantined && <span title="Quarantined">⛔</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Bin Telemetry Inspector */}
        <aside
          className={styles.inspector}
          aria-label="Selected bin details"
        >
          {selectedBin ? (
            <div className={styles.inspectorContent}>
              <div className={styles.inspectorHeader}>
                <span className={styles.inspectorTag}>SELECTED BIN</span>
                <h4 className={styles.inspectorTitle}>{selectedBin.binCode}</h4>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Position</span>
                  <span className={styles.detailValue}>
                    Bay {selectedBin.bay}, Shelf Tier {selectedBin.tier}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Utilization</span>
                  <span className={styles.detailValue}>
                    {selectedBin.capacityPercent}% Capacity
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>SKU Count</span>
                  <span className={styles.detailValue}>
                    {selectedBin.skuCount} items
                  </span>
                </div>
                {selectedBin.primarySku && (
                  <div className={styles.detailItemFull}>
                    <span className={styles.detailLabel}>Primary Stored SKU</span>
                    <span className={styles.skuValue}>
                      {selectedBin.primarySku}
                    </span>
                    {selectedBin.primarySkuName && (
                      <span className={styles.skuName}>
                        {selectedBin.primarySkuName}
                      </span>
                    )}
                  </div>
                )}
                {selectedBin.lotNumber && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Lot / Batch</span>
                    <span className={styles.detailValueMono}>
                      {selectedBin.lotNumber}
                    </span>
                  </div>
                )}
                {selectedBin.onHandQty !== undefined && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>On-Hand Units</span>
                    <span className={styles.detailValueMono}>
                      {selectedBin.onHandQty.toLocaleString()} EA
                    </span>
                  </div>
                )}
                {selectedBin.expiryDate && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Expiry Date</span>
                    <span className={styles.detailValue}>
                      {selectedBin.expiryDate}
                    </span>
                  </div>
                )}
              </div>

              {selectedBin.isQuarantined && (
                <div className={styles.quarantineWarning}>
                  ⛔ <strong>Quarantined Location:</strong> Material hold active. Picking and dispatch suppressed.
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyInspector}>
              Select a bin in the rack matrix to view stock details, lot numbers, and allocation status.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
