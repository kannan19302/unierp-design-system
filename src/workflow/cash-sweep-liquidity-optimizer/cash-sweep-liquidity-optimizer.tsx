import React, { useId, useState } from "react";
import styles from "./cash-sweep-liquidity-optimizer.module.css";

export type SweepDirection = "SWEEP_IN" | "SWEEP_OUT" | "OPTIMAL";

export interface TreasuryAccountNode {
  id: string;
  accountName: string;
  accountNumberMask: string; // "•••• 8921"
  accountType: "OPERATING" | "CONCENTRATION" | "HIGH_YIELD_SWEEP" | "PAYROLL_RESERVE";
  currency: string;
  currentBalance: number;
  targetFloorBalance: number;
  apyRate: number; // e.g. 5.15 for 5.15%
}

export interface CashSweepLiquidityOptimizerProps {
  accounts: TreasuryAccountNode[];
  masterPoolAccountId?: string;
  onExecuteBatchSweep?: (transfers: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
  }[]) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CashSweepLiquidityOptimizer: React.FC<CashSweepLiquidityOptimizerProps> = ({
  accounts,
  masterPoolAccountId,
  onExecuteBatchSweep,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [isExecuted, setIsExecuted] = useState<boolean>(false);
  const [autoSweepEnabled, setAutoSweepEnabled] = useState<boolean>(true);

  // Find concentration master or default to first
  const masterAccount =
    accounts.find((a) => a.id === masterPoolAccountId) ??
    accounts.find((a) => a.accountType === "CONCENTRATION") ??
    accounts[0];

  // Calculate sweep proposals
  const sweepCalculations = accounts.map((acc) => {
    const variance = acc.currentBalance - acc.targetFloorBalance;
    let direction: SweepDirection = "OPTIMAL";
    let proposedTransfer = 0;

    if (acc.id !== masterAccount?.id) {
      if (variance > 0) {
        direction = "SWEEP_OUT"; // Excess transferred to master/sweep pool
        proposedTransfer = variance;
      } else if (variance < 0) {
        direction = "SWEEP_IN"; // Deficit replenished from master pool
        proposedTransfer = Math.abs(variance);
      }
    }

    return {
      ...acc,
      variance,
      direction,
      proposedTransfer,
    };
  });

  const totalLiquidity = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalExcess = sweepCalculations
    .filter((a) => a.direction === "SWEEP_OUT")
    .reduce((sum, a) => sum + a.proposedTransfer, 0);
  const totalDeficit = sweepCalculations
    .filter((a) => a.direction === "SWEEP_IN")
    .reduce((sum, a) => sum + a.proposedTransfer, 0);
  const estimatedAnnualYield = accounts.reduce((acc, a) => {
    return acc + (a.currentBalance * (a.apyRate / 100));
  }, 0);

  const handleExecute = () => {
    if (!masterAccount) return;
    const transfers: { fromAccountId: string; toAccountId: string; amount: number }[] = [];

    sweepCalculations.forEach((item) => {
      if (item.id === masterAccount.id) return;
      if (item.direction === "SWEEP_OUT" && item.proposedTransfer > 0) {
        transfers.push({
          fromAccountId: item.id,
          toAccountId: masterAccount.id,
          amount: item.proposedTransfer,
        });
      } else if (item.direction === "SWEEP_IN" && item.proposedTransfer > 0) {
        transfers.push({
          fromAccountId: masterAccount.id,
          toAccountId: item.id,
          amount: item.proposedTransfer,
        });
      }
    });

    onExecuteBatchSweep?.(transfers);
    setIsExecuted(true);
  };

  const formatCurrency = (val: number, cur = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.treasuryBadge}>TREASURY LIQUIDITY POOL</span>
          <span className={`${styles.statusPill} ${isExecuted ? styles.pillExecuted : styles.pillPending}`}>
            {isExecuted ? "TRANSFERS DISPATCHED" : "REBALANCE PROPOSAL READY"}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Multi-Tier Cash Sweep & ZBA Liquidity Optimizer
          </h2>
          <label className={styles.autoSweepToggle}>
            <input
              type="checkbox"
              checked={autoSweepEnabled}
              onChange={(e) => setAutoSweepEnabled(e.target.checked)}
              className={styles.toggleCheckbox}
            />
            <span className={styles.toggleText}>Automated End-of-Day Sweep (17:00 EST)</span>
          </label>
        </div>
      </header>

      {/* Metrics Banner */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Pool Liquidity</span>
          <span className={styles.kpiValue}>{formatCurrency(totalLiquidity)}</span>
          <span className={styles.kpiSub}>{accounts.length} linked treasury nodes</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Surplus Sweep Volume</span>
          <span className={`${styles.kpiValue} ${styles.valSurplus}`}>
            +{formatCurrency(totalExcess)}
          </span>
          <span className={styles.kpiSub}>To Concentration / High-Yield</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Deficit Replenishment</span>
          <span className={`${styles.kpiValue} ${styles.valDeficit}`}>
            -{formatCurrency(totalDeficit)}
          </span>
          <span className={styles.kpiSub}>Required to meet target floors</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Est. Annual Yield</span>
          <span className={styles.kpiValue}>{formatCurrency(estimatedAnnualYield)}</span>
          <span className={styles.kpiSub}>Blended pool APY return</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Treasury accounts sweep allocation schedule">
          <thead>
            <tr>
              <th scope="col">Account Node</th>
              <th scope="col">Type & APY</th>
              <th scope="col">Current Balance</th>
              <th scope="col">Target Floor</th>
              <th scope="col">Variance</th>
              <th scope="col">Sweep Direction</th>
              <th scope="col">Proposed Transfer</th>
            </tr>
          </thead>
          <tbody>
            {sweepCalculations.map((acc) => (
              <tr key={acc.id} className={acc.id === masterAccount?.id ? styles.masterRow : ""}>
                <td>
                  <div className={styles.accountCell}>
                    <span className={styles.accName}>{acc.accountName}</span>
                    <span className={styles.accNumber}>{acc.accountNumberMask}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.typeBadge}>
                    <span>{acc.accountType.replace(/_/g, " ")}</span>
                    <span className={styles.apyText}>{acc.apyRate > 0 ? `${acc.apyRate}% APY` : "0.0%"}</span>
                  </div>
                </td>
                <td className={styles.numCell}>{formatCurrency(acc.currentBalance, acc.currency)}</td>
                <td className={styles.numCell}>{formatCurrency(acc.targetFloorBalance, acc.currency)}</td>
                <td className={styles.numCell}>
                  <span
                    className={
                      acc.variance > 0
                        ? styles.textPositive
                        : acc.variance < 0
                        ? styles.textNegative
                        : styles.textNeutral
                    }
                  >
                    {acc.variance > 0 ? "+" : ""}
                    {formatCurrency(acc.variance, acc.currency)}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.directionPill} ${
                      acc.direction === "SWEEP_OUT"
                        ? styles.dirSweepOut
                        : acc.direction === "SWEEP_IN"
                        ? styles.dirSweepIn
                        : styles.dirOptimal
                    }`}
                  >
                    {acc.id === masterAccount?.id
                      ? "POOL HUB"
                      : acc.direction === "SWEEP_OUT"
                      ? "↑ SWEEP TO HUB"
                      : acc.direction === "SWEEP_IN"
                      ? "↓ FUND FROM HUB"
                      : "✓ TARGET MET"}
                  </span>
                </td>
                <td className={`${styles.numCell} ${styles.transferCell}`}>
                  {acc.id === masterAccount?.id ? (
                    <span className={styles.hubCell}>Concentration Pool</span>
                  ) : acc.proposedTransfer > 0 ? (
                    formatCurrency(acc.proposedTransfer, acc.currency)
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerNotice}>
          <span>
            {isExecuted
              ? "All pending Zero-Balance Account (ZBA) sweeps have been dispatched for settlement."
              : "Review planned rebalancing. Execution triggers NACHA ACH / Fedwire automated sweep instructions."}
          </span>
        </div>
        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.executeBtn}
            onClick={handleExecute}
            disabled={isExecuted || sweepCalculations.every((a) => a.proposedTransfer === 0)}
            aria-label="Authorize and execute cash sweep transfers"
          >
            {isExecuted ? "Sweeps Transferred" : "Authorize Batch Rebalance"}
          </button>
        </div>
      </footer>
    </section>
  );
};
