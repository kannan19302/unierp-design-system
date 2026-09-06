import React, { useState, useId, useMemo } from "react";
import styles from "./rent-roll-financial-schedule.module.css";

export type LeaseStatus = "active" | "expiring_soon" | "delinquent" | "vacant";

export interface LeaseUnitRow {
  id: string;
  unitNumber: string;
  unitType: "Office" | "Retail" | "Industrial" | "Residential";
  tenantName: string;
  squareFeet: number;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  camCharges: number;
  depositHeld: number;
  arrearsAmount: number;
  status: LeaseStatus;
}

export interface RentRollFinancialScheduleProps {
  /** Commercial property name */
  propertyName: string;
  /** Property gross leasable area (GLA in SqFt) */
  totalPropertySqFt?: number;
  /** Currency code (default: "USD") */
  currency?: string;
  /** Unit lease records */
  units: LeaseUnitRow[];
  /** Callback fired when a row is clicked */
  onRowClick?: (unit: LeaseUnitRow) => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const RentRollFinancialSchedule: React.FC<RentRollFinancialScheduleProps> = ({
  propertyName,
  totalPropertySqFt,
  currency = "USD",
  units,
  onRowClick,
  density = "compact",
  className,
}) => {
  const scheduleId = useId();
  const [filter, setFilter] = useState<"all" | LeaseStatus>("all");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const filteredUnits = useMemo(() => {
    if (filter === "all") return units;
    return units.filter((u) => u.status === filter);
  }, [units, filter]);

  // Aggregate computations
  const totals = useMemo(() => {
    return filteredUnits.reduce(
      (acc, u) => {
        acc.leasedSqFt += u.squareFeet;
        acc.monthlyRent += u.monthlyRent;
        acc.camCharges += u.camCharges;
        acc.depositHeld += u.depositHeld;
        acc.arrears += u.arrearsAmount;
        if (u.status !== "vacant") {
          acc.occupiedUnits += 1;
        }
        return acc;
      },
      {
        leasedSqFt: 0,
        monthlyRent: 0,
        camCharges: 0,
        depositHeld: 0,
        arrears: 0,
        occupiedUnits: 0,
      }
    );
  }, [filteredUnits]);

  const occupancyRate = units.length > 0 ? Math.round((totals.occupiedUnits / units.length) * 100) : 0;
  const annualizedRevenue = totals.monthlyRent * 12;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSelectRow = (unit: LeaseUnitRow) => {
    setSelectedUnitId(unit.id);
    onRowClick?.(unit);
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${scheduleId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.propBadge}>RENT ROLL</span>
          <h3 id={`${scheduleId}-title`} className={styles.propTitle}>
            {propertyName}
          </h3>
          <span className={styles.occupancyPill}>
            {occupancyRate}% Occupancy ({totals.occupiedUnits}/{units.length} Leased)
          </span>
        </div>

        {/* Quick Filter Tabs */}
        <div className={styles.filterTabs} role="group" aria-label="Filter units by lease status">
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("all")}
          >
            All Units ({units.length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "active" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("active")}
          >
            Active Leases
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "expiring_soon" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("expiring_soon")}
          >
            Expiring &lt; 90d
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "delinquent" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("delinquent")}
          >
            Delinquent
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "vacant" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("vacant")}
          >
            Vacant
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Total Leased GLA</span>
          <span className={styles.kpiValue}>
            {totals.leasedSqFt.toLocaleString()}
            {totalPropertySqFt ? ` / ${totalPropertySqFt.toLocaleString()}` : ""} Sq Ft
          </span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Monthly Gross Rent</span>
          <span className={styles.kpiValue}>{formatCurrency(totals.monthlyRent)}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Annualized Run-Rate</span>
          <span className={styles.kpiValue}>{formatCurrency(annualizedRevenue)}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Total Arrears (Overdue)</span>
          <span
            className={`${styles.kpiValue} ${
              totals.arrears > 0 ? styles.kpiDanger : styles.kpiSuccess
            }`}
          >
            {formatCurrency(totals.arrears)}
          </span>
        </div>
      </div>

      {/* Financial Grid */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label={`${propertyName} rent roll schedule`}>
          <thead>
            <tr>
              <th scope="col" className={styles.thUnit}>Unit</th>
              <th scope="col" className={styles.thType}>Type</th>
              <th scope="col" className={styles.thTenant}>Tenant / Occupant</th>
              <th scope="col" className={styles.thNumeric}>Sq Ft</th>
              <th scope="col" className={styles.thDate}>Lease Term</th>
              <th scope="col" className={styles.thNumeric}>Monthly Rent</th>
              <th scope="col" className={styles.thNumeric}>CAM / Mo</th>
              <th scope="col" className={styles.thNumeric}>Deposit Held</th>
              <th scope="col" className={styles.thNumeric}>Arrears</th>
              <th scope="col" className={styles.thStatus}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.emptyCell}>
                  No units matching selected filter.
                </td>
              </tr>
            ) : (
              filteredUnits.map((unit) => {
                const isSelected = unit.id === selectedUnitId;
                return (
                  <tr
                    key={unit.id}
                    className={`${styles.tr} ${isSelected ? styles.trSelected : ""}`}
                    onClick={() => handleSelectRow(unit)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectRow(unit);
                      }
                    }}
                  >
                    <td className={`${styles.td} ${styles.tdUnit}`}>{unit.unitNumber}</td>
                    <td className={`${styles.td} ${styles.tdType}`}>{unit.unitType}</td>
                    <td className={`${styles.td} ${styles.tdTenant}`}>
                      {unit.status === "vacant" ? (
                        <span className={styles.vacantText}>— Vacant Space —</span>
                      ) : (
                        <span className={styles.tenantName}>{unit.tenantName}</span>
                      )}
                    </td>
                    <td className={`${styles.td} ${styles.tdNumeric}`}>
                      {unit.squareFeet.toLocaleString()}
                    </td>
                    <td className={`${styles.td} ${styles.tdDate}`}>
                      {unit.status === "vacant" ? "—" : `${unit.leaseStart} → ${unit.leaseEnd}`}
                    </td>
                    <td className={`${styles.td} ${styles.tdNumeric}`}>
                      {unit.monthlyRent > 0 ? formatCurrency(unit.monthlyRent) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNumeric}`}>
                      {unit.camCharges > 0 ? formatCurrency(unit.camCharges) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNumeric}`}>
                      {unit.depositHeld > 0 ? formatCurrency(unit.depositHeld) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNumeric}`}>
                      <span className={unit.arrearsAmount > 0 ? styles.arrearsAlert : ""}>
                        {unit.arrearsAmount > 0 ? formatCurrency(unit.arrearsAmount) : "$0"}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.tdStatus}`}>
                      {unit.status === "active" && (
                        <span className={styles.statusActive}>Active</span>
                      )}
                      {unit.status === "expiring_soon" && (
                        <span className={styles.statusExpiring}>Expiring Soon</span>
                      )}
                      {unit.status === "delinquent" && (
                        <span className={styles.statusDelinquent}>Delinquent</span>
                      )}
                      {unit.status === "vacant" && (
                        <span className={styles.statusVacant}>Vacant</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filteredUnits.length > 0 && (
            <tfoot>
              <tr className={styles.tfootRow}>
                <td className={styles.td} colSpan={3}>
                  <strong>Total Portfolio Summary ({filteredUnits.length} units)</strong>
                </td>
                <td className={`${styles.td} ${styles.tdNumeric}`}>
                  <strong>{totals.leasedSqFt.toLocaleString()} Sq Ft</strong>
                </td>
                <td className={styles.td} />
                <td className={`${styles.td} ${styles.tdNumeric}`}>
                  <strong>{formatCurrency(totals.monthlyRent)}</strong>
                </td>
                <td className={`${styles.td} ${styles.tdNumeric}`}>
                  <strong>{formatCurrency(totals.camCharges)}</strong>
                </td>
                <td className={`${styles.td} ${styles.tdNumeric}`}>
                  <strong>{formatCurrency(totals.depositHeld)}</strong>
                </td>
                <td className={`${styles.td} ${styles.tdNumeric}`}>
                  <strong className={totals.arrears > 0 ? styles.arrearsAlert : ""}>
                    {formatCurrency(totals.arrears)}
                  </strong>
                </td>
                <td className={styles.td} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
