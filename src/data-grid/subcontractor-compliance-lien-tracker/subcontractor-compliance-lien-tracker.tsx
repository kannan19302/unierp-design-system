import React, { useId, useState, useMemo } from "react";
import styles from "./subcontractor-compliance-lien-tracker.module.css";

export type LienWaiverStatus =
  | "CONDITIONAL_PROGRESS"
  | "UNCONDITIONAL_PROGRESS"
  | "CONDITIONAL_FINAL"
  | "UNCONDITIONAL_FINAL"
  | "LIEN_NOTICE_FILED";

export type PaymentReleaseStatus = "AUTHORIZED" | "ON_HOLD" | "RELEASED";

export interface SubcontractorComplianceRecord {
  id: string; // "sub_8819"
  vendorName: string; // "Apex Structural Steel Inc."
  tradeDivision: string; // "05 12 00 - Structural Steel"
  contractCode: string; // "CTR-2026-ST-02"
  coiValidUntil: string; // "2026-12-31"
  coiExpired: boolean;
  retainageHeld: number; // 45000
  currentBilling: number; // 180000
  lienStatus: LienWaiverStatus;
  paymentStatus: PaymentReleaseStatus;
}

export interface SubcontractorComplianceLienTrackerProps {
  records: SubcontractorComplianceRecord[];
  onAuthorizePayment?: (recordId: string) => void;
  onRequestLienWaiver?: (recordId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SubcontractorComplianceLienTracker: React.FC<SubcontractorComplianceLienTrackerProps> = ({
  records,
  onAuthorizePayment,
  onRequestLienWaiver,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const filterId = useId();
  const [tradeFilter, setTradeFilter] = useState<string>("ALL");

  const trades = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.tradeDivision)));
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (tradeFilter === "ALL") return records;
    return records.filter((r) => r.tradeDivision === tradeFilter);
  }, [records, tradeFilter]);

  const totalBilling = filteredRecords.reduce((sum, r) => sum + r.currentBilling, 0);
  const totalRetainage = filteredRecords.reduce((sum, r) => sum + r.retainageHeld, 0);
  const atRiskCount = filteredRecords.filter(
    (r) => r.lienStatus === "LIEN_NOTICE_FILED" || r.coiExpired || r.paymentStatus === "ON_HOLD"
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLienBadgeClass = (status: LienWaiverStatus) => {
    switch (status) {
      case "CONDITIONAL_PROGRESS":
      case "UNCONDITIONAL_PROGRESS":
      case "CONDITIONAL_FINAL":
      case "UNCONDITIONAL_FINAL":
        return styles.lienClean;
      case "LIEN_NOTICE_FILED":
        return styles.lienCritical;
      default:
        return "";
    }
  };

  const getPaymentBadgeClass = (status: PaymentReleaseStatus) => {
    switch (status) {
      case "AUTHORIZED":
        return styles.payAuthorized;
      case "RELEASED":
        return styles.payReleased;
      case "ON_HOLD":
        return styles.payHold;
      default:
        return "";
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.categoryBadge}>CONSTRUCTION & REAL ESTATE ERP</span>
          <span className={styles.countBadge}>{filteredRecords.length} CONTRACTS</span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Subcontractor Compliance &amp; Mechanic&apos;s Lien Waiver Tracker
          </h2>
          <div className={styles.filterGroup}>
            <label htmlFor={filterId} className={styles.filterLabel}>
              Trade Division:
            </label>
            <select
              id={filterId}
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="ALL">All Trade Divisions</option>
              {trades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* KPI Highlights */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Current Period Billings</span>
          <span className={styles.kpiValue}>{formatCurrency(totalBilling)}</span>
          <span className={styles.kpiSub}>Applications for payment</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Retainage Escrow Held (10%)</span>
          <span className={styles.kpiValue}>{formatCurrency(totalRetainage)}</span>
          <span className={styles.kpiSub}>Statutory project reserve</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Compliance Exceptions</span>
          <span className={`${styles.kpiValue} ${atRiskCount > 0 ? styles.valAlert : ""}`}>
            {atRiskCount}
          </span>
          <span className={styles.kpiSub}>Expired COIs or Lien notices</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Subcontractor compliance and lien waiver table">
          <thead>
            <tr>
              <th scope="col">Subcontractor &amp; Trade</th>
              <th scope="col">Contract Code</th>
              <th scope="col">Insurance COI</th>
              <th scope="col">Current Billing</th>
              <th scope="col">Retainage Held</th>
              <th scope="col">Lien Waiver Status</th>
              <th scope="col">Payment Gate</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((item) => (
              <tr key={item.id} className={item.lienStatus === "LIEN_NOTICE_FILED" ? styles.rowAlert : ""}>
                <td>
                  <div className={styles.vendorCell}>
                    <span className={styles.vendorName}>{item.vendorName}</span>
                    <span className={styles.tradeDivision}>{item.tradeDivision}</span>
                  </div>
                </td>
                <td className={styles.monoCell}>{item.contractCode}</td>
                <td>
                  <div className={styles.coiCell}>
                    <span className={item.coiExpired ? styles.coiExpired : styles.coiValid}>
                      {item.coiExpired ? "EXPIRED" : "ACTIVE"}
                    </span>
                    <span className={styles.dateSub}>exp: {item.coiValidUntil}</span>
                  </div>
                </td>
                <td className={styles.monoNum}>{formatCurrency(item.currentBilling)}</td>
                <td className={styles.monoNum}>{formatCurrency(item.retainageHeld)}</td>
                <td>
                  <span className={`${styles.statusPill} ${getLienBadgeClass(item.lienStatus)}`}>
                    {item.lienStatus.replace(/_/g, " ")}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusPill} ${getPaymentBadgeClass(item.paymentStatus)}`}>
                    {item.paymentStatus.replace(/_/g, " ")}
                  </span>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.waiverBtn}
                      onClick={() => onRequestLienWaiver?.(item.id)}
                      aria-label={`Request updated lien waiver from ${item.vendorName}`}
                    >
                      Request Waiver
                    </button>
                    <button
                      type="button"
                      className={styles.authorizeBtn}
                      onClick={() => onAuthorizePayment?.(item.id)}
                      disabled={item.paymentStatus === "RELEASED" || item.coiExpired || item.lienStatus === "LIEN_NOTICE_FILED"}
                      aria-label={`Authorize disbursement for ${item.vendorName}`}
                    >
                      Authorize
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
