import React, { useId, useState } from "react";
import styles from "./spend-category-sourcing-matrix.module.css";

export type KraljicQuadrant = "STRATEGIC" | "BOTTLENECK" | "LEVERAGE" | "NON_CRITICAL";
export type SourcingStatus =
  | "CONTRACTED"
  | "RFP_IN_PROGRESS"
  | "EXPIRING_SOON"
  | "RE_NEGOTIATION";

export interface SpendCategoryItem {
  id: string; // "spend_cat_01"
  categoryName: string; // "Cloud Compute & Managed Databases"
  kraljicQuadrant: KraljicQuadrant;
  annualSpendUsd: number; // 4200000
  activeSuppliersCount: number; // 3
  supplyRiskScore: number; // 68 (1-100)
  contractExpirationDate: string; // "2026-11-30"
  sourcingStatus: SourcingStatus;
}

export interface SpendCategorySourcingMatrixProps {
  fiscalYear?: number;
  categories: SpendCategoryItem[];
  onLaunchRfp?: (categoryId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SpendCategorySourcingMatrix: React.FC<SpendCategorySourcingMatrixProps> = ({
  fiscalYear = 2026,
  categories: initialCategories,
  onLaunchRfp,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [categories, setCategories] = useState<SpendCategoryItem[]>(initialCategories);
  const [quadrantFilter, setQuadrantFilter] = useState<string>("ALL");

  const filtered = categories.filter((c) =>
    quadrantFilter === "ALL" ? true : c.kraljicQuadrant === quadrantFilter
  );

  const totalSpend = categories.reduce((acc, c) => acc + c.annualSpendUsd, 0);
  const strategicCount = categories.filter((c) => c.kraljicQuadrant === "STRATEGIC").length;
  const expiringCount = categories.filter(
    (c) => c.sourcingStatus === "EXPIRING_SOON" || c.sourcingStatus === "RE_NEGOTIATION"
  ).length;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const handleLaunch = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, sourcingStatus: "RFP_IN_PROGRESS" as SourcingStatus } : c
      )
    );
    onLaunchRfp?.(id);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.sourcingBadge}>STRATEGIC SOURCING &amp; SPEND OPTIMIZATION</span>
            <span className={styles.yearBadge}>FY {fiscalYear} PORTFOLIO</span>
          </div>

          <div className={styles.kpiPills}>
            <span className={styles.kpiSpend}>Total Spend: {formatCurrency(totalSpend)}</span>
            <span className={styles.kpiStrategic}>{strategicCount} Strategic Categories</span>
            {expiringCount > 0 && (
              <span className={styles.kpiExpiring}>{expiringCount} Need Sourcing Action</span>
            )}
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Kraljic Portfolio Matrix &amp; Category Procurement Register
          </h2>

          <div className={styles.filterControl}>
            <label htmlFor={`${headingId}-filter`} className={styles.filterLabel}>
              Filter Quadrant:
            </label>
            <select
              id={`${headingId}-filter`}
              className={styles.filterSelect}
              value={quadrantFilter}
              onChange={(e) => setQuadrantFilter(e.target.value)}
            >
              <option value="ALL">All Kraljic Quadrants ({categories.length})</option>
              <option value="STRATEGIC">Strategic (High Profit / High Risk)</option>
              <option value="BOTTLENECK">Bottleneck (Low Profit / High Risk)</option>
              <option value="LEVERAGE">Leverage (High Profit / Low Risk)</option>
              <option value="NON_CRITICAL">Non-Critical (Routine)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Categories Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Spend category sourcing matrix">
          <thead>
            <tr>
              <th scope="col">Spend Category</th>
              <th scope="col">Kraljic Quadrant</th>
              <th scope="col">Annual Spend (USD)</th>
              <th scope="col">Suppliers</th>
              <th scope="col">Supply Risk</th>
              <th scope="col">Contract Expiration</th>
              <th scope="col">Sourcing Status</th>
              <th scope="col">Strategic Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const isStrategic = item.kraljicQuadrant === "STRATEGIC";
              const isRfpActive = item.sourcingStatus === "RFP_IN_PROGRESS";

              return (
                <tr key={item.id} className={isStrategic ? styles.strategicRow : ""}>
                  <td className={styles.categoryName}>{item.categoryName}</td>
                  <td>
                    <span
                      className={`${styles.quadrantBadge} ${
                        item.kraljicQuadrant === "STRATEGIC"
                          ? styles.quadStrategic
                          : item.kraljicQuadrant === "BOTTLENECK"
                          ? styles.quadBottleneck
                          : item.kraljicQuadrant === "LEVERAGE"
                          ? styles.quadLeverage
                          : styles.quadRoutine
                      }`}
                    >
                      {item.kraljicQuadrant.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className={styles.monoCell}>{formatCurrency(item.annualSpendUsd)}</td>
                  <td className={styles.monoCell}>{item.activeSuppliersCount} vendors</td>
                  <td>
                    <div className={styles.riskCell}>
                      <span
                        className={`${styles.riskVal} ${
                          item.supplyRiskScore > 70
                            ? styles.riskHigh
                            : item.supplyRiskScore > 40
                            ? styles.riskMed
                            : styles.riskLow
                        }`}
                      >
                        {item.supplyRiskScore}/100
                      </span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>{item.contractExpirationDate}</td>
                  <td>
                    <span
                      className={`${styles.statusPill} ${
                        isRfpActive
                          ? styles.statusRfp
                          : item.sourcingStatus === "CONTRACTED"
                          ? styles.statusContracted
                          : styles.statusExpiring
                      }`}
                    >
                      {item.sourcingStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.rfpBtn}
                      onClick={() => handleLaunch(item.id)}
                      disabled={isRfpActive}
                      aria-label={`Launch RFP for ${item.categoryName}`}
                    >
                      {isRfpActive ? "RFP Dispatched" : "Launch Competitive RFP"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Kraljic matrix model aligns purchasing power with supplier scarcity to eliminate supply chain bottleneck exposure.
        </span>
      </footer>
    </section>
  );
};
