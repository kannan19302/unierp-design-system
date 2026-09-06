import React, { useId, useState } from "react";
import styles from "./share-class-cap-table-structure.module.css";

export type LiquidationPreferenceType =
  | "1X_NON_PARTICIPATING"
  | "1X_PARTICIPATING"
  | "2X_NON_PARTICIPATING"
  | "COMMON_RESIDUAL";

export interface ShareClassEntry {
  id: string; // "class_ser_a"
  className: string; // "Series A Preferred"
  authorizedShares: number; // 2500000
  issuedShares: number; // 2100000
  fullyDilutedShares: number; // 2100000
  issuePriceUsd: number; // 4.50
  liquidationPref: LiquidationPreferenceType;
  seniorityRank: number; // 1 (highest)
}

export interface ShareClassCapTableStructureProps {
  companyName?: string;
  shareClasses: ShareClassEntry[];
  postMoneyValuationUsd?: number;
  onModelNewRound?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ShareClassCapTableStructure: React.FC<ShareClassCapTableStructureProps> = ({
  companyName = "Acme Global Technologies Inc.",
  shareClasses,
  postMoneyValuationUsd = 120000000,
  onModelNewRound,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const totalFullyDiluted = shareClasses.reduce(
    (sum, sc) => sum + sc.fullyDilutedShares,
    0
  );

  const totalIssued = shareClasses.reduce((sum, sc) => sum + sc.issuedShares, 0);

  const formatNumber = (val: number) => val.toLocaleString();
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.corpBadge}>CAPITALIZATION &amp; 409A GOVERNANCE</span>
          <span className={`${styles.statusPill} ${isSimulating ? styles.pillSim : styles.pillLive}`}>
            {isSimulating ? "PRO-FORMA ROUND SIMULATION" : "CANONICAL CAP TABLE (LIVE)"}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            {companyName} — Share Class Capital Structure
          </h2>
          <button
            type="button"
            className={styles.simToggleBtn}
            onClick={() => {
              setIsSimulating(!isSimulating);
              onModelNewRound?.();
            }}
            aria-label={isSimulating ? "Exit round simulation mode" : "Model new financing round"}
          >
            {isSimulating ? "Exit Model Mode" : "+ Model Financing Round"}
          </button>
        </div>
      </header>

      {/* Financial KPI Summary */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Post-Money Valuation</span>
          <span className={styles.kpiValue}>{formatCurrency(postMoneyValuationUsd)}</span>
          <span className={styles.kpiSub}>Latest 409A appraisal</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Fully Diluted Shares</span>
          <span className={styles.kpiValue}>{formatNumber(totalFullyDiluted)}</span>
          <span className={styles.kpiSub}>{formatNumber(totalIssued)} issued &amp; outstanding</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Common Stock Ratio</span>
          <span className={styles.kpiValue}>
            {totalFullyDiluted > 0
              ? `${(
                  ((shareClasses.find((sc) => sc.className.includes("Common"))?.fullyDilutedShares ?? 0) /
                    totalFullyDiluted) *
                  100
                ).toFixed(1)}%`
              : "0%"}
          </span>
          <span className={styles.kpiSub}>Founders &amp; early contributors</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Preferred Capital Liquidation Floor</span>
          <span className={styles.kpiValue}>
            {formatCurrency(
              shareClasses
                .filter((sc) => sc.className.includes("Preferred"))
                .reduce((sum, sc) => sum + sc.issuedShares * sc.issuePriceUsd, 0)
            )}
          </span>
          <span className={styles.kpiSub}>Senior investor preference</span>
        </div>
      </div>

      {/* Cap Table Matrix */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Share class equity capital structure table">
          <thead>
            <tr>
              <th scope="col">Share Class</th>
              <th scope="col">Authorized</th>
              <th scope="col">Issued &amp; Outstanding</th>
              <th scope="col">Fully Diluted</th>
              <th scope="col">Ownership %</th>
              <th scope="col">Issue Price</th>
              <th scope="col">Liquidation Preference</th>
              <th scope="col">Rank</th>
            </tr>
          </thead>
          <tbody>
            {shareClasses.map((sc) => {
              const ownershipPct =
                totalFullyDiluted > 0
                  ? ((sc.fullyDilutedShares / totalFullyDiluted) * 100).toFixed(2)
                  : "0.00";
              return (
                <tr key={sc.id}>
                  <td>
                    <span className={styles.classNameText}>{sc.className}</span>
                  </td>
                  <td className={styles.numCell}>{formatNumber(sc.authorizedShares)}</td>
                  <td className={styles.numCell}>{formatNumber(sc.issuedShares)}</td>
                  <td className={styles.numCell}>{formatNumber(sc.fullyDilutedShares)}</td>
                  <td className={styles.numCell}>
                    <span className={styles.ownershipBadge}>{ownershipPct}%</span>
                  </td>
                  <td className={styles.numCell}>{formatCurrency(sc.issuePriceUsd)}</td>
                  <td>
                    <span className={styles.prefBadge}>
                      {sc.liquidationPref.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className={styles.numCell}>#{sc.seniorityRank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerNote}>
          Calculations account for common equivalents, option grants, unallocated options pool, and SAFE notes.
        </span>
      </footer>
    </section>
  );
};
