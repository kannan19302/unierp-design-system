import React, { useState, useId, useMemo } from "react";
import styles from "./cap-table-scenario-simulator.module.css";

export interface CapTableStakeholder {
  id: string;
  name: string;
  shareClass: "Common (Founders)" | "Preferred (Seed)" | "Option Pool (ESOP)" | "New Investor";
  preShares: number;
}

export interface CapTableScenarioSimulatorProps {
  /** Round name (e.g. "Series A Growth Round") */
  roundName?: string;
  /** Existing stakeholders before the new round */
  initialStakeholders?: CapTableStakeholder[];
  /** Initial pre-money valuation in currency */
  initialPreMoney?: number;
  /** Initial investment amount to raise */
  initialInvestment?: number;
  /** Option pool expansion target percentage (e.g. 10 for 10%) */
  initialOptionPoolExpansionPercent?: number;
  /** Currency code (default: "USD") */
  currency?: string;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_STAKEHOLDERS: CapTableStakeholder[] = [
  { id: "s1", name: "Founding Team & Executives", shareClass: "Common (Founders)", preShares: 6000000 },
  { id: "s2", name: "Seed Angel Syndicate", shareClass: "Preferred (Seed)", preShares: 2000000 },
  { id: "s3", name: "Unallocated ESOP Pool", shareClass: "Option Pool (ESOP)", preShares: 1000000 },
];

export const CapTableScenarioSimulator: React.FC<CapTableScenarioSimulatorProps> = ({
  roundName = "Series A Financing Simulation",
  initialStakeholders = DEFAULT_STAKEHOLDERS,
  initialPreMoney = 40000000, // $40M
  initialInvestment = 10000000, // $10M
  initialOptionPoolExpansionPercent = 10,
  currency = "USD",
  density = "compact",
  className,
}) => {
  const simId = useId();
  const [preMoney, setPreMoney] = useState<number>(initialPreMoney);
  const [investment, setInvestment] = useState<number>(initialInvestment);
  const [poolExpansion, setPoolExpansion] = useState<number>(initialOptionPoolExpansionPercent);
  const [isPreMoneyPool, setIsPreMoneyPool] = useState<boolean>(true);

  // Existing pre-round total shares
  const totalPreShares = useMemo(() => {
    return initialStakeholders.reduce((sum, s) => sum + s.preShares, 0);
  }, [initialStakeholders]);

  // Derived financial computations
  const calculations = useMemo(() => {
    const postMoney = preMoney + investment;
    const investorOwnershipPct = postMoney > 0 ? (investment / postMoney) * 100 : 0;

    // Price per share
    // If option pool is pre-money: pool shares are created before investment, diluting existing holders
    const preMoneySharePrice = totalPreShares > 0 ? preMoney / totalPreShares : 1;
    const newInvestorShares = preMoneySharePrice > 0 ? Math.round(investment / preMoneySharePrice) : 0;
    const newTotalShares = totalPreShares + newInvestorShares;

    return {
      postMoney,
      investorOwnershipPct,
      sharePrice: preMoneySharePrice,
      newInvestorShares,
      totalPostShares: newTotalShares,
    };
  }, [preMoney, investment, totalPreShares]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(price);
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${simId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.capBadge}>EQUITY</span>
          <h3 id={`${simId}-title`} className={styles.title}>
            {roundName}
          </h3>
          <span className={styles.metricPill}>
            {calculations.investorOwnershipPct.toFixed(1)}% Dilution to New Lead
          </span>
        </div>

        <div className={styles.poolTimingGroup} role="group" aria-label="Option pool calculation timing">
          <button
            type="button"
            className={`${styles.timingBtn} ${isPreMoneyPool ? styles.timingBtnActive : ""}`}
            onClick={() => setIsPreMoneyPool(true)}
          >
            Pre-Money Pool (Standard)
          </button>
          <button
            type="button"
            className={`${styles.timingBtn} ${!isPreMoneyPool ? styles.timingBtnActive : ""}`}
            onClick={() => setIsPreMoneyPool(false)}
          >
            Post-Money Pool
          </button>
        </div>
      </div>

      {/* Interactive Simulation Parameter Sliders */}
      <div className={styles.paramsGrid}>
        <div className={styles.paramCard}>
          <label htmlFor={`${simId}-pre-money`} className={styles.paramLabel}>
            Pre-Money Valuation: <strong>{formatCurrency(preMoney)}</strong>
          </label>
          <input
            id={`${simId}-pre-money`}
            type="range"
            min={5000000}
            max={100000000}
            step={1000000}
            value={preMoney}
            onChange={(e) => setPreMoney(parseFloat(e.target.value))}
            className={styles.sliderInput}
          />
          <div className={styles.paramMinMax}>
            <span>$5M</span>
            <span>$100M</span>
          </div>
        </div>

        <div className={styles.paramCard}>
          <label htmlFor={`${simId}-investment`} className={styles.paramLabel}>
            New Investment Capital: <strong>{formatCurrency(investment)}</strong>
          </label>
          <input
            id={`${simId}-investment`}
            type="range"
            min={1000000}
            max={50000000}
            step={500000}
            value={investment}
            onChange={(e) => setInvestment(parseFloat(e.target.value))}
            className={styles.sliderInput}
          />
          <div className={styles.paramMinMax}>
            <span>$1M</span>
            <span>$50M</span>
          </div>
        </div>

        <div className={styles.paramCard}>
          <label htmlFor={`${simId}-pool`} className={styles.paramLabel}>
            Target Option Pool Expansion: <strong>{poolExpansion}%</strong>
          </label>
          <input
            id={`${simId}-pool`}
            type="range"
            min={0}
            max={25}
            step={1}
            value={poolExpansion}
            onChange={(e) => setPoolExpansion(parseInt(e.target.value, 10))}
            className={styles.sliderInput}
          />
          <div className={styles.paramMinMax}>
            <span>0%</span>
            <span>25%</span>
          </div>
        </div>
      </div>

      {/* Metric Telemetry Cards */}
      <div className={styles.metricsBar}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Post-Money Valuation</span>
          <span className={styles.metricValueBrand}>
            {formatCurrency(calculations.postMoney)}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Effective Share Price</span>
          <span className={styles.metricValueMono}>
            {formatPrice(calculations.sharePrice)}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>New Shares Issued</span>
          <span className={styles.metricValueMono}>
            {calculations.newInvestorShares.toLocaleString()}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Total Diluted Shares</span>
          <span className={styles.metricValueMono}>
            {calculations.totalPostShares.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dilution Waterfall Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Ownership dilution waterfall">
          <thead>
            <tr>
              <th scope="col" className={styles.thName}>Stakeholder / Entity</th>
              <th scope="col" className={styles.thClass}>Share Class</th>
              <th scope="col" className={styles.thNumeric}>Pre-Round Shares</th>
              <th scope="col" className={styles.thNumeric}>Pre %</th>
              <th scope="col" className={styles.thNumeric}>Post-Round Shares</th>
              <th scope="col" className={styles.thNumeric}>Post %</th>
              <th scope="col" className={styles.thNumeric}>Dilution</th>
              <th scope="col" className={styles.thNumeric}>Post-Round Value</th>
            </tr>
          </thead>
          <tbody>
            {initialStakeholders.map((holder) => {
              const prePct = totalPreShares > 0 ? (holder.preShares / totalPreShares) * 100 : 0;
              const postShares = holder.preShares;
              const postPct =
                calculations.totalPostShares > 0
                  ? (postShares / calculations.totalPostShares) * 100
                  : 0;
              const dilutionDelta = postPct - prePct;
              const postValue = postShares * calculations.sharePrice;

              return (
                <tr key={holder.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdName}`}>{holder.name}</td>
                  <td className={`${styles.td} ${styles.tdClass}`}>{holder.shareClass}</td>
                  <td className={`${styles.td} ${styles.tdNumeric}`}>
                    {holder.preShares.toLocaleString()}
                  </td>
                  <td className={`${styles.td} ${styles.tdNumeric}`}>{prePct.toFixed(2)}%</td>
                  <td className={`${styles.td} ${styles.tdNumeric}`}>
                    {postShares.toLocaleString()}
                  </td>
                  <td className={`${styles.td} ${styles.tdNumeric}`}>{postPct.toFixed(2)}%</td>
                  <td className={`${styles.td} ${styles.tdNumeric} ${styles.dilutionText}`}>
                    {dilutionDelta.toFixed(2)}%
                  </td>
                  <td className={`${styles.td} ${styles.tdNumeric} ${styles.valueText}`}>
                    {formatCurrency(postValue)}
                  </td>
                </tr>
              );
            })}

            {/* New Lead Investor Row */}
            <tr className={`${styles.tr} ${styles.trNewInvestor}`}>
              <td className={`${styles.td} ${styles.tdName}`}>
                <strong>Series A Lead Investor (New)</strong>
              </td>
              <td className={`${styles.td} ${styles.tdClass}`}>Series A Preferred</td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>—</td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>0.00%</td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong>{calculations.newInvestorShares.toLocaleString()}</strong>
              </td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong className={styles.investorHighlight}>
                  {calculations.investorOwnershipPct.toFixed(2)}%
                </strong>
              </td>
              <td className={`${styles.td} ${styles.tdNumeric} ${styles.additionText}`}>
                +{calculations.investorOwnershipPct.toFixed(2)}%
              </td>
              <td className={`${styles.td} ${styles.tdNumeric} ${styles.valueText}`}>
                <strong>{formatCurrency(investment)}</strong>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className={styles.tfootRow}>
              <td className={styles.td} colSpan={2}>
                <strong>Total Fully Diluted Ownership</strong>
              </td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong>{totalPreShares.toLocaleString()}</strong>
              </td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong>100.00%</strong>
              </td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong>{calculations.totalPostShares.toLocaleString()}</strong>
              </td>
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong>100.00%</strong>
              </td>
              <td className={styles.td} />
              <td className={`${styles.td} ${styles.tdNumeric}`}>
                <strong>{formatCurrency(calculations.postMoney)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
