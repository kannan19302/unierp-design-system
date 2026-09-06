import React, { useId, useState, useMemo } from "react";
import styles from "./lease-amortization-schedule.module.css";

export type LeaseClassification = "operating" | "finance";

export interface LeaseSchedulePeriod {
  periodNumber: number;
  paymentDate: string; // "2026-10-01"
  paymentAmount: number;
  interestExpense: number;
  principalReduction: number;
  endingLiability: number;
  rouDepreciation: number;
  endingRouAsset: number;
  fiscalYear: number;
}

export interface LeaseAmortizationScheduleProps {
  leaseIdentifier?: string;
  assetDescription?: string;
  lessorName?: string;
  classification?: LeaseClassification;
  commencementDate?: string;
  expirationDate?: string;
  discountRatePercent?: number; // e.g. 5.25
  initialRouAsset?: number;
  initialLiability?: number;
  periods: LeaseSchedulePeriod[];
  currency?: string;
  onRecalculate?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const LeaseAmortizationSchedule: React.FC<LeaseAmortizationScheduleProps> = ({
  leaseIdentifier = "LSE-HQ-008",
  assetDescription = "Floor 14-16 Corporate Headquarters (45,000 sq ft)",
  lessorName = "Brookfield Commercial Properties REIT",
  classification = "operating",
  commencementDate = "2026-10-01",
  expirationDate = "2031-09-30",
  discountRatePercent = 5.25,
  initialRouAsset = 3250000,
  initialLiability = 3250000,
  periods,
  currency = "USD",
  onRecalculate,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const years = useMemo(() => {
    const set = new Set<number>();
    periods.forEach((p) => set.add(p.fiscalYear));
    return Array.from(set).sort((a, b) => a - b);
  }, [periods]);

  const filteredPeriods = useMemo(() => {
    if (selectedYear === "all") return periods;
    return periods.filter((p) => p.fiscalYear === selectedYear);
  }, [periods, selectedYear]);

  const totals = useMemo(() => {
    let totalCash = 0;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let totalDepreciation = 0;

    filteredPeriods.forEach((p) => {
      totalCash += p.paymentAmount;
      totalInterest += p.interestExpense;
      totalPrincipal += p.principalReduction;
      totalDepreciation += p.rouDepreciation;
    });

    return {
      totalCash,
      totalInterest,
      totalPrincipal,
      totalDepreciation,
    };
  }, [filteredPeriods]);

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
            🏢
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.leaseCode}>{leaseIdentifier}</span>
              <span
                className={`${styles.classBadge} ${
                  classification === "operating" ? styles.classOperating : styles.classFinance
                }`}
              >
                ASC 842 / IFRS 16 {classification.toUpperCase()} LEASE
              </span>
              <span className={styles.lessorName}>Lessor: {lessorName}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {assetDescription}
            </h2>
          </div>
        </div>

        {/* HUD Key Metrics */}
        <div className={styles.hudStats}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Discount Rate (IBR):</span>
            <span className={styles.hudValue}>{discountRatePercent.toFixed(2)}%</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Initial ROU Asset:</span>
            <span className={styles.hudValue}>{formatCurrency(initialRouAsset)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Initial Liability:</span>
            <span className={styles.hudValue}>{formatCurrency(initialLiability)}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Term Span:</span>
            <span className={styles.hudValue}>
              {commencementDate} → {expirationDate}
            </span>
          </div>
        </div>
      </header>

      {/* Filter and Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.filterGroup}>
          <label htmlFor={`${headingId}-year-select`} className={styles.filterLabel}>
            Fiscal Year Schedule:
          </label>
          <select
            id={`${headingId}-year-select`}
            className={styles.yearSelect}
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))
            }
          >
            <option value="all">All Fiscal Years ({periods.length} Periods)</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                FY {yr}
              </option>
            ))}
          </select>
        </div>

        {onRecalculate && (
          <button type="button" className={styles.recalcBtn} onClick={onRecalculate}>
            🔄 Recalculate Schedule
          </button>
        )}
      </div>

      {/* Schedule Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Lease amortization financial schedule">
          <thead>
            <tr>
              <th scope="col" className={styles.periodTh}>Period #</th>
              <th scope="col" className={styles.dateTh}>Payment Date</th>
              <th scope="col" className={styles.numTh}>Cash Payment</th>
              <th scope="col" className={styles.numTh}>Interest Expense</th>
              <th scope="col" className={styles.numTh}>Principal Reduction</th>
              <th scope="col" className={styles.numTh}>Ending Liability</th>
              <th scope="col" className={styles.numTh}>ROU Depreciation</th>
              <th scope="col" className={styles.numTh}>Ending ROU Asset</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeriods.map((p) => (
              <tr key={p.periodNumber} className={styles.dataRow}>
                <td className={styles.periodCell}>{p.periodNumber}</td>
                <td className={styles.dateCell}>{p.paymentDate}</td>
                <td className={styles.numCell}>{formatCurrency(p.paymentAmount)}</td>
                <td className={styles.numCell}>{formatCurrency(p.interestExpense)}</td>
                <td className={styles.numCell}>{formatCurrency(p.principalReduction)}</td>
                <td className={`${styles.numCell} ${styles.balanceCell}`}>
                  {formatCurrency(p.endingLiability)}
                </td>
                <td className={styles.numCell}>{formatCurrency(p.rouDepreciation)}</td>
                <td className={`${styles.numCell} ${styles.balanceCell}`}>
                  {formatCurrency(p.endingRouAsset)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.totalsRow}>
              <th scope="row" colSpan={2} className={styles.totalLabelCell}>
                Schedule Total ({filteredPeriods.length} Periods)
              </th>
              <td className={styles.numCell}>{formatCurrency(totals.totalCash)}</td>
              <td className={styles.numCell}>{formatCurrency(totals.totalInterest)}</td>
              <td className={styles.numCell}>{formatCurrency(totals.totalPrincipal)}</td>
              <td className={styles.numCell}>—</td>
              <td className={styles.numCell}>{formatCurrency(totals.totalDepreciation)}</td>
              <td className={styles.numCell}>—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
