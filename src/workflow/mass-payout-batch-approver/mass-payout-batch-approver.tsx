import React, { useId, useState } from "react";
import styles from "./mass-payout-batch-approver.module.css";

export type PaymentRailType = "ACH" | "SEPA" | "SWIFT" | "LOCAL_RAIL";
export type SanctionScreeningStatus = "passed" | "flagged" | "pending";

export interface PayoutBatchLine {
  id: string;
  recipientName: string; // "Liam O'Connor"
  country: string; // "Ireland (IE)"
  currency: string; // "EUR"
  payoutAmount: number; // 4500.00
  usdEquivalent: number; // 4860.00
  rail: PaymentRailType;
  ofacScreeningStatus: SanctionScreeningStatus;
  bankAccountLast4: string; // "4401"
}

export interface MassPayoutBatchApproverProps {
  batchId: string; // "PAY-2026-0906-US"
  batchTitle?: string;
  settlementDate: string;
  totalPayees: number;
  totalGrossAmount: number;
  reportingCurrency?: string;
  fxRateLockSecondsRemaining?: number; // e.g. 120
  items: PayoutBatchLine[];
  onAuthorizeBatch?: (batchId: string, approvalToken: string) => void;
  onRefreshFxRates?: (batchId: string) => void;
  onExcludeRecipient?: (batchId: string, lineId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const MassPayoutBatchApprover: React.FC<MassPayoutBatchApproverProps> = ({
  batchId,
  batchTitle = "Global Contractor & Supplier Mass Payout Batch",
  settlementDate,
  totalPayees,
  totalGrossAmount,
  reportingCurrency = "USD",
  fxRateLockSecondsRemaining = 180,
  items,
  onAuthorizeBatch,
  onRefreshFxRates,
  onExcludeRecipient,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [tokenInput, setTokenInput] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const flaggedCount = items.filter((i) => i.ofacScreeningStatus === "flagged").length;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput || flaggedCount > 0) return;
    setIsAuthorized(true);
    onAuthorizeBatch?.(batchId, tokenInput);
  };

  const formatCurrency = (val: number, curr = reportingCurrency) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
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
            💸
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.batchBadge}>{batchId}</span>
              <span className={styles.settleDate}>Settlement: {settlementDate}</span>
              {isAuthorized ? (
                <span className={styles.authorizedBadge}>● Payout Authorized</span>
              ) : (
                <span className={styles.pendingBadge}>● Dual-Approval Required</span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>
              {batchTitle}
            </h2>
          </div>
        </div>

        {/* FX Rate Lock Timer & Refresh */}
        <div className={styles.fxTimerBox}>
          <span className={styles.fxLabel}>Live FX Rate Lock:</span>
          <span className={styles.fxTimer}>
            ⏱️ {Math.floor(fxRateLockSecondsRemaining / 60)}:
            {String(fxRateLockSecondsRemaining % 60).padStart(2, "0")} remaining
          </span>
          {onRefreshFxRates && (
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={() => onRefreshFxRates(batchId)}
            >
              ↻ Refresh Rates
            </button>
          )}
        </div>
      </header>

      {/* Financial Summary Ribbon */}
      <div className={styles.summaryRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Total Recipients</span>
          <span className={styles.ribbonValue}>{totalPayees}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Gross Batch Volume</span>
          <span className={styles.ribbonValue}>{formatCurrency(totalGrossAmount)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Sanctions Compliance</span>
          <span
            className={`${styles.ribbonValue} ${
              flaggedCount > 0 ? styles.ofacFlagged : styles.ofacPassed
            }`}
          >
            {flaggedCount > 0
              ? `⛔ ${flaggedCount} Flagged Payees (Action Required)`
              : "✓ All 142 Payees OFAC Cleared"}
          </span>
        </div>
      </div>

      {/* Recipients List Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Beneficiary payout distribution for batch {batchId}
          </caption>
          <thead>
            <tr>
              <th scope="col">Recipient / Beneficiary</th>
              <th scope="col">Country</th>
              <th scope="col">Payout Rail</th>
              <th scope="col">Account (Last 4)</th>
              <th scope="col" className={styles.thNum}>Local Currency Amount</th>
              <th scope="col" className={styles.thNum}>USD Equivalent</th>
              <th scope="col">OFAC Screening</th>
              <th scope="col" className={styles.thAction}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyCell}>
                  No payout lines in this batch.
                </td>
              </tr>
            ) : (
              items.map((line) => (
                <tr key={line.id} className={styles.tableRow}>
                  <td><strong>{line.recipientName}</strong></td>
                  <td>{line.country}</td>
                  <td>
                    <span className={styles.railBadge}>{line.rail}</span>
                  </td>
                  <td>
                    <code className={styles.accountCode}>••••{line.bankAccountLast4}</code>
                  </td>
                  <td className={styles.thNum}>
                    {formatCurrency(line.payoutAmount, line.currency)}
                  </td>
                  <td className={`${styles.thNum} ${styles.usdAmount}`}>
                    {formatCurrency(line.usdEquivalent, "USD")}
                  </td>
                  <td>
                    <span
                      className={`${styles.screeningBadge} ${
                        line.ofacScreeningStatus === "passed"
                          ? styles.screenPassed
                          : line.ofacScreeningStatus === "flagged"
                          ? styles.screenFlagged
                          : styles.screenPending
                      }`}
                    >
                      {line.ofacScreeningStatus === "passed"
                        ? "✓ Cleared"
                        : line.ofacScreeningStatus === "flagged"
                        ? "⛔ Sanctions Hold"
                        : "⏳ Pending"}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    {onExcludeRecipient && (
                      <button
                        type="button"
                        className={styles.excludeBtn}
                        onClick={() => onExcludeRecipient(batchId, line.id)}
                        aria-label={`Exclude ${line.recipientName} from batch`}
                      >
                        ✕ Exclude
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dual Authorization Sign-Off Box */}
      <footer className={styles.authFooter}>
        <form className={styles.authForm} onSubmit={handleAuthorize}>
          <div className={styles.authPrompt}>
            <span className={styles.authTitle}>Dual-Custody Authorization:</span>
            <span className={styles.authSub}>
              Enter hardware security token or authenticator PIN to release funds.
            </span>
          </div>

          <div className={styles.authControls}>
            <label htmlFor={`token-${headingId}`} className={styles.srOnly}>
              Approval Token PIN
            </label>
            <input
              id={`token-${headingId}`}
              type="password"
              placeholder="Enter 6-digit MFA Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className={styles.tokenInput}
              disabled={isAuthorized || flaggedCount > 0}
              maxLength={8}
              required
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!tokenInput || isAuthorized || flaggedCount > 0}
            >
              {isAuthorized ? "✓ Authorized" : "Authorize & Release Payout"}
            </button>
          </div>
        </form>
      </footer>
    </section>
  );
};
