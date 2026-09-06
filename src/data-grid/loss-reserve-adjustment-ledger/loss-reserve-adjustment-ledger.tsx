import React, { useId, useState, useMemo } from "react";
import styles from "./loss-reserve-adjustment-ledger.module.css";

export type ReserveBucket = "indemnity" | "medical" | "expense_dcc" | "expense_ao";

export interface ReserveAdjustmentRecord {
  id: string;
  transactionDate: string; // "2026-09-02"
  bucket: ReserveBucket;
  priorReserve: number;
  adjustedAmount: number; // positive = increase, negative = decrease
  newReserve: number;
  adjusterName: string;
  adjusterNpn: string; // National Producer Number / Adjuster ID
  reasonCode: string; // "REVAL_LEGAL_EXPOSURE", "MED_SURGERY_APPROVAL", etc.
  requiresSupervisorSignoff: boolean;
  isSignedOff?: boolean;
}

export interface ClaimFinancialSummary {
  claimNumber: string; // "CLM-2026-88190"
  policyNumber: string; // "POL-GL-99401"
  insuredName: string; // "Apex Industrial Logistics Corp"
  dateOfLoss: string; // "2026-06-14"
  claimantName: string; // "Robert Miller"
  totalIncurred: number;
  totalPaid: number;
  totalOutstandingReserve: number;
  adjusterAuthorityLimit: number; // e.g. 50000 USD
}

export interface LossReserveAdjustmentLedgerProps {
  claim: ClaimFinancialSummary;
  initialAdjustments?: ReserveAdjustmentRecord[];
  onAddAdjustment?: (adjustment: Omit<ReserveAdjustmentRecord, "id" | "newReserve">) => void;
  onApproveSupervisorSignoff?: (adjustmentId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const LossReserveAdjustmentLedger: React.FC<LossReserveAdjustmentLedgerProps> = ({
  claim,
  initialAdjustments = [],
  onAddAdjustment,
  onApproveSupervisorSignoff,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [adjustments, setAdjustments] = useState<ReserveAdjustmentRecord[]>(initialAdjustments);

  // Form input state
  const [bucket, setBucket] = useState<ReserveBucket>("indemnity");
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>("");
  const [reasonCode, setReasonCode] = useState<string>("REVAL_NEW_EVIDENCE");
  const [notes, setNotes] = useState<string>("");

  const currentBucketReserve = useMemo(() => {
    const bucketAdj = adjustments.filter((a) => a.bucket === bucket);
    if (bucketAdj.length === 0) return 25000; // baseline default
    return bucketAdj[bucketAdj.length - 1]?.newReserve ?? 25000;
  }, [adjustments, bucket]);

  const handlePostAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(adjustmentAmount);
    if (isNaN(amountNum) || amountNum === 0) return;

    const newRes = Math.max(0, currentBucketReserve + amountNum);
    const requiresSignoff = newRes > claim.adjusterAuthorityLimit;

    const newRecord: ReserveAdjustmentRecord = {
      id: `adj-${Date.now()}`,
      transactionDate: new Date().toISOString().split("T")[0] ?? "2026-09-06",
      bucket,

      priorReserve: currentBucketReserve,
      adjustedAmount: amountNum,
      newReserve: newRes,
      adjusterName: "Marcus Thorne",
      adjusterNpn: "NPN-9941029",
      reasonCode,
      requiresSupervisorSignoff: requiresSignoff,
      isSignedOff: !requiresSignoff,
    };

    setAdjustments([...adjustments, newRecord]);
    setAdjustmentAmount("");
    setNotes("");

    onAddAdjustment?.({
      transactionDate: newRecord.transactionDate,
      bucket: newRecord.bucket,
      priorReserve: newRecord.priorReserve,
      adjustedAmount: newRecord.adjustedAmount,
      adjusterName: newRecord.adjusterName,
      adjusterNpn: newRecord.adjusterNpn,
      reasonCode: newRecord.reasonCode,
      requiresSupervisorSignoff: newRecord.requiresSupervisorSignoff,
    });
  };

  const handleSignoff = (id: string) => {
    setAdjustments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isSignedOff: true } : a))
    );
    onApproveSupervisorSignoff?.(id);
  };

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
      {/* Claim Summary Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            🛡️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.claimBadge}>{claim.claimNumber}</span>
              <span className={styles.policyTag}>Policy: {claim.policyNumber}</span>
              <span className={styles.lossDateTag}>Loss Date: {claim.dateOfLoss}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Statutory Loss Reserve &amp; Incurred Adjustment Ledger
            </h2>
            <div className={styles.insuredRow}>
              <span>Insured: <strong>{claim.insuredName}</strong></span>
              <span>•</span>
              <span>Claimant: <strong>{claim.claimantName}</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Financial Exposure KPI Strip */}
      <div className={styles.exposureStrip}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Incurred Loss</span>
          <span className={styles.kpiValue}>{formatCurrency(claim.totalIncurred)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Cumulative Paid Loss</span>
          <span className={styles.kpiValue}>{formatCurrency(claim.totalPaid)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Outstanding Reserve</span>
          <span className={`${styles.kpiValue} ${styles.reserveValue}`}>
            {formatCurrency(claim.totalOutstandingReserve)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Adjuster Authority Limit</span>
          <span className={styles.kpiValue}>{formatCurrency(claim.adjusterAuthorityLimit)}</span>
        </div>
      </div>

      {/* Dual Workspace: Left Adjustment Form, Right Historical Ledger */}
      <div className={styles.workspaceGrid}>
        {/* Post Adjustment Panel */}
        <div className={styles.formPane}>
          <h3 className={styles.paneTitle}>Post Reserve Adjustment</h3>
          <form className={styles.adjForm} onSubmit={handlePostAdjustment}>
            <div className={styles.formRow}>
              <label htmlFor={`${headingId}-bucket`} className={styles.label}>
                Reserve Exposure Bucket:
              </label>
              <select
                id={`${headingId}-bucket`}
                className={styles.selectInput}
                value={bucket}
                onChange={(e) => setBucket(e.target.value as ReserveBucket)}
              >
                <option value="indemnity">Indemnity Loss (Comp / Settlement)</option>
                <option value="medical">Medical Expenses</option>
                <option value="expense_dcc">Defense &amp; Cost Containment (DCC)</option>
                <option value="expense_ao">Adjusting &amp; Other (AO)</option>
              </select>
            </div>

            <div className={styles.currentReserveCallout}>
              <span>Current {bucket.toUpperCase()} Reserve:</span>
              <strong>{formatCurrency(currentBucketReserve)}</strong>
            </div>

            <div className={styles.formRow}>
              <label htmlFor={`${headingId}-adj-amount`} className={styles.label}>
                Adjustment Delta ($ +Increase / -Decrease):
              </label>
              <input
                id={`${headingId}-adj-amount`}
                type="number"
                step="100"
                placeholder="+5000 or -2500"
                className={styles.textInput}
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <label htmlFor={`${headingId}-reason`} className={styles.label}>
                Statutory Reason Code:
              </label>
              <select
                id={`${headingId}-reason`}
                className={styles.selectInput}
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
              >
                <option value="REVAL_NEW_EVIDENCE">New Medical Evidence Received</option>
                <option value="REVAL_LITIGATION_RISK">Trial Counsel Exposure Revision</option>
                <option value="PARTIAL_PAYMENT_OFFSET">Paid Loss Settlement Offset</option>
                <option value="SUBROGATION_RECOVERY">Anticipated Subrogation Credit</option>
                <option value="CLOSING_ZERO_OUT">Claim Resolution Final Zero-Out</option>
              </select>
            </div>

            <div className={styles.formRow}>
              <label htmlFor={`${headingId}-notes`} className={styles.label}>
                Adjuster Justification Rationale:
              </label>
              <textarea
                id={`${headingId}-notes`}
                rows={2}
                placeholder="Detail exposure changes, medical reports, or counsel filings..."
                className={styles.textareaInput}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.postBtn}
              disabled={!adjustmentAmount || parseFloat(adjustmentAmount) === 0}
            >
              + Post Statutory Reserve Modification
            </button>
          </form>
        </div>

        {/* Historical Ledger Table Pane */}
        <div className={styles.tablePane}>
          <h3 className={styles.paneTitle}>Reserve Modification History</h3>
          <div className={styles.tableScrollWrap}>
            <table className={styles.ledgerTable}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Bucket</th>
                  <th scope="col" className={styles.numTh}>Prior</th>
                  <th scope="col" className={styles.numTh}>Adjustment</th>
                  <th scope="col" className={styles.numTh}>New Reserve</th>
                  <th scope="col">Adjuster / NPN</th>
                  <th scope="col">Signoff Status</th>
                  <th scope="col"><span className={styles.srOnly}>Action</span></th>
                </tr>
              </thead>
              <tbody>
                {adjustments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyCell}>
                      No reserve adjustments recorded for this claim.
                    </td>
                  </tr>
                ) : (
                  adjustments.map((adj) => {
                    const isIncrease = adj.adjustedAmount > 0;
                    return (
                      <tr key={adj.id} className={styles.tableRow}>
                        <td className={styles.dateCell}>{adj.transactionDate}</td>
                        <td>
                          <span className={styles.bucketBadge}>
                            {adj.bucket.replace(/_/g, " ").toUpperCase()}
                          </span>
                        </td>
                        <td className={styles.numTd}>{formatCurrency(adj.priorReserve)}</td>
                        <td
                          className={`${styles.numTd} ${
                            isIncrease ? styles.adjIncrease : styles.adjDecrease
                          }`}
                        >
                          {isIncrease ? `+${formatCurrency(adj.adjustedAmount)}` : formatCurrency(adj.adjustedAmount)}
                        </td>
                        <td className={`${styles.numTd} ${styles.newReserveTd}`}>
                          {formatCurrency(adj.newReserve)}
                        </td>
                        <td>
                          <div className={styles.adjusterCell}>
                            <span className={styles.adjName}>{adj.adjusterName}</span>
                            <span className={styles.adjNpn}>{adj.adjusterNpn}</span>
                          </div>
                        </td>
                        <td>
                          {adj.requiresSupervisorSignoff ? (
                            adj.isSignedOff ? (
                              <span className={styles.signoffApproved}>✓ Approved</span>
                            ) : (
                              <span className={styles.signoffPending}>⚠️ Over-Limit Pending</span>
                            )
                          ) : (
                            <span className={styles.signoffStandard}>Auto-Authorized</span>
                          )}
                        </td>
                        <td>
                          {adj.requiresSupervisorSignoff && !adj.isSignedOff && (
                            <button
                              type="button"
                              className={styles.approveBtn}
                              onClick={() => handleSignoff(adj.id)}
                            >
                              Sign Off
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
        </div>
      </div>
    </section>
  );
};
