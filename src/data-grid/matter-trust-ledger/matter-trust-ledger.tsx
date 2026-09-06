import React, { useId, useMemo } from "react";
import styles from "./matter-trust-ledger.module.css";

export type TrustTransactionType =
  | "retainer_deposit"
  | "disbursement_expense"
  | "earned_fees_transfer"
  | "interest_remittance";

export interface TrustLedgerEntry {
  id: string;
  date: string; // "2026-09-02"
  type: TrustTransactionType;
  payeeOrPayor: string; // "Acme Corp (Client)" or "Apex Expert Witness LLC"
  description: string; // "Initial retainment escrow funding"
  amount: number; // positive for deposit, negative for disbursement/transfer
  runningTrustBalance: number;
  voucherRef: string; // "VCH-TR-8819"
  reconciliationStatus: "cleared" | "pending_transit";
}

export interface MatterTrustLedgerProps {
  matterId: string;
  matterName: string;
  clientName: string;
  minimumRetainerThreshold?: number; // e.g. 10000
  ioltaBankBalance?: number; // e.g. 42500
  entries: TrustLedgerEntry[];
  onRequestDisbursement?: (matterId: string) => void;
  onRequestReplenishment?: (matterId: string, neededAmount: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const MatterTrustLedger: React.FC<MatterTrustLedgerProps> = ({
  matterId,
  matterName,
  clientName,
  minimumRetainerThreshold = 10000,
  ioltaBankBalance,
  entries,
  onRequestDisbursement,
  onRequestReplenishment,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();

  const currentBalance = useMemo(() => {
    if (entries.length === 0) return 0;
    const last = entries[entries.length - 1];
    return last ? last.runningTrustBalance : 0;
  }, [entries]);

  const bankReconciled =
    ioltaBankBalance !== undefined ? ioltaBankBalance === currentBalance : true;

  const isBelowThreshold = currentBalance < minimumRetainerThreshold;
  const replenishmentNeeded = Math.max(0, minimumRetainerThreshold - currentBalance);

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
            ⚖️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.matterBadge}>{matterId}</span>
              <span className={styles.clientTag}>Client: {clientName}</span>
              <span
                className={`${styles.reconBadge} ${
                  bankReconciled ? styles.reconOk : styles.reconMismatch
                }`}
              >
                {bankReconciled ? "✓ IOLTA 3-Way Reconciled" : "⚠️ Reconciliation Variance"}
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Client Trust Accounting Ledger: {matterName}
            </h2>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className={styles.headerActions}>
          {isBelowThreshold && onRequestReplenishment && (
            <button
              type="button"
              className={styles.replenishBtn}
              onClick={() => onRequestReplenishment(matterId, replenishmentNeeded)}
            >
              ⚠️ Request Replenishment ({formatCurrency(replenishmentNeeded)})
            </button>
          )}
          {onRequestDisbursement && (
            <button
              type="button"
              className={styles.disburseBtn}
              onClick={() => onRequestDisbursement(matterId)}
            >
              + Disburse Trust Funds
            </button>
          )}
        </div>
      </header>

      {/* Trust Financial Overview Ribbon */}
      <div className={styles.financialRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Current Trust Escrow Balance</span>
          <span
            className={`${styles.ribbonValue} ${
              isBelowThreshold ? styles.balanceWarning : styles.balanceOk
            }`}
          >
            {formatCurrency(currentBalance)}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Minimum Retainer Threshold</span>
          <span className={styles.ribbonValue}>
            {formatCurrency(minimumRetainerThreshold)}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>IOLTA Bank Statement Balance</span>
          <span className={styles.ribbonValue}>
            {ioltaBankBalance !== undefined ? formatCurrency(ioltaBankBalance) : "Synced"}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Fiduciary Compliance Status</span>
          <span className={styles.complianceTag}>
            ABA Rule 1.15 Segregation Compliant
          </span>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Matter trust accounting transactions ledger for {matterName}
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Voucher #</th>
              <th scope="col">Type</th>
              <th scope="col">Payee / Payor</th>
              <th scope="col">Description</th>
              <th scope="col" className={styles.thNum}>Amount</th>
              <th scope="col" className={styles.thNum}>Trust Balance</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyCell}>
                  No trust transactions recorded for this matter.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className={styles.tableRow}>
                  <td>{entry.date}</td>
                  <td>
                    <code className={styles.voucherCode}>{entry.voucherRef}</code>
                  </td>
                  <td>
                    <span
                      className={`${styles.typeBadge} ${
                        styles[`type_${entry.type}`] || styles.typeDefault
                      }`}
                    >
                      {entry.type.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </td>
                  <td><strong>{entry.payeeOrPayor}</strong></td>
                  <td>{entry.description}</td>
                  <td
                    className={`${styles.thNum} ${
                      entry.amount >= 0 ? styles.depositText : styles.disburseText
                    }`}
                  >
                    {entry.amount >= 0 ? `+${formatCurrency(entry.amount)}` : formatCurrency(entry.amount)}
                  </td>
                  <td className={`${styles.thNum} ${styles.balanceCell}`}>
                    {formatCurrency(entry.runningTrustBalance)}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        entry.reconciliationStatus === "cleared"
                          ? styles.statusCleared
                          : styles.statusTransit
                      }`}
                    >
                      {entry.reconciliationStatus === "cleared" ? "✓ Cleared" : "⏳ In Transit"}
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
