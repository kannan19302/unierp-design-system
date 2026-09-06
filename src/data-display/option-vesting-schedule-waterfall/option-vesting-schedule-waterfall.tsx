import React, { useId, useMemo } from "react";
import styles from "./option-vesting-schedule-waterfall.module.css";

export type StockGrantType = "ISO" | "NSO" | "RSU";

export interface VestingTranche {
  id: string;
  vestDate: string; // "2025-03-01"
  sharesVesting: number;
  cumulativeVested: number;
  status: "vested" | "upcoming" | "exercised";
  percentVested: number; // e.g. 25.0
}

export interface OptionVestingScheduleWaterfallProps {
  grantNumber: string; // "ESOP-2024-042"
  granteeName: string; // "Elena Rostova"
  grantType: StockGrantType;
  totalGrantedShares: number; // 48000
  strikePrice: number; // $1.25
  currentFairMarketValue: number; // $14.50
  vestingCommencementDate: string;
  cliffDate: string;
  cliffShares: number;
  election83bFiled: boolean;
  tranches: VestingTranche[];
  onExerciseVestedShares?: (grantNumber: string, shareCount: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const OptionVestingScheduleWaterfall: React.FC<OptionVestingScheduleWaterfallProps> = ({
  grantNumber,
  granteeName,
  grantType,
  totalGrantedShares,
  strikePrice,
  currentFairMarketValue,
  vestingCommencementDate,
  cliffDate,
  cliffShares,
  election83bFiled,
  tranches,
  onExerciseVestedShares,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();

  const { vestedShares, exercisableShares, unvestedShares } = useMemo(() => {
    const vested = tranches
      .filter((t) => t.status === "vested" || t.status === "exercised")
      .reduce((acc, t) => acc + t.sharesVesting, 0);

    const exercised = tranches
      .filter((t) => t.status === "exercised")
      .reduce((acc, t) => acc + t.sharesVesting, 0);

    const exercisable = Math.max(0, vested - exercised);
    const unvested = Math.max(0, totalGrantedShares - vested);

    return { vestedShares: vested, exercisableShares: exercisable, unvestedShares: unvested };
  }, [tranches, totalGrantedShares]);

  const spreadPerShare = Math.max(0, currentFairMarketValue - strikePrice);
  const totalIntrinsicValue = vestedShares * spreadPerShare;

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("en-US").format(val);

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
            📈
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.grantBadge}>{grantNumber}</span>
              <span className={styles.typeBadge}>{grantType}</span>
              <span
                className={`${styles.taxBadge} ${
                  election83bFiled ? styles.taxFiled : styles.taxNone
                }`}
              >
                {election83bFiled ? "✓ 83(b) Election Filed" : "No 83(b) Election"}
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Equity Option Vesting Waterfall: {granteeName}
            </h2>
          </div>
        </div>

        {/* Action Button */}
        {exercisableShares > 0 && onExerciseVestedShares && (
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.exerciseBtn}
              onClick={() => onExerciseVestedShares(grantNumber, exercisableShares)}
            >
              🚀 Exercise Vested Shares ({formatNumber(exercisableShares)})
            </button>
          </div>
        )}
      </header>

      {/* Financial Valuation Ribbon */}
      <div className={styles.valuationRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Total Granted Shares</span>
          <span className={styles.ribbonValue}>{formatNumber(totalGrantedShares)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Strike Price / FMV</span>
          <span className={styles.ribbonValue}>
            {formatCurrency(strikePrice)} / {formatCurrency(currentFairMarketValue)}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Vested &amp; Exercisable</span>
          <span className={`${styles.ribbonValue} ${styles.vestedHighlight}`}>
            {formatNumber(vestedShares)} ({((vestedShares / (totalGrantedShares || 1)) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Current Intrinsic Value (Pre-tax)</span>
          <span className={`${styles.ribbonValue} ${styles.valuePositive}`}>
            {formatCurrency(totalIntrinsicValue)}
          </span>
        </div>
      </div>

      {/* Grant Schedule Details */}
      <div className={styles.scheduleInfo}>
        <span>Vesting Commencement: <strong>{vestingCommencementDate}</strong></span>
        <span>1-Year Cliff Date: <strong>{cliffDate} ({formatNumber(cliffShares)} shares)</strong></span>
        <span>Unvested Remaining: <strong>{formatNumber(unvestedShares)} shares</strong></span>
      </div>

      {/* Vesting Tranches Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Vesting tranche schedule for grant {grantNumber}
          </caption>
          <thead>
            <tr>
              <th scope="col">Vesting Date</th>
              <th scope="col" className={styles.thNum}>Tranche Shares</th>
              <th scope="col" className={styles.thNum}>Cumulative Vested</th>
              <th scope="col" className={styles.thNum}>% Vested</th>
              <th scope="col" className={styles.thNum}>Tranche Spread Value</th>
              <th scope="col">Vesting Status</th>
            </tr>
          </thead>
          <tbody>
            {tranches.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyCell}>
                  No vesting schedule tranches configured.
                </td>
              </tr>
            ) : (
              tranches.map((t) => (
                <tr key={t.id} className={styles.tableRow}>
                  <td>{t.vestDate}</td>
                  <td className={styles.thNum}>+{formatNumber(t.sharesVesting)}</td>
                  <td className={styles.thNum}>{formatNumber(t.cumulativeVested)}</td>
                  <td className={styles.thNum}>{t.percentVested.toFixed(1)}%</td>
                  <td className={`${styles.thNum} ${styles.spreadText}`}>
                    {formatCurrency(t.sharesVesting * spreadPerShare)}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        t.status === "exercised"
                          ? styles.statusExercised
                          : t.status === "vested"
                          ? styles.statusVested
                          : styles.statusUpcoming
                      }`}
                    >
                      {t.status === "exercised"
                        ? "★ Exercised"
                        : t.status === "vested"
                        ? "✓ Vested"
                        : "⏳ Upcoming"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
