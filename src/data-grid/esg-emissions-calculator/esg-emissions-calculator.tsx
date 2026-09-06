import React, { useId, useState, useMemo } from "react";
import styles from "./esg-emissions-calculator.module.css";

export type EsgScope = "scope_1" | "scope_2" | "scope_3";

export interface EmissionActivityLine {
  id: string;
  activityName: string; // e.g. "Natural Gas Boiler Combustion"
  facilityName: string; // "Seattle Manufacturing Plant #1"
  scope: EsgScope;
  quantity: number;
  unitOfMeasure: string; // "therms", "kWh", "passenger-miles"
  emissionFactor: number; // e.g. 5.3 kg CO2e / unit
  factorSource: string; // "EPA GHG Hub 2026"
  tCo2e: number; // calculated metric tons CO2 equivalent
}

export interface EsgEmissionsCalculatorProps {
  reportingYear?: number;
  targetNetZeroYear?: number;
  annualReductionTargetPct?: number; // e.g. 15%
  activities: EmissionActivityLine[];
  onRecalculateFactors?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const EsgEmissionsCalculator: React.FC<EsgEmissionsCalculatorProps> = ({
  reportingYear = 2026,
  targetNetZeroYear = 2035,
  annualReductionTargetPct = 12.5,
  activities: initialActivities,
  onRecalculateFactors,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [scopeFilter, setScopeFilter] = useState<string>("all");

  // Summary calculations
  const totals = useMemo(() => {
    let scope1 = 0;
    let scope2 = 0;
    let scope3 = 0;

    initialActivities.forEach((act) => {
      if (act.scope === "scope_1") scope1 += act.tCo2e;
      else if (act.scope === "scope_2") scope2 += act.tCo2e;
      else if (act.scope === "scope_3") scope3 += act.tCo2e;
    });

    const grandTotal = scope1 + scope2 + scope3;

    return {
      scope1,
      scope2,
      scope3,
      grandTotal,
      scope1Pct: grandTotal > 0 ? (scope1 / grandTotal) * 100 : 0,
      scope2Pct: grandTotal > 0 ? (scope2 / grandTotal) * 100 : 0,
      scope3Pct: grandTotal > 0 ? (scope3 / grandTotal) * 100 : 0,
    };
  }, [initialActivities]);

  const filteredActivities = useMemo(() => {
    if (scopeFilter === "all") return initialActivities;
    return initialActivities.filter((a) => a.scope === scopeFilter);
  }, [initialActivities, scopeFilter]);

  const getScopeBadge = (scope: EsgScope) => {
    switch (scope) {
      case "scope_1":
        return <span className={`${styles.scopeBadge} ${styles.scope1Badge}`}>SCOPE 1: DIRECT</span>;
      case "scope_2":
        return <span className={`${styles.scopeBadge} ${styles.scope2Badge}`}>SCOPE 2: ELECTRICITY</span>;
      case "scope_3":
        return <span className={`${styles.scopeBadge} ${styles.scope3Badge}`}>SCOPE 3: VALUE CHAIN</span>;
    }
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
            🌱
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.yearTag}>FY {reportingYear} Audit</span>
              <span className={styles.targetTag}>Target Net-Zero: {targetNetZeroYear} (-{annualReductionTargetPct}% YoY)</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Corporate ESG Greenhouse Gas (GHG) Ledger
            </h2>
          </div>
        </div>

        {onRecalculateFactors && (
          <button type="button" className={styles.recalcBtn} onClick={onRecalculateFactors}>
            🔄 Sync Emission Factors
          </button>
        )}
      </header>

      {/* Scope Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.cardTotal}`}>
          <span className={styles.cardLabel}>TOTAL CARBON FOOTPRINT</span>
          <span className={styles.cardVal}>{totals.grandTotal.toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>
          <span className={styles.cardSub}>Metric Tons CO₂e</span>
        </div>

        <div className={`${styles.summaryCard} ${styles.cardScope1}`}>
          <div className={styles.cardHeaderSmall}>
            <span className={styles.cardLabel}>SCOPE 1 (DIRECT)</span>
            <span className={styles.scopePct}>{totals.scope1Pct.toFixed(1)}%</span>
          </div>
          <span className={styles.cardVal}>{totals.scope1.toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>
          <span className={styles.cardSub}>Fuel, boilers, vehicle fleet</span>
        </div>

        <div className={`${styles.summaryCard} ${styles.cardScope2}`}>
          <div className={styles.cardHeaderSmall}>
            <span className={styles.cardLabel}>SCOPE 2 (INDIRECT)</span>
            <span className={styles.scopePct}>{totals.scope2Pct.toFixed(1)}%</span>
          </div>
          <span className={styles.cardVal}>{totals.scope2.toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>
          <span className={styles.cardSub}>Purchased grid electricity &amp; steam</span>
        </div>

        <div className={`${styles.summaryCard} ${styles.cardScope3}`}>
          <div className={styles.cardHeaderSmall}>
            <span className={styles.cardLabel}>SCOPE 3 (VALUE CHAIN)</span>
            <span className={styles.scopePct}>{totals.scope3Pct.toFixed(1)}%</span>
          </div>
          <span className={styles.cardVal}>{totals.scope3.toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>
          <span className={styles.cardSub}>Air travel, suppliers &amp; logistics</span>
        </div>
      </div>

      {/* Scope Filter Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Filter Scope:</span>
          <button
            type="button"
            className={`${styles.filterBtn} ${scopeFilter === "all" ? styles.filterActive : ""}`}
            onClick={() => setScopeFilter("all")}
          >
            All Emissions ({initialActivities.length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${scopeFilter === "scope_1" ? styles.filterActive : ""}`}
            onClick={() => setScopeFilter("scope_1")}
          >
            Scope 1
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${scopeFilter === "scope_2" ? styles.filterActive : ""}`}
            onClick={() => setScopeFilter("scope_2")}
          >
            Scope 2
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${scopeFilter === "scope_3" ? styles.filterActive : ""}`}
            onClick={() => setScopeFilter("scope_3")}
          >
            Scope 3
          </button>
        </div>
      </div>

      {/* Emissions Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Corporate greenhouse gas emissions ledger">
          <thead>
            <tr>
              <th scope="col" className={styles.activityTh}>Activity / Facility</th>
              <th scope="col" className={styles.scopeTh}>Scope</th>
              <th scope="col" className={styles.numTh}>Activity Quantity</th>
              <th scope="col" className={styles.txtTh}>Emission Factor</th>
              <th scope="col" className={styles.txtTh}>Factor Authority</th>
              <th scope="col" className={styles.numTh}>Total (tCO₂e)</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((act) => (
              <tr key={act.id} className={styles.dataRow}>
                <td className={styles.activityCell}>
                  <span className={styles.actName}>{act.activityName}</span>
                  <span className={styles.facilityName}>{act.facilityName}</span>
                </td>
                <td className={styles.scopeCell}>{getScopeBadge(act.scope)}</td>
                <td className={styles.numCell}>
                  {act.quantity.toLocaleString()} {act.unitOfMeasure}
                </td>
                <td className={styles.txtCell}>
                  {act.emissionFactor.toFixed(4)} kg CO₂e / {act.unitOfMeasure}
                </td>
                <td className={styles.txtCell}>
                  <span className={styles.authBadge}>{act.factorSource}</span>
                </td>
                <td className={`${styles.numCell} ${styles.tco2eCell}`}>
                  {act.tCo2e.toFixed(2)} t
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
