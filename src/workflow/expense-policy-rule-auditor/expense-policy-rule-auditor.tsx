import React, { useId, useState } from "react";
import styles from "./expense-policy-rule-auditor.module.css";

export type PolicyViolationSeverity = "info" | "warning" | "violation_block";

export interface PolicyRuleAuditCheck {
  id: string;
  ruleName: string; // e.g. "Per Diem Lodging Maximum ($250/night)"
  passed: boolean;
  severity: PolicyViolationSeverity;
  observedValue: string; // e.g. "$385.00/night"
  policyLimit: string; // "$250.00/night"
  message: string;
}

export interface ExpenseTransactionAuditItem {
  id: string;
  cardHolderName: string; // "Elena Rostova"
  department: string; // "Product Engineering"
  merchantName: string; // "Grand Hyatt San Francisco"
  mccCode: string; // "3501 - Hotels/Motels"
  transactionDate: string; // "2026-09-04"
  amount: number;
  currency: string;
  receiptAttached: boolean;
  receiptOcrConfidencePct: number; // e.g. 98%
  receiptImageUrl?: string;
  status: "pending_review" | "policy_approved" | "manager_override_required" | "rejected";
  ruleChecks: PolicyRuleAuditCheck[];
}

export interface ExpensePolicyRuleAuditorProps {
  transaction: ExpenseTransactionAuditItem;
  onApprove?: (transactionId: string) => void;
  onOverride?: (transactionId: string, justification: string) => void;
  onReject?: (transactionId: string, rejectionReason: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ExpensePolicyRuleAuditor: React.FC<ExpensePolicyRuleAuditorProps> = ({
  transaction,
  onApprove,
  onOverride,
  onReject,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [justification, setJustification] = useState<string>("");
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(
    transaction.status === "policy_approved"
  );

  const hasBlockingViolations = transaction.ruleChecks.some(
    (c) => !c.passed && c.severity === "violation_block"
  );

  const hasWarnings = transaction.ruleChecks.some(
    (c) => !c.passed && c.severity === "warning"
  );

  const handleApprove = () => {
    setIsApproved(true);
    onApprove?.(transaction.id);
  };

  const handleOverrideSubmit = () => {
    if (!justification.trim()) return;
    setIsOverridden(true);
    onOverride?.(transaction.id, justification.trim());
  };

  const handleRejectSubmit = () => {
    setIsRejected(true);
    onReject?.(transaction.id, justification.trim() || "Policy non-compliance");
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: transaction.currency || "USD",
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
            💳
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.txIdBadge}>{transaction.id}</span>
              <span className={styles.deptTag}>{transaction.department}</span>
              <span className={styles.dateTag}>{transaction.transactionDate}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Corporate Spend &amp; Expense Policy Rule Auditor
            </h2>
          </div>
        </div>

        <div className={styles.amountWrap}>
          <span className={styles.amountLabel}>Total Charged</span>
          <span className={styles.amountValue}>{formatCurrency(transaction.amount)}</span>
        </div>
      </header>

      {/* Main Dual Workspace: Left Transaction & Receipt, Right Policy Checklist */}
      <div className={styles.gridContainer}>
        {/* Left Column: Transaction Details & Receipt Preview */}
        <div className={styles.detailsPane}>
          <h3 className={styles.sectionHeading}>Transaction Evidence &amp; Cardholder</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <span className={styles.fieldLabel}>Cardholder</span>
              <span className={styles.fieldValue}>{transaction.cardHolderName}</span>
            </div>
            <div className={styles.infoField}>
              <span className={styles.fieldLabel}>Merchant</span>
              <span className={styles.fieldValue}>{transaction.merchantName}</span>
            </div>
            <div className={styles.infoField}>
              <span className={styles.fieldLabel}>Merchant Category Code (MCC)</span>
              <span className={styles.fieldValueCode}>{transaction.mccCode}</span>
            </div>
            <div className={styles.infoField}>
              <span className={styles.fieldLabel}>Receipt Verification</span>
              <span
                className={`${styles.receiptBadge} ${
                  transaction.receiptAttached ? styles.receiptOk : styles.receiptMissing
                }`}
              >
                {transaction.receiptAttached
                  ? `✓ Attached (OCR ${transaction.receiptOcrConfidencePct}% match)`
                  : "⛔ Missing Receipt"}
              </span>
            </div>
          </div>

          {/* Receipt Mock Artifact Viewer */}
          <div className={styles.receiptPreviewBox}>
            <div className={styles.receiptHeaderBar}>
              <span>Digital Receipt Document</span>
              <span className={styles.mimeTag}>PDF / OCR VERIFIED</span>
            </div>
            <div className={styles.receiptDocContent}>
              <p className={styles.receiptDocMerchant}>{transaction.merchantName.toUpperCase()}</p>
              <p className={styles.receiptDocLine}>Date: {transaction.transactionDate}</p>
              <p className={styles.receiptDocLine}>Card ending: **** 4092</p>
              <div className={styles.receiptDivider} />
              <div className={styles.receiptTotalRow}>
                <span>TOTAL PAID</span>
                <span>{formatCurrency(transaction.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Policy Rules Evaluation & Action */}
        <div className={styles.policyPane}>
          <div className={styles.policyHeader}>
            <h3 className={styles.sectionHeading}>Automated Policy Guardrail Check</h3>
            <span
              className={`${styles.complianceStatus} ${
                hasBlockingViolations
                  ? styles.statusBlocked
                  : hasWarnings
                  ? styles.statusWarning
                  : styles.statusCompliant
              }`}
            >
              {hasBlockingViolations
                ? "⛔ BLOCKING VIOLATION"
                : hasWarnings
                ? "⚠️ WARNING EXCEPTION"
                : "✓ FULLY COMPLIANT"}
            </span>
          </div>

          {/* Rules Evaluation List */}
          <div className={styles.rulesList}>
            {transaction.ruleChecks.map((check) => (
              <div
                key={check.id}
                className={`${styles.ruleCard} ${
                  check.passed
                    ? styles.ruleCardPass
                    : check.severity === "violation_block"
                    ? styles.ruleCardFail
                    : styles.ruleCardWarn
                }`}
              >
                <div className={styles.ruleCardHeader}>
                  <span className={styles.ruleIcon} aria-hidden="true">
                    {check.passed ? "✓" : check.severity === "violation_block" ? "⛔" : "⚠️"}
                  </span>
                  <h4 className={styles.ruleTitle}>{check.ruleName}</h4>
                  <span className={styles.severityTag}>
                    {check.passed ? "PASS" : check.severity.toUpperCase()}
                  </span>
                </div>
                <p className={styles.ruleMessage}>{check.message}</p>
                <div className={styles.ruleMetricDiff}>
                  <span>Limit: <strong>{check.policyLimit}</strong></span>
                  <span>Observed: <strong>{check.observedValue}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Zone: Manager Override vs Instant Approval */}
          <div className={styles.actionFooter}>
            {hasBlockingViolations || hasWarnings ? (
              <div className={styles.overrideBox}>
                <label htmlFor={`${headingId}-justification`} className={styles.overrideLabel}>
                  Manager Exception Override Justification (Mandatory):
                </label>
                <textarea
                  id={`${headingId}-justification`}
                  rows={2}
                  placeholder="Detail client entertainment purpose, emergency travel justification..."
                  className={styles.overrideTextarea}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
                <div className={styles.overrideBtnGroup}>
                  <button
                    type="button"
                    className={styles.overrideBtn}
                    disabled={!justification.trim() || isOverridden || isRejected}
                    onClick={handleOverrideSubmit}
                  >
                    {isOverridden ? "✓ Exception Override Granted" : "Authorize Policy Override"}
                  </button>
                  <button
                    type="button"
                    className={styles.rejectBtn}
                    disabled={isRejected || isOverridden}
                    onClick={handleRejectSubmit}
                  >
                    {isRejected ? "✓ Expense Rejected" : "Decline & Flag Cardholder"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.approveBtn}
                disabled={isApproved}
                onClick={handleApprove}
              >
                {isApproved ? "✓ Expense Policy Approved" : "Approve & Release to Ledger"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
