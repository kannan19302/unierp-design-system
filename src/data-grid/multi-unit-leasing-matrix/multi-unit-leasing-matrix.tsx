import React, { useId, useState, useMemo } from "react";
import styles from "./multi-unit-leasing-matrix.module.css";

export type LeaseStatus = "available" | "leased" | "under_loi" | "renewal_pending" | "holdover";

export interface CommercialLeaseUnit {
  id: string;
  unitCode: string; // e.g. "SUITE-1400"
  floor: number; // e.g. 14
  rentableSqFt: number; // e.g. 12500
  usableSqFt: number; // e.g. 11200
  tenantName?: string; // e.g. "Stripe Global Inc."
  industry?: string; // e.g. "Fintech / Payments"
  baseRentPerSqFt: number; // e.g. $84.00
  camNnnPerSqFt: number; // e.g. $18.50
  leaseCommencement?: string; // "2022-01-01"
  leaseExpiration?: string; // "2027-12-31"
  status: LeaseStatus;
}

export interface MultiUnitLeasingMatrixProps {
  propertyName: string; // "One Embarcadero Center"
  propertyAddress?: string; // "1 Embarcadero Ctr, San Francisco, CA"
  units: CommercialLeaseUnit[];
  selectedUnitId?: string;
  onSelectUnit?: (unit: CommercialLeaseUnit) => void;
  onActionClick?: (action: string, unit: CommercialLeaseUnit) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const MultiUnitLeasingMatrix: React.FC<MultiUnitLeasingMatrixProps> = ({
  propertyName,
  propertyAddress = "Financial District Metro Campus",
  units,
  selectedUnitId,
  onSelectUnit,
  onActionClick,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeUnitId, setActiveUnitId] = useState<string | null>(
    selectedUnitId ?? (units[0]?.id ?? null)
  );

  const availableFloors = useMemo(() => {
    const floors = Array.from(new Set(units.map((u) => u.floor))).sort((a, b) => a - b);
    return floors;
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchFloor = floorFilter === "all" || u.floor.toString() === floorFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchFloor && matchStatus;
    });
  }, [units, floorFilter, statusFilter]);

  // Overall KPI rollups
  const kpis = useMemo(() => {
    const totalRsf = units.reduce((sum, u) => sum + u.rentableSqFt, 0);
    const leasedUnits = units.filter((u) => u.status === "leased" || u.status === "renewal_pending");
    const leasedRsf = leasedUnits.reduce((sum, u) => sum + u.rentableSqFt, 0);
    const occupancyRate = totalRsf > 0 ? (leasedRsf / totalRsf) * 100 : 0;

    const annualGrossRent = leasedUnits.reduce(
      (sum, u) => sum + u.rentableSqFt * (u.baseRentPerSqFt + u.camNnnPerSqFt),
      0
    );
    const avgInPlaceRate = leasedRsf > 0 ? annualGrossRent / leasedRsf : 0;

    return {
      totalRsf,
      leasedRsf,
      occupancyRate,
      annualGrossRent,
      avgInPlaceRate,
    };
  }, [units]);

  const getStatusBadge = (status: LeaseStatus) => {
    switch (status) {
      case "leased":
        return <span className={`${styles.statusBadge} ${styles.stLeased}`}>Leased</span>;
      case "available":
        return <span className={`${styles.statusBadge} ${styles.stAvailable}`}>Available</span>;
      case "under_loi":
        return <span className={`${styles.statusBadge} ${styles.stLoi}`}>Under LOI</span>;
      case "renewal_pending":
        return <span className={`${styles.statusBadge} ${styles.stRenewal}`}>Renewal Pending</span>;
      case "holdover":
        return <span className={`${styles.statusBadge} ${styles.stHoldover}`}>Holdover</span>;
    }
  };

  const handleRowClick = (unit: CommercialLeaseUnit) => {
    setActiveUnitId(unit.id);
    onSelectUnit?.(unit);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.propertyInfo}>
          <div className={styles.propertyBadgeRow}>
            <span className={styles.propertyBadge}>COMMERCIAL ASSET MANAGEMENT</span>
            <span className={styles.unitCountBadge}>{units.length} Units Modeled</span>
          </div>
          <h2 id={headingId} className={styles.propertyName}>
            {propertyName}
          </h2>
          <p className={styles.propertyAddress}>{propertyAddress}</p>
        </div>

        <div className={styles.kpiBar}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Occupancy Rate</span>
            <strong className={styles.kpiValue}>{kpis.occupancyRate.toFixed(1)}%</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Rentable RSF</span>
            <strong className={styles.kpiValue}>{kpis.totalRsf.toLocaleString()} SF</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Avg In-Place Gross</span>
            <strong className={styles.kpiValue}>${kpis.avgInPlaceRate.toFixed(2)}/SF</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Annualized Rent Roll</span>
            <strong className={styles.kpiValueHighlight}>
              ${(kpis.annualGrossRent / 1_000_000).toFixed(2)}M
            </strong>
          </div>
        </div>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label htmlFor="leasing-floor-filter" className={styles.filterLabel}>
            Floor:
          </label>
          <select
            id="leasing-floor-filter"
            className={styles.filterSelect}
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
          >
            <option value="all">All Floors ({availableFloors.length})</option>
            {availableFloors.map((fl) => (
              <option key={fl} value={fl.toString()}>
                Floor {fl}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="leasing-status-filter" className={styles.filterLabel}>
            Lease Status:
          </label>
          <select
            id="leasing-status-filter"
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="leased">Leased</option>
            <option value="available">Available</option>
            <option value="under_loi">Under LOI</option>
            <option value="renewal_pending">Renewal Pending</option>
            <option value="holdover">Holdover</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Commercial Tenant Units and Rent Roll">
          <caption className={styles.srOnly}>
            Commercial building suite inventory and in-place lease terms
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thLeft}>Suite / Unit</th>
              <th scope="col" className={styles.thCenter}>Floor</th>
              <th scope="col" className={styles.thRight}>Rentable SF</th>
              <th scope="col" className={styles.thLeft}>Current Tenant</th>
              <th scope="col" className={styles.thRight}>Base Rent ($/SF)</th>
              <th scope="col" className={styles.thRight}>CAM/NNN ($/SF)</th>
              <th scope="col" className={styles.thCenter}>Expiration</th>
              <th scope="col" className={styles.thCenter}>Status</th>
              <th scope="col" className={styles.thCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyRow}>
                  No suites match the selected floor or lease status filters.
                </td>
              </tr>
            ) : (
              filteredUnits.map((u) => {
                const isSelected = activeUnitId === u.id;
                return (
                  <tr
                    key={u.id}
                    className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                    onClick={() => handleRowClick(u)}
                  >
                    <td className={styles.tdLeft}>
                      <strong className={styles.unitCode}>{u.unitCode}</strong>
                      <span className={styles.usableSqFt}>{u.usableSqFt.toLocaleString()} USF</span>
                    </td>
                    <td className={styles.tdCenter}>L{u.floor}</td>
                    <td className={styles.tdRight}>{u.rentableSqFt.toLocaleString()}</td>
                    <td className={styles.tdLeft}>
                      {u.tenantName ? (
                        <div>
                          <div className={styles.tenantName}>{u.tenantName}</div>
                          {u.industry && <div className={styles.industryTag}>{u.industry}</div>}
                        </div>
                      ) : (
                        <span className={styles.vacantText}>Vacant Space</span>
                      )}
                    </td>
                    <td className={styles.tdRight}>
                      {u.baseRentPerSqFt > 0 ? `$${u.baseRentPerSqFt.toFixed(2)}` : "—"}
                    </td>
                    <td className={styles.tdRight}>
                      {u.camNnnPerSqFt > 0 ? `$${u.camNnnPerSqFt.toFixed(2)}` : "—"}
                    </td>
                    <td className={styles.tdCenter}>
                      {u.leaseExpiration ? (
                        <span className={styles.expirationDate}>{u.leaseExpiration}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={styles.tdCenter}>{getStatusBadge(u.status)}</td>
                    <td className={styles.tdCenter}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick?.("edit_lease", u);
                        }}
                        aria-label={`Manage lease agreement for ${u.unitCode}`}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className={styles.footerRow}>
              <td colSpan={2} className={styles.footerLabel}>
                Filtered Rollup ({filteredUnits.length} Suites):
              </td>
              <td className={styles.tdRight}>
                <strong>
                  {filteredUnits.reduce((s, it) => s + it.rentableSqFt, 0).toLocaleString()} SF
                </strong>
              </td>
              <td colSpan={6} className={styles.footerSubtext}>
                WALT calculation active on commercial lease roll
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
