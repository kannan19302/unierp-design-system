import React, { useId, useState } from "react";
import styles from "./cash-drawer-reconciliation-terminal.module.css";

export interface CashRegisterShiftContext {
  shiftId: string; // "SHIFT-2026-0906-A"
  terminalId: string; // "TERM-04"
  cashierName: string; // "Marcus Vance"
  openingFloat: number; // 300.00
  posCashSales: number; // 1420.50
  cashPaidOut: number; // -150.00
}

export interface CashDenominationCounts {
  hundreds: number;
  fifties: number;
  twenties: number;
  tens: number;
  fives: number;
  ones: number;
  quarters: number;
  dimes: number;
  nickels: number;
  pennies: number;
}

export interface CashDrawerReconciliationTerminalProps {
  shiftContext: CashRegisterShiftContext;
  onCommitCloseout?: (result: {
    shiftId: string;
    actualTotal: number;
    expectedTotal: number;
    variance: number;
    reasonCode?: string;
    notes: string;
  }) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CashDrawerReconciliationTerminal: React.FC<CashDrawerReconciliationTerminalProps> = ({
  shiftContext,
  onCommitCloseout,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const reasonSelectId = useId();
  const notesInputId = useId();

  const [counts, setCounts] = useState<CashDenominationCounts>({
    hundreds: 0,
    fifties: 0,
    twenties: 0,
    tens: 0,
    fives: 0,
    ones: 0,
    quarters: 0,
    dimes: 0,
    nickels: 0,
    pennies: 0,
  });

  const [reasonCode, setReasonCode] = useState<string>("NONE");
  const [notes, setNotes] = useState<string>("");
  const [isCommitted, setIsCommitted] = useState<boolean>(false);

  const updateCount = (key: keyof CashDenominationCounts, val: number) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, val || 0),
    }));
  };

  const actualTotal =
    counts.hundreds * 100 +
    counts.fifties * 50 +
    counts.twenties * 20 +
    counts.tens * 10 +
    counts.fives * 5 +
    counts.ones * 1 +
    counts.quarters * 0.25 +
    counts.dimes * 0.1 +
    counts.nickels * 0.05 +
    counts.pennies * 0.01;

  const expectedTotal =
    shiftContext.openingFloat + shiftContext.posCashSales + shiftContext.cashPaidOut;

  const variance = Math.round((actualTotal - expectedTotal) * 100) / 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommitCloseout?.({
      shiftId: shiftContext.shiftId,
      actualTotal,
      expectedTotal,
      variance,
      reasonCode: variance !== 0 ? reasonCode : undefined,
      notes,
    });
    setIsCommitted(true);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.posBadge}>POINT OF SALE TILL OPERATIONS</span>
          <span className={`${styles.statusPill} ${isCommitted ? styles.pillClosed : styles.pillActive}`}>
            {isCommitted ? "SHIFT CLOSED (Z-REPORT DISPATCHED)" : "CLOSEOUT IN PROGRESS"}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            POS Cash Drawer Shift Closeout &amp; Till Count Terminal
          </h2>
          <span className={styles.shiftMeta}>
            Terminal: <strong>{shiftContext.terminalId}</strong> | Shift: <strong>{shiftContext.shiftId}</strong> (
            {shiftContext.cashierName})
          </span>
        </div>
      </header>

      {/* POS System Audit Summary */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Opening Cash Float</span>
          <span className={styles.kpiValue}>{formatCurrency(shiftContext.openingFloat)}</span>
          <span className={styles.kpiSub}>Shift start float</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>POS Net Cash Sales</span>
          <span className={styles.kpiValue}>+{formatCurrency(shiftContext.posCashSales)}</span>
          <span className={styles.kpiSub}>Recorded register orders</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Paid Outs / Cash Drops</span>
          <span className={`${styles.kpiValue} ${styles.valDrop}`}>
            {formatCurrency(shiftContext.cashPaidOut)}
          </span>
          <span className={styles.kpiSub}>Mid-shift safe drops</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Expected Drawer Total</span>
          <span className={styles.kpiValue}>{formatCurrency(expectedTotal)}</span>
          <span className={styles.kpiSub}>Float + Sales - Drops</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContent}>
        <div className={styles.denominationsSection}>
          <h3 className={styles.sectionHeading}>Physical Drawer Currency Breakdown</h3>
          <div className={styles.denomGrid}>
            <div className={styles.column}>
              <h4 className={styles.denomCategory}>Currency Bills</h4>
              {[
                { label: "$100 Bills", key: "hundreds" as const, mult: 100 },
                { label: "$50 Bills", key: "fifties" as const, mult: 50 },
                { label: "$20 Bills", key: "twenties" as const, mult: 20 },
                { label: "$10 Bills", key: "tens" as const, mult: 10 },
                { label: "$5 Bills", key: "fives" as const, mult: 5 },
                { label: "$1 Bills", key: "ones" as const, mult: 1 },
              ].map((d) => {
                const inputId = `denom-${d.key}`;
                return (
                  <div key={d.key} className={styles.denomRow}>
                    <label htmlFor={inputId} className={styles.denomLabel}>
                      {d.label}
                    </label>
                    <input
                      id={inputId}
                      type="number"
                      min="0"
                      className={styles.denomInput}
                      value={counts[d.key] || ""}
                      onChange={(e) => updateCount(d.key, parseInt(e.target.value, 10) || 0)}
                      disabled={isCommitted}
                    />
                    <span className={styles.denomSubtotal}>
                      {formatCurrency(counts[d.key] * d.mult)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={styles.column}>
              <h4 className={styles.denomCategory}>Coins &amp; Rolls</h4>
              {[
                { label: "$0.25 Quarters", key: "quarters" as const, mult: 0.25 },
                { label: "$0.10 Dimes", key: "dimes" as const, mult: 0.1 },
                { label: "$0.05 Nickels", key: "nickels" as const, mult: 0.05 },
                { label: "$0.01 Pennies", key: "pennies" as const, mult: 0.01 },
              ].map((d) => {
                const inputId = `denom-${d.key}`;
                return (
                  <div key={d.key} className={styles.denomRow}>
                    <label htmlFor={inputId} className={styles.denomLabel}>
                      {d.label}
                    </label>
                    <input
                      id={inputId}
                      type="number"
                      min="0"
                      className={styles.denomInput}
                      value={counts[d.key] || ""}
                      onChange={(e) => updateCount(d.key, parseInt(e.target.value, 10) || 0)}
                      disabled={isCommitted}
                    />
                    <span className={styles.denomSubtotal}>
                      {formatCurrency(counts[d.key] * d.mult)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Totals & Variance Banner */}
        <div className={styles.varianceBanner}>
          <div className={styles.varianceItem}>
            <span className={styles.bannerLabel}>Actual Cash Counted:</span>
            <span className={styles.bannerValue}>{formatCurrency(actualTotal)}</span>
          </div>
          <div className={styles.varianceItem}>
            <span className={styles.bannerLabel}>Till Over / Short Variance:</span>
            <span
              className={`${styles.bannerValue} ${
                variance === 0
                  ? styles.varExact
                  : variance > 0
                  ? styles.varOver
                  : styles.varShort
              }`}
            >
              {variance > 0 ? "+" : ""}
              {formatCurrency(variance)}{" "}
              {variance === 0 ? "(BALANCED)" : variance > 0 ? "(OVER)" : "(SHORT)"}
            </span>
          </div>
        </div>

        {/* Over / Short Exception Notes */}
        {variance !== 0 && (
          <div className={styles.exceptionSection}>
            <div className={styles.formGroup}>
              <label htmlFor={reasonSelectId} className={styles.inputLabel}>
                Discrepancy Reason Code:
              </label>
              <select
                id={reasonSelectId}
                className={styles.select}
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
                disabled={isCommitted}
              >
                <option value="NONE">Select explanation...</option>
                <option value="CASHIER_CHANGE_ERROR">Cashier Change Dispense Discrepancy</option>
                <option value="UNRECORDED_PAID_OUT">Unrecorded Petty Cash / Safe Drop</option>
                <option value="COUNTERFEIT_DETECTED">Counterfeit Currency Confiscation</option>
                <option value="TERMINAL_SYNC_DELAY">Offline POS Sync Lag</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor={notesInputId} className={styles.inputLabel}>
                Manager &amp; Cashier Reconciliation Remarks:
              </label>
              <input
                id={notesInputId}
                type="text"
                className={styles.input}
                placeholder="Details regarding shift discrepancy or manager audit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isCommitted}
              />
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() =>
              setCounts({
                hundreds: 0,
                fifties: 0,
                twenties: 0,
                tens: 0,
                fives: 0,
                ones: 0,
                quarters: 0,
                dimes: 0,
                nickels: 0,
                pennies: 0,
              })
            }
            disabled={isCommitted || actualTotal === 0}
            aria-label="Reset denomination inputs to zero"
          >
            Clear Counts
          </button>
          <button
            type="submit"
            className={styles.commitBtn}
            disabled={isCommitted || actualTotal === 0}
            aria-label="Commit drawer reconciliation and generate Z-Report"
          >
            {isCommitted ? "Closeout Finalized" : "Commit Closeout & Finalize Shift"}
          </button>
        </footer>
      </form>
    </section>
  );
};
