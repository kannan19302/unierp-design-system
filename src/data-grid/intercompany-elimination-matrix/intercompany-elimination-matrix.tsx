import React, { useId, useState, useMemo } from "react";
import styles from "./intercompany-elimination-matrix.module.css";

export type IntercompanyTransactionType =
  | "trade_ar_ap"
  | "intercompany_loan"
  | "management_fee"
  | "royalty_license"
  | "equity_investment";

export type EliminationStatus = "matched" | "variance" | "eliminated" | "flagged";

export interface IntercompanyPairLine {
  id: string;
  sourceEntity: string; // e.g. "US-HoldCo Inc (1000)"
  sourceAccount: string; // "11200 - Due from UK Sub"
  sourceAmount: number;
  sourceCurrency: string;
  targetEntity: string; // e.g. "UK-OpCo Ltd (2000)"
  targetAccount: string; // "21200 - Due to US HoldCo"
  targetAmount: number;
  targetCurrency: string;
  fxRateUsed: number;
  varianceBaseCurrency: number; // discrepancy in consolidated reporting currency (USD)
  transactionType: IntercompanyTransactionType;
  status: EliminationStatus;
  eliminationVoucherRef?: string;
}

export interface IntercompanyEliminationMatrixProps {
  consolidationPeriod?: string; // e.g. "FY2026-M09 Close"
  reportingCurrency?: string; // "USD"
  lines: IntercompanyPairLine[];
  onEliminatePairs?: (selectedIds: string[]) => void;
  onFlagDiscrepancy?: (lineId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const IntercompanyEliminationMatrix: React.FC<IntercompanyEliminationMatrixProps> = ({
  consolidationPeriod = "FY2026-M09 (September Period Close)",
  reportingCurrency = "USD",
  lines: initialLines,
  onEliminatePairs,
  onFlagDiscrepancy,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [lines, setLines] = useState<IntercompanyPairLine[]>(initialLines);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLines = useMemo(() => {
    if (filterType === "all") return lines;
    return lines.filter((line) => line.transactionType === filterType);
  }, [lines, filterType]);

  const totals = useMemo(() => {
    let sourceSum = 0;
    let targetSum = 0;
    let varianceSum = 0;
    let matchedCount = 0;
    let varianceCount = 0;

    filteredLines.forEach((line) => {
      sourceSum += line.sourceAmount;
      targetSum += line.targetAmount * line.fxRateUsed;
      varianceSum += Math.abs(line.varianceBaseCurrency);
      if (line.status === "matched" || line.status === "eliminated") {
        matchedCount++;
      } else {
        varianceCount++;
      }
    });

    return { sourceSum, targetSum, varianceSum, matchedCount, varianceCount };
  }, [filteredLines]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredLines.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleBatchEliminate = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setLines((prev) =>
      prev.map((line) => {
        if (selectedIds.has(line.id) && line.status === "matched") {
          return {
            ...line,
            status: "eliminated" as EliminationStatus,
            eliminationVoucherRef: `ELIM-${Date.now().toString().slice(-4)}`,
          };
        }
        return line;
      })
    );
    setSelectedIds(new Set());
    onEliminatePairs?.(ids);
  };

  const formatCurrency = (val: number, cur = reportingCurrency) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
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
            ⚖️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.periodTag}>{consolidationPeriod}</span>
              <span className={styles.currencyTag}>Consolidation Base: {reportingCurrency}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Intercompany Balance Elimination &amp; Reconciliation Matrix
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.eliminateBtn}
            disabled={selectedIds.size === 0}
            onClick={handleBatchEliminate}
          >
            ⚡ Generate Elimination Entries ({selectedIds.size})
          </button>
        </div>
      </header>

      {/* KPI Telemetry Ribbon */}
      <div className={styles.telemetryRibbon}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Originating Claims</span>
          <span className={styles.kpiValue}>{formatCurrency(totals.sourceSum)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Target Counterparty Claims</span>
          <span className={styles.kpiValue}>{formatCurrency(totals.targetSum)}</span>
        </div>
        <div className={`${styles.kpiCard} ${totals.varianceSum > 0 ? styles.kpiCardWarning : ""}`}>
          <span className={styles.kpiLabel}>Netting Discrepancy Variance</span>
          <span className={styles.kpiValue}>{formatCurrency(totals.varianceSum)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Elimination Status</span>
          <span className={styles.kpiMeta}>
            {totals.matchedCount} Matched / {totals.varianceCount} Discrepancies
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={styles.filterToolbar}>
        <div className={styles.filterGroup}>
          <label htmlFor={`${headingId}-type-filter`} className={styles.filterLabel}>
            Transaction Type:
          </label>
          <select
            id={`${headingId}-type-filter`}
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Intercompany Categories</option>
            <option value="trade_ar_ap">Trade AR / AP Settlement</option>
            <option value="intercompany_loan">Intercompany Loans &amp; Interest</option>
            <option value="management_fee">Management Service Fees</option>
            <option value="royalty_license">IP Royalty &amp; Licenses</option>
            <option value="equity_investment">Parent-Sub Equity</option>
          </select>
        </div>
      </div>

      {/* Reconciliation Matrix Table */}
      <div className={styles.tableScrollWrap}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th scope="col" className={styles.checkTh}>
                <input
                  type="checkbox"
                  aria-label="Select all intercompany lines"
                  checked={
                    filteredLines.length > 0 && selectedIds.size === filteredLines.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th scope="col">Type</th>
              <th scope="col">Source Entity (Asset / AR)</th>
              <th scope="col" className={styles.numTh}>Source Amount</th>
              <th scope="col">Target Entity (Liability / AP)</th>
              <th scope="col" className={styles.numTh}>Target Amount</th>
              <th scope="col" className={styles.numTh}>FX Rate</th>
              <th scope="col" className={styles.numTh}>Variance ({reportingCurrency})</th>
              <th scope="col">Status</th>
              <th scope="col"><span className={styles.srOnly}>Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredLines.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.emptyCell}>
                  No intercompany transactions found for this period filter.
                </td>
              </tr>
            ) : (
              filteredLines.map((line) => {
                const isSelected = selectedIds.has(line.id);
                const hasVariance = line.varianceBaseCurrency !== 0;

                return (
                  <tr
                    key={line.id}
                    className={`${styles.tableRow} ${isSelected ? styles.rowSelected : ""}`}
                  >
                    <td className={styles.checkTd}>
                      <input
                        type="checkbox"
                        aria-label={`Select pair ${line.sourceEntity} and ${line.targetEntity}`}
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(line.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <span className={styles.typeBadge}>
                        {line.transactionType.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className={styles.entityWrap}>
                        <span className={styles.entityName}>{line.sourceEntity}</span>
                        <span className={styles.accountCode}>{line.sourceAccount}</span>
                      </div>
                    </td>
                    <td className={styles.numTd}>
                      {formatCurrency(line.sourceAmount, line.sourceCurrency)}
                    </td>
                    <td>
                      <div className={styles.entityWrap}>
                        <span className={styles.entityName}>{line.targetEntity}</span>
                        <span className={styles.accountCode}>{line.targetAccount}</span>
                      </div>
                    </td>
                    <td className={styles.numTd}>
                      {formatCurrency(line.targetAmount, line.targetCurrency)}
                    </td>
                    <td className={styles.numTd}>{line.fxRateUsed.toFixed(4)}</td>
                    <td
                      className={`${styles.numTd} ${
                        hasVariance ? styles.varianceAlertText : styles.matchedText
                      }`}
                    >
                      {formatCurrency(line.varianceBaseCurrency)}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          line.status === "eliminated"
                            ? styles.statusEliminated
                            : line.status === "matched"
                            ? styles.statusMatched
                            : styles.statusVariance
                        }`}
                      >
                        {line.status === "eliminated"
                          ? `✓ ELIMINATED (${line.eliminationVoucherRef || "POSTED"})`
                          : line.status === "matched"
                          ? "✓ RECONCILED"
                          : "⚠️ VARIANCE DETECTED"}
                      </span>
                    </td>
                    <td>
                      {hasVariance && (
                        <button
                          type="button"
                          className={styles.discrepancyBtn}
                          onClick={() => onFlagDiscrepancy?.(line.id)}
                          aria-label={`Flag variance for ${line.sourceEntity}`}
                        >
                          Dispute
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
