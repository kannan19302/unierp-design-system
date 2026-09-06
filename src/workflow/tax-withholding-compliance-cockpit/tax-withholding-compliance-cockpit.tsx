import React, { useId, useState, useMemo } from "react";
import styles from "./tax-withholding-compliance-cockpit.module.css";

export type TinMatchStatus = "TIN_MATCHED" | "B_NOTICE_ISSUED" | "PENDING_VERIFICATION" | "EXEMPT";
export type TaxFormType = "W_9" | "W_8BEN" | "W_8BEN_E";
export type WithholdingStatus = "ACTIVE_24_PCT" | "EXEMPT" | "NONE";

export interface VendorTaxProfile {
  id: string; // "v_8819"
  vendorLegalName: string; // "Atlas Engineering Consultants LLC"
  dbaName?: string;
  tinMasked: string; // "••-•••4910"
  formType: TaxFormType;
  tinStatus: TinMatchStatus;
  ytdSpendUsd: number; // 48200
  withholdingStatus: WithholdingStatus;
}

export interface TaxWithholdingComplianceCockpitProps {
  taxYear?: number; // 2026
  vendors: VendorTaxProfile[];
  onGenerateFireBatch?: () => void;
  onRequestUpdatedW9?: (vendorId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const TaxWithholdingComplianceCockpit: React.FC<TaxWithholdingComplianceCockpitProps> = ({
  taxYear = 2026,
  vendors,
  onGenerateFireBatch,
  onRequestUpdatedW9,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const filterId = useId();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isBatchGenerated, setIsBatchGenerated] = useState<boolean>(false);

  const filteredVendors = useMemo(() => {
    if (statusFilter === "ALL") return vendors;
    return vendors.filter((v) => v.tinStatus === statusFilter);
  }, [vendors, statusFilter]);

  const totalSpend = vendors.reduce((sum, v) => sum + v.ytdSpendUsd, 0);
  const overThresholdCount = vendors.filter((v) => v.ytdSpendUsd >= 600).length;
  const backupWithholdingHeld = vendors
    .filter((v) => v.withholdingStatus === "ACTIVE_24_PCT")
    .reduce((sum, v) => sum + v.ytdSpendUsd * 0.24, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const getTinClass = (st: TinMatchStatus) => {
    switch (st) {
      case "TIN_MATCHED":
        return styles.tinMatched;
      case "B_NOTICE_ISSUED":
        return styles.tinBNotice;
      case "PENDING_VERIFICATION":
        return styles.tinPending;
      default:
        return styles.tinExempt;
    }
  };

  const handleGenerate = () => {
    onGenerateFireBatch?.();
    setIsBatchGenerated(true);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.taxBadge}>IRS 1099 STATUTORY COMPLIANCE</span>
          <span className={`${styles.statusPill} ${isBatchGenerated ? styles.pillBatch : styles.pillReady}`}>
            {isBatchGenerated ? "IRS FIRE BATCH DISPATCHED" : `TAX YEAR ${taxYear} REPORTING`}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Vendor 1099 Tax Compliance &amp; Backup Withholding Cockpit
          </h2>
          <div className={styles.filterGroup}>
            <label htmlFor={filterId} className={styles.filterLabel}>
              TIN Validation:
            </label>
            <select
              id={filterId}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="ALL">All Validation States</option>
              <option value="TIN_MATCHED">TIN Matched (Clean)</option>
              <option value="B_NOTICE_ISSUED">B-Notice / Withholding Alert</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="EXEMPT">Statutory Exempt</option>
            </select>
          </div>
        </div>
      </header>

      {/* KPI Highlights */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total 1099-NEC Spend</span>
          <span className={styles.kpiValue}>{formatCurrency(totalSpend)}</span>
          <span className={styles.kpiSub}>Across {vendors.length} vendor profiles</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Reportable Over $600</span>
          <span className={styles.kpiValue}>{overThresholdCount}</span>
          <span className={styles.kpiSub}>Statutory IRS threshold met</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Backup Withholding (24%)</span>
          <span className={`${styles.kpiValue} ${backupWithholdingHeld > 0 ? styles.valWithholding : ""}`}>
            {formatCurrency(backupWithholdingHeld)}
          </span>
          <span className={styles.kpiSub}>Held on invalid TIN accounts</span>
        </div>
      </div>

      {/* Vendor Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Vendor 1099 tax compliance records">
          <thead>
            <tr>
              <th scope="col">Vendor Legal Entity</th>
              <th scope="col">Tax ID (TIN/EIN)</th>
              <th scope="col">Form</th>
              <th scope="col">IRS TIN Match</th>
              <th scope="col">YTD Spend</th>
              <th scope="col">Threshold</th>
              <th scope="col">Withholding</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((v) => (
              <tr key={v.id}>
                <td>
                  <div className={styles.vendorCell}>
                    <span className={styles.vendorName}>{v.vendorLegalName}</span>
                    {v.dbaName && <span className={styles.dbaName}>DBA: {v.dbaName}</span>}
                  </div>
                </td>
                <td className={styles.monoCell}>{v.tinMasked}</td>
                <td>
                  <span className={styles.formBadge}>{v.formType.replace(/_/g, "-")}</span>
                </td>
                <td>
                  <span className={`${styles.tinBadge} ${getTinClass(v.tinStatus)}`}>
                    {v.tinStatus.replace(/_/g, " ")}
                  </span>
                </td>
                <td className={styles.monoNum}>{formatCurrency(v.ytdSpendUsd)}</td>
                <td>
                  <span
                    className={`${styles.thresholdBadge} ${
                      v.ytdSpendUsd >= 600 ? styles.threshReportable : styles.threshExempt
                    }`}
                  >
                    {v.ytdSpendUsd >= 600 ? "REPORTABLE (>$600)" : "BELOW LIMIT"}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.withholdingBadge} ${
                      v.withholdingStatus === "ACTIVE_24_PCT"
                        ? styles.withholdingActive
                        : styles.withholdingNone
                    }`}
                  >
                    {v.withholdingStatus === "ACTIVE_24_PCT" ? "24% BACKUP WITHHELD" : "NONE"}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.requestBtn}
                    onClick={() => onRequestUpdatedW9?.(v.id)}
                    aria-label={`Request updated tax form for ${v.vendorLegalName}`}
                  >
                    Request W-9
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          <span>Electronic 1099-NEC &amp; 1099-MISC exports formatted to IRS Publication 1220 FIRE specs.</span>
        </div>
        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.fireBtn}
            onClick={handleGenerate}
            disabled={isBatchGenerated}
            aria-label="Generate electronic IRS FIRE filing batch"
          >
            {isBatchGenerated ? "Batch Dispatched" : "Generate IRS FIRE Batch"}
          </button>
        </div>
      </footer>
    </section>
  );
};
